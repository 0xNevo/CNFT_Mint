// pages/api/uploadToIPFS.js
import { getPinataJWT } from '@/components/utils/getPinataJWT';
import axios from 'axios';
import FormData from 'form-data';
import { parse } from 'url';

export default async function handler(req, res) {
  // This API endpoint expects a POST request with a file
  if (req.method !== 'POST') {
    return res.status(405).json({error: 'Method not allowed'});
  }

  try {
    // Setting up the form data
    const formData = new FormData();
    formData.append("file", req.file); // Assuming 'file' is passed via form-data in request
    const pinataMetadata = JSON.stringify({
      name: "File name", // Example metadata
    });
    formData.append("pinataMetadata", pinataMetadata);
    const pinataOptions = JSON.stringify({
      cidVersion: 1, // Example option
    });
    formData.append("pinataOptions", pinataOptions);

    const JWT = await getPinataJWT();
    // Axios POST request to Pinata
    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      formData,
      {
        headers: {
          'Authorization': `Bearer ${JWT}`,
          ...formData.getHeaders(),
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    res.status(500).json({error: 'Failed to upload to IPFS'});
  }
}
