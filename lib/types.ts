import "@nomiclabs/hardhat-ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { readFile, writeFile } from "fs/promises";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import {
  Counter,
  Counter__factory,
  Storage,
  Storage__factory,
} from "../typechain";

export type MyContracts = Storage | Counter;
export type MyFactories = Storage__factory | Counter__factory;
export type MyContractsNames = "Storage" | "Counter";

type NameToFactory = {
  [K in MyContractsNames]: K extends "Storage"
    ? Storage__factory
    : K extends "Counter"
    ? Counter__factory
    : never;
};

const contractToFactory = {
  Storage: Storage__factory,
  Counter: Counter__factory,
} as const;

type FactoryToContract<T extends MyFactories> = T extends Storage__factory
  ? Storage
  : T extends Counter__factory
  ? Counter
  : never;

export type NetworkConfig = {
  [key in MyContractsNames]?: {
    address: string;
    blockNumber: number;
    blockHash: string;
  };
};

type DeployParameters<T extends MyFactories> = Parameters<T["deploy"]>;

abstract class Contracts {
  abstract getChainId(): Promise<number>;

  abstract getSigner(): Promise<SignerWithAddress>;

  abstract loadNetworkConfig(): Promise<NetworkConfig>;

  abstract storeNetworkConfig(network: NetworkConfig): Promise<void>;

  async getAddress(name: MyContractsNames): Promise<string> {
    const network = await this.loadNetworkConfig();
    const config = network[name];

    if (config === undefined) {
      throw new Error(`Cannot find contract ${name}`);
    }

    return config.address;
  }

  async deploy<T extends MyContractsNames>(
    name: T,
    ...args: DeployParameters<NameToFactory[T]>
  ): Promise<FactoryToContract<NameToFactory[T]>> {
    const Factory = contractToFactory[name];
    const signer = await this.getSigner();
    const factory = new Factory(signer);
    // @ts-expect-error TS2556 - A spread argument must either have a tuple type or be passed to a rest parameter.
    const contract = await factory.deploy(...args);
    const receipt = await contract.deployTransaction.wait(1);
    const network = await this.loadNetworkConfig();
    network[name] = {
      address: contract.address,
      blockNumber: receipt.blockNumber,
      blockHash: receipt.blockHash,
    };
    await this.storeNetworkConfig(network);
    return contract as FactoryToContract<NameToFactory[T]>;
  }

  async load<T extends MyContractsNames>(
    name: T
  ): Promise<FactoryToContract<NameToFactory[T]>> {
    const Factory = contractToFactory[name];
    const address = await this.getAddress(name);
    const signer = await this.getSigner();
    return Factory.connect(address, signer) as FactoryToContract<
      NameToFactory[T]
    >;
  }
}

export class HREContracts extends Contracts {
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

export class MemoryContracts extends Contracts {
  networkConfig: NetworkConfig;
  chainId: number;
  signer: SignerWithAddress;

  constructor(
    networkConfig: NetworkConfig,
    chainId: number,
    signer: SignerWithAddress
  ) {
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
