import { NetworkConfig } from "../lib/contracts";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_TITLE: string;
      NEXT_PUBLIC_DESCRIPTION: string;
      NEXT_PUBLIC_PROJECT_ID: string;
      NEXT_PUBLIC_NETWORK: string;
      NEXT_PUBLIC_CHAIN_ID: string;
      NETWORK_CONFIG: NetworkConfig;
    }
  }
}

export {};
