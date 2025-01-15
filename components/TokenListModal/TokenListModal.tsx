
import "react-responsive-modal/styles.css";
import Modal from 'react-responsive-modal'
import { useState, useEffect, useContext } from 'react';
import { LocalToken } from '@/components/types/types';
import styles from './TokenListModal.module.css';
import Image from "next/image";
import { shortenAddress } from "../utils/shortenAddress";
import inputContext from "@/contexts/inputContext";

interface Props {
    tokens: LocalToken[],
    isOpen: boolean,
    onClose: () => void
}
const TokenListModal: React.FC<Props> = ({ tokens, onClose, isOpen }) => {

    const [search, setSearch] = useState("");
    const [filteredTokens, setFilteredTokens] = useState<LocalToken[]>()
    const { setCurrentToken } = useContext(inputContext);
    const handleTokenSelect = (token: LocalToken) => {
        setCurrentToken(token);
    }

    useEffect(() => {
        if (tokens) {
            const _filtered = Object.fromEntries(
                Object.entries(tokens).filter(([_, token]) => token.symbol.toLowerCase().includes(search.toLowerCase()))
            );
            setFilteredTokens(Object.values(_filtered).slice(0, 10))
        }
    }, [tokens, search]);

    return (
        <>
            <Modal open={isOpen} onClose={onClose} center classNames={{
                modal: styles.modal,
                overlay: styles.overLay,
                closeButton: styles.closeIcon
            }}>
                <div className="py-8 px-4">
                    <input type="text" placeholder="Search by token or paste address..."
                        className="placeholder-darkGrey bg-[#f5c835aa] w-[100%] rounded-[10px] text-cream placeholder:text-cream outline-none py-[6px] px-[13px]"
                        value={search}
                        onChange={(e: any) => {
                            setSearch(e.target.value)
                        }}
                    />
                    <div className="flex flex-col gap-[10px] mt-[15px]">
                        {filteredTokens && filteredTokens.length > 0 && filteredTokens.map((tokenKey) => (
                            <div className="relative w-[300px] md:w-[400px]">
                                <div className="bg-[#f5c835aa] rounded-lg flex items-center gap-5 cursor-pointer py-1.5 px-4"
                                    onClick={() => handleTokenSelect(tokenKey)}>
                                    <div className="rounded-full w-6 h-6 relative">
                                        <img
                                            src={tokenKey.logoURI}
                                            alt="Token Logo"
                                            className="rounded-full"
                                        />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[14px] text-cream font-bold">{tokenKey.symbol.toUpperCase()}</p>
                                        <p className="text-[10px] text-[#153f44] font-semibold]">{tokenKey.name}</p>
                                    </div>
                                </div>
                                <div className="bg-[#248b99] rounded-[5px] text-cream cursor-pointer flex items-center gap-[10px] px-[10px] absolute top-[13px] left-[170px] md:left-[270px]">
                                    <a className="text-[14px] text-cream" href={`https://solscan.io/address/${tokenKey.address}`} target="_blank">{shortenAddress(tokenKey.address)}</a>
                                    <Image
                                        alt="Share"
                                        src="/images/share.svg"
                                        width={9}
                                        height={9}
                                    />
                                </div>
                            </div>
                        ))}

                    </div>
                </div>
            </Modal>
        </>
    )
}

export default TokenListModal;