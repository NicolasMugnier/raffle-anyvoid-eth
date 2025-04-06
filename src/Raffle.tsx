import { JSX, useState } from 'react';
import { Wheel } from "react-custom-roulette";
import Confetti from "react-confetti";
import './Raffle.css';
// import { RaffleResult } from './RaffleResult';

function Raffle(): JSX.Element {
  const [labels, setLabels] = useState<{ option: string, style: { backgroundColor: string } }[]>([]);
  const [newLabel, setNewLabel] = useState<string>("");
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [spinning, setSpinning] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [prizeNumber, setPrizeNumber] = useState<number>(0);
  // const [raffleResult, setRaffleResult] = useState<RaffleResult | null>(null);

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

  const spinWheel = (): void => {
    setSelectedLabel(null);
    setShowConfetti(false);
    if (labels.length === 0 || spinning) return;
    setSpinning(true);
    const selectedIndex = Math.floor(Math.random() * labels.length);
    setPrizeNumber(selectedIndex);
    /**const raffleResult: RaffleResult = {
      owner: {
        username: "anyvoid.eth",
        fid: 1,
      },
      participants: labels.map((label) => ({ name: label.option })),
      winner: {
        name: labels[selectedIndex].option,
      },
      date: new Date().toISOString(),
    };**/
    // setRaffleResult(raffleResult);
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
      <button onClick={spinWheel} disabled={labels.length === 0 || spinning}>
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
      <div id="raffle-result">{/**JSON.stringify(raffleResult)**/}</div>
    </div>
  );
}

export default Raffle;
