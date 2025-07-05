#!/bin/bash

echo "Verifying Web-UI setup with deployed contracts..."
echo "=============================================="

echo "📋 Contract Addresses:"
echo "  MOCK_USDC: 0xb1b52134f9cd0f3e84e5861bcb444d4df2a1ac80"
echo "  MOCK_ORACLE: 0x73acb25b42ec034083e6dcc5468c21be5d239598"  
echo "  POLYGON_CTF: 0xb76693414fd6eeab291cfa357b4a12a23130649a"
echo "  CTF_WRAPPER: 0x33eef5d955da603208dec0d710c7285ff4a4f379 (fixed)"
echo "  MORPHO_BLUE: 0x1bF0c2541F820E775182832f06c0B7Fc27A25f67"
echo "  MARKET_ID: 0x7642bad72f58650f4e1e106df3384574b7ab5606f68c2cf59a573d4735d5953b"

echo ""
echo "🪙 Token Information:"
echo "  RAW CTF Token ID: 67310324695548387399493871825869748760760185456703713607142904506781711187020"
echo "  Token Name: 'Recession NO token' (keccak256 hash)"
echo "  User Balance: 100 tokens (from deployment)"

echo ""
echo "🔗 Testing connections..."

# Test Mock USDC
echo -n "  Mock USDC deployment: "
cast code 0xb1b52134f9cd0f3e84e5861bcb444d4df2a1ac80 --rpc-url $POLYGON_RPC > /dev/null 2>&1 && echo "✅" || echo "❌"

# Test Mock Oracle
echo -n "  Mock Oracle deployment: "
cast code 0x73acb25b42ec034083e6dcc5468c21be5d239598 --rpc-url $POLYGON_RPC > /dev/null 2>&1 && echo "✅" || echo "❌"

# Test CTF Contract
echo -n "  Mock CTF deployment: "
cast code 0xb76693414fd6eeab291cfa357b4a12a23130649a --rpc-url $POLYGON_RPC > /dev/null 2>&1 && echo "✅" || echo "❌"

# Test CTF Wrapper
echo -n "  CTF Wrapper deployment: "
cast code 0x33eef5d955da603208dec0d710c7285ff4a4f379 --rpc-url $POLYGON_RPC > /dev/null 2>&1 && echo "✅" || echo "❌"

# Test Morpho Blue
echo -n "  Morpho Blue deployment: "
cast code 0x1bF0c2541F820E775182832f06c0B7Fc27A25f67 --rpc-url $POLYGON_RPC > /dev/null 2>&1 && echo "✅" || echo "❌"

echo ""
echo "📊 Expected Dashboard Data:"
echo "  RAW CTF Balance: 100 tokens"
echo "  Wrapped CTF Balance: 0 tokens (until user wraps)"
echo "  USDC Balance: 1,000,000 tokens (from MockUSDC mint)"
echo "  Oracle Price: 1.00 USDC per CTF (from deployment)"

echo ""
echo "🔄 Wrap/Unwrap Tab:"
echo "  Can wrap: Recession NO tokens (100 available)"
echo "  Needs approval: setApprovalForAll for CTF Wrapper"
echo "  After wrapping: ERC20 tokens usable in Morpho"

echo ""
echo "Setup verification complete!"