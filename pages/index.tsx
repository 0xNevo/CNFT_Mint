// 'use client';
import RightComp from '@/components/RightComp/RightComp';
import React from 'react'
import ComponentToImage from '@/components/ComponentToImage';

import WalletButton from '@/components/WalletButton/WalletButton';
import { UiLayout } from '@/components/UiLayout/UiLayout';

const FormLayout = () => {
  const [captureFunction, setCaptureFunction] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);

  return (
    <div className="overflow-hidden min-w-full min-h-screen relative bg-[url('/images/home-background.png')] bg-cover bg-no-repeat after:content-[''] after:top-0 after:left-0 after:right-0 after:bottom-0 after:bg-[#0000003A] after:absolute flex flex-col items-center just h-full w-full text-white ">
      {/* LEFT SECTION */}
      <UiLayout>
        <div className='flex items-center justify-center flex-col w-full min-h-[calc(100vh-100px)] gap-8 px-2 md:px-8 '>
          <div className=' bg-main-box z-10 rounded-3xl max-w-[1200px] w-full grid grid-cols-1 md:grid-cols-2 gap-6 px-2 py-2 md:px-8 md:py-14 border border-[#B0B0B0]'>
            <ComponentToImage onCapture={captureFunction} onButtonClick={setCaptureFunction} setIsLoading={setIsLoading} />
            <RightComp onButtonClick={setCaptureFunction} isLoading={isLoading} setIsLoading={setIsLoading} />
          </div>
        </div>
      </UiLayout>
    </div>
  )
}

export default FormLayout