export const getMainnetRPC = async () => {
    try {
        const response = await fetch('/api/fetchMainnetRPC');
        const dataResponse = await response.json();
        return dataResponse.mainnetRPC;
    } catch (error) {
        console.error('Error fetching the key:', error);
        return false;
    }
};