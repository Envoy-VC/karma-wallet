import { Entity } from "dexie";

import type { KarmaDB } from "./index";

export class Goal extends Entity<KarmaDB> {
  account!: string;
  emoji!: string;
  name!: string;
  targetAmount!: number;
  currentAmount!: number;
  category!: string;
  note!: string | undefined;
  _createdAt!: Date;
  _updatedAt!: Date;

  async addAmount(amount: number) {
    await this.db.goals.update(this.account, (goal) => {
      if (goal.currentAmount + amount > goal.targetAmount) {
        // TODO: Think about this case
      }
      goal.currentAmount += amount;
    });
  }
}
