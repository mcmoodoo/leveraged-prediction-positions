// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

/**
 * @title LenderYieldVault
 * @notice ERC4626 vault that optimizes yield by allocating USDC across Morpho Blue and Morpho V2 Markets
 * @dev This is a conceptual prototype showing how Morpho V2 vaults could integrate
 * 
 * Key Features:
 * - Accepts USDC deposits
 * - Allocates to Morpho Blue (variable rate)
 * - Allocates to Morpho V2 Markets (fixed rate) - when available
 * - Maintains reserve pool for instant withdrawals
 * - Provides ERC4626 standard interface for composability
 */
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import {IMorpho, MarketParams} from "@morpho-blue/contracts/interfaces/IMorpho.sol";

contract LenderYieldVault is ERC4626, Ownable {
    // Morpho Blue integration
    IMorpho public immutable morphoBlue;
    MarketParams public marketParams;
    
    // Allocation strategy
    struct Allocation {
        uint256 morphoBlueWeight;    // Weight for Morpho Blue (basis points, e.g., 6000 = 60%)
        uint256 morphoV2Weight;      // Weight for Morpho V2 Markets (basis points)
        uint256 reserveWeight;       // Weight for reserve pool (basis points)
    }
    
    Allocation public allocation;
    
    // Reserve pool for instant withdrawals
    uint256 public reservePool;
    uint256 public minReserveRatio;  // Minimum reserve ratio (basis points)
    
    // Track allocations
    uint256 public totalAllocatedToMorphoBlue;
    uint256 public totalAllocatedToMorphoV2;
    
    // Events
    event AllocationUpdated(uint256 morphoBlue, uint256 morphoV2, uint256 reserve);
    event Rebalanced(uint256 morphoBlueAmount, uint256 morphoV2Amount, uint256 reserveAmount);
    event ReservePoolUpdated(uint256 newReserve);
    
    constructor(
        address _asset,              // USDC address
        address _morphoBlue,
        MarketParams memory _marketParams,
        address _owner
    ) ERC4626(IERC20(_asset)) ERC20("Lender Yield Vault", "LYV") Ownable(_owner) {
        morphoBlue = IMorpho(_morphoBlue);
        marketParams = _marketParams;
        
        // Default allocation: 60% Morpho Blue, 30% Morpho V2, 10% Reserve
        allocation = Allocation({
            morphoBlueWeight: 6000,
            morphoV2Weight: 3000,
            reserveWeight: 1000
        });
        
        minReserveRatio = 500; // 5% minimum reserve
        
        // Approve Morpho Blue to spend USDC
        IERC20(_asset).approve(_morphoBlue, type(uint256).max);
    }
    
    /**
     * @notice Deposit USDC and receive vault shares
     * @dev Overrides ERC4626 deposit to add allocation logic
     */
    function deposit(uint256 assets, address receiver) public override returns (uint256 shares) {
        shares = super.deposit(assets, receiver);
        
        // Allocate deposited assets according to strategy
        _allocateAssets(assets);
        
        return shares;
    }
    
    /**
     * @notice Withdraw USDC by redeeming shares
     * @dev Overrides ERC4626 redeem to handle instant withdrawals from reserve
     */
    function redeem(
        uint256 shares,
        address receiver,
        address owner
    ) public override returns (uint256 assets) {
        assets = super.redeem(shares, receiver, owner);
        
        // Try to fulfill from reserve pool first
        if (reservePool >= assets) {
            reservePool -= assets;
            IERC20(asset()).transfer(receiver, assets);
            emit ReservePoolUpdated(reservePool);
            return assets;
        }
        
        // If reserve insufficient, need to withdraw from Morpho Blue
        // This would require more complex logic to handle partial withdrawals
        // For now, this is a simplified version
        _withdrawFromMorphoBlue(assets - reservePool);
        reservePool = 0;
        
        IERC20(asset()).transfer(receiver, assets);
        emit ReservePoolUpdated(reservePool);
        
        return assets;
    }
    
    /**
     * @notice Allocate assets according to strategy weights
     * @param amount Amount of assets to allocate
     */
    function _allocateAssets(uint256 amount) internal {
        uint256 morphoBlueAmount = (amount * allocation.morphoBlueWeight) / 10000;
        uint256 morphoV2Amount = (amount * allocation.morphoV2Weight) / 10000;
        uint256 reserveAmount = amount - morphoBlueAmount - morphoV2Amount;
        
        // Allocate to Morpho Blue
        if (morphoBlueAmount > 0) {
            _allocateToMorphoBlue(morphoBlueAmount);
        }
        
        // Allocate to Morpho V2 Markets (placeholder for future implementation)
        if (morphoV2Amount > 0) {
            _allocateToMorphoV2(morphoV2Amount);
        }
        
        // Add to reserve pool
        reservePool += reserveAmount;
        
        emit Rebalanced(morphoBlueAmount, morphoV2Amount, reserveAmount);
    }
    
    /**
     * @notice Allocate assets to Morpho Blue market
     * @param amount Amount to supply
     */
    function _allocateToMorphoBlue(uint256 amount) internal {
        // Supply to Morpho Blue market
        morphoBlue.supply(
            marketParams,
            amount,
            0, // shares (0 = let Morpho calculate)
            address(this),
            ""
        );
        
        totalAllocatedToMorphoBlue += amount;
    }
    
    /**
     * @notice Allocate assets to Morpho V2 Markets
     * @param amount Amount to allocate
     * @dev Placeholder for Morpho V2 Markets integration
     */
    function _allocateToMorphoV2(uint256 amount) internal {
        // TODO: Implement Morpho V2 Markets integration
        // For now, add to reserve pool as fallback
        reservePool += amount;
        totalAllocatedToMorphoV2 += amount;
    }
    
    /**
     * @notice Withdraw from Morpho Blue
     * @param amount Amount to withdraw
     */
    function _withdrawFromMorphoBlue(uint256 amount) internal {
        bytes32 marketId = keccak256(abi.encode(marketParams));
        
        // Get current position
        (uint256 supplyShares, , ) = morphoBlue.position(marketId, address(this));
        
        // Calculate shares needed for amount
        uint256 sharesToWithdraw = _convertToShares(amount, marketId);
        
        if (sharesToWithdraw > supplyShares) {
            sharesToWithdraw = supplyShares;
        }
        
        // Withdraw from Morpho Blue
        morphoBlue.withdraw(
            marketParams,
            amount,
            sharesToWithdraw,
            address(this),
            address(this)
        );
        
        totalAllocatedToMorphoBlue -= amount;
    }
    
    /**
     * @notice Convert assets to shares for Morpho Blue
     * @dev Simplified version - would need actual market state
     */
    function _convertToShares(uint256 assets, bytes32 marketId) internal view returns (uint256) {
        // This is a placeholder - actual implementation would query Morpho Blue
        // to get the current exchange rate
        return assets; // Simplified 1:1 for now
    }
    
    /**
     * @notice Rebalance allocations
     * @dev Can be called by owner or keeper to rebalance positions
     */
    function rebalance() external {
        uint256 totalAssets = totalAssets();
        
        // Calculate target allocations
        uint256 targetMorphoBlue = (totalAssets * allocation.morphoBlueWeight) / 10000;
        uint256 targetMorphoV2 = (totalAssets * allocation.morphoV2Weight) / 10000;
        uint256 targetReserve = totalAssets - targetMorphoBlue - targetMorphoV2;
        
        // Rebalance if needed
        if (totalAllocatedToMorphoBlue < targetMorphoBlue) {
            uint256 toAllocate = targetMorphoBlue - totalAllocatedToMorphoBlue;
            if (reservePool >= toAllocate) {
                reservePool -= toAllocate;
                _allocateToMorphoBlue(toAllocate);
            }
        } else if (totalAllocatedToMorphoBlue > targetMorphoBlue) {
            uint256 toWithdraw = totalAllocatedToMorphoBlue - targetMorphoBlue;
            _withdrawFromMorphoBlue(toWithdraw);
            reservePool += toWithdraw;
        }
        
        // Ensure minimum reserve
        uint256 minReserve = (totalAssets * minReserveRatio) / 10000;
        if (reservePool < minReserve) {
            uint256 needed = minReserve - reservePool;
            if (totalAllocatedToMorphoBlue >= needed) {
                _withdrawFromMorphoBlue(needed);
                reservePool += needed;
            }
        }
        
        emit Rebalanced(totalAllocatedToMorphoBlue, totalAllocatedToMorphoV2, reservePool);
    }
    
    /**
     * @notice Update allocation strategy
     * @param morphoBlueWeight New weight for Morpho Blue (basis points)
     * @param morphoV2Weight New weight for Morpho V2 (basis points)
     * @param reserveWeight New weight for reserve (basis points)
     */
    function updateAllocation(
        uint256 morphoBlueWeight,
        uint256 morphoV2Weight,
        uint256 reserveWeight
    ) external onlyOwner {
        require(
            morphoBlueWeight + morphoV2Weight + reserveWeight == 10000,
            "Weights must sum to 10000"
        );
        
        allocation = Allocation({
            morphoBlueWeight: morphoBlueWeight,
            morphoV2Weight: morphoV2Weight,
            reserveWeight: reserveWeight
        });
        
        emit AllocationUpdated(morphoBlueWeight, morphoV2Weight, reserveWeight);
    }
    
    /**
     * @notice Get total assets managed by vault
     * @dev Overrides ERC4626 to include allocated assets
     */
    function totalAssets() public view override returns (uint256) {
        return reservePool + totalAllocatedToMorphoBlue + totalAllocatedToMorphoV2;
    }
    
    /**
     * @notice Get current yield rate (simplified)
     * @dev Would need to query actual rates from Morpho Blue and Morpho V2
     */
    function getCurrentYieldRate() external view returns (uint256) {
        // Placeholder - would calculate weighted average of:
        // - Morpho Blue supply rate
        // - Morpho V2 fixed rates
        return 500; // 5% APY placeholder
    }
}
