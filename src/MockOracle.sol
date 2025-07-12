// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract MockOracle {
    uint256 public mockPrice;
    uint256 public decimals = 18;

    mapping(address => bool) public isAuthorized;

    modifier onlyAuthorized() {
        require(isAuthorized[msg.sender], "Not authorized");
        _;
    }

    constructor(uint256 _initialPrice) {
        mockPrice = _initialPrice;
        isAuthorized[msg.sender] = true;
    }

    function updatePrice(uint256 _newPrice) external onlyAuthorized {
        mockPrice = _newPrice;
    }

    function addAuthorized(address _addr) external onlyAuthorized {
        isAuthorized[_addr] = true;
    }

    function removeAuthorized(address _addr) external onlyAuthorized {
        isAuthorized[_addr] = false;
    }
}

