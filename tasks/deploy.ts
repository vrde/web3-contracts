import { task } from "hardhat/config";

task("deploy:storage", "Deploy Storage", async (_, hre) => {
  await hre.contracts.deploy("Storage");
});

task("deploy:counter", "Deploy Counter", async (_, hre) => {
  await hre.contracts.deploy("Counter", 10);
});
