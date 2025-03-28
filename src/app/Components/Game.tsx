"use client"

import { useState, useEffect } from "react";
import GuessContainer from "./Guesses";
import WinScreen from "./WinScreen";
import background_img from "../twi-logo-fancy.png";

interface GameProps {
  todaysAnswer: string;
  allCharacterData: Map<string, string[]>;
  initialDifficulties: number[];
  onReset: (newAnswer?: string, newDifficulties?: number[]) => void;
}

export default function Game({ todaysAnswer, allCharacterData, initialDifficulties, onReset }: GameProps) {
  const [history, setHistory] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);
  const [showModal, setShowModal] = useState(true);

  function handleGuess(guess: string): void {
    const newHistory = [...history];
    newHistory.unshift(guess);
    setHistory(newHistory);

    if (guess === todaysAnswer) {
      setFinished(true);
    }
  }

  return (
    <div className="game justify-center relative">
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md text-center">
            <h2 className="text-xl font-bold mb-4">Welcome to the Game!</h2>
            <p className="mb-4">Here are the rules and some helpful hints to get you started.</p>
            <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-blue-500 text-white rounded-lg">Got it!</button>
          </div>
        </div>
      )}
      <div className="flex justify-center mb-4">
        <img src={background_img.src} alt="Background" className="w-full max-w-md rounded-2xl" />
      </div>
      <GuessContainer
        allCharacterData={allCharacterData}
        history={history}
        onGuess={handleGuess}
        todaysAnswer={todaysAnswer}
        difficulties={initialDifficulties}
        onReset={onReset}
      />
      {finished && <WinScreen todaysAnswer={todaysAnswer} history={history} />}
    </div>
  );
}