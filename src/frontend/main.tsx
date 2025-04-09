import { StrictMode, useEffect, ReactNode, JSX } from 'react';
import { createRoot } from 'react-dom/client';
import FrameSDK from '@farcaster/frame-sdk';
import './index.css';
import Raffle from './Raffle.tsx';
import Header from './Header.tsx';
import Footer from './Footer.tsx';

function FarcasterFrameProvider({ children }: { children: ReactNode }): JSX.Element {
  useEffect((): void => {
    const init = async () => {
      setTimeout((): void => {
        FrameSDK.actions.ready();
      }, 500);
    };
    init();
  }, []);
  return <>{children}</>;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FarcasterFrameProvider>
      <Header />
      <Raffle />
      <Footer />
    </FarcasterFrameProvider>
  </StrictMode>,
);
