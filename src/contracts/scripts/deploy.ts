import { ethers } from 'hardhat';

async function main() {
    const RaffleStorage = await ethers.getContractFactory("RaffleStorage");
    const raffleStorage = await RaffleStorage.deploy();
    const address: string = await raffleStorage.getAddress();
    console.log("RaffleStorage deployed to:", address);
}

main();