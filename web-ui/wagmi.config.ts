import { defineConfig } from '@wagmi/cli'

export default defineConfig({
  out: 'src/generated.ts',
  contracts: [
    {
      name: 'MockUSDC',
      address: {
        137: '0xdac671baee0176012ea8e4b30ef824ac8a210c5e',
      },
      abi: [
            {
                  "type": "constructor",
                  "inputs": [],
                  "stateMutability": "nonpayable"
            },
            {
                  "type": "function",
                  "name": "allowance",
                  "inputs": [
                        {
                              "name": "owner",
                              "type": "address",
                              "internalType": "address"
                        },
                        {
                              "name": "spender",
                              "type": "address",
                              "internalType": "address"
                        }
                  ],
                  "outputs": [
                        {
                              "name": "",
                              "type": "uint256",
                              "internalType": "uint256"
                        }
                  ],
                  "stateMutability": "view"
            },
            {
                  "type": "function",
                  "name": "approve",
                  "inputs": [
                        {
                              "name": "spender",
                              "type": "address",
                              "internalType": "address"
                        },
                        {
                              "name": "value",
                              "type": "uint256",
                              "internalType": "uint256"
                        }
                  ],
                  "outputs": [
                        {
                              "name": "",
                              "type": "bool",
                              "internalType": "bool"
                        }
                  ],
                  "stateMutability": "nonpayable"
            },
            {
                  "type": "function",
                  "name": "balanceOf",
                  "inputs": [
                        {
                              "name": "account",
                              "type": "address",
                              "internalType": "address"
                        }
                  ],
                  "outputs": [
                        {
                              "name": "",
                              "type": "uint256",
                              "internalType": "uint256"
                        }
                  ],
                  "stateMutability": "view"
            },
            {
                  "type": "function",
                  "name": "burn",
                  "inputs": [
                        {
                              "name": "amount",
                              "type": "uint256",
                              "internalType": "uint256"
                        }
                  ],
                  "outputs": [],
                  "stateMutability": "nonpayable"
            },
            {
                  "type": "function",
                  "name": "burnFrom",
                  "inputs": [
                        {
                              "name": "account",
                              "type": "address",
                              "internalType": "address"
                        },
                        {
                              "name": "amount",
                              "type": "uint256",
                              "internalType": "uint256"
                        }
                  ],
                  "outputs": [],
                  "stateMutability": "nonpayable"
            },
            {
                  "type": "function",
                  "name": "decimals",
                  "inputs": [],
                  "outputs": [
                        {
                              "name": "",
                              "type": "uint8",
                              "internalType": "uint8"
                        }
                  ],
                  "stateMutability": "view"
            },
            {
                  "type": "function",
                  "name": "mint",
                  "inputs": [
                        {
                              "name": "to",
                              "type": "address",
                              "internalType": "address"
                        },
                        {
                              "name": "amount",
                              "type": "uint256",
                              "internalType": "uint256"
                        }
                  ],
                  "outputs": [],
                  "stateMutability": "nonpayable"
            },
            {
                  "type": "function",
                  "name": "name",
                  "inputs": [],
                  "outputs": [
                        {
                              "name": "",
                              "type": "string",
                              "internalType": "string"
                        }
                  ],
                  "stateMutability": "view"
            },
            {
                  "type": "function",
                  "name": "owner",
                  "inputs": [],
                  "outputs": [
                        {
                              "name": "",
                              "type": "address",
                              "internalType": "address"
                        }
                  ],
                  "stateMutability": "view"
            },
            {
                  "type": "function",
                  "name": "renounceOwnership",
                  "inputs": [],
                  "outputs": [],
                  "stateMutability": "nonpayable"
            },
            {
                  "type": "function",
                  "name": "symbol",
                  "inputs": [],
                  "outputs": [
                        {
                              "name": "",
                              "type": "string",
                              "internalType": "string"
                        }
                  ],
                  "stateMutability": "view"
            },
            {
                  "type": "function",
                  "name": "totalSupply",
                  "inputs": [],
                  "outputs": [
                        {
                              "name": "",
                              "type": "uint256",
                              "internalType": "uint256"
                        }
                  ],
                  "stateMutability": "view"
            },
            {
                  "type": "function",
                  "name": "transfer",
                  "inputs": [
                        {
                              "name": "to",
                              "type": "address",
                              "internalType": "address"
                        },
                        {
                              "name": "value",
                              "type": "uint256",
                              "internalType": "uint256"
                        }
                  ],
                  "outputs": [
                        {
                              "name": "",
                              "type": "bool",
                              "internalType": "bool"
                        }
                  ],
                  "stateMutability": "nonpayable"
            },
            {
                  "type": "function",
                  "name": "transferFrom",
                  "inputs": [
                        {
                              "name": "from",
                              "type": "address",
                              "internalType": "address"
                        },
                        {
                              "name": "to",
                              "type": "address",
                              "internalType": "address"
                        },
                        {
                              "name": "value",
                              "type": "uint256",
                              "internalType": "uint256"
                        }
                  ],
                  "outputs": [
                        {
                              "name": "",
                              "type": "bool",
                              "internalType": "bool"
                        }
                  ],
                  "stateMutability": "nonpayable"
            },
            {
                  "type": "function",
                  "name": "transferOwnership",
                  "inputs": [
                        {
                              "name": "newOwner",
                              "type": "address",
                              "internalType": "address"
                        }
                  ],
                  "outputs": [],
                  "stateMutability": "nonpayable"
            },
            {
                  "type": "event",
                  "name": "Approval",
                  "inputs": [
                        {
                              "name": "owner",
                              "type": "address",
                              "indexed": true,
                              "internalType": "address"
                        },
                        {
                              "name": "spender",
                              "type": "address",
                              "indexed": true,
                              "internalType": "address"
                        },
                        {
                              "name": "value",
                              "type": "uint256",
                              "indexed": false,
                              "internalType": "uint256"
                        }
                  ],
                  "anonymous": false
            },
            {
                  "type": "event",
                  "name": "OwnershipTransferred",
                  "inputs": [
                        {
                              "name": "previousOwner",
                              "type": "address",
                              "indexed": true,
                              "internalType": "address"
                        },
                        {
                              "name": "newOwner",
                              "type": "address",
                              "indexed": true,
                              "internalType": "address"
                        }
                  ],
                  "anonymous": false
            },
            {
                  "type": "event",
                  "name": "Transfer",
                  "inputs": [
                        {
                              "name": "from",
                              "type": "address",
                              "indexed": true,
                              "internalType": "address"
                        },
                        {
                              "name": "to",
                              "type": "address",
                              "indexed": true,
                              "internalType": "address"
                        },
                        {
                              "name": "value",
                              "type": "uint256",
                              "indexed": false,
                              "internalType": "uint256"
                        }
                  ],
                  "anonymous": false
            },
            {
                  "type": "error",
                  "name": "ERC20InsufficientAllowance",
                  "inputs": [
                        {
                              "name": "spender",
                              "type": "address",
                              "internalType": "address"
                        },
                        {
                              "name": "allowance",
                              "type": "uint256",
                              "internalType": "uint256"
                        },
                        {
                              "name": "needed",
                              "type": "uint256",
                              "internalType": "uint256"
                        }
                  ]
            },
            {
                  "type": "error",
                  "name": "ERC20InsufficientBalance",
                  "inputs": [
                        {
                              "name": "sender",
                              "type": "address",
                              "internalType": "address"
                        },
                        {
                              "name": "balance",
                              "type": "uint256",
                              "internalType": "uint256"
                        },
                        {
                              "name": "needed",
                              "type": "uint256",
                              "internalType": "uint256"
                        }
                  ]
            },
            {
                  "type": "error",
                  "name": "ERC20InvalidApprover",
                  "inputs": [
                        {
                              "name": "approver",
                              "type": "address",
                              "internalType": "address"
                        }
                  ]
            },
            {
                  "type": "error",
                  "name": "ERC20InvalidReceiver",
                  "inputs": [
                        {
                              "name": "receiver",
                              "type": "address",
                              "internalType": "address"
                        }
                  ]
            },
            {
                  "type": "error",
                  "name": "ERC20InvalidSender",
                  "inputs": [
                        {
                              "name": "sender",
                              "type": "address",
                              "internalType": "address"
                        }
                  ]
            },
            {
                  "type": "error",
                  "name": "ERC20InvalidSpender",
                  "inputs": [
                        {
                              "name": "spender",
                              "type": "address",
                              "internalType": "address"
                        }
                  ]
            },
            {
                  "type": "error",
                  "name": "OwnableInvalidOwner",
                  "inputs": [
                        {
                              "name": "owner",
                              "type": "address",
                              "internalType": "address"
                        }
                  ]
            },
            {
                  "type": "error",
                  "name": "OwnableUnauthorizedAccount",
                  "inputs": [
                        {
                              "name": "account",
                              "type": "address",
                              "internalType": "address"
                        }
                  ]
            }
      ],
    },
    {
      name: 'CTFWrapper',
      address: {
        137: '0xdf8eed0577a97235d2405d7ea8f9cf27732f9b0e',
      },
      abi: [
            {
                  "type": "constructor",
                  "inputs": [
                        {
                              "name": "_ctfContract",
                              "type": "address",
                              "internalType": "address"
                        },
                        {
                              "name": "_tokenId",
                              "type": "uint256",
                              "internalType": "uint256"
                        },
                        {
                              "name": "_name",
                              "type": "string",
                              "internalType": "string"
                        },
                        {
                              "name": "_symbol",
                              "type": "string",
                              "internalType": "string"
                        }
                  ],
                  "stateMutability": "nonpayable"
            },
            {
                  "type": "function",
                  "name": "allowance",
                  "inputs": [
                        {
                              "name": "owner",
                              "type": "address",
                              "internalType": "address"
                        },
                        {
                              "name": "spender",
                              "type": "address",
                              "internalType": "address"
                        }
                  ],
                  "outputs": [
                        {
                              "name": "",
                              "type": "uint256",
                              "internalType": "uint256"
                        }
                  ],
                  "stateMutability": "view"
            },
            {
                  "type": "function",
                  "name": "approve",
                  "inputs": [
                        {
                              "name": "spender",
                              "type": "address",
                              "internalType": "address"
                        },
                        {
                              "name": "value",
                              "type": "uint256",
                              "internalType": "uint256"
                        }
                  ],
                  "outputs": [
                        {
                              "name": "",
                              "type": "bool",
                              "internalType": "bool"
                        }
                  ],
                  "stateMutability": "nonpayable"
            },
            {
                  "type": "function",
                  "name": "balanceOf",
                  "inputs": [
                        {
                              "name": "account",
                              "type": "address",
                              "internalType": "address"
                        }
                  ],
                  "outputs": [
                        {
                              "name": "",
                              "type": "uint256",
                              "internalType": "uint256"
                        }
                  ],
                  "stateMutability": "view"
            },
            {
                  "type": "function",
                  "name": "ctfContract",
                  "inputs": [],
                  "outputs": [
                        {
                              "name": "",
                              "type": "address",
                              "internalType": "contract IERC1155"
                        }
                  ],
                  "stateMutability": "view"
            },
            {
                  "type": "function",
                  "name": "decimals",
                  "inputs": [],
                  "outputs": [
                        {
                              "name": "",
                              "type": "uint8",
                              "internalType": "uint8"
                        }
                  ],
                  "stateMutability": "view"
            },
            {
                  "type": "function",
                  "name": "getUserCTFBalance",
                  "inputs": [
                        {
                              "name": "user",
                              "type": "address",
                              "internalType": "address"
                        }
                  ],
                  "outputs": [
                        {
                              "name": "",
                              "type": "uint256",
                              "internalType": "uint256"
                        }
                  ],
                  "stateMutability": "view"
            },
            {
                  "type": "function",
                  "name": "getWrappedBalance",
                  "inputs": [],
                  "outputs": [
                        {
                              "name": "",
                              "type": "uint256",
                              "internalType": "uint256"
                        }
                  ],
                  "stateMutability": "view"
            },
            {
                  "type": "function",
                  "name": "name",
                  "inputs": [],
                  "outputs": [
                        {
                              "name": "",
                              "type": "string",
                              "internalType": "string"
                        }
                  ],
                  "stateMutability": "view"
            },
            {
                  "type": "function",
                  "name": "onERC1155BatchReceived",
                  "inputs": [
                        {
                              "name": "",
                              "type": "address",
                              "internalType": "address"
                        },
                        {
                              "name": "",
                              "type": "address",
                              "internalType": "address"
                        },
                        {
                              "name": "",
                              "type": "uint256[]",
                              "internalType": "uint256[]"
                        },
                        {
                              "name": "",
                              "type": "uint256[]",
                              "internalType": "uint256[]"
                        },
                        {
                              "name": "",
                              "type": "bytes",
                              "internalType": "bytes"
                        }
                  ],
                  "outputs": [
                        {
                              "name": "",
                              "type": "bytes4",
                              "internalType": "bytes4"
                        }
                  ],
                  "stateMutability": "nonpayable"
            },
            {
                  "type": "function",
                  "name": "onERC1155Received",
                  "inputs": [
                        {
                              "name": "",
                              "type": "address",
                              "internalType": "address"
                        },
                        {
                              "name": "",
                              "type": "address",
                              "internalType": "address"
                        },
                        {
                              "name": "",
                              "type": "uint256",
                              "internalType": "uint256"
                        },
                        {
                              "name": "",
                              "type": "uint256",
                              "internalType": "uint256"
                        },
                        {
                              "name": "",
                              "type": "bytes",
                              "internalType": "bytes"
                        }
                  ],
                  "outputs": [
                        {
                              "name": "",
                              "type": "bytes4",
                              "internalType": "bytes4"
                        }
                  ],
                  "stateMutability": "nonpayable"
            },
            {
                  "type": "function",
                  "name": "owner",
                  "inputs": [],
                  "outputs": [
                        {
                              "name": "",
                              "type": "address",
                              "internalType": "address"
                        }
                  ],
                  "stateMutability": "view"
            },
            {
                  "type": "function",
                  "name": "renounceOwnership",
                  "inputs": [],
                  "outputs": [],
                  "stateMutability": "nonpayable"
            },
            {
                  "type": "function",
                  "name": "supportsInterface",
                  "inputs": [
                        {
                              "name": "interfaceId",
                              "type": "bytes4",
                              "internalType": "bytes4"
                        }
                  ],
                  "outputs": [
                        {
                              "name": "",
                              "type": "bool",
                              "internalType": "bool"
                        }
                  ],
                  "stateMutability": "view"
            },
            {
                  "type": "function",
                  "name": "symbol",
                  "inputs": [],
                  "outputs": [
                        {
                              "name": "",
                              "type": "string",
                              "internalType": "string"
                        }
                  ],
                  "stateMutability": "view"
            },
            {
                  "type": "function",
                  "name": "tokenId",
                  "inputs": [],
                  "outputs": [
                        {
                              "name": "",
                              "type": "uint256",
                              "internalType": "uint256"
                        }
                  ],
                  "stateMutability": "view"
            },
            {
                  "type": "function",
                  "name": "totalSupply",
                  "inputs": [],
                  "outputs": [
                        {
                              "name": "",
                              "type": "uint256",
                              "internalType": "uint256"
                        }
                  ],
                  "stateMutability": "view"
            },
            {
                  "type": "function",
                  "name": "transfer",
                  "inputs": [
                        {
                              "name": "to",
                              "type": "address",
                              "internalType": "address"
                        },
                        {
                              "name": "value",
                              "type": "uint256",
                              "internalType": "uint256"
                        }
                  ],
                  "outputs": [
                        {
                              "name": "",
                              "type": "bool",
                              "internalType": "bool"
                        }
                  ],
                  "stateMutability": "nonpayable"
            },
            {
                  "type": "function",
                  "name": "transferFrom",
                  "inputs": [
                        {
                              "name": "from",
                              "type": "address",
                              "internalType": "address"
                        },
                        {
                              "name": "to",
                              "type": "address",
                              "internalType": "address"
                        },
                        {
                              "name": "value",
                              "type": "uint256",
                              "internalType": "uint256"
                        }
                  ],
                  "outputs": [
                        {
                              "name": "",
                              "type": "bool",
                              "internalType": "bool"
                        }
                  ],
                  "stateMutability": "nonpayable"
            },
            {
                  "type": "function",
                  "name": "transferOwnership",
                  "inputs": [
                        {
                              "name": "newOwner",
                              "type": "address",
                              "internalType": "address"
                        }
                  ],
                  "outputs": [],
                  "stateMutability": "nonpayable"
            },
            {
                  "type": "function",
                  "name": "unwrap",
                  "inputs": [
                        {
                              "name": "amount",
                              "type": "uint256",
                              "internalType": "uint256"
                        }
                  ],
                  "outputs": [],
                  "stateMutability": "nonpayable"
            },
            {
                  "type": "function",
                  "name": "wrap",
                  "inputs": [
                        {
                              "name": "amount",
                              "type": "uint256",
                              "internalType": "uint256"
                        }
                  ],
                  "outputs": [],
                  "stateMutability": "nonpayable"
            },
            {
                  "type": "event",
                  "name": "Approval",
                  "inputs": [
                        {
                              "name": "owner",
                              "type": "address",
                              "indexed": true,
                              "internalType": "address"
                        },
                        {
                              "name": "spender",
                              "type": "address",
                              "indexed": true,
                              "internalType": "address"
                        },
                        {
                              "name": "value",
                              "type": "uint256",
                              "indexed": false,
                              "internalType": "uint256"
                        }
                  ],
                  "anonymous": false
            },
            {
                  "type": "event",
                  "name": "OwnershipTransferred",
                  "inputs": [
                        {
                              "name": "previousOwner",
                              "type": "address",
                              "indexed": true,
                              "internalType": "address"
                        },
                        {
                              "name": "newOwner",
                              "type": "address",
                              "indexed": true,
                              "internalType": "address"
                        }
                  ],
                  "anonymous": false
            },
            {
                  "type": "event",
                  "name": "Transfer",
                  "inputs": [
                        {
                              "name": "from",
                              "type": "address",
                              "indexed": true,
                              "internalType": "address"
                        },
                        {
                              "name": "to",
                              "type": "address",
                              "indexed": true,
                              "internalType": "address"
                        },
                        {
                              "name": "value",
                              "type": "uint256",
                              "indexed": false,
                              "internalType": "uint256"
                        }
                  ],
                  "anonymous": false
            },
            {
                  "type": "event",
                  "name": "Unwrapped",
                  "inputs": [
                        {
                              "name": "user",
                              "type": "address",
                              "indexed": true,
                              "internalType": "address"
                        },
                        {
                              "name": "amount",
                              "type": "uint256",
                              "indexed": false,
                              "internalType": "uint256"
                        }
                  ],
                  "anonymous": false
            },
            {
                  "type": "event",
                  "name": "Wrapped",
                  "inputs": [
                        {
                              "name": "user",
                              "type": "address",
                              "indexed": true,
                              "internalType": "address"
                        },
                        {
                              "name": "amount",
                              "type": "uint256",
                              "indexed": false,
                              "internalType": "uint256"
                        }
                  ],
                  "anonymous": false
            },
            {
                  "type": "error",
                  "name": "ERC20InsufficientAllowance",
                  "inputs": [
                        {
                              "name": "spender",
                              "type": "address",
                              "internalType": "address"
                        },
                        {
                              "name": "allowance",
                              "type": "uint256",
                              "internalType": "uint256"
                        },
                        {
                              "name": "needed",
                              "type": "uint256",
                              "internalType": "uint256"
                        }
                  ]
            },
            {
                  "type": "error",
                  "name": "ERC20InsufficientBalance",
                  "inputs": [
                        {
                              "name": "sender",
                              "type": "address",
                              "internalType": "address"
                        },
                        {
                              "name": "balance",
                              "type": "uint256",
                              "internalType": "uint256"
                        },
                        {
                              "name": "needed",
                              "type": "uint256",
                              "internalType": "uint256"
                        }
                  ]
            },
            {
                  "type": "error",
                  "name": "ERC20InvalidApprover",
                  "inputs": [
                        {
                              "name": "approver",
                              "type": "address",
                              "internalType": "address"
                        }
                  ]
            },
            {
                  "type": "error",
                  "name": "ERC20InvalidReceiver",
                  "inputs": [
                        {
                              "name": "receiver",
                              "type": "address",
                              "internalType": "address"
                        }
                  ]
            },
            {
                  "type": "error",
                  "name": "ERC20InvalidSender",
                  "inputs": [
                        {
                              "name": "sender",
                              "type": "address",
                              "internalType": "address"
                        }
                  ]
            },
            {
                  "type": "error",
                  "name": "ERC20InvalidSpender",
                  "inputs": [
                        {
                              "name": "spender",
                              "type": "address",
                              "internalType": "address"
                        }
                  ]
            },
            {
                  "type": "error",
                  "name": "OwnableInvalidOwner",
                  "inputs": [
                        {
                              "name": "owner",
                              "type": "address",
                              "internalType": "address"
                        }
                  ]
            },
            {
                  "type": "error",
                  "name": "OwnableUnauthorizedAccount",
                  "inputs": [
                        {
                              "name": "account",
                              "type": "address",
                              "internalType": "address"
                        }
                  ]
            }
      ],
    },
    {
      name: 'MockPolyMarketCTF',
      address: {
        137: '0xe98c92fd27ae71b07f0244b7820f2c2236965142',
      },
      abi: [
            {
                  "type": "constructor",
                  "inputs": [],
                  "stateMutability": "nonpayable"
            },
            {
                  "type": "function",
                  "name": "MAX_OUTCOME_SLOT_COUNT",
                  "inputs": [],
                  "outputs": [
                        {
                              "name": "",
                              "type": "uint256",
                              "internalType": "uint256"
                        }
                  ],
                  "stateMutability": "view"
            },
            {
                  "type": "function",
                  "name": "balanceOf",
                  "inputs": [
                        {
                              "name": "account",
                              "type": "address",
                              "internalType": "address"
                        },
                        {
                              "name": "id",
                              "type": "uint256",
                              "internalType": "uint256"
                        }
                  ],
                  "outputs": [
                        {
                              "name": "",
                              "type": "uint256",
                              "internalType": "uint256"
                        }
                  ],
                  "stateMutability": "view"
            },
            {
                  "type": "function",
                  "name": "balanceOfBatch",
                  "inputs": [
                        {
                              "name": "accounts",
                              "type": "address[]",
                              "internalType": "address[]"
                        },
                        {
                              "name": "ids",
                              "type": "uint256[]",
                              "internalType": "uint256[]"
                        }
                  ],
                  "outputs": [
                        {
                              "name": "",
                              "type": "uint256[]",
                              "internalType": "uint256[]"
                        }
                  ],
                  "stateMutability": "view"
            },
            {
                  "type": "function",
                  "name": "collateralTokens",
                  "inputs": [
                        {
                              "name": "",
                              "type": "address",
                              "internalType": "address"
                        },
                        {
                              "name": "",
                              "type": "bytes32",
                              "internalType": "bytes32"
                        }
                  ],
                  "outputs": [
                        {
                              "name": "",
                              "type": "uint256",
                              "internalType": "uint256"
                        }
                  ],
                  "stateMutability": "view"
            },
            {
                  "type": "function",
                  "name": "conditions",
                  "inputs": [
                        {
                              "name": "",
                              "type": "bytes32",
                              "internalType": "bytes32"
                        }
                  ],
                  "outputs": [
                        {
                              "name": "oracle",
                              "type": "address",
                              "internalType": "address"
                        },
                        {
                              "name": "questionId",
                              "type": "bytes32",
                              "internalType": "bytes32"
                        },
                        {
                              "name": "outcomeSlotCount",
                              "type": "uint256",
                              "internalType": "uint256"
                        },
                        {
                              "name": "resolved",
                              "type": "bool",
                              "internalType": "bool"
                        }
                  ],
                  "stateMutability": "view"
            },
            {
                  "type": "function",
                  "name": "getCollectionId",
                  "inputs": [
                        {
                              "name": "parentCollectionId",
                              "type": "bytes32",
                              "internalType": "bytes32"
                        },
                        {
                              "name": "conditionId",
                              "type": "bytes32",
                              "internalType": "bytes32"
                        },
                        {
                              "name": "outcomeIndex",
                              "type": "uint256",
                              "internalType": "uint256"
                        }
                  ],
                  "outputs": [
                        {
                              "name": "",
                              "type": "bytes32",
                              "internalType": "bytes32"
                        }
                  ],
                  "stateMutability": "pure"
            },
            {
                  "type": "function",
                  "name": "getConditionId",
                  "inputs": [
                        {
                              "name": "oracle",
                              "type": "address",
                              "internalType": "address"
                        },
                        {
                              "name": "questionId",
                              "type": "bytes32",
                              "internalType": "bytes32"
                        },
                        {
                              "name": "outcomeSlotCount",
                              "type": "uint256",
                              "internalType": "uint256"
                        }
                  ],
                  "outputs": [
                        {
                              "name": "",
                              "type": "bytes32",
                              "internalType": "bytes32"
                        }
                  ],
                  "stateMutability": "pure"
            },
            {
                  "type": "function",
                  "name": "getPositionId",
                  "inputs": [
                        {
                              "name": "collateralToken",
                              "type": "address",
                              "internalType": "contract IERC20"
                        },
                        {
                              "name": "parentCollectionId",
                              "type": "bytes32",
                              "internalType": "bytes32"
                        },
                        {
                              "name": "conditionId",
                              "type": "bytes32",
                              "internalType": "bytes32"
                        },
                        {
                              "name": "outcomeIndex",
                              "type": "uint256",
                              "internalType": "uint256"
                        }
                  ],
                  "outputs": [
                        {
                              "name": "",
                              "type": "uint256",
                              "internalType": "uint256"
                        }
                  ],
                  "stateMutability": "pure"
            },
            {
                  "type": "function",
                  "name": "isApprovedForAll",
                  "inputs": [
                        {
                              "name": "account",
                              "type": "address",
                              "internalType": "address"
                        },
                        {
                              "name": "operator",
                              "type": "address",
                              "internalType": "address"
                        }
                  ],
                  "outputs": [
                        {
                              "name": "",
                              "type": "bool",
                              "internalType": "bool"
                        }
                  ],
                  "stateMutability": "view"
            },
            {
                  "type": "function",
                  "name": "mergePositions",
                  "inputs": [
                        {
                              "name": "collateralToken",
                              "type": "address",
                              "internalType": "contract IERC20"
                        },
                        {
                              "name": "parentCollectionId",
                              "type": "bytes32",
                              "internalType": "bytes32"
                        },
                        {
                              "name": "conditionId",
                              "type": "bytes32",
                              "internalType": "bytes32"
                        },
                        {
                              "name": "partition",
                              "type": "uint256[]",
                              "internalType": "uint256[]"
                        },
                        {
                              "name": "amount",
                              "type": "uint256",
                              "internalType": "uint256"
                        }
                  ],
                  "outputs": [],
                  "stateMutability": "nonpayable"
            },
            {
                  "type": "function",
                  "name": "owner",
                  "inputs": [],
                  "outputs": [
                        {
                              "name": "",
                              "type": "address",
                              "internalType": "address"
                        }
                  ],
                  "stateMutability": "view"
            },
            {
                  "type": "function",
                  "name": "payoutDenominator",
                  "inputs": [
                        {
                              "name": "",
                              "type": "bytes32",
                              "internalType": "bytes32"
                        }
                  ],
                  "outputs": [
                        {
                              "name": "",
                              "type": "uint256",
                              "internalType": "uint256"
                        }
                  ],
                  "stateMutability": "view"
            },
            {
                  "type": "function",
                  "name": "prepareCondition",
                  "inputs": [
                        {
                              "name": "oracle",
                              "type": "address",
                              "internalType": "address"
                        },
                        {
                              "name": "questionId",
                              "type": "bytes32",
                              "internalType": "bytes32"
                        },
                        {
                              "name": "outcomeSlotCount",
                              "type": "uint256",
                              "internalType": "uint256"
                        }
                  ],
                  "outputs": [],
                  "stateMutability": "nonpayable"
            },
            {
                  "type": "function",
                  "name": "redeemPositions",
                  "inputs": [
                        {
                              "name": "collateralToken",
                              "type": "address",
                              "internalType": "contract IERC20"
                        },
                        {
                              "name": "parentCollectionId",
                              "type": "bytes32",
                              "internalType": "bytes32"
                        },
                        {
                              "name": "conditionId",
                              "type": "bytes32",
                              "internalType": "bytes32"
                        },
                        {
                              "name": "indexSets",
                              "type": "uint256[]",
                              "internalType": "uint256[]"
                        }
                  ],
                  "outputs": [],
                  "stateMutability": "nonpayable"
            },
            {
                  "type": "function",
                  "name": "renounceOwnership",
                  "inputs": [],
                  "outputs": [],
                  "stateMutability": "nonpayable"
            },
            {
                  "type": "function",
                  "name": "reportPayouts",
                  "inputs": [
                        {
                              "name": "questionId",
                              "type": "bytes32",
                              "internalType": "bytes32"
                        },
                        {
                              "name": "payouts",
                              "type": "uint256[]",
                              "internalType": "uint256[]"
                        }
                  ],
                  "outputs": [],
                  "stateMutability": "nonpayable"
            },
            {
                  "type": "function",
                  "name": "safeBatchTransferFrom",
                  "inputs": [
                        {
                              "name": "from",
                              "type": "address",
                              "internalType": "address"
                        },
                        {
                              "name": "to",
                              "type": "address",
                              "internalType": "address"
                        },
                        {
                              "name": "ids",
                              "type": "uint256[]",
                              "internalType": "uint256[]"
                        },
                        {
                              "name": "values",
                              "type": "uint256[]",
                              "internalType": "uint256[]"
                        },
                        {
                              "name": "data",
                              "type": "bytes",
                              "internalType": "bytes"
                        }
                  ],
                  "outputs": [],
                  "stateMutability": "nonpayable"
            },
            {
                  "type": "function",
                  "name": "safeTransferFrom",
                  "inputs": [
                        {
                              "name": "from",
                              "type": "address",
                              "internalType": "address"
                        },
                        {
                              "name": "to",
                              "type": "address",
                              "internalType": "address"
                        },
                        {
                              "name": "id",
                              "type": "uint256",
                              "internalType": "uint256"
                        },
                        {
                              "name": "value",
                              "type": "uint256",
                              "internalType": "uint256"
                        },
                        {
                              "name": "data",
                              "type": "bytes",
                              "internalType": "bytes"
                        }
                  ],
                  "outputs": [],
                  "stateMutability": "nonpayable"
            },
            {
                  "type": "function",
                  "name": "setApprovalForAll",
                  "inputs": [
                        {
                              "name": "operator",
                              "type": "address",
                              "internalType": "address"
                        },
                        {
                              "name": "approved",
                              "type": "bool",
                              "internalType": "bool"
                        }
                  ],
                  "outputs": [],
                  "stateMutability": "nonpayable"
            },
            {
                  "type": "function",
                  "name": "splitPosition",
                  "inputs": [
                        {
                              "name": "collateralToken",
                              "type": "address",
                              "internalType": "contract IERC20"
                        },
                        {
                              "name": "parentCollectionId",
                              "type": "bytes32",
                              "internalType": "bytes32"
                        },
                        {
                              "name": "conditionId",
                              "type": "bytes32",
                              "internalType": "bytes32"
                        },
                        {
                              "name": "partition",
                              "type": "uint256[]",
                              "internalType": "uint256[]"
                        },
                        {
                              "name": "amount",
                              "type": "uint256",
                              "internalType": "uint256"
                        }
                  ],
                  "outputs": [],
                  "stateMutability": "nonpayable"
            },
            {
                  "type": "function",
                  "name": "supportsInterface",
                  "inputs": [
                        {
                              "name": "interfaceId",
                              "type": "bytes4",
                              "internalType": "bytes4"
                        }
                  ],
                  "outputs": [
                        {
                              "name": "",
                              "type": "bool",
                              "internalType": "bool"
                        }
                  ],
                  "stateMutability": "view"
            },
            {
                  "type": "function",
                  "name": "transferOwnership",
                  "inputs": [
                        {
                              "name": "newOwner",
                              "type": "address",
                              "internalType": "address"
                        }
                  ],
                  "outputs": [],
                  "stateMutability": "nonpayable"
            },
            {
                  "type": "function",
                  "name": "uri",
                  "inputs": [
                        {
                              "name": "tokenId",
                              "type": "uint256",
                              "internalType": "uint256"
                        }
                  ],
                  "outputs": [
                        {
                              "name": "",
                              "type": "string",
                              "internalType": "string"
                        }
                  ],
                  "stateMutability": "view"
            },
            {
                  "type": "event",
                  "name": "ApprovalForAll",
                  "inputs": [
                        {
                              "name": "account",
                              "type": "address",
                              "indexed": true,
                              "internalType": "address"
                        },
                        {
                              "name": "operator",
                              "type": "address",
                              "indexed": true,
                              "internalType": "address"
                        },
                        {
                              "name": "approved",
                              "type": "bool",
                              "indexed": false,
                              "internalType": "bool"
                        }
                  ],
                  "anonymous": false
            },
            {
                  "type": "event",
                  "name": "ConditionPreparation",
                  "inputs": [
                        {
                              "name": "conditionId",
                              "type": "bytes32",
                              "indexed": true,
                              "internalType": "bytes32"
                        },
                        {
                              "name": "oracle",
                              "type": "address",
                              "indexed": true,
                              "internalType": "address"
                        },
                        {
                              "name": "questionId",
                              "type": "bytes32",
                              "indexed": true,
                              "internalType": "bytes32"
                        },
                        {
                              "name": "outcomeSlotCount",
                              "type": "uint256",
                              "indexed": false,
                              "internalType": "uint256"
                        }
                  ],
                  "anonymous": false
            },
            {
                  "type": "event",
                  "name": "ConditionResolution",
                  "inputs": [
                        {
                              "name": "conditionId",
                              "type": "bytes32",
                              "indexed": true,
                              "internalType": "bytes32"
                        },
                        {
                              "name": "oracle",
                              "type": "address",
                              "indexed": true,
                              "internalType": "address"
                        },
                        {
                              "name": "questionId",
                              "type": "bytes32",
                              "indexed": true,
                              "internalType": "bytes32"
                        },
                        {
                              "name": "outcomeSlotCount",
                              "type": "uint256",
                              "indexed": false,
                              "internalType": "uint256"
                        },
                        {
                              "name": "payoutNumerators",
                              "type": "uint256[]",
                              "indexed": false,
                              "internalType": "uint256[]"
                        }
                  ],
                  "anonymous": false
            },
            {
                  "type": "event",
                  "name": "OwnershipTransferred",
                  "inputs": [
                        {
                              "name": "previousOwner",
                              "type": "address",
                              "indexed": true,
                              "internalType": "address"
                        },
                        {
                              "name": "newOwner",
                              "type": "address",
                              "indexed": true,
                              "internalType": "address"
                        }
                  ],
                  "anonymous": false
            },
            {
                  "type": "event",
                  "name": "PayoutRedemption",
                  "inputs": [
                        {
                              "name": "redeemer",
                              "type": "address",
                              "indexed": true,
                              "internalType": "address"
                        },
                        {
                              "name": "collateralToken",
                              "type": "address",
                              "indexed": true,
                              "internalType": "contract IERC20"
                        },
                        {
                              "name": "parentCollectionId",
                              "type": "bytes32",
                              "indexed": true,
                              "internalType": "bytes32"
                        },
                        {
                              "name": "conditionId",
                              "type": "bytes32",
                              "indexed": false,
                              "internalType": "bytes32"
                        },
                        {
                              "name": "indexSets",
                              "type": "uint256[]",
                              "indexed": false,
                              "internalType": "uint256[]"
                        },
                        {
                              "name": "payout",
                              "type": "uint256",
                              "indexed": false,
                              "internalType": "uint256"
                        }
                  ],
                  "anonymous": false
            },
            {
                  "type": "event",
                  "name": "PositionSplit",
                  "inputs": [
                        {
                              "name": "stakeholder",
                              "type": "address",
                              "indexed": true,
                              "internalType": "address"
                        },
                        {
                              "name": "collateralToken",
                              "type": "address",
                              "indexed": false,
                              "internalType": "contract IERC20"
                        },
                        {
                              "name": "parentCollectionId",
                              "type": "bytes32",
                              "indexed": true,
                              "internalType": "bytes32"
                        },
                        {
                              "name": "conditionId",
                              "type": "bytes32",
                              "indexed": true,
                              "internalType": "bytes32"
                        },
                        {
                              "name": "partition",
                              "type": "uint256[]",
                              "indexed": false,
                              "internalType": "uint256[]"
                        },
                        {
                              "name": "amount",
                              "type": "uint256",
                              "indexed": false,
                              "internalType": "uint256"
                        }
                  ],
                  "anonymous": false
            },
            {
                  "type": "event",
                  "name": "PositionsMerge",
                  "inputs": [
                        {
                              "name": "stakeholder",
                              "type": "address",
                              "indexed": true,
                              "internalType": "address"
                        },
                        {
                              "name": "collateralToken",
                              "type": "address",
                              "indexed": false,
                              "internalType": "contract IERC20"
                        },
                        {
                              "name": "parentCollectionId",
                              "type": "bytes32",
                              "indexed": true,
                              "internalType": "bytes32"
                        },
                        {
                              "name": "conditionId",
                              "type": "bytes32",
                              "indexed": true,
                              "internalType": "bytes32"
                        },
                        {
                              "name": "partition",
                              "type": "uint256[]",
                              "indexed": false,
                              "internalType": "uint256[]"
                        },
                        {
                              "name": "amount",
                              "type": "uint256",
                              "indexed": false,
                              "internalType": "uint256"
                        }
                  ],
                  "anonymous": false
            },
            {
                  "type": "event",
                  "name": "TransferBatch",
                  "inputs": [
                        {
                              "name": "operator",
                              "type": "address",
                              "indexed": true,
                              "internalType": "address"
                        },
                        {
                              "name": "from",
                              "type": "address",
                              "indexed": true,
                              "internalType": "address"
                        },
                        {
                              "name": "to",
                              "type": "address",
                              "indexed": true,
                              "internalType": "address"
                        },
                        {
                              "name": "ids",
                              "type": "uint256[]",
                              "indexed": false,
                              "internalType": "uint256[]"
                        },
                        {
                              "name": "values",
                              "type": "uint256[]",
                              "indexed": false,
                              "internalType": "uint256[]"
                        }
                  ],
                  "anonymous": false
            },
            {
                  "type": "event",
                  "name": "TransferSingle",
                  "inputs": [
                        {
                              "name": "operator",
                              "type": "address",
                              "indexed": true,
                              "internalType": "address"
                        },
                        {
                              "name": "from",
                              "type": "address",
                              "indexed": true,
                              "internalType": "address"
                        },
                        {
                              "name": "to",
                              "type": "address",
                              "indexed": true,
                              "internalType": "address"
                        },
                        {
                              "name": "id",
                              "type": "uint256",
                              "indexed": false,
                              "internalType": "uint256"
                        },
                        {
                              "name": "value",
                              "type": "uint256",
                              "indexed": false,
                              "internalType": "uint256"
                        }
                  ],
                  "anonymous": false
            },
            {
                  "type": "event",
                  "name": "URI",
                  "inputs": [
                        {
                              "name": "value",
                              "type": "string",
                              "indexed": false,
                              "internalType": "string"
                        },
                        {
                              "name": "id",
                              "type": "uint256",
                              "indexed": true,
                              "internalType": "uint256"
                        }
                  ],
                  "anonymous": false
            },
            {
                  "type": "error",
                  "name": "ERC1155InsufficientBalance",
                  "inputs": [
                        {
                              "name": "sender",
                              "type": "address",
                              "internalType": "address"
                        },
                        {
                              "name": "balance",
                              "type": "uint256",
                              "internalType": "uint256"
                        },
                        {
                              "name": "needed",
                              "type": "uint256",
                              "internalType": "uint256"
                        },
                        {
                              "name": "tokenId",
                              "type": "uint256",
                              "internalType": "uint256"
                        }
                  ]
            },
            {
                  "type": "error",
                  "name": "ERC1155InvalidApprover",
                  "inputs": [
                        {
                              "name": "approver",
                              "type": "address",
                              "internalType": "address"
                        }
                  ]
            },
            {
                  "type": "error",
                  "name": "ERC1155InvalidArrayLength",
                  "inputs": [
                        {
                              "name": "idsLength",
                              "type": "uint256",
                              "internalType": "uint256"
                        },
                        {
                              "name": "valuesLength",
                              "type": "uint256",
                              "internalType": "uint256"
                        }
                  ]
            },
            {
                  "type": "error",
                  "name": "ERC1155InvalidOperator",
                  "inputs": [
                        {
                              "name": "operator",
                              "type": "address",
                              "internalType": "address"
                        }
                  ]
            },
            {
                  "type": "error",
                  "name": "ERC1155InvalidReceiver",
                  "inputs": [
                        {
                              "name": "receiver",
                              "type": "address",
                              "internalType": "address"
                        }
                  ]
            },
            {
                  "type": "error",
                  "name": "ERC1155InvalidSender",
                  "inputs": [
                        {
                              "name": "sender",
                              "type": "address",
                              "internalType": "address"
                        }
                  ]
            },
            {
                  "type": "error",
                  "name": "ERC1155MissingApprovalForAll",
                  "inputs": [
                        {
                              "name": "operator",
                              "type": "address",
                              "internalType": "address"
                        },
                        {
                              "name": "owner",
                              "type": "address",
                              "internalType": "address"
                        }
                  ]
            },
            {
                  "type": "error",
                  "name": "OwnableInvalidOwner",
                  "inputs": [
                        {
                              "name": "owner",
                              "type": "address",
                              "internalType": "address"
                        }
                  ]
            },
            {
                  "type": "error",
                  "name": "OwnableUnauthorizedAccount",
                  "inputs": [
                        {
                              "name": "account",
                              "type": "address",
                              "internalType": "address"
                        }
                  ]
            }
      ],
    },
    {
      name: 'MockOracle',
      address: {
        137: '0x7b9159c4ca8f59f9dc71dec7135248da31cb8223',
      },
      abi: [
            {
                  "type": "constructor",
                  "inputs": [
                        {
                              "name": "_initialPrice",
                              "type": "uint256",
                              "internalType": "uint256"
                        }
                  ],
                  "stateMutability": "nonpayable"
            },
            {
                  "type": "function",
                  "name": "addAuthorized",
                  "inputs": [
                        {
                              "name": "_addr",
                              "type": "address",
                              "internalType": "address"
                        }
                  ],
                  "outputs": [],
                  "stateMutability": "nonpayable"
            },
            {
                  "type": "function",
                  "name": "decimals",
                  "inputs": [],
                  "outputs": [
                        {
                              "name": "",
                              "type": "uint256",
                              "internalType": "uint256"
                        }
                  ],
                  "stateMutability": "view"
            },
            {
                  "type": "function",
                  "name": "isAuthorized",
                  "inputs": [
                        {
                              "name": "",
                              "type": "address",
                              "internalType": "address"
                        }
                  ],
                  "outputs": [
                        {
                              "name": "",
                              "type": "bool",
                              "internalType": "bool"
                        }
                  ],
                  "stateMutability": "view"
            },
            {
                  "type": "function",
                  "name": "price",
                  "inputs": [],
                  "outputs": [
                        {
                              "name": "",
                              "type": "uint256",
                              "internalType": "uint256"
                        }
                  ],
                  "stateMutability": "view"
            },
            {
                  "type": "function",
                  "name": "removeAuthorized",
                  "inputs": [
                        {
                              "name": "_addr",
                              "type": "address",
                              "internalType": "address"
                        }
                  ],
                  "outputs": [],
                  "stateMutability": "nonpayable"
            },
            {
                  "type": "function",
                  "name": "updatePrice",
                  "inputs": [
                        {
                              "name": "_newPrice",
                              "type": "uint256",
                              "internalType": "uint256"
                        }
                  ],
                  "outputs": [],
                  "stateMutability": "nonpayable"
            }
      ],
    },
    {
      name: 'MorphoBlue',
      address: {
        137: '0x1bf0c2541f820e775182832f06c0b7fc27a25f67',
      },
      abi: [
            {
                  "inputs": [
                        {
                              "name": "marketParams",
                              "type": "tuple",
                              "components": [
                                    {
                                          "name": "loanToken",
                                          "type": "address"
                                    },
                                    {
                                          "name": "collateralToken",
                                          "type": "address"
                                    },
                                    {
                                          "name": "oracle",
                                          "type": "address"
                                    },
                                    {
                                          "name": "irm",
                                          "type": "address"
                                    },
                                    {
                                          "name": "lltv",
                                          "type": "uint256"
                                    }
                              ]
                        },
                        {
                              "name": "assets",
                              "type": "uint256"
                        },
                        {
                              "name": "shares",
                              "type": "uint256"
                        },
                        {
                              "name": "onBehalf",
                              "type": "address"
                        },
                        {
                              "name": "data",
                              "type": "bytes"
                        }
                  ],
                  "name": "supply",
                  "outputs": [
                        {
                              "name": "assetsSupplied",
                              "type": "uint256"
                        },
                        {
                              "name": "sharesSupplied",
                              "type": "uint256"
                        }
                  ],
                  "stateMutability": "nonpayable",
                  "type": "function"
            },
            {
                  "inputs": [
                        {
                              "name": "id",
                              "type": "bytes32"
                        },
                        {
                              "name": "user",
                              "type": "address"
                        }
                  ],
                  "name": "position",
                  "outputs": [
                        {
                              "name": "supplyShares",
                              "type": "uint256"
                        },
                        {
                              "name": "borrowShares",
                              "type": "uint256"
                        },
                        {
                              "name": "collateral",
                              "type": "uint256"
                        }
                  ],
                  "stateMutability": "view",
                  "type": "function"
            }
      ],
    },
  ],
  plugins: [],
})
