// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import "@eth-infinitism/account-abstraction/contracts/core/BaseAccount.sol";

import "@eth-infinitism/account-abstraction/contracts/core/Helpers.sol";
import "@eth-infinitism/account-abstraction/contracts/accounts/callback/TokenCallbackHandler.sol";

import {IOracleAdaptor} from "./interfaces/IOracleAdaptor.sol";

import {Jar} from "./Jar.sol";

contract KarmaAccount is BaseAccount, TokenCallbackHandler, UUPSUpgradeable, Initializable {
    address public owner;

    IEntryPoint private immutable _entryPoint;
    IOracleAdaptor public _oracleAdaptor;

    Jar public _jar;

    event KarmaAccountInitialized(IEntryPoint indexed entryPoint, address indexed owner);

    modifier onlyOwner() {
        _onlyOwner();
        _;
    }

    /// @inheritdoc BaseAccount
    function entryPoint() public view virtual override returns (IEntryPoint) {
        return _entryPoint;
    }

    receive() external payable {}

    constructor(IEntryPoint entryPoint_) {
        _entryPoint = entryPoint_;
        _disableInitializers();
    }

    function _onlyOwner() internal view {
        require(msg.sender == owner || msg.sender == address(this), "only owner");
    }

    /**
     * @dev The _entryPoint member is immutable, to reduce gas consumption.  To upgrade EntryPoint,
     * a new implementation of SimpleAccount must be deployed with the new EntryPoint address, then upgrading
     * the implementation by calling `upgradeTo()`
     * @param anOwner the owner (signer) of this account
     */
    function initialize(address anOwner, address oracleAdaptor_) public virtual initializer {
        _oracleAdaptor = IOracleAdaptor(oracleAdaptor_);
        _jar = new Jar(payable(address(this)));
        _initialize(anOwner);
    }

    function _initialize(address anOwner) internal virtual {
        owner = anOwner;
        emit KarmaAccountInitialized(_entryPoint, owner);
    }

    // Require the function call went through EntryPoint or owner
    function _requireForExecute() internal view virtual override {
        require(msg.sender == address(entryPoint()) || msg.sender == owner, "account: not Owner or EntryPoint");
    }

    /// implement template method of BaseAccount
    function _validateSignature(PackedUserOperation calldata userOp, bytes32 userOpHash)
        internal
        virtual
        override
        returns (uint256 validationData)
    {
        // UserOpHash can be generated using eth_signTypedData_v4
        if (owner != ECDSA.recover(userOpHash, userOp.signature)) {
            return SIG_VALIDATION_FAILED;
        }
        return SIG_VALIDATION_SUCCESS;
    }

    function execute(address target, uint256 value, bytes calldata data) external override {
        // _requireForExecute();

        uint256 gasPre = gasleft();
        bool ok = Exec.call(target, value, data, gasPre);
        uint256 gasPost = gasleft();

        uint256 gasUsed = gasPre - gasPost;

        _executeTipJarLogic(gasUsed);

        if (!ok) {
            Exec.revertWithReturnData();
        }
    }

    function _executeTipJarLogic(uint256 gasUsed) internal {
        uint256 ethPriceUSD = _oracleAdaptor.getLatestEthPriceInUsd();

        uint256 gasCostInWei = gasUsed * tx.gasprice;
        uint256 gasCostInUSD = (gasCostInWei * ethPriceUSD) / 1e18;

        uint256 tipInUSD = 0;
        uint256 roundingMultipleUSD = 1e16; // For rounding to nearest $0.01
        if (gasCostInUSD > 0) {
            uint256 remainder = gasCostInUSD % roundingMultipleUSD;
            if (remainder > 0) {
                tipInUSD = roundingMultipleUSD - remainder;
            }
        }

        if (tipInUSD > 0) {
            uint256 tipInWei = (tipInUSD * 1e18) / ethPriceUSD;

            _jar.deposit{value: tipInWei}(gasUsed, tipInUSD);
        }
    }

    /**
     * check current account deposit in the entryPoint
     */
    function getDeposit() public view returns (uint256) {
        return entryPoint().balanceOf(address(this));
    }

    /**
     * deposit more funds for this account in the entryPoint
     */
    function addDeposit() public payable {
        entryPoint().depositTo{value: msg.value}(address(this));
    }

    /**
     * withdraw value from the account's deposit
     * @param withdrawAddress target to send to
     * @param amount to withdraw
     */
    function withdrawDepositTo(address payable withdrawAddress, uint256 amount) public onlyOwner {
        entryPoint().withdrawTo(withdrawAddress, amount);
    }

    function _authorizeUpgrade(address newImplementation) internal view override {
        (newImplementation);
        _onlyOwner();
    }
}
