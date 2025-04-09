"use client"

import { useState } from "react";
import GuessContainer from "./Guesses";
import WinScreen from "./WinScreen";
import background_img from "../twi-logo-fancy.png";
import { createHash } from 'crypto';


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
  settingsModalFunc: (page: number) => void;
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


function sha256ToBigInt(data: string): bigint {
  const hashHex = createHash('sha256').update(data).digest('hex');
  return BigInt('0x' + hashHex);
}


function Modal({ onClose, resetFunc, settingsModalFunc, allCharacterData }: ModalProps) {
  const enabledLevels: number[] = [1, 2, 3];

  const filteredKeys = Array.from(allCharacterData.entries())
    .filter(([, values]) => values[11] !== undefined && enabledLevels.includes(Number(values[11])))
    .map(([key]) => key);



  const randomIndex = Math.floor(Math.random() * filteredKeys.length);
  const initialAnswer: string = filteredKeys[randomIndex];

  const dateStr = new Date().toISOString().split("T")[0];

  const hashInt = sha256ToBigInt(dateStr);
  const keysSize = BigInt(filteredKeys.length)
  const index = hashInt % keysSize

  const dailyAnswer: string = filteredKeys[Number(index)]


  // if (filteredKeys.length > 0) {
  //     const randomIndex = Math.floor(Math.random() * filteredKeys.length);
  //     resetFunction(filteredKeys[randomIndex], enabledLevels, false);
  // }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md w-full text-center relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-700 hover:text-black bg-transparent p-2 text-2xl"
        >
          &times;
        </button>

        {/* Modal Content */}
        <h2 className="text-2xl font-bold mb-4">Welcome to Inndle!</h2>

        <p className="mb-6 text-sm text-gray-700 leading-relaxed">
          The <strong>Daily Challenge</strong> is the same for everyone and resets at <strong>8:00pm EST</strong>.<br /><br />
          <strong>Free Play</strong> allows you to choose from different difficulties.<br /><br />
          Visit <strong>Settings</strong> to:
          <ul className="list-disc list-inside text-left mt-2 ml-2">
            <li>Select difficulty</li>
            <li>Mask columns to prevent spoilers</li>
            <li>Read comprehensive instructions</li>
          </ul>
        </p>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => resetFunc(dailyAnswer, enabledLevels, false)}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            Daily Challenge
          </button>
          <button
            onClick={() => resetFunc(initialAnswer, enabledLevels, false)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Free Play
          </button>
          <button
            onClick={() => {
              onClose(); 
              settingsModalFunc(0);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Open Rules
          </button>

          <button
            onClick={() => {
              onClose();
              settingsModalFunc(1);
            }}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
          >
            Spoiler Controls
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

  const [settingsPage, setSettingsPage] = useState(-1);

  function handleGuess(guess: string): void {
    const newHistory = [...history];
    newHistory.unshift(guess);
    setHistory(newHistory);

    if (guess === todaysAnswer) {
      setFinished(true);
    }
  }
  return (
    <div className="game flex flex-col items-center relative px-4">
      {showTheModal && (
        <Modal
          onClose={() => setShowTheModal(false)}
          resetFunc={onReset}
          settingsModalFunc={setSettingsPage}
          allCharacterData={allCharacterData}
        />
      )}
      <div className="flex justify-center mb-4 w-full">
        <img src={background_img.src} alt="Background" className="w-full max-w-md rounded-2xl" />
      </div>
      {finished && (
        <WinScreen
          todaysAnswer={todaysAnswer}
          history={history}
          onFreePlay={onReset}
          characterData={allCharacterData}
          difficulties={initialDifficulties}
        />
      )}
      <GuessContainer
        allCharacterData={allCharacterData}
        history={history}
        onGuess={handleGuess}
        todaysAnswer={todaysAnswer}
        difficulties={initialDifficulties}
        onReset={onReset}
        settingsStartOpen={settingsPage}
      />
    </div>
  );
  /*return (
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
  );*/
}