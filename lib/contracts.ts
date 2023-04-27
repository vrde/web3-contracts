import { Provider } from "@ethersproject/providers";
import { Signer } from "ethers";

import {
  Counter,
  Counter__factory,
  Storage,
  Storage__factory,
} from "../typechain";

export type MyContracts = Storage | Counter;
export type MyFactories = Storage__factory | Counter__factory;
export type MyContractsNames = "Storage" | "Counter";

export type Contracts = {
  storage: Storage;
  counter: Counter;
};

export type NameToContractType = {
  [K in keyof Contracts]: MyContractsNames;
};

const nameToContract: NameToContractType = {
  storage: "Storage",
  counter: "Counter",
} as const;

export type NameToFactory = {
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

export type FactoryToContract<T extends MyFactories> =
  T extends Storage__factory
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

export type DeployParameters<T extends MyFactories> = Parameters<T["deploy"]>;

export abstract class ContractManager {
  abstract getChainId(): Promise<number>;

  abstract getSigner(): Promise<Signer>;

  abstract getProvider(): Promise<Provider>;

  abstract loadNetworkConfig(): Promise<NetworkConfig>;

  abstract storeNetworkConfig(network: NetworkConfig): Promise<void>;

  async getSignerOrProvider() {
    try {
      return await this.getSigner();
    } catch (e) {
      return await this.getProvider();
    }
  }

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
    const signerOrProvider = await this.getSignerOrProvider();
    return Factory.connect(address, signerOrProvider) as FactoryToContract<
      NameToFactory[T]
    >;
  }

  async loadAll() {
    const contracts = {};
    let key: keyof Contracts;
    for (key in nameToContract) {
      const name = nameToContract[key];
      const contract = await this.load(name);
      // @ts-ignore
      contracts[key] = contract;
    }
    return contracts as Contracts;
  }
}
