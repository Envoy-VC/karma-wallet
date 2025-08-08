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
