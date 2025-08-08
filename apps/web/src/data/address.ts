import type { Hex } from "viem";

// ChainId => Token => Address
type TokenAddressMap = Record<number, Record<string, Hex>>;

export const TokenAddress: TokenAddressMap = {
  2810: {
    dai: "0xAa19d46626947C6E1E5F281aE835971579827DDC",
    usdc: "0xeA2610c28B4c5857689EAFa8b2116a617206d283",
    usdt: "0x9E12AD42c4E4d2acFBADE01a96446e48e6764B98",
  },
};
