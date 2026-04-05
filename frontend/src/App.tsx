import { useWallet } from "./hooks/useWallet";
import { Balance } from "./components/Balance";
import { BurnTokens } from "./components/BurnTokens";
import { ConnectWallet } from "./components/ConnectWallet";
import { MintTokens } from "./components/MintTokens";
import { SendTokens } from "./components/SendTokens";
import { TokenInfo } from "./components/TokenInfo";

function App() {
  const { address, connect, switchToSepolia } = useWallet();

  return (
    <div
      className="min-h-screen py-8"
      style={{ backgroundColor: "var(--color-surface-page)" }}
    >
      <header className="max-w-xl mx-auto px-4 flex items-center justify-between mb-8">
        <h1
          className="text-xl font-bold"
          style={{ color: "var(--color-mai-gold)" }}
        >
          MaiCoin
        </h1>
        <ConnectWallet
          address={address}
          onConnect={connect}
          onSwitchNetwork={switchToSepolia}
        />
      </header>

      <main className="max-w-xl mx-auto px-4 space-y-4">
        <TokenInfo />
        <Balance address={address} />
        <SendTokens />
        <MintTokens />
        <BurnTokens />
      </main>
    </div>
  );
}

export default App;
