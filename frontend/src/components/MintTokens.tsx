export function MintTokens() {
  return (
    <div
      className="rounded-lg border p-4"
      style={{
        borderColor: "var(--color-owner-border)",
        backgroundColor: "var(--color-surface-owner)",
      }}
    >
      <span
        className="text-xs font-semibold px-2 py-0.5 rounded"
        style={{
          backgroundColor: "var(--color-owner-badge-bg)",
          color: "var(--color-owner-badge-text)",
        }}
      >
        Owner only
      </span>
      <p className="text-sm font-medium text-gray-700">Mint Tokens</p>
      <p className="text-xs text-gray-400 mt-1">Create new MAI</p>
    </div>
  );
}
