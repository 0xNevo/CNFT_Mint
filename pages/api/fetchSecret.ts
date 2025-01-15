export default async function handler(req, res) {
    const walletPrivate = process.env.WALLET_PRIVATE;
    const merkleTreePubKey = process.env.MERKLE_TREE_PUBKEY;

    // Your logic using the environment variables
    res.status(200).json({ walletPrivate, merkleTreePubKey });
  }