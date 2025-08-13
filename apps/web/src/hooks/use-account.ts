import { createSmartAccountClient } from "permissionless";
import { toSimpleSmartAccount } from "permissionless/accounts";
import { useReadLocalStorage } from "usehooks-ts";
import { type Hex, parseEventLogs } from "viem";
import { entryPoint07Abi, entryPoint07Address } from "viem/account-abstraction";
import { http, usePublicClient, useWalletClient } from "wagmi";

import { JAR_ABI, KARMA_ACCOUNT_ABI } from "@/data/abi";
import { ContractAddress } from "@/data/address";
import { db, getDefaultGoal } from "@/db";
import { env } from "@/env";
import { weiToUsd } from "@/lib/utils";
import { chain, pimlicoClient } from "@/lib/wagmi";

import { useBalances } from "./use-balances";

export const useSmartAccount = () => {
  const address = useReadLocalStorage<Hex | null>("karmaAccount");
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const balances = useBalances();

  const getClient = async () => {
    if (!address) return null;
    if (!walletClient) return null;
    if (!publicClient) return null;

    const karmaAccount = await toSimpleSmartAccount({
      address: address as Hex,
      client: publicClient,
      entryPoint: {
        address: entryPoint07Address,
        version: "0.7",
      },
      factoryAddress: ContractAddress.karamaccountFactory,
      owner: walletClient,
    });

    const smartAccountClient = createSmartAccountClient({
      account: karmaAccount,
      bundlerTransport: http(env.VITE_BUNDLER_URL),
      chain: chain,
      userOperation: {
        estimateFeesPerGas: async () => {
          return (await pimlicoClient.getUserOperationGasPrice()).fast; // only when using pimlico bundler
        },
      },
    });

    return smartAccountClient;
  };

  const sendEth = async (to: Hex, value: bigint) => {
    const client = await getClient();
    if (!client) return;
    const hash = await client.sendTransaction({
      callGasLimit: BigInt(10_000_000),
      to,
      value,
    });

    await postTransaction(hash);
  };

  const postTransaction = async (hash: Hex) => {
    const receipt = await publicClient?.getTransactionReceipt({ hash });

    const parsed = parseEventLogs({
      abi: [...JAR_ABI, ...KARMA_ACCOUNT_ABI, ...entryPoint07Abi],
      logs: receipt?.logs ?? [],
    });

    const depositLog = parsed.filter((e) => e.eventName === "Deposit")[0];
    if (depositLog) {
      console.log("Adding Deposit");
      await db.deposits.add({
        account: address as Hex,
        sender: depositLog.args.sender,
        timestamp: Number(depositLog.args.timestamp),
        totalGasSpent: Number(depositLog.args.totalGasSpent),
        totalTip: Number(depositLog.args.totalTip),
        txHash: hash,
      });
      console.log("Added Deposit");
      console.log("Fetching Default Goal");
      const defaultGoal = await getDefaultGoal();
      console.log("Default Goal Fetched", defaultGoal);
      if (defaultGoal) {
        console.log("Adding Amount");
        await defaultGoal.addAmount(
          Number(weiToUsd(Number(depositLog.args.totalTip), balances.ethPrice)),
        );
        console.log("Amount Added");
      }
    }
  };

  return {
    address: address as Hex | null,
    sendEth,
  };
};
