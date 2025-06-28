// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IConditionalTokens is IERC1155 {
    function splitPosition(
        address collateralToken,
        bytes32 parentCollectionId,
        bytes32 conditionId,
        uint256[] calldata partition,
        uint256 amount
    ) external;
    
    function mergePositions(
        address collateralToken,
        bytes32 parentCollectionId,
        bytes32 conditionId,
        uint256[] calldata partition,
        uint256 amount
    ) external;
    
    function getCollectionId(
        bytes32 parentCollectionId,
        bytes32 conditionId,
        uint256 indexSet
    ) external view returns (bytes32);
    
    function getPositionId(
        address collateralToken,
        bytes32 collectionId
    ) external pure returns (uint256);
}

contract PolymarketTokenWrapper is ERC20, ERC1155Holder, Ownable, ReentrancyGuard {
    IConditionalTokens public immutable conditionalTokens;
    IERC20 public immutable collateralToken;
    
    uint256 public immutable yesTokenId;
    uint256 public immutable noTokenId;
    bytes32 public immutable conditionId;
    
    bool public immutable isYesToken;
    
    event Wrap(address indexed user, uint256 amount);
    event Unwrap(address indexed user, uint256 amount);
    
    constructor(
        string memory name,
        string memory symbol,
        address _conditionalTokens,
        address _collateralToken,
        bytes32 _conditionId,
        bool _isYesToken
    ) ERC20(name, symbol) Ownable(msg.sender) {
        conditionalTokens = IConditionalTokens(_conditionalTokens);
        collateralToken = IERC20(_collateralToken);
        conditionId = _conditionId;
        isYesToken = _isYesToken;
        
        bytes32 collectionId = conditionalTokens.getCollectionId(
            bytes32(0),
            _conditionId,
            _isYesToken ? 1 : 2
        );
        
        uint256 tokenId = conditionalTokens.getPositionId(
            _collateralToken,
            collectionId
        );
        
        if (_isYesToken) {
            yesTokenId = tokenId;
            noTokenId = 0;
        } else {
            yesTokenId = 0;
            noTokenId = tokenId;
        }
    }
    
    function wrap(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        
        uint256 tokenId = isYesToken ? yesTokenId : noTokenId;
        
        conditionalTokens.safeTransferFrom(
            msg.sender,
            address(this),
            tokenId,
            amount,
            ""
        );
        
        _mint(msg.sender, amount);
        
        emit Wrap(msg.sender, amount);
    }
    
    function unwrap(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(balanceOf(msg.sender) >= amount, "Insufficient wrapped token balance");
        
        uint256 tokenId = isYesToken ? yesTokenId : noTokenId;
        
        _burn(msg.sender, amount);
        
        conditionalTokens.safeTransferFrom(
            address(this),
            msg.sender,
            tokenId,
            amount,
            ""
        );
        
        emit Unwrap(msg.sender, amount);
    }
    
    function getUnderlyingTokenId() external view returns (uint256) {
        return isYesToken ? yesTokenId : noTokenId;
    }
    
    function decimals() public pure override returns (uint8) {
        return 6;
    }
}