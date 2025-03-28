"use client"

import { useState } from "react";
import Game from "./Game";

interface GameWrapperProps {
    allCharacterData: Map<string, string[]>,
}

const DEBUGGING = false;

export default function GameWrapper({ allCharacterData }: GameWrapperProps) {
    const initialDifficulties: number[] = [1, 2, 3];

    const filteredData = new Map(
      [...allCharacterData.entries()].filter(
        ([, values]) => values[11] !== undefined && initialDifficulties.includes(Number(values[11]))
      )
    );

    const keys = Array.from(filteredData.keys());
    const randomIndex = Math.floor(Math.random() * keys.length);
    const initialAnswer: string = keys[randomIndex];

    if (DEBUGGING) {  
      const todaysAnswerDetails: string[] | undefined = allCharacterData.get(initialAnswer);
      if (todaysAnswerDetails === undefined) {
        console.log('Selected character does not have info')
      }
      else {
        console.log(todaysAnswerDetails);
        console.log(`Today's Answer: ${initialAnswer}`);
        console.log(`Today's Answer Aliases: ${todaysAnswerDetails[0].split(" |")}`);
        console.log(`Today's Answer Fighting Type: ${todaysAnswerDetails[todaysAnswerDetails.length-1].split(" |")}`);
      }
    }

    const [todaysAnswer, setTodaysAnswer] = useState(initialAnswer);
    const [difficulties, setDifficulties] = useState(initialDifficulties);
    const [gameKey, setGameKey] = useState(0);
    const [showModal, setShowModal] = useState(true);
  
    function resetGame(newAnswer?: string, newDifficulties?: number[], newShowModal?: boolean) {
      setTodaysAnswer(newAnswer || initialAnswer);
      setDifficulties(newDifficulties || initialDifficulties);
      setShowModal(newShowModal ?? true);
      setGameKey((prevKey) => prevKey + 1);
    }
    
  
    return (
      <Game
        key={gameKey}
        todaysAnswer={todaysAnswer}
        allCharacterData={allCharacterData}
        initialDifficulties={difficulties}
        onReset={resetGame} // Pass down reset function
        showModal={showModal} // Pass down showModal state
      />
    );
}