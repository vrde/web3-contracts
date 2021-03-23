import { task } from "hardhat/config";
import { readFile } from "fs/promises";
import { Storage__factory } from "../typechain";

task("store", "Store a value")
  .addParam("value", "the value to write")
  .setAction(async ({ value }, hre) => {
    const network = JSON.parse(
      await readFile("./artifacts/network.json", "utf8")
    );
    const [alice] = await hre.ethers.getSigners();
    const { chainId } = await hre.ethers.provider.getNetwork();

    const storageContract = Storage__factory.connect(
      network[chainId]["Storage"],
      alice
    );

    const tx = await storageContract.store(value);
    console.log("Submitted tx", tx.hash);
    const receipt = await tx.wait();
    console.log("Transaction included in block", receipt.blockNumber);
  });

task("retrieve", "Read the current value")
  .addFlag("hex", "Display the value in hex")
  .setAction(async ({ hex }, hre) => {
    const network = JSON.parse(
      await readFile("./artifacts/network.json", "utf8")
    );
    const [alice] = await hre.ethers.getSigners();
    const { chainId } = await hre.ethers.provider.getNetwork();

    const storageContract = Storage__factory.connect(
      network[chainId]["Storage"],
      alice
    );

    const value = await storageContract.retrieve();
    if (hex) {
      console.log(value.toHexString());
    } else {
      console.log(value.toString());
    }
  });
