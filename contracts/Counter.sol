// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

/**
 * @title Counter contract
 *
 * @dev `Counter` counts.
 */
contract Counter {
    uint256 private _value;
    event Increment(address indexed from, uint256 value);

    constructor(uint256 start) {
        _value = start;
    }

    /**
     * @dev Increment the number
     */
    function inc() public {
        emit Increment(msg.sender, ++_value);
    }

    /**
     * @dev Retrieve the number from the contract.
     *
     * @return The number.
     */
    function retrieve() public view returns (uint256) {
        return _value;
    }
}
