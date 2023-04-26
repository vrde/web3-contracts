import { Signer } from "ethers";

import { ContractManager, NetworkConfig } from "./contracts";

export class MemoryContractManager extends ContractManager {
  networkConfig: NetworkConfig;
  chainId: number;
  signer: Signer;

  constructor(networkConfig: NetworkConfig, chainId: number, signer: Signer) {
    super();
    this.networkConfig = networkConfig;
    this.chainId = chainId;
    this.signer = signer;
  }

  async loadNetworkConfig(): Promise<NetworkConfig> {
    return this.networkConfig;
  }

  async storeNetworkConfig(network: NetworkConfig): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async getChainId(): Promise<number> {
    return this.chainId;
  }

  async getSigner() {
    return this.signer;
  }
}
