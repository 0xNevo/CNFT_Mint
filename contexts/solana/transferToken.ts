import { SystemProgram, PublicKey, SYSVAR_RENT_PUBKEY, TransactionInstruction, Connection } from "@solana/web3.js";
import axios from 'axios'
import {
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
    createTransferCheckedInstruction,
    getAssociatedTokenAddress,
    createTransferInstruction,
} from "@solana/spl-token";
import { Keypair } from '@solana/web3.js';
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes';
import { WalletContextState } from "@solana/wallet-adapter-react";
import { BN, web3 } from "@project-serum/anchor";
import { simulateTransaction } from "@project-serum/anchor/dist/cjs/utils/rpc";

export const getAssociatedTokenAccount = (ownerPubkey: PublicKey, mintPk: PublicKey): PublicKey => {

    const associatedTokenAccountPubkey = (PublicKey.findProgramAddressSync(
        [
            ownerPubkey.toBuffer(),
            TOKEN_PROGRAM_ID.toBuffer(),
            mintPk.toBuffer(), // mint address
        ],

        ASSOCIATED_TOKEN_PROGRAM_ID
    ))[0];
    return associatedTokenAccountPubkey;
};

export const createAssociatedTokenAccountInstruction = (
    associatedTokenAddress: PublicKey,
    payer: PublicKey,
    walletAddress: PublicKey,
    splTokenMintAddress: PublicKey
) => {

    const keys = [
        { pubkey: payer, isSigner: true, isWritable: true },
        { pubkey: associatedTokenAddress, isSigner: false, isWritable: true },
        { pubkey: walletAddress, isSigner: false, isWritable: false },
        { pubkey: splTokenMintAddress, isSigner: false, isWritable: false },
        {
            pubkey: SystemProgram.programId,
            isSigner: false,
            isWritable: false,
        },
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        {
            pubkey: SYSVAR_RENT_PUBKEY,
            isSigner: false,
            isWritable: false,
        },
    ];
    return new TransactionInstruction({
        keys,
        programId: ASSOCIATED_TOKEN_PROGRAM_ID,
        data: Buffer.from([]),
    });
};

export const getATokenAccountsNeedCreate = async (
    connection: Connection,
    walletAddress: PublicKey,
    owner: PublicKey,
    nfts: PublicKey[],
) => {
    const instructions = []; const destinationAccounts = [];
    for (const mint of nfts) {
        const destinationPubkey = getAssociatedTokenAccount(owner, mint);
        let response = await connection.getAccountInfo(destinationPubkey);
        if (!response) {
            const createATAIx = createAssociatedTokenAccountInstruction(
                destinationPubkey,
                walletAddress,
                owner,
                mint,
            );
            instructions.push(createATAIx);
        }
        destinationAccounts.push(destinationPubkey);
        if (walletAddress != owner) {
            const userAccount = getAssociatedTokenAccount(walletAddress, mint);
            response = await connection.getAccountInfo(userAccount);
            if (!response) {
                const createATAIx = createAssociatedTokenAccountInstruction(
                    userAccount,
                    walletAddress,
                    walletAddress,
                    mint,
                );
                instructions.push(createATAIx);
            }
        }
    }
    return {
        instructions,
        destinationAccounts,
    };
};


export const buildSplTransferTx = async (
    connection: Connection, sender: PublicKey, tokenMint: PublicKey, tokenDecimal: number, receiver: PublicKey, amount: number, wallet: WalletContextState
) => {
    const senderTokenAccount = await getAssociatedTokenAddress(tokenMint, wallet.publicKey)
    const recieverTokenAccount = await getAssociatedTokenAddress(tokenMint, receiver)
    const transaction = new web3.Transaction()
    if ((await connection.getAccountInfo(recieverTokenAccount)) == null) {
        transaction.add(createAssociatedTokenAccountInstruction(
            recieverTokenAccount, wallet.publicKey, receiver, tokenMint
        ))
    }

    transaction.add(
        createTransferInstruction(
            senderTokenAccount,
            recieverTokenAccount,
            wallet.publicKey,
            amount * Math.pow(10, tokenDecimal)
        )
    )
    try {
        const blockhash = await connection.getLatestBlockhash();
        if (!wallet || !wallet.publicKey || !wallet.signTransaction)
            return null;
        transaction.feePayer = wallet.publicKey;
        transaction.recentBlockhash = blockhash.blockhash;

        const signedTx = await wallet.signTransaction(transaction);

        console.log(await simulateTransaction(connection, signedTx))
        const signature = await connection.sendRawTransaction(signedTx.serialize());
        await connection.confirmTransaction(signature)
        console.log(`Transaction success: https://explorer.solana.com/tx/${signature}`)
        return signature;
    } catch (error) {
        console.log("Error happened in sending transaction")
        return false
    }
}