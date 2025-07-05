import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits, keccak256, encodeAbiParameters, parseAbiParameters, toHex } from 'viem'
import { CONTRACT_ADDRESSES, TOKEN_IDS, CONFIG } from '../contracts/constants'
import { MORPHO_BLUE_ABI, ERC20_ABI, CTF_WRAPPER_ABI, ERC1155_ABI } from '../contracts/abis'
import { TOKEN_DECIMALS } from '../contracts/constants'

const MARKET_PARAMS = {
  loanToken: CONTRACT_ADDRESSES.MOCK_USDC,
  collateralToken: CONTRACT_ADDRESSES.CTF_WRAPPER,
  oracle: CONTRACT_ADDRESSES.MOCK_ORACLE,
  irm: CONTRACT_ADDRESSES.ADAPTIVE_CURVE_IRM,
  lltv: BigInt(CONFIG.LLTV),
}

// Calculate the correct market ID from parameters
const CALCULATED_MARKET_ID = keccak256(
  encodeAbiParameters(
    parseAbiParameters('address,address,address,address,uint256'),
    [
      MARKET_PARAMS.loanToken,
      MARKET_PARAMS.collateralToken,
      MARKET_PARAMS.oracle,
      MARKET_PARAMS.irm,
      MARKET_PARAMS.lltv
    ]
  )
)

export function useUserPosition(userAddress?: `0x${string}`) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.MORPHO_BLUE,
    abi: MORPHO_BLUE_ABI,
    functionName: 'position',
    args: [CALCULATED_MARKET_ID, userAddress!],
    query: { enabled: !!userAddress },
  })
}

export function useMarketData() {
  return useReadContract({
    address: CONTRACT_ADDRESSES.MORPHO_BLUE,
    abi: MORPHO_BLUE_ABI,
    functionName: 'market',
    args: [CALCULATED_MARKET_ID],
  })
}

export function useUSDCBalance(userAddress?: `0x${string}`) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.MOCK_USDC,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [userAddress!],
    query: { enabled: !!userAddress },
  })
}

export function useCTFBalance(userAddress?: `0x${string}`) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.CTF_WRAPPER,
    abi: CTF_WRAPPER_ABI,
    functionName: 'balanceOf',
    args: [userAddress!],
    query: { enabled: !!userAddress },
  })
}

export function useRawCTFBalance(userAddress?: `0x${string}`) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.MOCK_POLYMARKET_CTF,
    abi: ERC1155_ABI,
    functionName: 'balanceOf',
    args: [userAddress!, BigInt(TOKEN_IDS.RECESSION_NO)],
    query: { enabled: !!userAddress },
  })
}

export function useUSDCAllowance(userAddress?: `0x${string}`) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.MOCK_USDC,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: [userAddress!, CONTRACT_ADDRESSES.MORPHO_BLUE],
    query: { enabled: !!userAddress },
  })
}

export function useCTFAllowance(userAddress?: `0x${string}`) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.CTF_WRAPPER,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: [userAddress!, CONTRACT_ADDRESSES.MORPHO_BLUE],
    query: { enabled: !!userAddress },
  })
}

export function useRawCTFApproval(userAddress?: `0x${string}`) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.MOCK_POLYMARKET_CTF,
    abi: ERC1155_ABI,
    functionName: 'isApprovedForAll',
    args: [userAddress!, CONTRACT_ADDRESSES.CTF_WRAPPER],
    query: { enabled: !!userAddress },
  })
}

export function useMorphoTransactions() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  // Debug error state
  if (error) {
    console.error('useMorphoTransactions error:', error)
  }

  const supply = (amount: string, userAddress: `0x${string}`) => {
    console.log('supply function called with:', { amount, userAddress })
    const assets = parseUnits(amount, TOKEN_DECIMALS.USDC)
    console.log('parsed assets:', assets.toString())
    console.log('MARKET_PARAMS:', MARKET_PARAMS)
    console.log('Individual MARKET_PARAMS:')
    console.log('  loanToken:', MARKET_PARAMS.loanToken)
    console.log('  collateralToken:', MARKET_PARAMS.collateralToken)
    console.log('  oracle:', MARKET_PARAMS.oracle)
    console.log('  irm:', MARKET_PARAMS.irm)
    console.log('  lltv:', MARKET_PARAMS.lltv)
    console.log('CONTRACT_ADDRESSES.MORPHO_BLUE:', CONTRACT_ADDRESSES.MORPHO_BLUE)
    
    const emptyBytes = toHex('')
    console.log('emptyBytes value:', emptyBytes)
    
    const contractCall = {
      address: CONTRACT_ADDRESSES.MORPHO_BLUE,
      abi: MORPHO_BLUE_ABI,
      functionName: 'supply',
      args: [
        MARKET_PARAMS,
        assets, 
        0n, 
        userAddress, 
        emptyBytes
      ],
    }
    console.log('writeContract call:', contractCall)
    
    try {
      writeContract(contractCall)
      console.log('writeContract called successfully')
    } catch (error) {
      console.error('Error calling writeContract:', error)
    }
  }

  const withdraw = (amount: string, userAddress: `0x${string}`) => {
    const assets = parseUnits(amount, TOKEN_DECIMALS.USDC)
    writeContract({
      address: CONTRACT_ADDRESSES.MORPHO_BLUE,
      abi: MORPHO_BLUE_ABI,
      functionName: 'withdraw',
      args: [
        MARKET_PARAMS,
        assets, 
        0n, 
        userAddress, 
        userAddress
      ],
    })
  }

  const borrow = (amount: string, userAddress: `0x${string}`) => {
    const assets = parseUnits(amount, TOKEN_DECIMALS.USDC)
    writeContract({
      address: CONTRACT_ADDRESSES.MORPHO_BLUE,
      abi: MORPHO_BLUE_ABI,
      functionName: 'borrow',
      args: [
        MARKET_PARAMS,
        assets, 
        0n, 
        userAddress, 
        userAddress
      ],
    })
  }

  const repay = (amount: string, userAddress: `0x${string}`) => {
    const assets = parseUnits(amount, TOKEN_DECIMALS.USDC)
    writeContract({
      address: CONTRACT_ADDRESSES.MORPHO_BLUE,
      abi: MORPHO_BLUE_ABI,
      functionName: 'repay',
      args: [
        MARKET_PARAMS,
        assets, 
        0n, 
        userAddress, 
        toHex('')
      ],
    })
  }

  const supplyCollateral = (amount: string, userAddress: `0x${string}`) => {
    const assets = parseUnits(amount, TOKEN_DECIMALS.CTF_WRAPPER)
    writeContract({
      address: CONTRACT_ADDRESSES.MORPHO_BLUE,
      abi: MORPHO_BLUE_ABI,
      functionName: 'supplyCollateral',
      args: [
        MARKET_PARAMS,
        assets, 
        userAddress, 
        toHex('')
      ],
    })
  }

  const withdrawCollateral = (amount: string, userAddress: `0x${string}`) => {
    const assets = parseUnits(amount, TOKEN_DECIMALS.CTF_WRAPPER)
    writeContract({
      address: CONTRACT_ADDRESSES.MORPHO_BLUE,
      abi: MORPHO_BLUE_ABI,
      functionName: 'withdrawCollateral',
      args: [
        MARKET_PARAMS,
        assets, 
        userAddress, 
        userAddress
      ],
    })
  }

  return {
    supply,
    withdraw,
    borrow,
    repay,
    supplyCollateral,
    withdrawCollateral,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  }
}

export function useTokenTransactions() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const approveUSDC = (amount: string) => {
    const value = parseUnits(amount, TOKEN_DECIMALS.USDC)
    writeContract({
      address: CONTRACT_ADDRESSES.MOCK_USDC,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [CONTRACT_ADDRESSES.MORPHO_BLUE, value],
    })
  }

  const approveMaxUSDC = () => {
    writeContract({
      address: CONTRACT_ADDRESSES.MOCK_USDC,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [CONTRACT_ADDRESSES.MORPHO_BLUE, BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')],
    })
  }

  const approveCTF = (amount: string) => {
    const value = parseUnits(amount, TOKEN_DECIMALS.CTF_WRAPPER)
    writeContract({
      address: CONTRACT_ADDRESSES.CTF_WRAPPER,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [CONTRACT_ADDRESSES.MORPHO_BLUE, value],
    })
  }

  const approveMaxCTF = () => {
    writeContract({
      address: CONTRACT_ADDRESSES.CTF_WRAPPER,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [CONTRACT_ADDRESSES.MORPHO_BLUE, BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')],
    })
  }

  const approveRawCTF = () => {
    writeContract({
      address: CONTRACT_ADDRESSES.MOCK_POLYMARKET_CTF,
      abi: ERC1155_ABI,
      functionName: 'setApprovalForAll',
      args: [CONTRACT_ADDRESSES.CTF_WRAPPER, true],
    })
  }

  const wrapCTF = (amount: string) => {
    const value = BigInt(amount) // ERC1155 tokens don't have decimals
    writeContract({
      address: CONTRACT_ADDRESSES.CTF_WRAPPER,
      abi: CTF_WRAPPER_ABI,
      functionName: 'wrap',
      args: [value],
    })
  }

  const unwrapCTF = (amount: string) => {
    const value = BigInt(amount)
    writeContract({
      address: CONTRACT_ADDRESSES.CTF_WRAPPER,
      abi: CTF_WRAPPER_ABI,
      functionName: 'unwrap',
      args: [value],
    })
  }

  return {
    approveUSDC,
    approveMaxUSDC,
    approveCTF,
    approveMaxCTF,
    approveRawCTF,
    wrapCTF,
    unwrapCTF,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  }
}