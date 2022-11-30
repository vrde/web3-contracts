// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

/**
 * @title Storage contract
 *
 * @dev `Storage` stores a `uint` in the blockchain.
 */
contract Storage {
    uint256 number;
    address private _owner;

    event Store(address indexed from, uint256 num);

    /**
     * @dev Instantiate the contract. The owner of the contract is set to
     * `msg.sender`.
     */
    constructor() {
        _owner = msg.sender;
    }

    /**
     * @dev Store an number in blockchain.
     *
     * @param num The number to store.
     */
    function store(uint256 num) public {
        require(msg.sender == _owner, "Sender is not owner");
        number = num;
        emit Store(msg.sender, num);
    }

    /**
     * @dev Retrieve the number from the contract.._
     *
     * @return The number.
     */
    function retrieve() public view returns (uint256) {
        return number;
    }
}
