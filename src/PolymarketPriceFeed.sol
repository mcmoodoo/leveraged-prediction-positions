// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface ICTFExchange {
    struct OrderFilled {
        bytes32 orderHash;
        address maker;
        address taker;
        uint256 makerAssetId;
        uint256 takerAssetId;
        uint256 makerAmountFilled;
        uint256 takerAmountFilled;
        uint256 fee;
    }
}

contract PolymarketPriceFeed is Ownable, ReentrancyGuard {
    struct PriceData {
        uint256 price;
        uint256 timestamp;
        uint256 volume;
    }
    
    struct TimeWeightedPrice {
        uint256 cumulativePrice;
        uint256 cumulativeVolume;
        uint256 lastUpdateTime;
    }
    
    address public immutable ctfExchange;
    uint256 public constant PRICE_DECIMALS = 18;
    uint256 public constant MAX_PRICE_AGE = 3600;
    uint256 public constant MIN_VOLUME_THRESHOLD = 1000e6;
    
    mapping(uint256 => PriceData) public latestPrices;
    mapping(uint256 => TimeWeightedPrice) public twapData;
    mapping(uint256 => bool) public supportedTokens;
    
    event PriceUpdated(
        uint256 indexed tokenId,
        uint256 price,
        uint256 volume,
        uint256 timestamp
    );
    
    event TokenAdded(uint256 indexed tokenId);
    event TokenRemoved(uint256 indexed tokenId);
    
    modifier onlyValidToken(uint256 tokenId) {
        require(supportedTokens[tokenId], "Token not supported");
        _;
    }
    
    constructor(address _ctfExchange) Ownable(msg.sender) {
        ctfExchange = _ctfExchange;
    }
    
    function addSupportedToken(uint256 tokenId) external onlyOwner {
        supportedTokens[tokenId] = true;
        twapData[tokenId].lastUpdateTime = block.timestamp;
        emit TokenAdded(tokenId);
    }
    
    function removeSupportedToken(uint256 tokenId) external onlyOwner {
        supportedTokens[tokenId] = false;
        emit TokenRemoved(tokenId);
    }
    
    function updatePrice(
        uint256 tokenId,
        uint256 makerAssetId,
        uint256 takerAssetId,
        uint256 makerAmountFilled,
        uint256 takerAmountFilled
    ) external onlyValidToken(tokenId) {
        require(msg.sender == ctfExchange, "Only CTF Exchange can update prices");
        
        uint256 price;
        uint256 volume;
        
        if (makerAssetId == 0) {
            price = (makerAmountFilled * 10**PRICE_DECIMALS) / takerAmountFilled;
            volume = takerAmountFilled;
        } else if (takerAssetId == 0) {
            price = (takerAmountFilled * 10**PRICE_DECIMALS) / makerAmountFilled;
            volume = makerAmountFilled;
        } else {
            revert("Invalid trade: no USDC involved");
        }
        
        require(volume >= MIN_VOLUME_THRESHOLD, "Volume too low");
        require(price <= 10**PRICE_DECIMALS, "Price cannot exceed 1.0");
        
        _updateTWAP(tokenId, price, volume);
        
        latestPrices[tokenId] = PriceData({
            price: price,
            timestamp: block.timestamp,
            volume: volume
        });
        
        emit PriceUpdated(tokenId, price, volume, block.timestamp);
    }
    
    function _updateTWAP(uint256 tokenId, uint256 price, uint256 volume) internal {
        TimeWeightedPrice storage twap = twapData[tokenId];
        
        if (twap.lastUpdateTime == 0) {
            twap.cumulativePrice = price * volume;
            twap.cumulativeVolume = volume;
            twap.lastUpdateTime = block.timestamp;
            return;
        }
        
        uint256 timeDelta = block.timestamp - twap.lastUpdateTime;
        if (timeDelta > 0) {
            twap.cumulativePrice += price * volume;
            twap.cumulativeVolume += volume;
            twap.lastUpdateTime = block.timestamp;
        }
    }
    
    function getLatestPrice(uint256 tokenId) 
        external 
        view 
        onlyValidToken(tokenId) 
        returns (uint256 price, uint256 timestamp) 
    {
        PriceData memory data = latestPrices[tokenId];
        require(data.timestamp > 0, "No price data available");
        require(block.timestamp - data.timestamp <= MAX_PRICE_AGE, "Price data too old");
        
        return (data.price, data.timestamp);
    }
    
    function getTWAP(uint256 tokenId, uint256 period) 
        external 
        view 
        onlyValidToken(tokenId) 
        returns (uint256) 
    {
        require(period > 0, "Period must be greater than 0");
        
        TimeWeightedPrice memory twap = twapData[tokenId];
        require(twap.cumulativeVolume > 0, "No TWAP data available");
        
        return twap.cumulativePrice / twap.cumulativeVolume;
    }
    
    function isPriceStale(uint256 tokenId) external view returns (bool) {
        PriceData memory data = latestPrices[tokenId];
        if (data.timestamp == 0) return true;
        return block.timestamp - data.timestamp > MAX_PRICE_AGE;
    }
    
    function resetTWAP(uint256 tokenId) external onlyOwner onlyValidToken(tokenId) {
        delete twapData[tokenId];
        twapData[tokenId].lastUpdateTime = block.timestamp;
    }
}
