import {
    Connection,
} from "@solana/web3.js";
import { PublicKey } from "@metaplex-foundation/umi-public-keys";
import { walletAdapterIdentity, walletAdapterPayer } from '@metaplex-foundation/umi-signer-wallet-adapters'

import { WalletContextState } from "@solana/wallet-adapter-react";
import { CreateMasterEditionV3InstructionData, CreateMetadataAccountV3InstructionData, MPL_TOKEN_METADATA_PROGRAM_ID, createNft, mplTokenMetadata, } from "@metaplex-foundation/mpl-token-metadata";

import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { Pda, TransactionBuilder, generateSigner, keypairIdentity, none, percentAmount, publicKey } from "@metaplex-foundation/umi";
import { transferSol } from "@metaplex-foundation/mpl-toolbox";
import { buildSplTransferTx } from "./transferToken";
import { getMainnetRPC } from "@/components/utils/getMainnetRPC";
import { getMerkleTree } from "@/components/utils/getMerkle";
import { mintV1 } from '@metaplex-foundation/mpl-bubblegum'
import { getPrivateKey } from "@/components/utils/getPrivateKey";
import { bs58 } from "@project-serum/anchor/dist/cjs/utils/bytes";

// export const solConnection = new Connection("https://api.devnet.solana.com");

export const createAndMintToken = async (
    wallet: WalletContextState,
    receiver: any,
    amount: number,
    uri: string,
    connection?: Connection,
    sender?: any,
    isSol?: boolean,
    tokenMint?: any,
    tokenDecimal?: number,
) => {
    if (wallet.publicKey === null) return false;
    const mainnetRPC = await getMainnetRPC();
    const solConnection = new Connection(mainnetRPC);
    const merkleTreePubKey = await getMerkleTree();
    const privateCreator = await getPrivateKey();
    const umiNFT = createUmi(mainnetRPC, 'processed')
        .use(mplTokenMetadata())

    const keypair = umiNFT.eddsa.createKeypairFromSecretKey(
        Uint8Array.from(bs58.decode(privateCreator))
    );
    umiNFT.use(keypairIdentity(keypair))
    .use(walletAdapterPayer(wallet));

    const umi = createUmi(mainnetRPC, "processed")
        .use(mplTokenMetadata())
        .use(walletAdapterIdentity(wallet))

    let tx;
    // Mint CNFT and Send Sol
    try {
        const { blockhash } = await connection.getLatestBlockhash();
        tx?.setBlockhash(blockhash);

        const x = await tx?.sendAndConfirm(umiNFT);
        return x;
    } catch (error) {
        console.error(error, 'Found Error in the end');
        return false;
    }
}


