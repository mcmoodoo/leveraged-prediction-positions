import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits, keccak256, encodeAbiParameters, parseAbiParameters, toHex } from 'viem'
import { CONTRACT_ADDRESSES, TOKEN_IDS, MARKET_PARAMS, CALCULATED_MARKET_ID } from '../contracts/constants'
import { TOKEN_DECIMALS } from '../contracts/constants'
import { 
  morphoBlueAbi, 
  mockUsdcAbi, 
  ctfWrapperAbi, 
  mockPolyMarketCtfAbi 
} from '../generated'

// Market params and calculated ID are now imported from constants

export function useUserPosition(userAddress?: `0x${string}`) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.morphoBlueAddress,
    abi: morphoBlueAbi,
    functionName: 'position',
    args: [CALCULATED_MARKET_ID, userAddress!],
    query: { enabled: !!userAddress },
  })
}

export function useMarketData() {
  return useReadContract({
    address: CONTRACT_ADDRESSES.morphoBlueAddress,
    abi: morphoBlueAbi,
    functionName: 'market',
    args: [CALCULATED_MARKET_ID],
  })
}

export function useUSDCBalance(userAddress?: `0x${string}`) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.mockUsdc,
    abi: mockUsdcAbi,
    functionName: 'balanceOf',
    args: [userAddress!],
    query: { enabled: !!userAddress },
  })
}

export function useCTFBalance(userAddress?: `0x${string}`) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.recessionNoWrapper,
    abi: ctfWrapperAbi,
    functionName: 'balanceOf',
    args: [userAddress!],
    query: { enabled: !!userAddress },
  })
}

export function useRawCTFBalance(userAddress?: `0x${string}`) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.mockPolyMarketCTF,
    abi: mockPolyMarketCtfAbi,
    functionName: 'balanceOf',
    args: [userAddress!, BigInt(TOKEN_IDS.mockRecessionNoTokenId)],
    query: { enabled: !!userAddress },
  })
}

export function useUSDCAllowance(userAddress?: `0x${string}`) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.mockUsdc,
    abi: mockUsdcAbi,
    functionName: 'allowance',
    args: [userAddress!, CONTRACT_ADDRESSES.morphoBlueAddress],
    query: { enabled: !!userAddress },
  })
}

export function useCTFAllowance(userAddress?: `0x${string}`) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.recessionNoWrapper,
    abi: mockUsdcAbi,
    functionName: 'allowance',
    args: [userAddress!, CONTRACT_ADDRESSES.morphoBlueAddress],
    query: { enabled: !!userAddress },
  })
}

export function useRawCTFApproval(userAddress?: `0x${string}`) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.mockPolyMarketCTF,
    abi: mockPolyMarketCtfAbi,
    functionName: 'isApprovedForAll',
    args: [userAddress!, CONTRACT_ADDRESSES.recessionNoWrapper],
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
    console.log('CONTRACT_ADDRESSES.morphoBlueAddress:', CONTRACT_ADDRESSES.morphoBlueAddress)
    
    const emptyBytes = toHex('')
    console.log('emptyBytes value:', emptyBytes)
    
    const contractCall = {
      address: CONTRACT_ADDRESSES.morphoBlueAddress,
      abi: morphoBlueAbi,
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
      address: CONTRACT_ADDRESSES.morphoBlueAddress,
      abi: morphoBlueAbi,
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
  const assets = parseUnits(amount, TOKEN_DECIMALS.USDC);

  console.log("Borrow variables:");
  console.log("amount:", amount);
  console.log("assets (parsed amount):", assets.toString());
  console.log("userAddress:", userAddress);
  console.log("MARKET_PARAMS:", MARKET_PARAMS);

  writeContract({
    address: CONTRACT_ADDRESSES.morphoBlueAddress,
    abi: morphoBlueAbi,
    functionName: 'borrow',
    args: [
      MARKET_PARAMS,
      assets, 
      0n, 
      userAddress, 
      userAddress
    ],
  });
}

  const repay = (amount: string, userAddress: `0x${string}`) => {
    const assets = parseUnits(amount, TOKEN_DECIMALS.USDC)
    writeContract({
      address: CONTRACT_ADDRESSES.morphoBlueAddress,
      abi: morphoBlueAbi,
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
      address: CONTRACT_ADDRESSES.morphoBlueAddress,
      abi: morphoBlueAbi,
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
      address: CONTRACT_ADDRESSES.morphoBlueAddress,
      abi: morphoBlueAbi,
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
      address: CONTRACT_ADDRESSES.mockUsdc,
      abi: mockUsdcAbi,
      functionName: 'approve',
      args: [CONTRACT_ADDRESSES.morphoBlueAddress, value],
    })
  }

  const approveMaxUSDC = () => {
    writeContract({
      address: CONTRACT_ADDRESSES.mockUsdc,
      abi: mockUsdcAbi,
      functionName: 'approve',
      args: [CONTRACT_ADDRESSES.morphoBlueAddress, BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')],
    })
  }

  const approveCTF = (amount: string) => {
    const value = parseUnits(amount, TOKEN_DECIMALS.CTF_WRAPPER)
    writeContract({
      address: CONTRACT_ADDRESSES.recessionNoWrapper,
      abi: mockUsdcAbi,
      functionName: 'approve',
      args: [CONTRACT_ADDRESSES.morphoBlueAddress, value],
    })
  }

  const approveMaxCTF = () => {
    writeContract({
      address: CONTRACT_ADDRESSES.recessionNoWrapper,
      abi: mockUsdcAbi,
      functionName: 'approve',
      args: [CONTRACT_ADDRESSES.morphoBlueAddress, BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')],
    })
  }

  const approveRawCTF = () => {
    writeContract({
      address: CONTRACT_ADDRESSES.mockPolyMarketCTF,
      abi: mockPolyMarketCtfAbi,
      functionName: 'setApprovalForAll',
      args: [CONTRACT_ADDRESSES.recessionNoWrapper, true],
    })
  }

  const wrapCTF = (amount: string) => {
    const value = BigInt(amount) // ERC1155 tokens don't have decimals
    writeContract({
      address: CONTRACT_ADDRESSES.recessionNoWrapper,
      abi: ctfWrapperAbi,
      functionName: 'wrap',
      args: [value],
    })
  }

  const unwrapCTF = (amount: string) => {
    const value = BigInt(amount)
    writeContract({
      address: CONTRACT_ADDRESSES.recessionNoWrapper,
      abi: ctfWrapperAbi,
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
