import { JSX } from "react"
import './Header.css'

function Header(): JSX.Element {
    return (
        <div className="header">
            <a href="https://warpcast.com/~/compose?text=Raffle%20Frame%20by%20%40anyvoid.eth&embeds[]=https://raffle.anyvoid.xyz">Share Frame</a>
        </div>
    )
}

export default Header
