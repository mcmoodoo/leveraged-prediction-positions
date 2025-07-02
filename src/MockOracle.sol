// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

interface AggregatorV3Interface {
    function decimals() external view returns (uint8);
    function description() external view returns (string memory);
    function version() external view returns (uint256);
    function getRoundData(uint80 _roundId)
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        );
    function latestRoundData()
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        );
}

contract MockOracle is AggregatorV3Interface, Ownable {
    struct RoundData {
        int256 answer;
        uint256 startedAt;
        uint256 updatedAt;
        uint80 answeredInRound;
    }

    uint8 private _decimals;
    string private _description;
    uint256 private _version;
    uint80 private _currentRoundId;
    
    mapping(uint80 => RoundData) private _rounds;
    
    event PriceUpdated(uint80 indexed roundId, int256 answer, uint256 timestamp);
    
    constructor(
        uint8 decimals_,
        string memory description_,
        uint256 version_,
        int256 initialPrice
    ) Ownable(msg.sender) {
        _decimals = decimals_;
        _description = description_;
        _version = version_;
        _currentRoundId = 1;
        
        _rounds[_currentRoundId] = RoundData({
            answer: initialPrice,
            startedAt: block.timestamp,
            updatedAt: block.timestamp,
            answeredInRound: _currentRoundId
        });
        
        emit PriceUpdated(_currentRoundId, initialPrice, block.timestamp);
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
    
    function getRoundData(uint80 _roundId)
        external
        view
        override
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        require(_roundId <= _currentRoundId && _roundId > 0, "Invalid round ID");
        
        RoundData memory round = _rounds[_roundId];
        return (
            _roundId,
            round.answer,
            round.startedAt,
            round.updatedAt,
            round.answeredInRound
        );
    }
    
    function latestRoundData()
        external
        view
        override
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        RoundData memory round = _rounds[_currentRoundId];
        return (
            _currentRoundId,
            round.answer,
            round.startedAt,
            round.updatedAt,
            round.answeredInRound
        );
    }
    
    function updatePrice(int256 newPrice) external onlyOwner {
        _currentRoundId++;
        
        _rounds[_currentRoundId] = RoundData({
            answer: newPrice,
            startedAt: block.timestamp,
            updatedAt: block.timestamp,
            answeredInRound: _currentRoundId
        });
        
        emit PriceUpdated(_currentRoundId, newPrice, block.timestamp);
    }
    
    function updatePriceWithTimestamp(int256 newPrice, uint256 timestamp) external onlyOwner {
        require(timestamp <= block.timestamp, "Timestamp cannot be in the future");
        
        _currentRoundId++;
        
        _rounds[_currentRoundId] = RoundData({
            answer: newPrice,
            startedAt: timestamp,
            updatedAt: timestamp,
            answeredInRound: _currentRoundId
        });
        
        emit PriceUpdated(_currentRoundId, newPrice, timestamp);
    }
    
    function setDecimals(uint8 newDecimals) external onlyOwner {
        _decimals = newDecimals;
    }
    
    function setDescription(string memory newDescription) external onlyOwner {
        _description = newDescription;
    }
    
    function getCurrentRoundId() external view returns (uint80) {
        return _currentRoundId;
    }
    
    function getLatestPrice() external view returns (int256) {
        return _rounds[_currentRoundId].answer;
    }
}