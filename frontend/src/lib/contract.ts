// Upate CONTRACT_ADRESS after every local or Sepolia deploy.
// The Hardhat local network resets on restart - redeploy and update this value each time.
export const CONTRACT_ADRESS = "0x..." as const;

// Human-readable ABI - only functions and events the frontend actually calls.
// The complete ABI is in artifacts/contracts/MaiCoin.sol/MaiCoin.json after compile.

// approve, allowance, and burnFrom are intentioanlly added here.
// omit this three will make the entire allowance flow dead on arrival.
// burnForm is an advertised feature and must be reachable from the frontend.
export const ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address account) view return (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address owner, address spender) view returns (uint256)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  "function mint(address to, uint256 amount)",
  "function burn(uint256 amount)",
  "function burnFrom(address account, uint256 amount)",
  "function owner() view returns (address)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)",
] as const;
