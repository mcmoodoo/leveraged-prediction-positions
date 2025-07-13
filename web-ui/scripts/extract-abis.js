#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Paths
const outDir = path.join(__dirname, '../../out')
const configPath = path.join(__dirname, '../wagmi.config.ts')

// Contract mappings from out folder to config names
const contractMappings = {
  'MockUSDC.sol/MockUSDC.json': 'MockUSDC',
  'CTFWrapper.sol/CTFWrapper.json': 'CTFWrapper', 
  'MockPolyMarketCTF.sol/MockPolyMarketCTF.json': 'MockPolyMarketCTF',
  'MockOracle.sol/MockOracle.json': 'MockOracle'
}

// Extract ABIs from out folder
const abis = {}
for (const [filePath, contractName] of Object.entries(contractMappings)) {
  const fullPath = path.join(outDir, filePath)
  if (fs.existsSync(fullPath)) {
    const contractJson = JSON.parse(fs.readFileSync(fullPath, 'utf8'))
    abis[contractName] = contractJson.abi
    console.log(`✓ Extracted ABI for ${contractName}`)
  } else {
    console.warn(`⚠ File not found: ${fullPath}`)
  }
}

// Add Morpho Blue ABI (from node_modules or lib)
const morphoAbiPath = path.join(__dirname, '../../lib/morpho-blue/src/interfaces/IMorpho.sol')
if (fs.existsSync(morphoAbiPath)) {
  // For now, we'll use a basic Morpho ABI since we need the compiled version
  abis['MorphoBlue'] = [
    {
      "inputs": [
        {"name": "marketParams", "type": "tuple", "components": [
          {"name": "loanToken", "type": "address"},
          {"name": "collateralToken", "type": "address"},
          {"name": "oracle", "type": "address"},
          {"name": "irm", "type": "address"},
          {"name": "lltv", "type": "uint256"}
        ]},
        {"name": "assets", "type": "uint256"},
        {"name": "shares", "type": "uint256"},
        {"name": "onBehalf", "type": "address"},
        {"name": "data", "type": "bytes"}
      ],
      "name": "supply",
      "outputs": [
        {"name": "assetsSupplied", "type": "uint256"},
        {"name": "sharesSupplied", "type": "uint256"}
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {"name": "id", "type": "bytes32"},
        {"name": "user", "type": "address"}
      ],
      "name": "position",
      "outputs": [
        {"name": "supplyShares", "type": "uint256"},
        {"name": "borrowShares", "type": "uint256"},
        {"name": "collateral", "type": "uint256"}
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]
  console.log('✓ Added basic Morpho Blue ABI')
}

// Update wagmi config
let configContent = fs.readFileSync(configPath, 'utf8')

// Replace each contract's empty abi with the extracted one
for (const [contractName, abi] of Object.entries(abis)) {
  const pattern = new RegExp(`(name: '${contractName}',[\\s\\S]*?)abi: \\[\\]`, 'g')
  const replacement = `$1abi: ${JSON.stringify(abi, null, 6).replace(/\n/g, '\n      ')}`
  configContent = configContent.replace(pattern, replacement)
}

fs.writeFileSync(configPath, configContent)
console.log('✓ Updated wagmi.config.ts with extracted ABIs')