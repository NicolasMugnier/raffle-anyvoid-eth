import { JSX } from "react";
import './Header.css';
import FrameSDK from '@farcaster/frame-sdk';

const shareFrame = (): void => {
    const url: string = 'https://warpcast.com/~/compose?text=Raffle%20Frame%20by%20%40anyvoid.eth&embeds[]=https://raffle.anyvoid.xyz';
    FrameSDK.actions.openUrl(url);
}

function Header(): JSX.Element {
    return (
        <div className="header">
            <button className="share-button" onClick={shareFrame}>Share Frame</button>
        </div>
    );
}

export default Header;
