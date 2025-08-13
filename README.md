# Karma Wallet

Karma Wallet is an Account Abstraction (AA) smart wallet that automatically rounds up your gas fees and sends the spare change to a Tip Jar.

For example, if your transaction gas fee is $0.087, Karma Wallet will round it up to the nearest $0.01 and send the difference ($0.003) to the Tip Jar. This way, every transaction you make leaves behind a little karma for a cause you care about.

Powered by ERC-4337 smart accounts, Karma Wallet seamlessly integrates this tipping logic into your wallet’s transaction flow without requiring any additional user action.

## 🎯 Motive

Gas fees are a necessary part of using the blockchain, but they’re often odd amounts that leave “dust” in the wallet. Karma Wallet turns these small amounts into meaningful contributions:

- Support open-source projects without actively thinking about it.
- Fund community initiatives in a passive, automated way.
- Gamify generosity by making every transaction part of a bigger giving story.

Instead of letting your micro-ETH fragments sit idle, they get converted into micro-donations.

## ⚙️ How It Works — Detailed UserOperation Flow

Karma Wallet is built on ERC-4337 and works within the UserOperation lifecycle. Here’s the exact flow:

1️⃣ Transaction Initiation

- User interacts with a dApp via Karma Wallet.
- The wallet constructs a UserOperation with:
    - sender = Karma Wallet smart account address.
    - callData = Encoded function call to the target dApp contract.
    - value = Transaction value.
    - maxFeePerGas = Current gas settings.
    - maxPriorityFeePerGas = Current gas settings.
    - paymasterAndData = Empty bytes.
    - signature = Empty bytes.

2️⃣ UserOperation is signed and sent to Bundler

- The wallet sends the UserOperation to the Bundler.
- The Bundler processes the UserOperation and sends it to the EntryPoint.
- The EntryPoint processes the UserOperation and sends it to the Account Abstraction smart contract.

3️⃣ Account Abstraction Smart Contract

```solidity
function execute(address dest, uint256 value, bytes calldata func) external {
    _requireFromEntryPointOrOwner();

    uint256 gasPre = gasleft();
    _call(dest, value, func);
    uint256 gasPost = gasleft();

    uint256 gasUsed = gasPre - gasPost;
    uint256 balance = address(this).balance;

    uint256 tip = _calculateTip(gasUsed);

    if (tip < balance) {
        _jar.deposit{value: tip}(gasUsed, tip);
    }
}

function _calculateTip(uint256 gasUsed) internal view returns (uint256) {
    uint256 ethPriceUSD = _oracleAdaptor.getLatestEthPriceInUsd();

    uint256 gasCostInWei = gasUsed * tx.gasprice;
    uint256 gasCostInUSD = (gasCostInWei * ethPriceUSD) / 1e18;

    uint256 tipInUSD = 0;
    uint256 roundingMultipleUSD = 1e16; // $0.01 in 18-decimal USD
    if (gasCostInUSD > 0) {
        uint256 remainder = gasCostInUSD % roundingMultipleUSD;
        if (remainder > 0) {
            tipInUSD = roundingMultipleUSD - remainder;
        }
    }

    uint256 tipInWei = (tipInUSD * 1e18) / ethPriceUSD;
    return tipInWei;
}

```

- The Account Abstraction smart contract processes the UserOperation and sends it to the EntryPoint.
- `gasPre` and `gasPost` measure the gas consumed during the call.
- `_calculateTip(gasUsed)` converts gas used into USD value and determines the rounded-up tip.
- If the wallet has enough ETH to cover the tip, it’s sent to the _jar contract.

## 📍 Contract Addresses

| Contract | Chain | Address |
| --- | --- | --- |
| Karma Account Factory | Morph Holesky | 0xe2567b2a7214877d395dfa6ca72335644b26dc23 |
| Pyth Adaptor | Ethereum | 0x2ca12ac2cb30b9acbdb6d9c7dcfc895338904a93 |

## 🛠 Self-Host Bundler Guide — Alto Bundler

1. Clone the [Alto Bundler](https://github.com/pimlicolabs/alto) repository.

```bash
git clone https://github.com/pimlicolabs/alto.git
```

2. Install the dependencies.

```bash
cd alto
pnpm install
```

3. Create Config for Morph Holesky Testnet.

```bash

```

4. Update L1GasProxy Contract Address in `src/utils/preVerificationGasCalulator.ts:L588`:

```diff
const opGasPriceOracle = getContract({
    abi: OpL1FeeAbi,
-    address: "0x420000000000000000000000000000000000000F",
+    address: "0x530000000000000000000000000000000000000f",
    client: {
        public: publicClient
    }
})
```

5. Build the bundler.

```bash
pnpm build
```

6. Run the bundler.

```bash
./alto config="alto.config.json"
```

7. Start a local Proxy

```bash
npx local-cors-proxy --proxyUrl http://localhost:4337
```

## 🔮 Future — Modular Safe Account with Hooks

The current Karma Wallet is a modified SimpleSmartAccount, but future plans include:

- Migrating to Safe-based modular accounts.
- Using preExec and postExec hooks:
    - `preExec`: Estimate and lock in tip before execution.
    - `postExec`: Execute final tip transfer after actual gas cost known.
- Supporting multi-recipient tips (split between multiple causes).
- Integrating Paymaster sponsorship for gasless tip donations.

## 📝 License

The Karma Wallet is licensed under the [MIT License](https://opensource.org/licenses/MIT).