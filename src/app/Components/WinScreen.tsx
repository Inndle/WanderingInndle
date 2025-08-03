import { useState } from "react";
import { CellResponse, planRow } from "./Guesses";
import { ResetFunc } from "./Game";

interface WinScreenProps {
  todaysAnswer: string, 
  history: string[], 
  onFreePlay: ResetFunc,
  daily: boolean,
  dayNumber: number,
  characterData: Map<string, string[]>,
  difficulties: number[],
  gaveUp: boolean,
  setGiveUp: (state: boolean) => void;
  maxVolume: number;
}

export default function WinScreen({todaysAnswer, history, onFreePlay, daily, dayNumber, characterData, difficulties, gaveUp, setGiveUp, maxVolume}: WinScreenProps) {
  const [shared, setShared] = useState(false);

  // Helper function to generate a new character 
  const handleResetClick = () => {
        if (difficulties.length === 0) {
            alert("Please select at least one difficulty level before resetting the game.");
            return;
        }

        const filteredKeys = Array.from(characterData.entries())
            .filter(([, values]) => values[11] !== undefined && difficulties.includes(Number(values[11])) && Number(values[13]) <= maxVolume)
            .map(([key]) => key);

        if (filteredKeys.length > 0) {
            const randomIndex = Math.floor(Math.random() * filteredKeys.length);
            onFreePlay(filteredKeys[randomIndex], difficulties, false);
            if (gaveUp) {setGiveUp(false);}
        }
    };

  const shareResults = () => {
    const answer = daily ? `#${dayNumber}` : todaysAnswer;
    const strIn = gaveUp ? `Gave up after + ${history.length}` : `in ${history.length}`;
    let str = `Wandering Inndle ${answer}: ${strIn}`;

    str += '\n';
    str += history.map((guess) => {
      const rowPlan = planRow({todaysAnswer, allCharacterData: characterData, guess});
      const cells = rowPlan.map(stringCell);
      return cells.join('');
    }).join('\n');

    copyToClipboard(str).then(() => setShared(true));
  }

    return (
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md mb-6 text-center">
        {gaveUp ? <h2 className="text-2xl font-bold text-red-600 mb-4">You gave up :(</h2> : <h2 className="text-2xl font-bold text-green-600 mb-4">You did it!</h2>}
        <div className="text-lg text-gray-700 mb-2">
          {daily ? "Today's answer was:" : "The answer was:"}
        </div>
        <div className="text-2xl font-semibold text-black mb-4">
          {todaysAnswer}
        </div>
        <div className="text-sm text-gray-600 mb-6">
          Number of tries: {history.length}
        </div>
        <button
          onClick={handleResetClick}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl transition mb-2"
        >
          Play Again (Free Play)
        </button>
        <div></div>
        <button
          onClick={shareResults}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-xl transition"
        >
          {shared ? 'Copied Results to Clipboard' : 'Share Results'}
        </button>
      </div>
    );
  }
  
function stringCell(r: CellResponse) {
  switch (r.type) {
    case "Image":
      return "";
    case "Scalar":
      return r.response === "High" ? "🔻"
        : r.response === "Low" ? "🔺"
        : r.response === "Correct" ? "🟩"
        : "🟥";
    case "Binary":
      return r.response === "Correct" ? "🟩" : "🟥";
    case "Category":
      return r.response === "Match" ? "🟩"
        : r.response === "Partial" ? "🟨"
        : "🟥";
  }
}

async function copyToClipboard(text: string) {
  // In https, navigator.clipboard.writeText works.
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
  } else {
    const prevFocused = document.activeElement as HTMLElement | null;
    const input = document.createElement("input");
    input.style.position = "absolute";
    input.style.left = "-1000px";
    input.style.top = "-1000px";
    input.value = text;
    document.body.appendChild(input);
    input.select();

    try {
      document.execCommand('copy');
      prevFocused?.focus?.();
    } catch (error) {
      console.error(error);
    } finally {
      input.remove();
    }
  }
}
