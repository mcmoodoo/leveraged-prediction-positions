// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@morpho-blue/src/interfaces/IMorpho.sol";
import "@morpho-blue/src/interfaces/IOracle.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./PolymarketTokenWrapper.sol";
import "./PolymarketPriceFeed.sol";

contract PolymarketLendingVault is IOracle, Ownable, ReentrancyGuard {
    IMorpho public immutable morpho;
    PolymarketPriceFeed public immutable priceFeed;
    IERC20 public immutable loanToken;
    PolymarketTokenWrapper public immutable collateralToken;
    
    uint256 public constant LTV_RATIO = 70e16;
    uint256 public constant LIQUIDATION_LTV = 80e16;
    uint256 public constant ORACLE_PRICE_SCALE = 1e36;
    
    MarketParams public marketParams;
    
    event MarketCreated(
        address indexed loanToken,
        address indexed collateralToken,
        uint256 lltv
    );
    
    event PositionCreated(
        address indexed user,
        uint256 collateralAmount,
        uint256 borrowAmount
    );
    
    event PositionLiquidated(
        address indexed user,
        address indexed liquidator,
        uint256 collateralSeized
    );
    
    constructor(
        address _morpho,
        address _priceFeed,
        address _loanToken,
        address _collateralToken,
        address _irm
    ) Ownable(msg.sender) {
        morpho = IMorpho(_morpho);
        priceFeed = PolymarketPriceFeed(_priceFeed);
        loanToken = IERC20(_loanToken);
        collateralToken = PolymarketTokenWrapper(_collateralToken);
        
        marketParams = MarketParams({
            loanToken: _loanToken,
            collateralToken: _collateralToken,
            oracle: address(this),
            irm: _irm,
            lltv: LTV_RATIO
        });
        
        emit MarketCreated(_loanToken, _collateralToken, LTV_RATIO);
    }
    
    function price() external view override returns (uint256) {
        uint256 tokenId = collateralToken.getUnderlyingTokenId();
        
        (uint256 latestPrice,) = priceFeed.getLatestPrice(tokenId);
        
        return (latestPrice * ORACLE_PRICE_SCALE) / (10 ** priceFeed.PRICE_DECIMALS());
    }
    
    function createLeveragedPosition(
        uint256 collateralAmount,
        uint256 borrowAmount
    ) external nonReentrant {
        require(collateralAmount > 0, "Collateral amount must be greater than 0");
        require(borrowAmount > 0, "Borrow amount must be greater than 0");
        
        uint256 maxBorrow = (collateralAmount * this.price() * LTV_RATIO) / 
                           (ORACLE_PRICE_SCALE * 1e18);
        require(borrowAmount <= maxBorrow, "Borrow amount exceeds LTV limit");
        
        collateralToken.transferFrom(msg.sender, address(this), collateralAmount);
        
        collateralToken.approve(address(morpho), collateralAmount);
        
        morpho.supplyCollateral(marketParams, collateralAmount, msg.sender, "");
        
        morpho.borrow(marketParams, borrowAmount, 0, msg.sender, msg.sender);
        
        emit PositionCreated(msg.sender, collateralAmount, borrowAmount);
    }
    
    function liquidatePosition(
        address borrower,
        uint256 seizedAssets,
        uint256 repaidShares
    ) external nonReentrant {
        require(isLiquidatable(borrower), "Position not liquidatable");
        
        loanToken.transferFrom(msg.sender, address(this), repaidShares);
        loanToken.approve(address(morpho), repaidShares);
        
        morpho.liquidate(
            marketParams,
            borrower,
            seizedAssets,
            repaidShares,
            ""
        );
        
        collateralToken.transfer(msg.sender, seizedAssets);
        
        emit PositionLiquidated(borrower, msg.sender, seizedAssets);
    }
    
    function isLiquidatable(address borrower) public view returns (bool) {
        (uint256 collateralValue, uint256 borrowValue) = getPositionValues(borrower);
        
        if (borrowValue == 0) return false;
        
        uint256 currentLTV = (borrowValue * 1e18) / collateralValue;
        return currentLTV > LIQUIDATION_LTV;
    }
    
    function getPositionValues(address user) 
        public 
        view 
        returns (uint256 collateralValue, uint256 borrowValue) 
    {
        Position memory pos = morpho.position(
            Id.wrap(keccak256(abi.encode(marketParams))),
            user
        );
        
        uint256 tokenPrice = this.price();
        collateralValue = (uint256(pos.collateral) * tokenPrice) / ORACLE_PRICE_SCALE;
        borrowValue = uint256(pos.borrowShares);
    }
    
    function getMaxBorrowAmount(uint256 collateralAmount) 
        external 
        view 
        returns (uint256) 
    {
        uint256 collateralValue = (collateralAmount * this.price()) / ORACLE_PRICE_SCALE;
        return (collateralValue * LTV_RATIO) / 1e18;
    }
    
    function getMarketId() external view returns (Id) {
        return Id.wrap(keccak256(abi.encode(marketParams)));
    }
    
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        IERC20(token).transfer(owner(), amount);
    }
}