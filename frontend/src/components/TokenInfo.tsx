export function TokenInfo() {
  return (
    <div
      className="rounded-lg border p-4"
      style={{
        borderColor: "var(--color-border-card)",
        backgroundColor: "var(--color-surface-card)",
      }}
    >
      <p className="text-sm font-medium text-gray-700">Token Info</p>
      <p className="text-xs text-gray-400 mt-1">Name, symbol, total supply</p>
    </div>
  );
}
