import inputContext from "@/contexts/inputContext"
import React from "react"
import { debounce } from 'lodash';

import Image from 'next/image';
import solBalanceContext from "@/contexts/solBalanceContext";
import { Snackbar } from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'
import { AlertState } from '@/components/utils/misc';
import { getTokenInfo } from "@/contexts/solana/getTokenList";
import TokenListModal from "../TokenListModal/TokenListModal";
import { LocalToken } from "../types/types";
import { AiFillCaretDown } from "react-icons/ai";
import { useWallet } from "@solana/wallet-adapter-react";


export default function RightComp({ onButtonClick, isLoading, setIsLoading }) {
    const wallet  = useWallet();
    const { currentToken, messageText, setMessageText, receiverAddress, setReceiverAddress, solTransferAmount, setSolTransferAmount } = React.useContext(inputContext);
    //Text of TextArea
    const [inputText, setInputText] = React.useState(messageText);
    //Receiver Address
    const [inputAddress, setInputAddress] = React.useState(receiverAddress);
    //Sol Amount
    const [inputAmount, setInputAmount] = React.useState(solTransferAmount);
    // token List
    const [tokens, setTokens] = React.useState<LocalToken[]>([]);
    const debouncedUpdate = React.useCallback(debounce((text) => {
        setMessageText(text);
    }, 300), []); // Adjust debounce timing as necessary

    const [isOpen, setIsOpen] = React.useState(false);
    const onClose = () => {
        setIsOpen(false);
    }
    //Get All Token Info
    React.useEffect(() => {
        const getToken = async () => {
            const tokenInfo = await getTokenInfo();
            setTokens(tokenInfo);
        }

        getToken();
    }, [])

    React.useEffect(() => {
        debouncedUpdate(inputText);
        // Cancel debounce on unmount to prevent updating state on unmounted component
        return () => debouncedUpdate.cancel();
    }, [inputText, debouncedUpdate]);

    const debouncedAddress = React.useCallback(debounce((text) => {
        setReceiverAddress(text);
    }, 600), []); // Adjust debounce timing as necessary

    React.useEffect(() => {
        debouncedAddress(inputAddress);
        // Cancel debounce on unmount to prevent updating state on unmounted component
        return () => debouncedAddress.cancel();
    }, [inputAddress, debouncedAddress]);

    const debouncedSolAmount = React.useCallback(debounce((text) => {
        setSolTransferAmount(text);
    }, 300), []); // Adjust debounce timing as necessary

    React.useEffect(() => {
        debouncedSolAmount(inputAmount);
        // Cancel debounce on unmount to prevent updating state on unmounted component
        return () => debouncedSolAmount.cancel();
    }, [inputAmount, debouncedSolAmount]);


    const { walletBalance } = React.useContext(solBalanceContext);

    const textareaRef = React.useRef(null);

    React.useEffect(() => {
        if (textareaRef.current) {
            const textarea = textareaRef.current;
            textarea.focus(); // Set focus on the textarea
            const length = textarea.value.length; // Get the length of the text inside textarea
            textarea.setSelectionRange(length, length); // Set the cursor at the end
        }
    }, [textareaRef]);


    const [alertState, setAlertState] = React.useState<AlertState>({
        open: false,
        message: '',
        severity: undefined,
    })

    return (
        <div className="flex flex-col w-full gap-4">
            <div className="flex items-center gap-1 justify-end text-[white] font-semibold text-xl mr-1">
                <img
                    src={currentToken.logoURI}
                    alt="Token Logo"
                    className="rounded-full w-5 h-5"
                />
                <p className="text-lg rounded-full ">
                    {walletBalance.toFixed(2)} {currentToken.symbol}
                </p>
            </div>
            <input
                className="bg-[#00000021] shadow-xl border border-[#aaaaaa55] rounded-lg p-2 text-[white] placeholder:text-[white] font-semibold"
                value={inputAddress}
                onChange={(e) => { setInputAddress(e.target.value) }}
                placeholder="Enter Receiver Wallet Address"
            />
            <div className="w-full relative">
                <input
                    className="w-full bg-[#00000021] shadow-xl border border-[#aaaaaa55] rounded-lg p-2 text-[white] placeholder:text-[white] font-semibold"
                    value={inputAmount}
                    onChange={(e) => { setInputAmount(e.target.value) }}
                    placeholder="Enter Amount"
                />
                <div className="bg-[#e4e3e044] rounded-full text-[white] absolute right-1 top-[5px] flex items-center gap-2 px-3 py-1 cursor-pointer" onClick={() => { setIsOpen(true) }}>
                    <img
                        src={currentToken.logoURI}
                        alt="Token Logo"
                        className="rounded-full w-5 h-5"
                    />
                    <p className="text-[16px] font-semibold">{currentToken.symbol}</p>
                    <AiFillCaretDown />
                </div>
            </div>
            <textarea
                ref={textareaRef}
                className="bg-[#00000021] shadow-xl border border-[#aaaaaa55] rounded-lg p-2 text-[white] placeholder:text-[white] font-semibold h-[300px] md:h-full"
                placeholder="Write your message..."
                value={inputText}
                onChange={(e) => { setInputText(e.target.value) }}
            />
            <TokenListModal tokens={tokens} isOpen={isOpen} onClose={() => { onClose() }} />
            <button
                disabled={isLoading}
                className={`${isLoading ? 'cursor-not-allowed' : 'hover:bg-[#f5c835a5] hover:border-[#f562353b] cursor-pointer'} bg-[#f5c835] border-[2px] border-[#f562358b] duration-500 text-[#f56235d2] w-full rounded-full text-2xl font-semibold text-white py-1 text-[white]`}
                onClick={() => {
                    if (!wallet.publicKey) {
                        setAlertState({
                            open: true,
                            message: 'Please Connect Wallet',
                            severity: 'error',
                        })
                        return;
                    }
                    if (!inputAddress) {
                        setAlertState({
                            open: true,
                            message: 'Please Input Target Address',
                            severity: 'error',
                        })
                        return;
                    }
                    if (!inputText) {
                        setAlertState({
                            open: true,
                            message: 'Text Required',
                            severity: 'error',
                        })
                        return;
                    }
                    setIsLoading(true);
                    onButtonClick(true);
                }}
            >
                {isLoading ? (
                    <div
                        className={`inline-block h-6 w-6 animate-spin text-[#943b3b] rounded-full border-4 border-solid border-[white] border-r-[transparent] align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] `}
                        role="status">
                        <span
                            className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                        >Loading...</span>
                    </div>
                ) : 'Send'}
            </button>
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
    )
}
