import { ethers } from "hardhat";

async function main() {
    const contractAddress: string = '0x0165878A594ca255338adfa4d48449f69242Eb8F';
    const raffles = await ethers.getContractAt("RaffleStorage", contractAddress);
    const length: bigint = await raffles.getRafflesCount();
    console.log("Raffles Count:", length);
    const raffleResult = await raffles.getRaffle(length - BigInt(1));
    console.log("Raffle Result:", raffleResult);
}

main();
