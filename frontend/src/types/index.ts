// Ambient declaration for MetaMask's injected provider.
// Extends ethers' Eip1193Provider (which only has `request`) to add the
// event listener API that MetaMask exposes. This avoids importing the full
// @metamask/providers package (~300KB) for a type we only use 4 methods on.
import type { Eip1193Provider } from "ethers";

interface EthereumProvider extends Eip1193Provider {
  on: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener: (
    event: string,
    handler: (...args: unknown[]) => void,
  ) => void;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

// export {} makes TypeScript treat this as a module, which is required for
// global augmentation to work when the file has no other exports.
export {};
