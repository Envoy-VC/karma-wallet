import { create } from "zustand";

export type TokenType = "eth" | "dai" | "usdc" | "usdt";

type SendStoreState = {
  amount: number;
  token: TokenType | undefined;
  amountInUsd: number;
  receiver: string;
  setAmount: (amount: number) => void;
  setToken: (token: TokenType) => void;
  setReceiver: (receiver: string) => void;
  setAmountInUsd: (amount: number) => void;
  checklist: {
    validToken: boolean;
    validAddress: boolean;
    validAmount: boolean;
  };
  setChecklistOption: (
    option: keyof SendStoreState["checklist"],
    value: boolean,
  ) => void;
};

export const useSendStore = create<SendStoreState>((set, get) => ({
  amount: 0,
  amountInUsd: 0,
  checklist: {
    validAddress: false,
    validAmount: false,
    validToken: false,
  },
  receiver: "",
  setAmount: (amount: number) => set({ amount }),
  setAmountInUsd: (amount: number) => {
    set({ amountInUsd: amount });
  },
  setChecklistOption: (option, value) => {
    set({
      checklist: {
        ...get().checklist,
        [option]: value,
      },
    });
  },
  setReceiver: (receiver: string) => {
    set({ receiver });
  },
  setToken: (token: TokenType) => set({ token }),
  token: undefined,
}));
