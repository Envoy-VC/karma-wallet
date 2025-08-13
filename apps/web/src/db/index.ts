import Dexie, { type EntityTable } from "dexie";

import { weiToUsd } from "@/lib/utils";

import { Deposit } from "./deposit";
import { Goal } from "./goal";

export class KarmaDB extends Dexie {
  goals!: EntityTable<Goal, "id">;
  deposits!: EntityTable<Deposit, "txHash">;

  constructor() {
    super("KarmaDB");
    this.version(1).stores({
      deposits: "txHash,account,sender,timestamp",
      goals: "id,account,isDefault",
    });
    this.goals.mapToClass(Goal);
    this.deposits.mapToClass(Deposit);
  }
}

export const db = new KarmaDB();

export const getDefaultGoal = async () => {
  const goals = await db.goals.toArray();
  return goals.filter((g) => g.isDefault)[0];
};

export const listAllGoals = async () => {
  const goals = await db.goals.toArray();
  return goals;
};

export const getGoalById = async (id: string) => {
  const goal = await db.goals.get(id);
  return goal;
};

export const getDepositByTxHash = async (txHash: string) => {
  const deposit = await db.deposits.get(txHash);
  return deposit;
};

export const listAllDeposits = async () => {
  const deposits = await db.deposits.toArray();
  return deposits;
};

export const getLastWeekStatistics = async (ethPriceUsd: number) => {
  // Get last week's deposits
  const now = Math.floor(Date.now() / 1000);
  const lastWeek = now - 60 * 60 * 24 * 7;
  const lastLastWeek = lastWeek - 60 * 60 * 24 * 7;
  const allDeposits = await listAllDeposits();
  const lastWeekDeposits = allDeposits.filter((d) => d.timestamp > lastWeek);
  const lastLastWeekDeposits = allDeposits.filter(
    (d) => d.timestamp > lastLastWeek && d.timestamp <= lastWeek,
  );

  // Calculate totals
  const lastWeekTotalGasSpent = lastWeekDeposits.reduce(
    (total, deposit) => total + deposit.totalGasSpent,
    0,
  );
  const lastWeekTotalTip = lastWeekDeposits.reduce(
    (total, deposit) => total + deposit.totalTip,
    0,
  );

  const lastLastWeekTotalGasSpent = lastLastWeekDeposits.reduce(
    (total, deposit) => total + deposit.totalGasSpent,
    0,
  );
  const lastLastWeekTotalTip = lastLastWeekDeposits.reduce(
    (total, deposit) => total + deposit.totalTip,
    0,
  );

  // Convert Wei to USD
  const lastWeekGasSpentUsd = weiToUsd(lastWeekTotalGasSpent, ethPriceUsd);
  const lastWeekTipUsd = weiToUsd(lastWeekTotalTip, ethPriceUsd);

  const lastLastWeekGasSpentUsd = weiToUsd(
    lastLastWeekTotalGasSpent,
    ethPriceUsd,
  );
  const lastLastWeekTipUsd = weiToUsd(lastLastWeekTotalTip, ethPriceUsd);

  // Calculate change in percent compared to last last week
  const changeInTip =
    lastLastWeekTipUsd === 0
      ? 0
      : Number(
          (
            ((lastWeekTipUsd - lastLastWeekTipUsd) / lastLastWeekTipUsd) *
            100
          ).toFixed(2),
        );

  const changeInSpent =
    lastWeekGasSpentUsd === 0
      ? 0
      : Number(
          (
            ((lastWeekGasSpentUsd - lastLastWeekGasSpentUsd) /
              lastLastWeekGasSpentUsd) *
            100
          ).toFixed(2),
        );

  return {
    totalGasSpent: {
      change: changeInSpent,
      gwei: Number((lastWeekTotalGasSpent / 10e9).toFixed(2)),
      usd: lastWeekGasSpentUsd,
      wei: lastWeekTotalGasSpent,
    },
    totalSavings: {
      change: changeInTip,
      gwei: Number((lastWeekTotalTip / 10e9).toFixed(2)),
      usd: lastWeekTipUsd,
      wei: lastWeekTotalTip,
    },
  };
};

export const getLastWeekChartData = async () => {
  const now = Math.floor(Date.now() / 1000);
  const lastWeek = now - 60 * 60 * 24 * 7;

  const lastWeekDeposits = await db.deposits
    .where("timestamp")
    .above(lastWeek)
    .toArray();

  const map = new Map<string, Deposit[]>();

  for (const deposit of lastWeekDeposits) {
    const key = new Date(deposit.timestamp * 1000).toISOString().slice(0, 10);
    if (!map.has(key)) {
      map.set(key, []);
      // biome-ignore lint/style/noNonNullAssertion: safe
      map.get(key)!.push(deposit);
    } else {
      // biome-ignore lint/style/noNonNullAssertion: safe
      map.get(key)!.push(deposit);
    }
  }

  // Group Deposits by date
  const res = Array.from(map.entries()).map(([date, deposits]) => {
    const totalGasSpent = deposits.reduce((acc, deposit) => {
      return acc + deposit.totalGasSpent;
    }, 0);
    const totalTip = deposits.reduce((acc, deposit) => {
      return acc + deposit.totalTip;
    }, 0);
    const total = totalGasSpent + totalTip;

    return {
      date,
      gasSaved: totalTip,
      gasSpent: totalGasSpent,
      total: total,
    };
  });

  return res;
};

export const getLastXDeposits = async (x: number) => {
  const deposits = await db.deposits.toArray();
  return deposits.slice(deposits.length - x);
};
