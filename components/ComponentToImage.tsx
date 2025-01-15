import React, { useRef, useEffect } from 'react';
import ImageComponent from './ImageComponent';
import * as htmlToImage from 'html-to-image';
import { createAndMintToken } from '@/contexts/solana/transaction';
import inputContext from '@/contexts/inputContext';
import { Snackbar } from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'
import { AlertState } from '@/components/utils/misc';
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'

import {
    LAMPORTS_PER_SOL,
    PublicKey,
} from "@solana/web3.js";
import {
    useConnection,
    useWallet,
} from '@solana/wallet-adapter-react';
import { error } from 'console';
import { getPinataJWT } from './utils/getPinataJWT';


interface File {
    uri: string;
    type: string;
}

interface Properties {
    files: File[];
    category: string;
}

interface NFT {
    name: string;
    symbol: string;
    description: string;
    external_url: string;
    seller_fee_basis_points: number;
    image: string;
    properties: Properties;
    attributes: any;
}
const ComponentToImage = ({ onCapture, onButtonClick, setIsLoading }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const componentRef = useRef<HTMLDivElement>(null);
    const [isConfetti, setIsConfetti] = React.useState(false);
    const { width, height } = useWindowSize()
    const { connection } = useConnection();
    const [alertState, setAlertState] = React.useState<AlertState>({
        open: false,
        message: '',
        severity: undefined,
    })
    const { receiverAddress, solTransferAmount, textColor, setTextColor, setNewImage, currentToken, messageText } = React.useContext(inputContext);

    const wallet = useWallet();
    // Convert File to IPFS
    async function pinFileToIPFS(blob) {
        try {
            const data = new FormData();
            data.append("file", blob);
            const JWT = await getPinataJWT();
            const res = await fetch("");
            const resData = await res.json();
            return resData;
        } catch (error) {
            console.log(error);
        }
    };
    // Upload JSON to Pinata
    const uploadJsonToPinata = async (jsonData: NFT) => {
        try {
            const response = await fetch("");
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();
            return data.IpfsHash;
        } catch (error) {
            console.error('Error uploading JSON to Pinata:', error);
            throw error;
        }
    };
    const convertToBlob = async (element) => {
        if (!element) return;  // Make sure the element is not null 
        try {
            htmlToImage.toPng(element, { canvasHeight: 400, canvasWidth: 400 })
                .then(async (dataUrl) => {
                    const res = await fetch(dataUrl);
                    const blob = await res.blob();

                    const imageFile = new File([blob], 'image.png', { type: 'image/png' });

                    const resData = await pinFileToIPFS(imageFile);
                    
                    if (resData.IpfsHash) {
                        const imgUrl = ``;
                        const uriHash = await uploadJsonToPinata({
                            "name": "Message",
                            "symbol": "MS",
                            "description": "",
                            "external_url": "",
                            "seller_fee_basis_points": 55,
                            "image": imgUrl,
                            "properties": {
                                "files": [
                                    {
                                        "uri": imgUrl,
                                        "type": "image/png"
                                    }
                                ],
                                "category": "image"
                            },
                            "attributes": {
                                "Message Content": messageText,
                                "Transfer Token Amount": solTransferAmount,
                                "Transfer Token Type": currentToken.symbol
                            }
                        })
                        const receiverPublicKey = new PublicKey(receiverAddress);
                        let hashResult;
                        try {
                            if (currentToken.symbol == 'SOL') {
                                hashResult = await createAndMintToken(wallet, receiverPublicKey, parseFloat(solTransferAmount) * LAMPORTS_PER_SOL, uriHash, connection, wallet.publicKey, true);
                            } else {
                                const tokenMint = new PublicKey(currentToken.address);
                                hashResult = await createAndMintToken(wallet, receiverPublicKey, parseFloat(solTransferAmount), uriHash, connection, wallet.publicKey, false, tokenMint, currentToken.decimals);
                            }
                            if (hashResult) {
                                setAlertState({
                                    open: true,
                                    message: 'Successfully Sent!',
                                    severity: 'success',
                                });
                                setIsLoading(false);
                                setIsConfetti(true);
                                setTimeout(() => {
                                    setIsConfetti(false);
                                }, 10000);
                            } else {
                                setAlertState({
                                    open: true,
                                    message: 'Failed',
                                    severity: 'error',
                                });
                                setIsLoading(false);
                            }
                        } catch (error) {
                            setAlertState({
                                open: true,
                                message: 'Failed',
                                severity: 'error',
                            });
                            setIsLoading(false);
                            console.error(error, 'error>>>');
                            return;
                        }

                    } else {
                        setAlertState({
                            open: true,
                            message: 'Failed',
                            severity: 'error',
                        })
                        setIsLoading(false);
                    }
                })
                .catch((error) => {
                    console.error(error, "toPNG error");
                })
        } catch (error) {
            console.error("Error capturing image as blob:", error);
            return '';
        }
    }
    const captureComponent = async () => {
        if (componentRef.current) {
            await convertToBlob(componentRef.current);
            onButtonClick(false);
        }
    };

    useEffect(() => {
        if (onCapture) {
            captureComponent();
        }

    }, [onCapture]);

    const handleBig = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const imageUrls = Object.values(files).map((file) => URL.createObjectURL(file));
            setNewImage(imageUrls[0]);
        }
    };

    return (
        <div className='w-full flex flex-col gap-5'>
            <div className='w-full' ref={componentRef}>
                <ImageComponent />
            </div>
            <div className='w-full grid grid-cols-2 gap-4'>
                <div className='w-full'>
                    <button
                        className='hover:bg-[#f5c835a5] bg-[#f5c835] border-[2px] border-[#f562358b] hover:border-[#f562353b] duration-500 text-[#f56235d2] w-full rounded-full text-2xl font-semibold text-white py-1 text-[white]'
                        onClick={handleBig}
                    >
                        Upload New Image
                    </button>
                    <input type='file' accept='image/*' onChange={handleFileChange} className='opacity-0 min-h-full min-w-full' ref={fileInputRef} style={{ display: 'none' }} />
                </div>
                <input
                    type="color"
                    className="w-full opacity-1 cursor-pointer p-0"
                    value={textColor}
                    onChange={(e) => { setTextColor(e.target.value) }}
                    style={{ backgroundColor: 'transparent', border: '2px solid #f562358b', height: '100%', borderRadius: '120px', overflow: 'hidden', padding: '6px', paddingLeft: '10px', paddingRight: '10px' }}
                />
            </div>
            {
                isConfetti && 
                <Confetti
                    width={width}
                    height={height}
                    gravity={0.4}
                />}
            <Snackbar
                open={alertState.open}
                autoHideDuration={6000}
                onClose={() => setAlertState({ ...alertState, open: false })}
            >
                <Alert
                    onClose={() => setAlertState({ ...alertState, open: false })}
                    severity={alertState.severity}
                    className='text-[red]'
                >
                    {alertState.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default ComponentToImage;
