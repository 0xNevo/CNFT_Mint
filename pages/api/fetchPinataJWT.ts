export default async function handler(req, res) {
    const pinataJWT = process.env.PINATA_JWT;
    // Your logic using the environment variables
    res.status(200).json({ pinataJWT });
  }