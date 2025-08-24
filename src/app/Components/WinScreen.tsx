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

function encodeWithNonce(input: string): string {
  // Generate a random nonce (8 hex chars)
  const nonce = Math.random().toString(16).slice(2, 10);

  // Simple disguise: XOR each char with nonce chars
  const disguised = Array.from(input)
    .map((char, i) => {
      const code = char.charCodeAt(0);
      const key = nonce.charCodeAt(i % nonce.length);
      return String.fromCharCode(code ^ key);
    })
    .join("");

  // Final output = nonce + disguised string (Base64 so it stays printable)
  return nonce + btoa(disguised);
}

// function decodeWithNonce(encoded: string): string {
//   const nonce = encoded.slice(0, 8);          // first 8 chars
//   const disguised = atob(encoded.slice(8));   // decode from Base64

//   return Array.from(disguised)
//     .map((char, i) => {
//       const code = char.charCodeAt(0);
//       const key = nonce.charCodeAt(i % nonce.length);
//       return String.fromCharCode(code ^ key);
//     })
//     .join("");
// }

export default function WinScreen({ todaysAnswer, history, onFreePlay, daily, dayNumber, characterData, difficulties, gaveUp, setGiveUp, maxVolume }: WinScreenProps) {
  const [shared, setShared] = useState(false);
  const [seedSaved, setSeedSaved] = useState(false); // 👈 new state

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
      if (gaveUp) { setGiveUp(false); }
    }
  };

  const firstDate = new Date("2025-07-31");
  const todayDate = new Date(firstDate);
  todayDate.setDate(todayDate.getDate() + dayNumber - 1);
  const todayStr = todayDate.toISOString().split("T")[0];

  const shareResults = () => {
    const answer = daily ? `${todayStr}` : todaysAnswer;
    const strIn = gaveUp ? `Gave up after + ${history.length}` : `in ${history.length}`;
    let str = daily ? `Wandering Inndle ${answer}: ${strIn}` : `Wandering Inndle ||${answer}||: ${strIn}`;

    str += '\n';
    str += history.map((guess) => {
      const rowPlan = planRow({ todaysAnswer, allCharacterData: characterData, guess });
      const cells = rowPlan.map(stringCell);
      return cells.join('');
    }).join('\n');

    copyToClipboard(str).then(() => setShared(true));
  }

  const saveSeed = () => {
    const seed = encodeWithNonce(todaysAnswer);
    navigator.clipboard.writeText(seed).then(() => setSeedSaved(true));
  };


  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md mb-6 text-center">
      {gaveUp ? (
        <h2 className="text-2xl font-bold text-red-600 mb-4">You gave up :(</h2>
      ) : (
        <h2 className="text-2xl font-bold text-green-600 mb-4">You did it!</h2>
      )}

      <div className="text-lg text-gray-700 mb-2">
        {daily ? "Today's answer was:" : "The answer was:"}
      </div>
      <div className="text-2xl font-semibold text-black mb-4">{todaysAnswer}</div>
      <div className="text-sm text-gray-600 mb-6">
        Number of tries: {history.length}
      </div>

      {/* Button group stacked vertically */}
      <div className="flex justify-center">
        <div className="flex flex-col w-max space-y-2">
          <button
            onClick={handleResetClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl transition w-full"
          >
            Play Again (Free Play)
          </button>

          <button
            onClick={shareResults}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-xl transition w-full"
          >
            {shared ? "Copied Results to Clipboard" : "Share Results"}
          </button>

          <button
            onClick={saveSeed}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-xl transition w-full"
          >
            {seedSaved ? "Copied Seed to Clipboard" : "Save Seed"}
          </button>
        </div>
      </div>

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