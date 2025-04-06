// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract RaffleStorage {
    struct RaffleResult {
        string owner;
        string winner;
        string date;
        string[] participants;
    }

    RaffleResult[] public raffles;

    event RaffleStored(
        uint256 indexed raffleId,
        string owner,
        string winner,
        string date
    );
    event RaffleRun(uint256 indexed winnerIndex);

    function storeRaffle(
        string memory owner,
        string memory winner,
        string memory date,
        string[] memory participants
    ) public {
        raffles.push(RaffleResult(owner, winner, date, participants));
        emit RaffleStored(raffles.length - 1, owner, winner, date);
    }

    function runRaffle(
        string memory owner,
        string memory date,
        string[] memory participants
    ) public returns (uint256) {
        require(participants.length > 0, "No participants provided");
        uint256 randomNumber = uint256(
            keccak256(
                abi.encodePacked(block.timestamp, block.prevrandao, msg.sender)
            )
        );
        if (
            randomNumber <
            (type(uint256).max / participants.length) * participants.length
        ) {
            randomNumber = randomNumber % participants.length;
        }
        string memory winner = participants[randomNumber];

        raffles.push(RaffleResult(owner, winner, date, participants));
        emit RaffleRun(randomNumber);

        return randomNumber;
    }

    function getRafflesCount() public view returns (uint256) {
        return raffles.length;
    }

    function getRaffle(
        uint256 raffleId
    ) public view returns (RaffleResult memory) {
        require(raffleId < raffles.length, "Invalid raffle ID");
        return raffles[raffleId];
    }
}
