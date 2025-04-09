import { JSX, useState } from 'react';
import { Wheel } from "react-custom-roulette";
import Confetti from "react-confetti";
import './Raffle.css';
import { ethers, AbiCoder, id } from "ethers";
import { Snackbar, Alert } from "@mui/material";

const runRaffleOnBlockchain = async (owner: string, date: string, participants: string[]): Promise<number> => {

  // Replace with your contract's address and ABI
  const contractAddress = "0x0165878A594ca255338adfa4d48449f69242Eb8F"; // Test address
  const contractABI = [
    "function runRaffle(string memory owner,string memory date,string[] memory participants) public returns (uint256)",
    "event RaffleRun(uint256 indexed winnerIndex)"
  ];

  // Connect to the user's wallet
  const provider = new ethers.BrowserProvider(window.ethereum); // todo yagmi and farcaster context ?
  const signer = await provider.getSigner();

  // Create a contract instance
  const contract = new ethers.Contract(contractAddress, contractABI, signer);

  // Send the transaction
  const tx = await contract.runRaffle(owner, date, participants);
  console.log("Transaction sent:", tx.hash);

  // Wait for the transaction to be mined
  const receipt = await tx.wait();
  console.log("Transaction confirmed:", receipt);

  const event = receipt.logs.find((log: ethers.Log) => log.topics[0] === id("RaffleRun(uint256)"));
  if (event !== null) {
    const winnerIndex = (new AbiCoder()).decode(["uint256"], event.topics[1])[0];
    console.log("Winner index:", winnerIndex);
    return winnerIndex;
  } else {
    throw new Error("RaffleRun event not found in transaction logs");
  }

};

function Raffle(): JSX.Element {
  const [labels, setLabels] = useState<{ option: string, style: { backgroundColor: string } }[]>([]);
  const [newLabel, setNewLabel] = useState<string>("");
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [spinning, setSpinning] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [prizeNumber, setPrizeNumber] = useState<number>(0);
  // const [raffleResult, setRaffleResult] = useState<RaffleResult | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");

  const addLabel = (): void => {
    if (newLabel.trim() !== "") {
      const color: string = Math.floor(Math.random() * 16777215).toString(16);
      const backgroundColor: string = `#${color.padEnd(6, '0')}`;
      setLabels([...labels, { option: newLabel, style: { backgroundColor: backgroundColor } }]);
      setNewLabel("");
    }
  };

  const removeLabel = (index: number): void => {
    setLabels(labels.filter((_, i: number): boolean => i !== index));
  };

  const mintRaffle = async (): Promise<void> => {
    //const selectedIndex: number = Math.floor(Math.random() * labels.length);
    /**const raffleResult: RaffleResult = {
      owner: {
        username: "anyvoid.eth", // TODO
        fid: 1, // TODO
      },
      participants: labels.map((label) => ({ name: label.option })),
      winner: {
        name: labels[selectedIndex].option,
      },
      date: new Date().toISOString(),
    };
    setRaffleResult(raffleResult);**/

    const owner: string = 'anyvoid.eth'; // TODO
    const date: string = new Date().toISOString();
    const participants: string[] = labels.map((label) => label.option);
    try {
      // await storeRaffleOnBlockchain(raffleResult);
      const selectedIndex: number = await runRaffleOnBlockchain(owner, date, participants);
      await spinWheel(selectedIndex);
    } catch (e: any) {
      console.log(e);
      setSnackbarMessage(e.shortMessage);
      setSnackbarOpen(true);
    }
  }

  const spinWheel = async (selectedIndex: number): Promise<void> => {
    setSelectedLabel(null);
    setShowConfetti(false);
    if (labels.length === 0 || spinning) return;
    setSpinning(true);
    setPrizeNumber(selectedIndex);
  };

  const emojis: string[] = ["🎉", "🎊", "🏆", "🥳", "👏", "🔥"];

  return (
    <div className="container">
      {showConfetti &&
        <div className="confetti">
          <Confetti
            gravity={0.1}
            wind={0}
          />
        </div>
      }
      <h1>Raffle</h1>
      {selectedLabel && <h2>Congratulations {selectedLabel} {emojis[Math.floor(Math.random() * emojis.length)]}</h2>}
      <button onClick={mintRaffle} disabled={labels.length === 0 || spinning}>
        Let's go!
      </button><br />
      <input
        type="text"
        value={newLabel}
        onChange={(e) => setNewLabel(e.target.value)}
        placeholder="Enter name"
        disabled={spinning}
      />
      <button onClick={addLabel} disabled={spinning}>Add Participant</button>
      {labels.length > 0 ? (
        <div className="wheel-container">
          <Wheel
            mustStartSpinning={spinning}
            prizeNumber={prizeNumber}
            data={labels}
            onStopSpinning={() => {
              setSpinning(false);
              setSelectedLabel(labels[prizeNumber].option);
              setShowConfetti(true);
              setTimeout(() => { setShowConfetti(false); }, 5000);
            }}
            backgroundColors={["#f9c74f", "#f94144", "#43aa8b", "#577590"]}
            textColors={["#fff"]}
            spinDuration={1.0}
            innerRadius={0}
            outerBorderWidth={2}
            radiusLineWidth={2}
          />
        </div>
      ) : (
        <p>No participant available</p>
      )}
      <ul>
        {labels.map((label, index) => (
          <li key={index} style={{ backgroundColor: label.style.backgroundColor }}>
            {label.option}
            <button disabled={spinning} onClick={() => removeLabel(index)}>Remove</button>
          </li>
        ))}
      </ul>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}

      >
        <Alert
          severity="error"
          onClose={() => setSnackbarOpen(false)}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <div id="raffle-result">{/**JSON.stringify(raffleResult)**/}</div>
    </div>
  );
}

export default Raffle;
