import { useState, useEffect } from "react";
import { BrowserProvider } from "ethers";

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);

  // Subscribe to MetaMask events on mount so the app stays in sync
  // if the user switches accounts or networks while the tab is open.
  // Without this, address and provider go stale - transactions may go
  // to the wrong account or chain.
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (...args: unknown[]) => {
      const accounts = args[0] as string[];
      const addr = accounts[0];
      setAddress(addr ?? null);

      // All accounts disconnected - clear provider so read calls stop working
      // rather than silently operating on stale signer.
      if (!addr) setProvider(null);
    };

    const handleChainChanged = () => {
      // MetaMask's own guidance: reload on chain change. The BrowserProvider is
      // bound to the chain at construction time - reusing it after a chain switch
      // causes silent RPC failures.
      window.location.reload();
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum?.removeListener("chainChanged", handleChainChanged);
    };
  }, []);

  async function connect() {
    if (!window.ethereum) {
      alert("MetaMask not installed - get it at metamask.io");
      return;
    }

    try {
      const p = new BrowserProvider(window.ethereum);
      const accounts = (await p.send("eth_requestAccounts", [])) as string[];

      // guard the empty accounts before indexing [0].
      // MetaMask can return [] when the user has no accounts configured.
      if (!accounts.length) {
        alert("No accounts found. Unlock MetaMask and try again.");
        return;
      }

      setProvider(p);
      setAddress(accounts[0]);
    } catch (e: unknown) {
      const err = e as { code?: number };

      // Error 4001 means the user clicked Reject in MetaMask.
      // Treat it as a user cancel - no crash, no feedback beyond teh closed popup.
      if (err.code === 4001) return;
      throw e;
    }
  }

  async function switchToSepolia() {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xaa36a7" }], // Sepolia chain ID
      });
    } catch (e: unknown) {
      const err = e as { code?: number };

      // Error 4902 means Sepolia is not yet in the user's MetaMask.
      // wallet_addEthereumChain registers it so the switch can succeed.
      // Without this fallback, the switch silently fails and the user stays on
      // the wrong network with no feedback.
      if (err.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0xaa36a7",
              chainName: "Sepolia",
              nativeCurrency: {
                name: "SepoliaETH",
                symbol: "ETH",
                decimals: 18,
              },
              rpcUrls: ["https://rpc.sepolia.org"],
              blockExplorerUrls: ["https://sepolia.etherscan.io"],
            },
          ],
        });
      }
    }
  }

  return { address, provider, connect, switchToSepolia };
}
