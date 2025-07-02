// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";

interface AggregatorV3Interface {
    function decimals() external view returns (uint8);
    function description() external view returns (string memory);
    function version() external view returns (uint256);
    function getRoundData(uint80 _roundId) external view returns (
        uint80 roundId,
        int256 answer,
        uint256 startedAt,
        uint256 updatedAt,
        uint80 answeredInRound
    );
    function latestRoundData() external view returns (
        uint80 roundId,
        int256 answer,
        uint256 startedAt,
        uint256 updatedAt,
        uint80 answeredInRound
    );
}

contract MockOracle is AggregatorV3Interface, Ownable {
    uint8 private _decimals;
    string private _description;
    uint256 private _version;
    
    struct RoundData {
        int256 answer;
        uint256 startedAt;
        uint256 updatedAt;
        uint80 answeredInRound;
    }
    
    mapping(uint80 => RoundData) private rounds;
    uint80 private currentRoundId;
    
    event AnswerUpdated(int256 indexed current, uint256 indexed roundId, uint256 updatedAt);
    event NewRound(uint256 indexed roundId, address indexed startedBy, uint256 startedAt);

    constructor(
        uint8 _dec,
        string memory _desc,
        uint256 _ver,
        int256 _initialAnswer
    ) Ownable(msg.sender) {
        _decimals = _dec;
        _description = _desc;
        _version = _ver;
        currentRoundId = 1;
        
        rounds[currentRoundId] = RoundData({
            answer: _initialAnswer,
            startedAt: block.timestamp,
            updatedAt: block.timestamp,
            answeredInRound: currentRoundId
        });
        
        emit NewRound(currentRoundId, msg.sender, block.timestamp);
        emit AnswerUpdated(_initialAnswer, currentRoundId, block.timestamp);
    }

    function decimals() external view override returns (uint8) {
        return _decimals;
    }

    function description() external view override returns (string memory) {
        return _description;
    }

    function version() external view override returns (uint256) {
        return _version;
    }

    function getRoundData(uint80 _roundId) external view override returns (
        uint80 roundId,
        int256 answer,
        uint256 startedAt,
        uint256 updatedAt,
        uint80 answeredInRound
    ) {
        require(rounds[_roundId].updatedAt > 0, "No data present");
        
        RoundData memory round = rounds[_roundId];
        return (
            _roundId,
            round.answer,
            round.startedAt,
            round.updatedAt,
            round.answeredInRound
        );
    }

    function latestRoundData() external view override returns (
        uint80 roundId,
        int256 answer,
        uint256 startedAt,
        uint256 updatedAt,
        uint80 answeredInRound
    ) {
        RoundData memory round = rounds[currentRoundId];
        return (
            currentRoundId,
            round.answer,
            round.startedAt,
            round.updatedAt,
            round.answeredInRound
        );
    }

    function updateAnswer(int256 _answer) external onlyOwner {
        currentRoundId++;
        
        rounds[currentRoundId] = RoundData({
            answer: _answer,
            startedAt: block.timestamp,
            updatedAt: block.timestamp,
            answeredInRound: currentRoundId
        });
        
        emit NewRound(currentRoundId, msg.sender, block.timestamp);
        emit AnswerUpdated(_answer, currentRoundId, block.timestamp);
    }

    function getCurrentRoundId() external view returns (uint80) {
        return currentRoundId;
    }

    function getLatestAnswer() external view returns (int256) {
        return rounds[currentRoundId].answer;
    }
}