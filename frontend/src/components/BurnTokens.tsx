export function BurnTokens() {
  return (
    <div
      className="rounded-lg border p-4"
      style={{
        borderColor: "var(--color-border-card)",
        backgroundColor: "var(--color-surface-card)",
      }}
    >
      <p className="text-sm font-medium text-gray-700">Burn Tokens</p>
      <p className="text-xs text-gray-400 mt-1">Destroy your MAI</p>
    </div>
  );
}
