import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
import "@typechain/hardhat";
import { config as dotEnvConfig } from "dotenv";
import "hardhat-gas-reporter";
import { HardhatUserConfig } from "hardhat/types";
import "solidity-coverage";
import "solidity-docgen";

// Extend HRE with ContractManager
import("./lib/HREContractManager").catch((e) =>
  console.log("Cannot load HREContractManager", e.toString())
);
import("./tasks").catch((e) => console.log("Cannot load tasks", e.toString()));
dotEnvConfig();

const INFURA_API_KEY = process.env.INFURA_API_KEY || "";
const RINKEBY_PRIVATE_KEY =
  process.env.RINKEBY_PRIVATE_KEY! ||
  "0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3"; // well known private key
const KOVAN_PRIVATE_KEY =
  process.env.KOVAN_PRIVATE_KEY! ||
  "0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3"; // well known private key
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const COINMARKETCAP_KEY = process.env.COINMARKETCAP_KEY || "";

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  solidity: {
    compilers: [
      {
        version: "0.8.19",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  networks: {
    hardhat: {},
    localhost: {},
    kovan: {
      url: `https://kovan.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [KOVAN_PRIVATE_KEY],
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [RINKEBY_PRIVATE_KEY],
    },
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: ETHERSCAN_API_KEY,
  },
  gasReporter: {
    enabled: !!process.env.GAS_REPORTER,
    currency: "USD",
    gasPrice: 100,
    coinmarketcap: COINMARKETCAP_KEY,
  },
  typechain: {
    outDir: "./typechain",
    discriminateTypes: true,
  },
  // See config options at
  // https://github.com/OpenZeppelin/solidity-docgen/blob/master/src/config.ts
  docgen: {},
};

export default config;
