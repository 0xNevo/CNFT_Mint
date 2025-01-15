export default async function handler(req, res) {
    const mainnetRPC = process.env.MAINNET_RPC;
    // Your logic using the environment variables
    res.status(200).json({ mainnetRPC });
}