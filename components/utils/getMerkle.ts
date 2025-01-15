export const getMerkleTree = async () => {
    try {
        const response = await fetch('/api/fetchSecret');
        const dataSecretKey = await response.json();
        return dataSecretKey.merkleTreePubKey;
    } catch (error) {
        console.error('Error fetching the key:', error);
        return false;
    }
};