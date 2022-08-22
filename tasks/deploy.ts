import { task } from "hardhat/config";
import { writeFile } from "fs/promises";

task("deploy", "Deploy Storage", async (_, hre) => {
  console.log("Deploy contract Storage");
  const storageFactory = await hre.ethers.getContractFactory("Storage");

  const storageContract = await storageFactory.deploy();
  console.log("  Address", storageContract.address);
  const receipt = await storageContract.deployed();
  console.log("  Receipt", receipt.deployTransaction.hash);

  const { chainId } = await hre.ethers.provider.getNetwork();

  const config = {
    [chainId]: {
      Storage: storageContract.address,
    },
  };

  console.log("Configuration file in ./artifacts/network.json");
  await writeFile("./artifacts/network.json", JSON.stringify(config, null, 2));

  // It is recommended to wait for 5 confirmations before issuing the verification request
  await storageContract.deployTransaction.wait(5);
  await hre.run("verify", {
    address: storageContract.address,
    contract: "contracts/Storage.sol:Storage",
    //constructorArgsParams: []
  });
});
