// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {IOracle} from '@morpho-blue/contracts/interfaces/IOracle.sol';

contract MockOracle is IOracle {
    uint256 public price;
    uint256 public decimals = 18;

    mapping(address => bool) public isAuthorized;

    modifier onlyAuthorized() {
        require(isAuthorized[msg.sender], "Not authorized");
        _;
    }

    constructor(uint256 _initialPrice) {
        price = _initialPrice;
        isAuthorized[msg.sender] = true;
    }

    function updatePrice(uint256 _newPrice) external onlyAuthorized {
        price = _newPrice;
    }

    function addAuthorized(address _addr) external onlyAuthorized {
        isAuthorized[_addr] = true;
    }

    function removeAuthorized(address _addr) external onlyAuthorized {
        isAuthorized[_addr] = false;
    }
}

