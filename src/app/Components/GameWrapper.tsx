"use client"

import { useState } from "react";
import Game from "./Game";

interface GameWrapperProps {
    initialAnswer: string;
    allCharacterData: Map<string, string[]>,
    initialDifficulties: number[]
}

export default function GameWrapper({ initialAnswer, initialDifficulties, allCharacterData }: GameWrapperProps) {
    const [todaysAnswer, setTodaysAnswer] = useState(initialAnswer);
    const [difficulties, setDifficulties] = useState(initialDifficulties);
    const [gameKey, setGameKey] = useState(0);
  
    function resetGame(newAnswer?: string, newDifficulties?: number[]) {
      setTodaysAnswer(newAnswer || initialAnswer);
      setDifficulties(newDifficulties || initialDifficulties);
      setGameKey((prevKey) => prevKey + 1);
    }
  
    return (
      <Game
        key={gameKey}
        todaysAnswer={todaysAnswer}
        allCharacterData={allCharacterData}
        initialDifficulties={difficulties}
        onReset={resetGame} // Pass down reset function
      />
    );
  }

