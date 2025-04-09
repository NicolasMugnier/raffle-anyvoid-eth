import { ethers } from "hardhat";

async function main() {
    const contractAddress: string = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
    const raffles = await ethers.getContractAt("RaffleStorage", contractAddress);
    const length: bigint = await raffles.getRafflesCount();
    console.log("Raffles Count:", length);
    const raffleResult = await raffles.getRaffle(length - BigInt(1));
    console.log("Raffle Result:", raffleResult);
}

main();
