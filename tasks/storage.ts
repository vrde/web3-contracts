import { task } from "hardhat/config";

task("store", "Store a value")
  .addParam("value", "the value to write")
  .setAction(async ({ value }, hre) => {
    const storage = await hre.contracts.load("Storage");
    await storage.store(value);
  });

task("retrieve", "Read the current value").setAction(async (_, hre) => {
  const storage = await hre.contracts.load("Storage");
  console.log(await storage.retrieve());
});
