import { Entity } from "dexie";

import type { KarmaDB } from "./index";

export class Goal extends Entity<KarmaDB> {
  id!: string;
  account!: string;
  emoji!: string;
  name!: string;
  targetAmount!: number;
  currentAmount!: number;
  category!: string;
  note!: string | undefined;
  isDefault!: boolean;
  _createdAt!: Date;
  _updatedAt!: Date;

  async addAmount(amount: number) {
    await this.db.goals.update(this.id, (goal) => {
      goal.currentAmount += amount;
    });
  }

  currentAmountFormatted() {
    return this.currentAmount.toFixed(4);
  }

  async toggleIsDefault() {
    const defaultGoal = (await this.db.goals.toArray()).filter(
      (g) => g.isDefault,
    );

    for (const goal of defaultGoal) {
      await this.db.goals.update(goal.id, { isDefault: false });
    }

    await this.db.goals.update(this.id, {
      isDefault: !this.isDefault,
    });
  }
}
