import { useMemo } from "react";

import { isAddress } from "viem";

import { type TokenType, useSendStore } from "@/lib/stores";

import { useBalances } from "./use-balances";

export const useSend = () => {
  const balances = useBalances();
  const {
    token,
    amount,
    receiver,
    setAmount,
    setAmountInUsd,
    setReceiver,
    amountInUsd,
    setToken,
    checklist,
    setChecklistOption,
    sendingState,
    setSendingState,
  } = useSendStore();

  const onTokenChange = (token: TokenType) => {
    setChecklistOption("validToken", true);
    setToken(token);
    onAmountChange(amount);
  };

  const onAmountChange = (amount: number) => {
    if (!token) {
      return;
    }

    const tokenBalance = balances[token];
    const isAvailable =
      balances[token].value >= BigInt(amount * 10 ** tokenBalance.decimals);

    if (!isAvailable || amount === 0) {
      setChecklistOption("validAmount", false);
    } else {
      setChecklistOption("validAmount", true);
    }
    setAmount(amount);
    const amountInUsd = calculateAmountInUsd(amount, token);
    setAmountInUsd(amountInUsd);
  };

  const calculateAmountInUsd = (amount: number, token: TokenType) => {
    if (token === "eth") {
      return amount * balances.ethPrice;
    }
    return amount;
  };

  const onReceiverChange = (receiver: string) => {
    const isValid = isAddress(receiver);
    if (!isValid) {
      setChecklistOption("validAddress", false);
    }
    setReceiver(receiver);
    setChecklistOption("validAddress", true);
  };

  const onMax = () => {
    if (!token) {
      return;
    }
    const tokenBalance = balances[token];
    const maxAmount =
      Number(tokenBalance.value) / Number(10 ** tokenBalance.decimals);
    onAmountChange(maxAmount);
  };

  const currentTokenBalance = () => {
    if (!token) {
      return 0;
    }
    return balances[token].formatted;
  };

  const buttonStatus = useMemo(() => {
    const messages = [];

    if (!checklist.validToken) {
      messages.push("Select a token");
    }
    if (!checklist.validAmount) {
      messages.push("Invalid amount");
    }
    if (!checklist.validAddress) {
      messages.push("Invalid address");
    }

    return messages[0];
  }, [checklist]);

  return {
    amount,
    amountInUsd,
    buttonStatus,
    currentTokenBalance,
    onAmountChange,
    onMax,
    onReceiverChange,
    onTokenChange,
    receiver,
    sendingState,
    setSendingState,
    token,
  };
};
