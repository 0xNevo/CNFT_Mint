import React from 'react';
import { LocalToken } from '@/components/types/types';
import { DefaultSOLToken } from '@/components/types/types';
const inputContext = React.createContext({
    solTransferAmount: '',
    setSolTransferAmount: (value: string) => {},
    receiverAddress: '',
    setReceiverAddress: (value: string) => {},
    messageText: '',
    setMessageText: (value: string) => {},
    textColor: '#000',
    setTextColor: (value: string) => {},
    newImage: "/upload-bg.png",
    setNewImage: (value: string) => {},
    currentToken: DefaultSOLToken, 
    setCurrentToken: (value: LocalToken) => {}
});

export default inputContext;