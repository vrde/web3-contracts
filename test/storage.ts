import { ethers } from "hardhat";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { solidity } from "ethereum-waffle";
import { Storage__factory, Storage } from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

chai.use(solidity);
chai.use(chaiAsPromised);
const { expect } = chai;

const AddressZero = ethers.constants.AddressZero;
const AddressOne = AddressZero.replace(/.$/, "1");

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
    it("Fail if not approved", async () => {
      expect(await aliceS.retrieve()).to.equal(0);
      await expect(bobS.store(123)).to.be.revertedWith("Sender is not owner");
      expect(await aliceS.retrieve()).to.equal(0);
    });
  });
});
