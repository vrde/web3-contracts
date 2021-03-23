![Test workflow](https://github.com/vrde/hardhat-typescript-template/actions/workflows/node.yml/badge.svg)

# HardHat TypeScript Template

```bash
degit https://github.com/vrde/hardhat-typescript-template
```

## What's included

- TypeScript configuration.
- Sample `Storage` contract and tests.
- Tasks:
  - `deploy`
  - `store` to store a value
  - `retrieve` to retrieve the current value

## Run it

If you just want to run tests, then `npm test` is your friend.

If you want to play with the tasks, run your favorite Ethereum development node (mine is [ethnode](https://github.com/vrde/ethnode/), give it a try).

When the node is running, try the following commands

- `npx hardhat --network localhost deploy` to deploy the contract in your local node.
- `npx hardhat --network localhost store 666` to store a new value in the contract.
- `npx hardhat --network localhost retrieve` to retrieve the current value.
- `npx hardhat --network localhost retrieve --hex` to retrieve the current value in hex.