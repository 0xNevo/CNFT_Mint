import { LocalToken } from '@/components/types/types';
import axios from 'axios';

export const getTokenInfo = async () => {
    const response = await axios.get("https://cache.jup.ag/all-tokens");
    const tokensData: LocalToken[] = response.data;
    return tokensData;
  };