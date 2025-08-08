import { useMemo } from "react";

import { erc20Abi, zeroAddress } from "viem";
import { useAccount, useBalance, useReadContracts } from "wagmi";

import { TokenAddress } from "@/data/address";

export const useBalances = () => {
  const { address } = useAccount();
  const { data: balance } = useBalance({
    address,
    query: { enabled: address !== undefined },
  });

  const { data: tokenBalances } = useReadContracts({
    contracts: [
      {
        abi: erc20Abi,
        address: TokenAddress["2810"].dai.address,
        args: [address ?? zeroAddress],
        functionName: "balanceOf",
      },
      {
        abi: erc20Abi,
        address: TokenAddress["2810"].usdc.address,
        args: [address ?? zeroAddress],
        functionName: "balanceOf",
      },
      {
        abi: erc20Abi,
        address: TokenAddress["2810"].usdt.address,
        args: [address ?? zeroAddress],
        functionName: "balanceOf",
      },
      {
        abi: erc20Abi,
        address: TokenAddress["2810"].dai.address,
        args: [],
        functionName: "decimals",
      },
      {
        abi: erc20Abi,
        address: TokenAddress["2810"].usdc.address,
        args: [],
        functionName: "decimals",
      },
      {
        abi: erc20Abi,
        address: TokenAddress["2810"].usdt.address,
        args: [],
        functionName: "decimals",
      },
    ],
    query: {
      enabled: address !== undefined,
    },
  });

  const balances = useMemo(() => {
    const ethBalance = balance?.value ?? 0n;
    const daiBalance = tokenBalances?.[0].result ?? 0n;
    const usdcBalance = tokenBalances?.[1].result ?? 0n;
    const usdtBalance = tokenBalances?.[2].result ?? 0n;

    const daiDecimals = tokenBalances?.[3].result ?? 18;
    const usdcDecimals = tokenBalances?.[4].result ?? 18;
    const usdtDecimals = tokenBalances?.[5].result ?? 18;

    return {
      dai: {
        decimals: daiDecimals,
        formatted: (Number(daiBalance) / 10 ** daiDecimals).toFixed(2),
        symbol: "DAI",
        value: daiBalance,
      },
      eth: {
        decimals: 18,
        formatted: (Number(ethBalance) / 10 ** 18).toFixed(4),
        symbol: "ETH",
        value: ethBalance,
      },
      usdc: {
        decimals: usdcDecimals,
        formatted: (Number(usdcBalance) / 10 ** usdcDecimals).toFixed(2),
        symbol: "USDC",
        value: usdcBalance,
      },
      usdt: {
        decimals: usdtDecimals,
        formatted: (Number(usdtBalance) / 10 ** usdcDecimals).toFixed(2),
        symbol: "USDT",
        value: usdtBalance,
      },
    };
  }, [balance, tokenBalances]);

  return balances;
};
