import type { SessionTypes, SignClientTypes } from "@walletconnect/types";
import { serializeError } from "serialize-error";
import type { Hex } from "viem";

export const truncateEthAddress = (address: string | undefined) => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

type Duration = `${number}ms` | `${number}s` | `${number}m` | `${number}h`;

export const sleep = (duration: Duration) => {
  let time: number;
  if (duration.endsWith("ms")) {
    time = parseInt(duration.slice(0, -2));
  } else if (duration.endsWith("s")) {
    time = parseInt(duration.slice(0, -1)) * 1000;
  } else if (duration.endsWith("m")) {
    time = parseInt(duration.slice(0, -1)) * 1000 * 60;
  } else if (duration.endsWith("h")) {
    time = parseInt(duration.slice(0, -1)) * 1000 * 60 * 60;
  } else {
    throw new Error("Invalid duration");
  }
  return new Promise((resolve) => setTimeout(resolve, time));
};

export const parseErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  const serialized = serializeError(error);
  if (
    typeof serialized === "object" &&
    serialized !== null &&
    "message" in serialized &&
    typeof serialized.message === "string"
  ) {
    return serialized.message;
  }

  return "An unknown error occurred";
};

export const parseSignMessageRequest = (
  sessionRequest: SignClientTypes.EventArguments["session_request"],
) => {
  const { id, params } = sessionRequest;
  const { chainId, request } = params;
  const [hexMessage, address] = request.params as [Hex, Hex];
  return {
    chainId,
    expiryTimestamp: request.expiryTimestamp,
    id,
    method: request.method as "eth_sign" | "personal_sign",
    params: {
      address,
      message: hexMessage,
    },
  };
};

export const parseSession = (session: SessionTypes.Struct | undefined) => {
  const name = session?.peer.metadata.name ?? "Instadapp";
  const url = session?.peer.metadata.url ?? "http://localhost:3000";
  const icon =
    session?.peer.metadata.icons[0] ??
    "https://images.mirror-media.xyz/publication-images/Lx_fohJ8ttprQ3DmDKU9N.png?height=2048&width=2048";
  const description = session?.peer.metadata.description ?? "No description";
  return { description, icon, name, url };
};
