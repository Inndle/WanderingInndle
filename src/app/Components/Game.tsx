"use client"

import { useState } from "react";
import GuessContainer from "./Guesses";
import WinScreen from "./WinScreen";
import background_img from "../twi-logo-fancy.png";
import buttonImage from "../infoButton.png";
import { createHash } from 'crypto';
import { useEffect, useRef } from "react";

export type ResetFunc = (newAnswer?: string, newDifficulties?: number[], newShowModal?: boolean, maxVolume?: number, dayNumber?: number) => void

interface GameProps {
  todaysAnswer: string;
  allCharacterData: Map<string, string[]>;
  initialDifficulties: number[];
  onReset: ResetFunc;
  showModal: boolean;
  maxVolume: number;
  isDaily: boolean;
  setIsDaily: (state: boolean) => void;
  dayNumber: number;
}

interface ModalProps {
  onClose: () => void;
  resetFunc: ResetFunc;
  setDaily: (state: boolean) => void
  settingsModalFunc: (page: number) => void;
  allCharacterData: Map<string, string[]>;
}

interface InfoModalProps {
  onClose: () => void;
  character: string;
  resetFunc: ResetFunc;
  enabledLevels: number[];
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

function decodeWithNonce(encoded: string): string {
  const nonce = encoded.slice(0, 8);          // first 8 chars
  const disguised = atob(encoded.slice(8));   // decode from Base64

  return Array.from(disguised)
    .map((char, i) => {
      const code = char.charCodeAt(0);
      const key = nonce.charCodeAt(i % nonce.length);
      return String.fromCharCode(code ^ key);
    })
    .join("");
}


// Helper function for generating the daily character
function sha256ToBigInt(data: string): bigint {
  const hashHex = createHash('sha256').update(data).digest('hex');
  return BigInt('0x' + hashHex);
}

function Modal({ onClose, resetFunc, setDaily, settingsModalFunc, allCharacterData }: ModalProps) {
  //// Generate the character for when the player starts playing - both daily and free
  // Our initial character will only be from difficulties easy, medium, and hard
  const enabledLevels: number[] = [1, 2, 3];

  // Remove characters that are too difficult
  const filteredKeys = Array.from(allCharacterData.entries())
    .filter(([, values]) => values[11] !== undefined && enabledLevels.includes(Number(values[11])))
    .map(([key]) => key);

  // Calculate the free play initial character
  const randomIndex = Math.floor(Math.random() * filteredKeys.length);
  const initialAnswer: string = filteredKeys[randomIndex];


  const daysToCheck = 14;
  const usedIndexes = new Set<number>();
  const usedDate = new Date();
  //usedDate.setDate(usedDate.getDate() + 1)


  // Get list of indexes from the previous 14 days
  for (let i = 1; i <= daysToCheck; i++) {
    const pastDate = new Date(usedDate);
    pastDate.setDate(pastDate.getDate() - i);
    const pastDateStr = pastDate.toISOString().split("T")[0];
    const pastHashInt = sha256ToBigInt(pastDateStr);
    const keysSize = BigInt(filteredKeys.length);
    const pastIndex = Number(pastHashInt % keysSize);
    usedIndexes.add(pastIndex);
  }

  // Compute today's index
  const todayStr = usedDate.toISOString().split("T")[0];
  // Handle special hardcoded dates
  const hardcodedAnswers: { [date: string]: string } = {
    "2025-07-31": "Belavierr",
    "2025-08-01": "Garry",
    "2025-08-02": "Flos",
    "2025-08-03": "Foliana",
    "2025-08-04": "Garen",
    "2025-08-05": "Fithea",
    "2025-08-06": "Halrac",
    "2025-08-07": "Tolveilouka",
    "2025-08-08": "Seraphel",
    "2025-08-09": "Crusader 51",
    "2025-08-10": "Gothica",
    "2025-08-11": "Serept",
    "2025-08-12": "Tserre",
    "2025-08-13": "Wil",
    "2025-08-14": "Rasea",
    "2025-08-15": "Larracel",
    "2025-08-16": "Brunkr", //Was gonna repeat Tserre
    "2025-08-17": "Drevish",
    "2025-08-18": "Kevin",
    "2025-08-19": "Emerrhain",
    "2025-08-20": "Garia",
    "2025-08-21": "Nanette",
    "2025-08-22": "Tulm",
    "2025-08-23": "Revi",
    "2025-08-24": "Verdan",
    "2025-08-25": "Typhenous",
    "2025-08-26": "Xitegen",
    "2025-08-27": "Florist",
    "2025-08-28": "Salkis",
    "2025-08-29": "Bethal",
    "2025-08-30": "Kenjiro",
    "2025-08-31": "Talia", // Was gonna repeat Halrac
    "2025-09-01": "Quarass",
    "2025-09-02": "Satar",
    "2025-09-03": "Jecaina", //Was gonna repeat Salkis
    "2025-09-04": "Visma",
    "2025-09-05": "Dakelos",
    "2025-09-06": "Wesle",
    "2025-09-07": "Yitton",
    "2025-09-08": "Norechl",
    "2025-09-09": "Yelroan",
    "2025-09-10": "Mavika",
    "2025-09-11": "Rhisveri",
    "2025-09-12": "Gireulashia",
    "2025-09-13": "Cognita",
    "2025-09-14": "Hawk",
    "2025-09-15": "Artur",
    "2025-09-16": "Xevccha",
    "2025-09-17": "Dalimont",
    "2025-09-18": "Osthia",
    "2025-09-19": "Ielane",
    "2025-09-20": "Rose",
    "2025-09-21": "Mars",
    "2025-09-22": "Noass",
    "2025-09-23": "Zeladona",
    "2025-09-24": "Agnes",
    "2025-09-25": "Pyrite",
    "2025-09-26": "Erin",
    "2025-09-27": "Yelroan", //Oopsie
    "2025-09-28": "Pryde",
    "2025-09-29": "Calidus",
    "2025-09-30": "Ressa",
    "2025-10-01": "Xrn",
    "2025-10-02": "Maresar",
    "2025-10-03": "Jewel",
    "2025-10-04": "Pebblesnatch",
    "2025-10-05": "Rie",
    "2025-10-06": "Ulvama",
    "2025-10-07": "Ilvriss",
    "2025-10-08": "Wrymvr",
    "2025-10-09": "Luan",
    "2025-10-10": "Nsiia",
    "2025-10-11": "Toren",
    "2025-10-12": "Thomas",
    "2025-10-13": "Eloise",
    "2025-10-14": "Colfa",
    "2025-10-15": "Yvlon",
    "2025-10-16": "Vess",
    "2025-10-17": "Relc",
    "2025-10-18": "Zevara",
    "2025-10-19": "Alcaz",
    "2025-10-20": "Az'kerash",
    "2025-10-21": "Anand",
    "2025-10-22": "Nerry",
    "2025-10-23": "Colthei",
    "2025-10-24": "Palt",
    "2025-10-25": "Tessa",
    "2025-10-26": "Serinpotva",
    "2025-10-27": "Cara",
    "2025-10-28": "Orthenon",
    "2025-10-29": "Aaron",
    "2025-10-30": "Raelt",
    "2025-10-31": "Altestiel",
    "2025-11-01": "Durene",
    "2025-11-02": "Termin",
    "2025-11-03": "Richard",
    "2025-11-04": "Sammial",
    "2025-11-06": "Talia", //Didn't set
    "2025-11-07": "Raim", //Didn't set
    "2025-11-08": "Asgra",
    "2025-11-09": "Fetohep",
    "2025-11-10": "Calruz",
    "2025-11-11": "Umina",
    "2025-11-12": "Drassi",
    "2025-11-13": "Vaulont",
    "2025-11-14": "Vernoue",
    "2025-11-15": "Elia",
    "2025-11-16": "Badarrow",
    "2025-11-17": "Thelican",
    "2025-11-18": "Pisces",
    "2025-11-19": "Tesy",
    "2025-11-20": "Selys",
    "2025-11-21": "Saliss",
    //Xesci and Octavia and uhhh....
    "2025-11-25": "Teriarch",
    "2025-11-26": "Ieka",
    "2025-11-27": "Vernoue",
    "2025-11-28": "Dawil",
    "2025-11-29": "Sserys",
    "2025-11-30": "Fithea",
    "2025-12-01": "Irurx",
    "2025-12-02": "Asale",
    "2025-12-03": "Stan",
    "2025-12-04": "Krshia",
    "2025-12-05": "Trey",
    "2025-12-06": "Feor",
    "2025-12-07": "Moore",
    "2025-12-08": "Olesm",
    "2025-12-09": "Tremborag",
    "2025-12-10": "Mrsha",
    "2025-12-11": "Mrsha",
    "2025-12-12": "Nerrhavia",
    "2025-12-13": "Embria",
    "2025-12-14": "Nereshal",
    "2025-12-15": "Fierre",
    "2025-12-16": "Ysara",
    "2025-12-17": "Perorn",
    "2025-12-18": "Ivolethe",
    "2025-12-19": "Reiss",
    "2025-12-20": "Laken",
    "2025-12-21": "Zelkyr",
    "2025-12-22": "Othius",
    "2025-12-23": "Greydath",
    "2025-12-24": "Rhisveri",
    "2025-12-25": "Nawalishifra",
    "2025-12-26": "Maughin",
    "2025-12-27": "Salii",
  };

  // Date without time is automatically UTC.
  const firstDate = new Date("2025-07-31");
  const todayDate = new Date(todayStr);
  const msInDay = 1000 * 60 * 60 * 24;
  // The firstDate and todayDate are both in UTC, so no rounding should be necessary.
  let dayNumber = (todayDate.getTime() - firstDate.getTime()) / msInDay + 1;
  // To be safe, round anyways.
  dayNumber = Math.round(dayNumber);

  let dailyAnswer: string;

  if (todayStr in hardcodedAnswers) {
    dailyAnswer = hardcodedAnswers[todayStr];
  } else {
    const todayHashInt = sha256ToBigInt(todayStr);
    const keysSize = BigInt(filteredKeys.length);
    let index = Number(todayHashInt % keysSize);

    while (usedIndexes.has(index)) {
      index = (index + 1) % Number(keysSize);
    }

    dailyAnswer = filteredKeys[index];
  }

  // // Calculate the daily character using our hash
  // const dateStr = new Date().toISOString().split("T")[0];
  // const hashInt = sha256ToBigInt(dateStr);
  // const keysSize = BigInt(filteredKeys.length)
  // const index = hashInt % keysSize
  // const dailyAnswer: string = filteredKeys[Number(index)]

  // Now that we have generated the characters we can create our modal
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
          The <strong>Daily Challenge</strong> is the same for everyone and resets at <strong>7:00pm EST</strong>.<br /><br />
          <strong>Free Play</strong> allows you to choose from different difficulties.<br /><br />
          Visit <strong>Settings</strong> to:
          <ul className="list-disc list-inside text-left mt-2 ml-2">
            <li>Select difficulty</li>
            <li>Hide columns to prevent spoilers</li>
            <li>Read comprehensive instructions</li>
          </ul>
        </p>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => { resetFunc(dailyAnswer, enabledLevels, false, undefined, dayNumber); setDaily(true) }}
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
            onClick={() => { settingsModalFunc(0); }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Rules
          </button>
          <button
            onClick={() => { settingsModalFunc(1); }}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
          >
            Spoiler Controls
          </button>
          <button
            onClick={() => { settingsModalFunc(3); }}
            className="col-span-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
          >
            Enter Seed
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Game({ todaysAnswer, allCharacterData, initialDifficulties, onReset, showModal, maxVolume, isDaily, setIsDaily, dayNumber }: GameProps) {
  const [history, setHistory] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);
  const [showTheModal, setShowTheModal] = useState(showModal);
  const [giveUp, setGiveUp] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);


  const [settingsPage, setSettingsPage] = useState(-1);

  // Helper function to pass down to Guesses to update history state
  function handleGuess(guess: string): void {
    const newHistory = [...history];
    newHistory.unshift(guess);
    setHistory(newHistory);

    if (guess === todaysAnswer) {
      setFinished(true);
    }
  }

  function InfoModal({ onClose, character, resetFunc, enabledLevels }: InfoModalProps) {
    // Konami code sequence (with enter/return at the end)
    const konamiCode: (string | string[])[] = [
      "arrowup",
      "arrowup",
      "arrowdown",
      "arrowdown",
      "arrowleft",
      "arrowright",
      "arrowleft",
      "arrowright",
      "b",
      "a",
      ["enter", "return"],
    ];

    const position = useRef(0);
    const [showInput, setShowInput] = useState(false);
    const encodedChar = encodeWithNonce(character)
    const [inputValue, setInputValue] = useState(encodedChar);

    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        const key = event.key.toLowerCase();
        const expected = konamiCode[position.current];

        const isMatch = Array.isArray(expected)
          ? expected.includes(key)
          : key === expected;

        if (isMatch) {
          position.current++;

          if (position.current === konamiCode.length) {
            setShowInput(true); // reveal input
            position.current = 0;
          }
        } else {
          const first = konamiCode[0];
          if ((Array.isArray(first) && first.includes(key)) || key === first) {
            position.current = 1;
          } else {
            position.current = 0;
          }
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }, []);

    const handleSubmit = () => {
      // For now, log the value — replace with whatever you want
      const decodedChar = decodeWithNonce(inputValue)
      resetFunc(decodedChar, enabledLevels, false)
    };

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md w-full text-left relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-700 hover:text-black bg-transparent p-2 text-2xl"
          >
            &times;
          </button>
          <h2 className="text-xl font-bold mb-4">About</h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            Inndle is a daily character-guessing game featuring characters from
            the web serial <em>The Wandering Inn</em> by Pirateaba.
          </p>

          <p className="text-gray-700 text-sm leading-relaxed">
            Created by CalvinWill, SppEric, and{" "}
            <span
              onClick={() => setShowInput(true)} // or whatever function the Konami code uses
            >
              samf25
            </span>{" "}
            on Github.
          </p>

          {showInput && (
            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Enter a seed:
              </label>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
              />
              <button
                onClick={handleSubmit}
                className="mt-3 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow"
              >
                Submit
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="game flex flex-col items-center relative px-4">
      {showTheModal && (
        <Modal
          onClose={() => setShowTheModal(false)}
          resetFunc={onReset}
          setDaily={setIsDaily}
          settingsModalFunc={setSettingsPage}
          allCharacterData={allCharacterData}
        />
      )}
      {showInfoModal && <InfoModal onClose={() => setShowInfoModal(false)} character={todaysAnswer} resetFunc={onReset} enabledLevels={initialDifficulties} />}
      <div className="flex justify-center mb-4 w-full">
        <img src={background_img.src} alt="Background" className="w-full max-w-md rounded-2xl" />
      </div>
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setShowInfoModal(true)}
          className="w-8 h-8 rounded-full shadow-lg bg-white hover:bg-gray-200 transition flex items-center justify-center overflow-hidden"
        >
          <img src={buttonImage.src} alt="Info" className="w-full h-full object-cover scale-125" />
        </button>
      </div>
      {(finished || giveUp) && (
        <WinScreen
          todaysAnswer={todaysAnswer}
          history={history}
          onFreePlay={onReset}
          daily={isDaily}
          dayNumber={dayNumber}
          characterData={allCharacterData}
          difficulties={initialDifficulties}
          gaveUp={giveUp}
          setGiveUp={setGiveUp}
          maxVolume={maxVolume}
        />
      )}
      <GuessContainer
        allCharacterData={allCharacterData}
        history={history}
        onGuess={handleGuess}
        todaysAnswer={todaysAnswer}
        difficulties={initialDifficulties}
        onReset={onReset}
        setGiveUp={setGiveUp}
        settingsStartOpen={settingsPage}
        settingsModalFunc={setSettingsPage}
        maxVolume={maxVolume}
      />
    </div>
  );
}