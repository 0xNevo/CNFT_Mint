// MyComponent.jsx
import inputContext from '@/contexts/inputContext';
import React from 'react';

const ImageComponent = () => {
    const { messageText, textColor, newImage } = React.useContext(inputContext);
    const optimizedText = React.useMemo(() => {
        // Suppose we need to perform some formatting:
        return messageText;
    }, [messageText]);
    const optimizedColor = React.useMemo(() => {
        // Suppose we need to perform some formatting:
        return textColor;
    }, [textColor]);

    return (
        <div className="w-full flex flex-col items-center aspect-square relative bg-[#F5C935] rounded-3xl p-10">
            <div className='w-full flex justify-center mx-auto absolute top-6 '>
                <div className='text-2xl font-semibold p-4 bg-[#f56235d2] rounded-2xl text-[white] z-30'>
                    Message
                </div>
            </div>
            <div className='w-full relative aspect-square rounded-3xl'>
                <textarea
                    className={`bg-[transparent] w-full relative aspect-square rounded-3xl font-semibold p-2 pt-14 z-20 text-xl`}
                    style={{color: optimizedColor}}
                    disabled
                    value={optimizedText}
                    placeholder=""
                />
                <div className='w-full absolute top-0 bg-[white] rounded-3xl aspect-square z-10'>
                    <img src={`${newImage ? newImage : '/upload-bg.png'}`} className='inset-0 bg-cover bg-center h-full mx-auto' />
                </div>
            </div>
        </div>
    );
};

export default ImageComponent;
