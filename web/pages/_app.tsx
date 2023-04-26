import "@/styles/globals.css";
import { EthereumClient, w3mConnectors, w3mProvider } from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { WagmiConfig, configureChains, createClient } from "wagmi";
import { goerli, mainnet } from "wagmi/chains";

import { localhost } from "@/lib/chains";
import { PROJECT_ID } from "@/lib/config";

import ContractsProvider from "@/components/ContractsProvider";

const chains = [localhost, mainnet, goerli];

const { provider } = configureChains(chains, [w3mProvider({ projectId: PROJECT_ID })]);
const wagmiClient = createClient({
  autoConnect: true,
  connectors: w3mConnectors({ projectId: PROJECT_ID, version: 1, chains }),
  provider,
});
const ethereumClient = new EthereumClient(wagmiClient, chains);

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <WagmiConfig client={wagmiClient}>
        <ContractsProvider>
          <Component {...pageProps} />
        </ContractsProvider>
      </WagmiConfig>

      <Web3Modal projectId={PROJECT_ID} ethereumClient={ethereumClient} />
    </>
  );
}

// Disable server side rendering
export default dynamic(() => Promise.resolve(App), {
  ssr: false,
});
