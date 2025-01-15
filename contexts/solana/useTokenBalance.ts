import { PublicKey, token } from "@metaplex-foundation/js";
import { getAssociatedTokenAddress } from "@solana/spl-token";
// import { publicKey } from "@project-serum/anchor/dist/cjs/utils";
import { useConnection, WalletContextState } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
import { useQueries, useQuery } from "@tanstack/react-query";

const useTokenBalance = async (wallet: WalletContextState, connection: Connection, uuid: string) => {
    const tokenBalance = await getTokenBalance(connection, wallet, uuid);
    if (tokenBalance) {
        return tokenBalance;
    } else {
        return 0;
    }
}

async function getTokenBalance(connection: Connection, wallet: WalletContextState, uuid: string) {

    try {
        const sourceAccount = await getAssociatedTokenAddress(
            new PublicKey(uuid),
            wallet.publicKey
        );
        const info = await connection.getTokenAccountBalance(sourceAccount);
        if (info.value.uiAmount == null) throw new Error('No balance found');

        const bal = info.value.uiAmount
        return bal;


        // // Fetch the token account balance
        // const tokenAccountAddress = await getTokenAddressToPing(connection, wallet, uuid)
        // const tokenAccountInfo = await connection.getTokenAccountBalance(tokenAccountAddress);

        // // Extract and return the token balance
        // const tokenBalance = tokenAccountInfo.value.uiAmount;
        // return tokenBalance;
    } catch (error) {
        // throw new Error();
        console.error(`Error fetching token balance: ${error}`);
    }
}


// async function getTokenAddressToPing(connection: Connection, wallet: WalletContextState, token: string) {
//     try {
//         // Fetch the token accounts associated with the walletc
//         const tokenMintAddress = new PublicKey(token)
//         const tokenAccounts = await connection.getTokenAccountsByOwner(wallet.publicKey, { mint: tokenMintAddress });

//         // Check if there are any token accounts
//         if (tokenAccounts.value.length > 0) {
//             // Return the first token account found (assuming there's only one for simplicity)
//             return tokenAccounts.value[0].pubkey;
//         } else {
//             throw new Error("No token account found for the specified wallet and token.");
//         }
//     } catch (error) {
//         throw new Error(`Error fetching token account: ${error}`);
//     }
// }


export default useTokenBalance;