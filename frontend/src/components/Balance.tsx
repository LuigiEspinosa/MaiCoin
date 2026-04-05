interface Props {
  address: string | null;
}

export function Balance({ address }: Props) {
  return (
    <div
      className="rounded-lg border p-4"
      style={{
        borderColor: "var(--color-border-card)",
        backgroundColor: "var(--color-surface-card)",
      }}
    >
      <p className="text-sm font-medium text-gray-700">Balance</p>
      <p className="text-xs text-gray-400 mt-1">
        {address
          ? `MAI balance for ${address.slice(0, 6)}...`
          : "Connect wallet to see balance"}
      </p>
    </div>
  );
}
