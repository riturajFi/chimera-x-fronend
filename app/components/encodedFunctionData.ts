//Encoded Withdraw Data

import { encodeFunctionData } from "viem";
import { _4POOL_DEPOSIT_ABI } from "../constants/4pool_deposit_abi";
import { USDC_BASE_CONTRACT_ABI } from "../constants/USDC_base_abi";

const _4poolWinthdrawABI = [
  {
    stateMutability: "nonpayable",
    type: "function",
    name: "remove_liquidity_one_coin",
    inputs: [
      { name: "_burn_amount", type: "uint256" },
      { name: "i", type: "int128" },
      { name: "_min_received", type: "uint256" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
];

const _burn_amount = BigInt("2521159640395019"); // 0.045 ETH in wei
const i = 0; // Index of the token
const _min_received = BigInt(2557); // Minimum tokens received

export const encodedWithdrawData = encodeFunctionData({
  abi: _4poolWinthdrawABI,
  functionName: "remove_liquidity_one_coin",
  args: [_burn_amount, i, _min_received],
});

const spender = "0xf6C5F01C7F3148891ad0e19DF78743D31E390D1f";
const value = BigInt(
  "115792089237316195423570985008687907853269984665640564039457584007913129639935"
);

export const encodedApproveSpenderData = encodeFunctionData({
  abi: USDC_BASE_CONTRACT_ABI,
  functionName: "approve",
  args: [spender, value],
});

const spender1 = "0x5244b38c272b1fa6Dc22034608903eA4EeBC7C2f";
const value1 = BigInt(
  "115792089237316195423570985008687907853269984665640564039457584007913129639935"
);

export const encodedApproveAiToSpendUSDCData = encodeFunctionData({
  abi: USDC_BASE_CONTRACT_ABI,
  functionName: "approve",
  args: [spender1, value],
});

const _amounts = [BigInt(50000), BigInt(0), BigInt(0), BigInt(0)];
const _min_mint_amount = BigInt("49242745402084618");

export const encodedAddLiquidity4PoolData = encodeFunctionData({
  abi: _4POOL_DEPOSIT_ABI,
  functionName: "add_liquidity",
  args: [_amounts, _min_mint_amount],
});


