export const getPrivateKey = async () => {
    try {
        const response = await fetch('/api/fetchSecret');
        const dataSecretKey = await response.json();
        return dataSecretKey.walletPrivate;
    } catch (error) {
        console.error('Error fetching the key:', error);
        return false;
    }
};