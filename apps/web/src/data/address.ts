import type { Hex } from "viem";

type ChainId = 2810;

// ChainId => Token => Address
export type TokenAddressMap = Record<
  ChainId,
  Record<
    string,
    {
      address: Hex;
      icon: string;
      name: string;
    }
  >
>;

export const TokenAddress = {
  2810: {
    dai: {
      address: "0xAa19d46626947C6E1E5F281aE835971579827DDC",
      icon: "/icons/dai.svg",
      name: "DAI",
    },
    eth: {
      address: "0x0000000000000000000000000000000000000000",
      icon: "/icons/eth.svg",
      name: "ETH",
    },
    usdc: {
      address: "0xeA2610c28B4c5857689EAFa8b2116a617206d283",
      icon: "/icons/usdc.svg",
      name: "USDC",
    },
    usdt: {
      address: "0x9E12AD42c4E4d2acFBADE01a96446e48e6764B98",
      icon: "/icons/usdt.svg",
      name: "USDT",
    },
  },
} as const;

// export const ContractAddress = {
//   karamaccountFactory: "0x8F54dbbA4eaD629c98a117a27F154831345C8Eaa",
//   pythAdaptor: "0x0f583d4466B87902d41f814bdD5089407C862D14",
// } as const;

// Anvil Contracts
// export const ContractAddress = {
//   karamaccountFactory: "0xA15BB66138824a1c7167f5E85b957d04Dd34E468",
//   pythAdaptor: "0x700b6A60ce7EaaEA56F065753d8dcB9653dbAD35",
// } as const;

// Sepolia Contracts
export const ContractAddress = {
  karamaccountFactory: "0x6E85056eb08D248Ee516bE85818EE5a4ca0b0223",
  pythAdaptor: "0x963288C37c071c603Bfa766EEd1B81e2C8825069",
} as const;
