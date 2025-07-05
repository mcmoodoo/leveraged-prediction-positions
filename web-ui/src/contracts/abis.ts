// Basic ERC20 ABI
export const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: '_spender', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      { name: '_owner', type: 'address' },
      { name: '_spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function',
  },
] as const

// Basic ERC1155 ABI
export const ERC1155_ABI = [
  {
    constant: true,
    inputs: [
      { name: '_owner', type: 'address' },
      { name: '_id', type: 'uint256' },
    ],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: '_operator', type: 'address' },
      { name: '_approved', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      { name: '_owner', type: 'address' },
      { name: '_operator', type: 'address' },
    ],
    name: 'isApprovedForAll',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function',
  },
] as const

// CTF Wrapper ABI
export const CTF_WRAPPER_ABI = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: '_spender', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      { name: '_owner', type: 'address' },
      { name: '_spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    type: 'function',
  },
  {
    constant: false,
    inputs: [{ name: '_amount', type: 'uint256' }],
    name: 'wrap',
    outputs: [],
    type: 'function',
  },
  {
    constant: false,
    inputs: [{ name: '_amount', type: 'uint256' }],
    name: 'unwrap',
    outputs: [],
    type: 'function',
  },
] as const

// Morpho Blue ABI
export const MORPHO_BLUE_ABI = [
  {
    constant: true,
    inputs: [
      { name: '_id', type: 'bytes32' },
      { name: '_user', type: 'address' },
    ],
    name: 'position',
    outputs: [
      { name: 'supplyShares', type: 'uint256' },
      { name: 'borrowShares', type: 'uint256' },
      { name: 'collateral', type: 'uint256' },
    ],
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ name: '_id', type: 'bytes32' }],
    name: 'market',
    outputs: [
      { name: 'totalSupplyAssets', type: 'uint128' },
      { name: 'totalSupplyShares', type: 'uint128' },
      { name: 'totalBorrowAssets', type: 'uint128' },
      { name: 'totalBorrowShares', type: 'uint128' },
      { name: 'lastUpdate', type: 'uint128' },
      { name: 'fee', type: 'uint128' },
    ],
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_marketParams',
        type: 'tuple',
        components: [
          { name: 'loanToken', type: 'address' },
          { name: 'collateralToken', type: 'address' },
          { name: 'oracle', type: 'address' },
          { name: 'irm', type: 'address' },
          { name: 'lltv', type: 'uint256' },
        ],
      },
      { name: '_assets', type: 'uint256' },
      { name: '_shares', type: 'uint256' },
      { name: '_onBehalf', type: 'address' },
      { name: '_receiver', type: 'address' },
    ],
    name: 'supply',
    outputs: [
      { name: 'assetsSupplied', type: 'uint256' },
      { name: 'sharesSupplied', type: 'uint256' },
    ],
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_marketParams',
        type: 'tuple',
        components: [
          { name: 'loanToken', type: 'address' },
          { name: 'collateralToken', type: 'address' },
          { name: 'oracle', type: 'address' },
          { name: 'irm', type: 'address' },
          { name: 'lltv', type: 'uint256' },
        ],
      },
      { name: '_assets', type: 'uint256' },
      { name: '_shares', type: 'uint256' },
      { name: '_onBehalf', type: 'address' },
      { name: '_receiver', type: 'address' },
    ],
    name: 'withdraw',
    outputs: [
      { name: 'assetsWithdrawn', type: 'uint256' },
      { name: 'sharesWithdrawn', type: 'uint256' },
    ],
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_marketParams',
        type: 'tuple',
        components: [
          { name: 'loanToken', type: 'address' },
          { name: 'collateralToken', type: 'address' },
          { name: 'oracle', type: 'address' },
          { name: 'irm', type: 'address' },
          { name: 'lltv', type: 'uint256' },
        ],
      },
      { name: '_assets', type: 'uint256' },
      { name: '_shares', type: 'uint256' },
      { name: '_onBehalf', type: 'address' },
      { name: '_receiver', type: 'address' },
    ],
    name: 'borrow',
    outputs: [
      { name: 'assetsBorrowed', type: 'uint256' },
      { name: 'sharesBorrowed', type: 'uint256' },
    ],
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_marketParams',
        type: 'tuple',
        components: [
          { name: 'loanToken', type: 'address' },
          { name: 'collateralToken', type: 'address' },
          { name: 'oracle', type: 'address' },
          { name: 'irm', type: 'address' },
          { name: 'lltv', type: 'uint256' },
        ],
      },
      { name: '_assets', type: 'uint256' },
      { name: '_shares', type: 'uint256' },
      { name: '_onBehalf', type: 'address' },
      { name: '_data', type: 'bytes' },
    ],
    name: 'repay',
    outputs: [
      { name: 'assetsRepaid', type: 'uint256' },
      { name: 'sharesRepaid', type: 'uint256' },
    ],
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_marketParams',
        type: 'tuple',
        components: [
          { name: 'loanToken', type: 'address' },
          { name: 'collateralToken', type: 'address' },
          { name: 'oracle', type: 'address' },
          { name: 'irm', type: 'address' },
          { name: 'lltv', type: 'uint256' },
        ],
      },
      { name: '_assets', type: 'uint256' },
      { name: '_onBehalf', type: 'address' },
      { name: '_data', type: 'bytes' },
    ],
    name: 'supplyCollateral',
    outputs: [],
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_marketParams',
        type: 'tuple',
        components: [
          { name: 'loanToken', type: 'address' },
          { name: 'collateralToken', type: 'address' },
          { name: 'oracle', type: 'address' },
          { name: 'irm', type: 'address' },
          { name: 'lltv', type: 'uint256' },
        ],
      },
      { name: '_assets', type: 'uint256' },
      { name: '_onBehalf', type: 'address' },
      { name: '_receiver', type: 'address' },
    ],
    name: 'withdrawCollateral',
    outputs: [],
    type: 'function',
  },
] as const