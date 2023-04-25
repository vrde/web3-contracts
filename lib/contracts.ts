import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import { MyFactories } from "./types";

//export function deploy<T>() {}

export function store<T>() {}

export function load<T>() {}

/*
export async function _deployContract(
  hre: HardhatRuntimeEnvironment,
  contractName: ContractNames,
  verify = false,
  args: any[] = [],
  libraries = ({} = {}),
  proxy = false
) {
  const factory = await hre.ethers.getContractFactory(contractName, {
    libraries,
  });
  console.log("Deploy:", contractName);
  const { chainId } = await hre.ethers.provider.getNetwork();
  let contract: Contract;
  if (proxy) {
    contract = await hre.upgrades.deployProxy(factory, args);
  } else {
    contract = await factory.deploy(...args);
  }
  console.log("Contract address:", contract.address);
  console.log(`Wait ${WAIT_BLOCKS} blocks`);
  const receipt = await contract.deployTransaction.wait(WAIT_BLOCKS);

  // Save the address in the config json file
  const configPath = getConfigPath(chainId);
  let contracts: NeokingdomNetworkFile = {};
  try {
    contracts = JSON.parse(await readFile(configPath, "utf8"));
  } catch (e) {
    if ((e as any).code !== "ENOENT") {
      throw e;
    }
  }
  contracts[contractName] = {
    address: contract.address,
    blockNumber: receipt.blockNumber,
    blockHash: receipt.blockHash,
  };
  await writeFile(configPath, JSON.stringify(contracts, null, 2));
  console.log(
    `Address ${contract.address} stored for ${contractName} at ${configPath}`
  );

  // Save constructor arguments for verification
  await writeFile(
    `./deployments/${chainId}.${contractName}.arguments.json`,
    JSON.stringify(args)
  );

  if (verify) {
    console.log("Wait 2 blocks");
    await contract.deployTransaction.wait(2);
    console.log("Verify contract");
    try {
      await hre.run("verify", {
        address: contract.address,
        constructorArgs: `deployments/${chainId}.${contractName}.arguments.json`,
        contract: `contracts/${contractName}.sol:${contractName}`,
      });
    } catch (e) {
      console.error(e);
    }
  }

  return contract;
}
*/

//
//
//
//
