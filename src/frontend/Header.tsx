import { JSX, useEffect, useState } from "react";
import './Header.css';
import FrameSDK from '@farcaster/frame-sdk';
import { FrameContext, UserContext } from '@farcaster/frame-core/dist/context';

const farcasterUser = async (): Promise<UserContext> => {
    console.log("Fetching user context...");
    const context: FrameContext = await FrameSDK.context;
    const user: UserContext = context?.user;
    console.log("User context received:", user);

    if (!user?.fid) {
        throw new Error("User object is invalid or fid is missing.");
    }

    return user;
}

const shareFrame = (): void => {
    const url: string = 'https://warpcast.com/~/compose?text=Raffle%20Frame%20by%20%40anyvoid.eth&embeds[]=https://raffle.anyvoid.xyz';
    FrameSDK.actions.openUrl(url);
}

function Header(): JSX.Element {

    const [username, setUsername] = useState<string | null>(null);
    const [pfpUrl, setPfpUrl] = useState<string | null>(null);
    // const [fid, setFid] = useState<number | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            await farcasterUser().then((user: UserContext) => {
                setUsername(user.username ?? '');
                setPfpUrl(user.pfpUrl ?? '');
            }).catch((error: Error) => {
                console.log(error);
            });
        };

        fetchUser();
    }, []);

    return (
        <div className="header">
            <div className="user-profile">
                <img className="profile-img" src={pfpUrl ?? 'https://raffle.anyvoid.xyz/splash.png'} alt={username ? username : ''} />
                <span className="username">{username ? username : "Loading..."}</span>
            </div>
            <button className="share-button" onClick={shareFrame}>Share Frame</button>
        </div>
    );
}

export default Header;
