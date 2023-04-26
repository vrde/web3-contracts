import { readFile, writeFile } from "fs/promises";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import {
  ContractManager,
  DeployParameters,
  FactoryToContract,
  MyContractsNames,
  NameToFactory,
  NetworkConfig,
} from "./contracts";

export class HREContractManager extends ContractManager {
  hre: HardhatRuntimeEnvironment;
  verify: Boolean;

  constructor(hre: HardhatRuntimeEnvironment, { verify = false } = {}) {
    super();
    this.hre = hre;
    this.verify = verify;
  }

  async getNetworkPath() {
    const chainId = await this.getChainId();
    return `./deployments/${chainId}.network.json`;
  }

  async loadNetworkConfig(): Promise<NetworkConfig> {
    const path = await this.getNetworkPath();
    try {
      return JSON.parse(await readFile(path, "utf8"));
    } catch (e) {
      if ((e as any).code !== "ENOENT") {
        throw e;
      }
    }
    return {};
  }

  async storeNetworkConfig(network: NetworkConfig) {
    const path = await this.getNetworkPath();
    await writeFile(path, JSON.stringify(network, null, 2));
  }

  async getChainId(): Promise<number> {
    const { chainId } = await this.hre.ethers.provider.getNetwork();
    return chainId;
  }

  async getSigner() {
    const [signer] = await this.hre.ethers.getSigners();
    return signer;
  }

  async deploy<T extends MyContractsNames>(
    name: T,
    ...args: DeployParameters<NameToFactory[T]>
  ): Promise<FactoryToContract<NameToFactory[T]>> {
    const contract = await super.deploy(name, ...args);
    const chainId = await this.getChainId();

    await writeFile(
      `./deployments/${chainId}.${name}.arguments.json`,
      JSON.stringify(args)
    );

    if (this.verify) {
      console.log("Wait 2 blocks");
      await contract.deployTransaction.wait(2);
      console.log("Verify contract");
      try {
        await this.hre.run("verify", {
          address: contract.address,
          constructorArgs: `deployments/${chainId}.${name}.arguments.json`,
          contract: `contracts/${name}.sol:${name}`,
        });
      } catch (e) {
        console.error(e);
      }
    }

    return contract;
  }
}
