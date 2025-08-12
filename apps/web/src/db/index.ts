import Dexie, { type EntityTable } from "dexie";

import { Goal } from "./goal";

export class KarmaDB extends Dexie {
  goals!: EntityTable<Goal, "id">;

  constructor() {
    super("KarmaDB");
    this.version(1).stores({
      goals: "id,account,isDefault",
    });
    this.goals.mapToClass(Goal);
  }
}

export const db = new KarmaDB();

export const getDefaultGoal = async () => {
  const goals = await db.goals.where({ isDefault: true }).toArray();
  return goals[0];
};

export const listAllGoals = async () => {
  const goals = await db.goals.toArray();
  return goals;
};

export const getGoalById = async (id: string) => {
  const goal = await db.goals.get(id);
  return goal;
};
