"use client"

import { useState } from "react";
import GuessContainer from "./Guesses";
import WinScreen from "./WinScreen";
import background_img from "../twi-logo-fancy.png";

interface GameProps {
  todaysAnswer: string;
  allCharacterData: Map<string, string[]>;
  initialDifficulties: number[];
  onReset: (newAnswer?: string, newDifficulties?: number[], newShowModal?: boolean) => void;
  showModal: boolean;
}

interface ModalProps {
  onClose: () => void;
  resetFunc: (newAnswer?: string, newDifficulties?: number[], newShowModal?: boolean) => void;
  allCharacterData: Map<string, string[]>;

}

// function Modal({ onClose }: ModalProps) {
//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//       <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md text-center">
//         <h2 className="text-xl font-bold mb-4">Welcome to the Game!</h2>
//         <p className="mb-4">Here are the rules and some helpful hints to get you started.</p>
//         <button onClick={onClose} className="px-4 py-2 bg-blue-500 text-white rounded-lg">Got it!</button>
//       </div>
//     </div>
//   );
// }

function fnv1aHash(str: string, maxRange: number): number {
  let hash = 2166136261; // FNV offset basis
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash *= 16777619; // FNV prime
  }
  return Math.abs(hash) % maxRange;
}

function getDailyHashImproved(maxRange: number): number {
  const dateStr = new Date().toISOString().split("T")[0];
  return fnv1aHash(dateStr, maxRange);
}

function Modal({ onClose, resetFunc, allCharacterData }: ModalProps) {

  const enabledLevels: number[] = [1, 2, 3];

  const filteredKeys = Array.from(allCharacterData.entries())
    .filter(([, values]) => values[11] !== undefined && enabledLevels.includes(Number(values[11])))
    .map(([key]) => key);



  const randomIndex = Math.floor(Math.random() * filteredKeys.length);
  const initialAnswer: string = filteredKeys[randomIndex];
  const dailyAnswer: string = filteredKeys[getDailyHashImproved(filteredKeys.length)]


  // if (filteredKeys.length > 0) {
  //     const randomIndex = Math.floor(Math.random() * filteredKeys.length);
  //     resetFunction(filteredKeys[randomIndex], enabledLevels, false);
  // }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md text-center relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-700 hover:text-black bg-transparent p-2 text-2xl"
        >
          &times;
        </button>

        {/* Modal Content */}
        <h2 className="text-xl font-bold mb-4">Welcome to the Game!</h2>
        <p className="mb-6">Here are the rules and some helpful hints to get you started.</p>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <button onClick={() => resetFunc(dailyAnswer, enabledLevels, false)} className="px-4 py-2 bg-green-500 text-white rounded-lg">
            DAILY CHALLENGE
          </button>
          <button onClick={() => resetFunc(initialAnswer, enabledLevels, false)} className="px-4 py-2 bg-red-500 text-white rounded-lg">
            Free Play
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Game({ todaysAnswer, allCharacterData, initialDifficulties, onReset, showModal }: GameProps) {
  const [history, setHistory] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);
  const [showTheModal, setShowTheModal] = useState(showModal);

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
      {showTheModal && <Modal onClose={() => setShowTheModal(false)} resetFunc={onReset} allCharacterData={allCharacterData} />}
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