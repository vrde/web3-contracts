import { Provider } from "@ethersproject/providers";
import { Signer } from "ethers";

import { ContractManager, NetworkConfig } from "./contracts";

export class MemoryContractManager extends ContractManager {
  networkConfig: NetworkConfig;
  signer?: Signer;
  provider?: Provider;

  constructor(
    networkConfig: NetworkConfig,
    signer?: Signer,
    provider?: Provider
  ) {
    super();
    this.networkConfig = networkConfig;
    this.signer = signer;
    this.provider = provider;
  }

  async loadNetworkConfig(): Promise<NetworkConfig> {
    return this.networkConfig;
  }

  async storeNetworkConfig(network: NetworkConfig): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async getChainId(): Promise<number> {
    const provider = await this.getProvider();
    const { chainId } = await provider.getNetwork();
    return chainId;
  }

  async getSigner() {
    if (!this.signer) {
      throw new Error("Signer not available");
    }
    return this.signer;
  }

  async getProvider() {
    if (!this.provider) {
      throw new Error("Provider not available");
    }
    return this.provider;
  }
}
