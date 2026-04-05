interface Props {
  address: string | null;
  onConnect: () => void;
  onSwitchNetwork: () => void;
}

export function ConnectWallet({ address, onConnect, onSwitchNetwork }: Props) {
  if (address) {
    return (
      <div className="flex items-center gap-2">
        <span
          className="inline-block w-2 h-2 rounded-full"
          style={{ backgroundColor: "var(--color-wallet-on)" }}
        />
        <span
          className="font-mono text-sm px-2 py-0 5 rounded"
          style={{
            color: "var(--color-address-text)",
            backgroundColor: "var(--color-address-bg)",
          }}
        >
          {address.slice(0, 6)} ... {address.slice(-4)}
        </span>
        <button
          onClick={onSwitchNetwork}
          className="text-xs underline text-gray-500"
        >
          Switch to Sepolia
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={onConnect}
      className="px-4 py-2 rounded text-white font-semibold text-sm"
      style={{ backgroundColor: "var(--color-mai-leaf)" }}
    >
      Connect Wallet
    </button>
  );
}
