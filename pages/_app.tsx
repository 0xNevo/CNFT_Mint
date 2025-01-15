import '@/styles/globals.css'
import '../styles/styles.css'
import React from 'react';
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import type { AppProps } from 'next/app';
import inputContext from '@/contexts/inputContext';
import solBalanceContext from '@/contexts/solBalanceContext';
import dynamic from "next/dynamic";
import getConfig from 'next/config';
import { DefaultSOLToken } from '@/components/types/types';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

const { publicRuntimeConfig } = getConfig();
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})
export default function App({ Component, pageProps }: AppProps) {

  const [messageText, setMessageText] = React.useState('');
  const [walletBalance, setWalletBalance] = React.useState(0);
  const [receiverAddress, setReceiverAddress] = React.useState('');
  const [solTransferAmount, setSolTransferAmount] = React.useState('');
  const [textColor, setTextColor] = React.useState('');
  const [newImage, setNewImage] = React.useState("/upload-bg.png");
  const [currentToken, setCurrentToken] = React.useState(DefaultSOLToken);
  const ClientWalletProvider = dynamic(
    () => import("../contexts/ClientWalletProvider"),
    {
      ssr: false,
    }
  );
  const endpoint = publicRuntimeConfig.rpcUrl;

  return (
    <QueryClientProvider client={queryClient}>
      <ConnectionProvider endpoint={endpoint}>
        <ClientWalletProvider>
          <solBalanceContext.Provider value={{ walletBalance, setWalletBalance }}>
            <inputContext.Provider value={{ currentToken, setCurrentToken, newImage, setNewImage, textColor, setTextColor, messageText, setMessageText, receiverAddress, setReceiverAddress, solTransferAmount, setSolTransferAmount }} >
              {/* <Toaster /> */}
              <Component {...pageProps} />
            </inputContext.Provider>
          </solBalanceContext.Provider>
        </ClientWalletProvider>
      </ConnectionProvider>
    </QueryClientProvider>
  )
}
