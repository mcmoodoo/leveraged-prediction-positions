// Morpho Blue core functions for lending/borrowing
export const MORPHO_BLUE_ABI = [
  {
    "type": "function",
    "name": "supply",
    "inputs": [
      { "name": "marketParams", "type": "tuple", "components": [
        { "name": "loanToken", "type": "address" },
        { "name": "collateralToken", "type": "address" },
        { "name": "oracle", "type": "address" },
        { "name": "irm", "type": "address" },
        { "name": "lltv", "type": "uint256" }
      ]},
      { "name": "assets", "type": "uint256" },
      { "name": "shares", "type": "uint256" },
      { "name": "onBehalf", "type": "address" },
      { "name": "receiver", "type": "address" }
    ],
    "outputs": [
      { "name": "assetsSupplied", "type": "uint256" },
      { "name": "sharesSupplied", "type": "uint256" }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "withdraw",
    "inputs": [
      { "name": "marketParams", "type": "tuple", "components": [
        { "name": "loanToken", "type": "address" },
        { "name": "collateralToken", "type": "address" },
        { "name": "oracle", "type": "address" },
        { "name": "irm", "type": "address" },
        { "name": "lltv", "type": "uint256" }
      ]},
      { "name": "assets", "type": "uint256" },
      { "name": "shares", "type": "uint256" },
      { "name": "onBehalf", "type": "address" },
      { "name": "receiver", "type": "address" }
    ],
    "outputs": [
      { "name": "assetsWithdrawn", "type": "uint256" },
      { "name": "sharesWithdrawn", "type": "uint256" }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "borrow",
    "inputs": [
      { "name": "marketParams", "type": "tuple", "components": [
        { "name": "loanToken", "type": "address" },
        { "name": "collateralToken", "type": "address" },
        { "name": "oracle", "type": "address" },
        { "name": "irm", "type": "address" },
        { "name": "lltv", "type": "uint256" }
      ]},
      { "name": "assets", "type": "uint256" },
      { "name": "shares", "type": "uint256" },
      { "name": "onBehalf", "type": "address" },
      { "name": "receiver", "type": "address" }
    ],
    "outputs": [
      { "name": "assetsBorrowed", "type": "uint256" },
      { "name": "sharesBorrowed", "type": "uint256" }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "repay",
    "inputs": [
      { "name": "marketParams", "type": "tuple", "components": [
        { "name": "loanToken", "type": "address" },
        { "name": "collateralToken", "type": "address" },
        { "name": "oracle", "type": "address" },
        { "name": "irm", "type": "address" },
        { "name": "lltv", "type": "uint256" }
      ]},
      { "name": "assets", "type": "uint256" },
      { "name": "shares", "type": "uint256" },
      { "name": "onBehalf", "type": "address" },
      { "name": "data", "type": "bytes" }
    ],
    "outputs": [
      { "name": "assetsRepaid", "type": "uint256" },
      { "name": "sharesRepaid", "type": "uint256" }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "supplyCollateral",
    "inputs": [
      { "name": "marketParams", "type": "tuple", "components": [
        { "name": "loanToken", "type": "address" },
        { "name": "collateralToken", "type": "address" },
        { "name": "oracle", "type": "address" },
        { "name": "irm", "type": "address" },
        { "name": "lltv", "type": "uint256" }
      ]},
      { "name": "assets", "type": "uint256" },
      { "name": "onBehalf", "type": "address" },
      { "name": "data", "type": "bytes" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "withdrawCollateral",
    "inputs": [
      { "name": "marketParams", "type": "tuple", "components": [
        { "name": "loanToken", "type": "address" },
        { "name": "collateralToken", "type": "address" },
        { "name": "oracle", "type": "address" },
        { "name": "irm", "type": "address" },
        { "name": "lltv", "type": "uint256" }
      ]},
      { "name": "assets", "type": "uint256" },
      { "name": "onBehalf", "type": "address" },
      { "name": "receiver", "type": "address" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "position",
    "inputs": [
      { "name": "id", "type": "bytes32" },
      { "name": "user", "type": "address" }
    ],
    "outputs": [
      { "name": "supplyShares", "type": "uint256" },
      { "name": "borrowShares", "type": "uint256" },
      { "name": "collateral", "type": "uint256" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "market",
    "inputs": [
      { "name": "id", "type": "bytes32" }
    ],
    "outputs": [
      { "name": "totalSupplyAssets", "type": "uint128" },
      { "name": "totalSupplyShares", "type": "uint128" },
      { "name": "totalBorrowAssets", "type": "uint128" },
      { "name": "totalBorrowShares", "type": "uint128" },
      { "name": "lastUpdate", "type": "uint128" },
      { "name": "fee", "type": "uint128" }
    ],
    "stateMutability": "view"
  }
] as const

// Standard ERC20 functions
export const ERC20_ABI = [
  {
    "type": "function",
    "name": "balanceOf",
    "inputs": [{ "name": "account", "type": "address" }],
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "allowance",
    "inputs": [
      { "name": "owner", "type": "address" },
      { "name": "spender", "type": "address" }
    ],
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "approve",
    "inputs": [
      { "name": "spender", "type": "address" },
      { "name": "amount", "type": "uint256" }
    ],
    "outputs": [{ "name": "", "type": "bool" }],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "decimals",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint8" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "symbol",
    "inputs": [],
    "outputs": [{ "name": "", "type": "string" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "name",
    "inputs": [],
    "outputs": [{ "name": "", "type": "string" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "totalSupply",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "transfer",
    "inputs": [
      { "name": "to", "type": "address" },
      { "name": "amount", "type": "uint256" }
    ],
    "outputs": [{ "name": "", "type": "bool" }],
    "stateMutability": "nonpayable"
  }
] as const

// CTF Wrapper specific functions  
export const CTF_WRAPPER_ABI = [
  {
    "type": "function",
    "name": "wrap",
    "inputs": [{ "name": "amount", "type": "uint256" }],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "unwrap",
    "inputs": [{ "name": "amount", "type": "uint256" }],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "balanceOf",
    "inputs": [{ "name": "account", "type": "address" }],
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getUserCTFBalance",
    "inputs": [{ "name": "user", "type": "address" }],
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "approve",
    "inputs": [
      { "name": "spender", "type": "address" },
      { "name": "amount", "type": "uint256" }
    ],
    "outputs": [{ "name": "", "type": "bool" }],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "allowance",
    "inputs": [
      { "name": "owner", "type": "address" },
      { "name": "spender", "type": "address" }
    ],
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "tokenId",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view"
  }
] as const

// ERC1155 functions for CTF tokens
export const ERC1155_ABI = [
  {
    "type": "function",
    "name": "balanceOf",
    "inputs": [
      { "name": "account", "type": "address" },
      { "name": "id", "type": "uint256" }
    ],
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "setApprovalForAll",
    "inputs": [
      { "name": "operator", "type": "address" },
      { "name": "approved", "type": "bool" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "isApprovedForAll",
    "inputs": [
      { "name": "account", "type": "address" },
      { "name": "operator", "type": "address" }
    ],
    "outputs": [{ "name": "", "type": "bool" }],
    "stateMutability": "view"
  }
] as const

// Mock Oracle ABI (from MockOracle.sol)
export const MOCK_ORACLE_ABI = [
  {
    "type": "function",
    "name": "latestRoundData",
    "inputs": [],
    "outputs": [
      { "name": "roundId", "type": "uint80" },
      { "name": "answer", "type": "int256" },
      { "name": "startedAt", "type": "uint256" },
      { "name": "updatedAt", "type": "uint256" },
      { "name": "answeredInRound", "type": "uint80" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "decimals",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint8" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "description",
    "inputs": [],
    "outputs": [{ "name": "", "type": "string" }],
    "stateMutability": "view"
  }
] as const