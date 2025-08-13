import { Entity } from "dexie";

import type { KarmaDB } from "./index";

export class Deposit extends Entity<KarmaDB> {
  txHash!: string;
  account!: string;
  sender!: string;
  totalGasSpent!: number;
  totalTip!: number;
  timestamp!: number;
}
