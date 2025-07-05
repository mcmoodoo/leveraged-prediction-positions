// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract MockPolyMarketCTF is ERC1155, Ownable {
    using Strings for uint256;

    // Events
    event ConditionPreparation(
        bytes32 indexed conditionId,
        address indexed oracle,
        bytes32 indexed questionId,
        uint256 outcomeSlotCount
    );
    
    event ConditionResolution(
        bytes32 indexed conditionId,
        address indexed oracle,
        bytes32 indexed questionId,
        uint256 outcomeSlotCount,
        uint256[] payoutNumerators
    );
    
    event PositionSplit(
        address indexed stakeholder,
        IERC20 collateralToken,
        bytes32 indexed parentCollectionId,
        bytes32 indexed conditionId,
        uint256[] partition,
        uint256 amount
    );
    
    event PositionsMerge(
        address indexed stakeholder,
        IERC20 collateralToken,
        bytes32 indexed parentCollectionId,
        bytes32 indexed conditionId,
        uint256[] partition,
        uint256 amount
    );
    
    event PayoutRedemption(
        address indexed redeemer,
        IERC20 indexed collateralToken,
        bytes32 indexed parentCollectionId,
        bytes32 conditionId,
        uint256[] indexSets,
        uint256 payout
    );

    // Structs
    struct Condition {
        address oracle;
        bytes32 questionId;
        uint256 outcomeSlotCount;
        uint256[] payoutNumerators;
        bool resolved;
    }

    // Storage
    mapping(bytes32 => Condition) public conditions;
    mapping(bytes32 => uint256) public payoutDenominator;
    mapping(address => mapping(bytes32 => uint256)) public collateralTokens;
    
    // Constants
    uint256 public constant MAX_OUTCOME_SLOT_COUNT = 256;
    
    constructor() ERC1155("") Ownable(msg.sender) {
        // Mint the specified fungible token
        bytes32 recessionNoTokenId = keccak256("Recession NO token");
        bytes32 ethAbove100KYesTokenId = keccak256("Eth Above 100k YES token");
        _mint(0xe71DB3894A79BeBe377fbD7B601766660Aaea5f9, uint256(recessionNoTokenId), 100, "");
        _mint(0xe71DB3894A79BeBe377fbD7B601766660Aaea5f9, uint256(ethAbove100KYesTokenId), 100, "");
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        return string(abi.encodePacked("https://polymarket.com/metadata/", tokenId.toString()));
    }

    function prepareCondition(
        address oracle,
        bytes32 questionId,
        uint256 outcomeSlotCount
    ) external {
        require(outcomeSlotCount >= 2, "Outcome count must be at least 2");
        require(outcomeSlotCount <= MAX_OUTCOME_SLOT_COUNT, "Outcome count exceeds maximum");
        
        bytes32 conditionId = getConditionId(oracle, questionId, outcomeSlotCount);
        require(!conditions[conditionId].resolved, "Condition already exists");
        
        conditions[conditionId] = Condition({
            oracle: oracle,
            questionId: questionId,
            outcomeSlotCount: outcomeSlotCount,
            payoutNumerators: new uint256[](0),
            resolved: false
        });
        
        emit ConditionPreparation(conditionId, oracle, questionId, outcomeSlotCount);
    }

    function reportPayouts(
        bytes32 questionId,
        uint256[] calldata payouts
    ) external {
        bytes32 conditionId = getConditionId(msg.sender, questionId, payouts.length);
        require(conditions[conditionId].oracle == msg.sender, "Not oracle");
        require(!conditions[conditionId].resolved, "Already resolved");
        
        conditions[conditionId].payoutNumerators = payouts;
        conditions[conditionId].resolved = true;
        
        uint256 sum = 0;
        for (uint256 i = 0; i < payouts.length; i++) {
            sum += payouts[i];
        }
        payoutDenominator[conditionId] = sum;
        
        emit ConditionResolution(
            conditionId,
            msg.sender,
            questionId,
            payouts.length,
            payouts
        );
    }

    function splitPosition(
        IERC20 collateralToken,
        bytes32 parentCollectionId,
        bytes32 conditionId,
        uint256[] calldata partition,
        uint256 amount
    ) external {
        require(conditions[conditionId].oracle != address(0), "Condition not prepared");
        require(partition.length == conditions[conditionId].outcomeSlotCount, "Invalid partition");
        
        // Transfer collateral from user
        collateralToken.transferFrom(msg.sender, address(this), amount);
        
        // Mint position tokens
        for (uint256 i = 0; i < partition.length; i++) {
            if (partition[i] > 0) {
                uint256 positionId = getPositionId(collateralToken, parentCollectionId, conditionId, i);
                _mint(msg.sender, positionId, amount, "");
            }
        }
        
        emit PositionSplit(msg.sender, collateralToken, parentCollectionId, conditionId, partition, amount);
    }

    function mergePositions(
        IERC20 collateralToken,
        bytes32 parentCollectionId,
        bytes32 conditionId,
        uint256[] calldata partition,
        uint256 amount
    ) external {
        require(conditions[conditionId].oracle != address(0), "Condition not prepared");
        require(partition.length == conditions[conditionId].outcomeSlotCount, "Invalid partition");
        
        // Burn position tokens
        for (uint256 i = 0; i < partition.length; i++) {
            if (partition[i] > 0) {
                uint256 positionId = getPositionId(collateralToken, parentCollectionId, conditionId, i);
                _burn(msg.sender, positionId, amount);
            }
        }
        
        // Transfer collateral to user
        collateralToken.transfer(msg.sender, amount);
        
        emit PositionsMerge(msg.sender, collateralToken, parentCollectionId, conditionId, partition, amount);
    }

    function redeemPositions(
        IERC20 collateralToken,
        bytes32 parentCollectionId,
        bytes32 conditionId,
        uint256[] calldata indexSets
    ) external {
        require(conditions[conditionId].resolved, "Condition not resolved");
        
        uint256 totalPayout = 0;
        uint256 denominator = payoutDenominator[conditionId];
        
        for (uint256 i = 0; i < indexSets.length; i++) {
            uint256 positionId = getPositionId(collateralToken, parentCollectionId, conditionId, indexSets[i]);
            uint256 balance = balanceOf(msg.sender, positionId);
            
            if (balance > 0) {
                uint256 payout = (balance * conditions[conditionId].payoutNumerators[indexSets[i]]) / denominator;
                totalPayout += payout;
                _burn(msg.sender, positionId, balance);
            }
        }
        
        if (totalPayout > 0) {
            collateralToken.transfer(msg.sender, totalPayout);
        }
        
        emit PayoutRedemption(msg.sender, collateralToken, parentCollectionId, conditionId, indexSets, totalPayout);
    }

    function getConditionId(
        address oracle,
        bytes32 questionId,
        uint256 outcomeSlotCount
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(oracle, questionId, outcomeSlotCount));
    }

    function getPositionId(
        IERC20 collateralToken,
        bytes32 parentCollectionId,
        bytes32 conditionId,
        uint256 outcomeIndex
    ) public pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(collateralToken, parentCollectionId, conditionId, outcomeIndex)));
    }

    function getCollectionId(
        bytes32 parentCollectionId,
        bytes32 conditionId,
        uint256 outcomeIndex
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(parentCollectionId, conditionId, outcomeIndex));
    }

    function balanceOfBatch(
        address[] memory accounts,
        uint256[] memory ids
    ) public view override returns (uint256[] memory) {
        return super.balanceOfBatch(accounts, ids);
    }
}

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}
