export const getPinataJWT = async () => {
    try {
        const response = await fetch('/api/fetchPinataJWT');
        const dataResponse = await response.json();
        return dataResponse.pinataJWT;
    } catch (error) {
        console.error('Error fetching the key:', error);
        return false;
    }
};