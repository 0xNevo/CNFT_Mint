import React from 'react';

const solBalanceContext = React.createContext({
    walletBalance: 0,
    setWalletBalance: (value: number) => {}
});

export default solBalanceContext;