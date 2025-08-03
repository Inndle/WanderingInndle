"use client"

import { useState } from "react";
import Game from "./Game";

interface GameWrapperProps {
  allCharacterData: Map<string, string[]>,
}

// const DEBUGGING = false;

export default function GameWrapper({ allCharacterData }: GameWrapperProps) {
  // Set defaults for game start
  const initialDifficulties: number[] = [1, 2, 3];
  const initialMaxVolume: number = 10;

  // Create an initial answer based on the defaults
  const filteredData = new Map(
    [...allCharacterData.entries()].filter(
      ([, values]) => values[11] !== undefined && initialDifficulties.includes(Number(values[11]))
    )
  );

  const keys = Array.from(filteredData.keys());
  const randomIndex = Math.floor(Math.random() * keys.length);
  const initialAnswer: string = keys[randomIndex];

  // Log initial answer - NOTE: This answer is only for when you press close on the game start modal
  // if (DEBUGGING) {  
  //   const todaysAnswerDetails: string[] | undefined = allCharacterData.get(initialAnswer);
  //   if (todaysAnswerDetails === undefined) {
  //     console.log('Selected character does not have info')
  //   }
  //   else {
  //     console.log(todaysAnswerDetails);
  //     console.log(`Today's Answer: ${initialAnswer}`);
  //     console.log(`Today's Answer Aliases: ${todaysAnswerDetails[0].split(" |")}`);
  //     console.log(`Today's Answer Fighting Type: ${todaysAnswerDetails[todaysAnswerDetails.length-1].split(" |")}`);
  //   }
  // }

  // Initialize state based on calculated defaults
  const [todaysAnswer, setTodaysAnswer] = useState(initialAnswer);
  const [difficulties, setDifficulties] = useState(initialDifficulties);
  const [maxVolume, setMaxVolume] = useState(initialMaxVolume);
  const [gameKey, setGameKey] = useState(0);
  const [isDaily, setIsDaily] = useState(false);
  const [dayNumber, setDayNumber] = useState(0);
  const [showModal, setShowModal] = useState(true);

  /**
   * Reset game function that will be passed down to reinitialize the game state
   * New characters are prepared locally downstream whenever a reset button exists and they just
   * pass the info up here 
   * 
   * TODO: Refactor code so that reset game performs the character calculation so everything
   * is in one place
   * 
   * @param newAnswer Character name 
   * @param newDifficulties
   * @param newShowModal 
   * returns nothing
   */
  function resetGame(newAnswer?: string, newDifficulties?: number[], newShowModal?: boolean, maxVol?: number, dayNumber?: number) {
    setTodaysAnswer(newAnswer || initialAnswer);
    setDifficulties(newDifficulties || initialDifficulties);
    // console.log("ShowModal1", newShowModal)
    setShowModal(newShowModal ?? true);
    setGameKey((prevKey) => prevKey + 1);
    setMaxVolume(maxVol ?? maxVolume)
    if (dayNumber !== undefined)
      setDayNumber(dayNumber);
    setIsDaily(false);
  }

  // console.log("showModal2", showModal)
  return (
    <Game
      key={gameKey}
      todaysAnswer={todaysAnswer}
      allCharacterData={allCharacterData}
      initialDifficulties={difficulties}
      onReset={resetGame} // Pass down reset function
      showModal={showModal}
      maxVolume={maxVolume} // Pass down showModal state
      isDaily={isDaily}
      setIsDaily={setIsDaily}
      dayNumber={dayNumber}
    />
  );
}