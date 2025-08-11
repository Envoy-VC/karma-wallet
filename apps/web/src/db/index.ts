import Dexie, { type EntityTable } from "dexie";

import { Goal } from "./goal";

export class KarmaDB extends Dexie {
  goals!: EntityTable<Goal, "account">;

  constructor() {
    super("FriendsDB");
    this.version(1).stores({
      goals: "account",
    });
    this.goals.mapToClass(Goal);
  }
}

export const db = new KarmaDB();
