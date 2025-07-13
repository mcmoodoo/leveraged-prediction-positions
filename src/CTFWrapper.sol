// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CTFWrapper is ERC20, ERC1155Holder, Ownable {
    IERC1155 public immutable ctfContract;
    uint256 public immutable tokenId;

    event Wrapped(address indexed user, uint256 amount);
    event Unwrapped(address indexed user, uint256 amount);

    constructor(
        address _ctfContract,
        uint256 _tokenId,
        string memory _name,
        string memory _symbol
    ) ERC20(_name, _symbol) Ownable(msg.sender) {
        ctfContract = IERC1155(_ctfContract);
        tokenId = _tokenId;
    }

    function wrap(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        
        ctfContract.safeTransferFrom(
            msg.sender,
            address(this),
            tokenId,
            amount,
            ""
        );
        
        _mint(msg.sender, amount);
        
        emit Wrapped(msg.sender, amount);
    }

    function unwrap(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        require(balanceOf(msg.sender) >= amount, "Insufficient wrapped tokens");

        _burn(msg.sender, amount);
        
        ctfContract.safeTransferFrom(
            address(this),
            msg.sender,
            tokenId,
            amount,
            ""
        );
        
        emit Unwrapped(msg.sender, amount);
    }

    function getWrappedBalance() external view returns (uint256) {
        return ctfContract.balanceOf(address(this), tokenId);
    }

    function getUserCTFBalance(address user) external view returns (uint256) {
        return ctfContract.balanceOf(user, tokenId);
    }
}
