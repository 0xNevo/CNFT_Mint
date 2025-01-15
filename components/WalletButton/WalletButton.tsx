import React from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import {
  useWallet,
  useConnection
} from '@solana/wallet-adapter-react';
import {
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import solBalanceContext from '@/contexts/solBalanceContext';
import inputContext from "@/contexts/inputContext";
import useTokenBalance from "@/contexts/solana/useTokenBalance";

export default function WalletButton() {
  const wallet = useWallet();
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const { currentToken } = React.useContext(inputContext);
  const { setWalletBalance } = React.useContext(solBalanceContext);

  React.useEffect(() => {

    if (connection && wallet && wallet.publicKey) {
      const getBalance = async () => {
        if (currentToken.symbol == "SOL") {
          const solBalance = await connection?.getBalance(wallet.publicKey);
          setWalletBalance(solBalance / LAMPORTS_PER_SOL);
        } else {
          const balance = await useTokenBalance(wallet, connection, currentToken.address)
          setWalletBalance(balance);
        }
      }
      getBalance();
    }
  }, [connection, publicKey, currentToken])

  return (
    <>
      <WalletMultiButton />
    </>
  )
}
