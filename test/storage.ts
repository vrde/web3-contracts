import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";

import { Storage, Storage__factory } from "../typechain";

chai.use(solidity);
chai.use(chaiAsPromised);
const { expect } = chai;

describe("Storage", () => {
  let storage: Storage;
  let alice: SignerWithAddress, bob: SignerWithAddress;
  let aliceS: Storage, bobS: Storage;

  beforeEach(async () => {
    [alice, bob] = await ethers.getSigners();

    const StorageFactory = (await ethers.getContractFactory(
      "Storage",
      alice
    )) as Storage__factory;
    storage = await StorageFactory.deploy();
    await storage.deployed();

    aliceS = storage.connect(alice);
    bobS = storage.connect(bob);
  });

  describe("Store value", async () => {
    it("Allow Alice to store value", async () => {
      expect(await aliceS.retrieve()).to.equal(0);
      await expect(aliceS.store(666))
        .to.emit(storage, "Store")
        .withArgs(alice.address, 666);
      expect(await aliceS.retrieve()).to.equal(666);
    });

    it.skip("Fail if not approved", async () => {
      expect(await aliceS.retrieve()).to.equal(0);
      await expect(bobS.store(123)).to.be.revertedWith("Sender is not owner");
      expect(await aliceS.retrieve()).to.equal(0);
    });
  });
});
