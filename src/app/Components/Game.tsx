"use client"

import { useState } from "react";
import GuessContainer from "./Guesses";
import WinScreen from "./WinScreen";
import background_img from "../twi-logo-fancy.png";

interface GameProps {
  todaysAnswer: string;
  allCharacterData: Map<string, string[]>;
  initialDifficulties: number[];
  onReset: (newAnswer?: string, newDifficulties?: number[]) => void; // Pass down reset function
}

export default function Game({ todaysAnswer, allCharacterData, initialDifficulties, onReset }: GameProps) {
  const [history, setHistory] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);

  function handleGuess(guess: string): void {
    let newHistory = [...history];
    newHistory.unshift(guess);
    setHistory(newHistory);

    if (guess === todaysAnswer) {
      setFinished(true);
    }
  }

  return (
    <div className="game justify-center">
      <div className="flex justify-center mb-4">
        <img src={background_img.src} alt="Background" className="w-full max-w-md rounded-2xl" />
      </div>
      <GuessContainer
        allCharacterData={allCharacterData}
        history={history}
        onGuess={handleGuess}
        todaysAnswer={todaysAnswer}
        finished={finished}
        difficulties={initialDifficulties}
        onReset={onReset} // Pass reset function
      />
      {finished && <WinScreen todaysAnswer={todaysAnswer} history={history} />}
    </div>
  );
}


