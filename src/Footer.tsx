import { JSX } from "react";
import FrameSDK from '@farcaster/frame-sdk';
import "./Footer.css";

const openGitHub = (): void => {
    console.log('Opening GitHub repository...');
    const repoUrl: string = 'https://github.com/NicolasMugnier/raffle-anyvoid-eth';
    FrameSDK.actions.openUrl(repoUrl);
}

function Footer(): JSX.Element{
    return (
    <footer className="footer">
        <p>&copy; 2025 - anyvoid.eth - View on <a href="#" onClick={openGitHub}>GitHub</a></p>
      </footer>
    )
}

export default Footer;
