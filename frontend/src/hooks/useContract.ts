// Stub - compiles and satisfies imports.
// null guards, validation, tx timeout, balance events are deferred.
import { Contract, formatEther } from "ethers";
import type { BrowserProvider } from "ethers";
import { CONTRACT_ADRESS, ABI } from "@/lib/contract";

export function useContract(provider: BrowserProvider | null) {
  const readContract = provider
    ? new Contract(CONTRACT_ADRESS, ABI, provider)
    : null;

  async function getBalance(address: string): Promise<string> {
    if (!readContract) return "0";
    const raw = await readContract.balanceOf(address);
    return formatEther(raw as bigint);
  }

  return { getBalance };
}
