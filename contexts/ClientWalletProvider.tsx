import type { WalletProviderProps } from "@solana/wallet-adapter-react";

import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";

import { useMemo, ReactNode } from "react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from "@solana/web3.js";

require('@solana/wallet-adapter-react-ui/styles.css');





export function ClientWalletProvider({
  children,
}: {
  children: React.ReactNode
}) {

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <WalletProvider wallets={wallets} autoConnect>
      <WalletModalProvider >
        {children}
      </WalletModalProvider>
    </WalletProvider>
  );
}

export default ClientWalletProvider;
