// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Storage {
    uint256 number;
    address private _owner;

    event Store(address indexed from, uint256 num);

    constructor() {
        _owner = msg.sender;
    }

    function store(uint256 num) public {
        require(msg.sender == _owner, "Sender is not owner");
        number = num;
        emit Store(msg.sender, num);
    }

    function retrieve() public view returns (uint256) {
        return number;
    }
}
