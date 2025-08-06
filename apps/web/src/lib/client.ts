import { createSmartAccountClient } from "permissionless";
import { toSimpleSmartAccount } from "permissionless/accounts";
import { createPimlicoClient } from "permissionless/clients/pimlico";
import { createPublicClient, http } from "viem";
import { entryPoint07Address } from "viem/account-abstraction";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";

const pimlicoClient = createPimlicoClient({
  entryPoint: {
    address: entryPoint07Address,
    version: "0.7",
  },
  transport: http(
    "https://api.pimlico.io/v2/sepolia/rpc?apikey=YOUR_API_KEY_HERE",
  ),
});

const pimlicoBundlerUrl = `https://api.pimlico.io/v2/sepolia/rpc?apikey=<PIMLICO_API_KEY>`;

export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http("https://sepolia.rpc.thirdweb.com"),
});

const owner = privateKeyToAccount("0x0");

const simpleSmartAccount = await toSimpleSmartAccount({
  client: publicClient,
  entryPoint: {
    address: entryPoint07Address,
    version: "0.7",
  },
  owner,
});

const smartAccountClient = createSmartAccountClient({
  account: simpleSmartAccount,
  bundlerTransport: http(pimlicoBundlerUrl),
  chain: sepolia,
  paymaster: pimlicoClient, // optional
  userOperation: {
    estimateFeesPerGas: async () => {
      return (await pimlicoClient.getUserOperationGasPrice()).fast;
    },
  },
});

// smartAccountClient
