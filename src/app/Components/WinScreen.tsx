export default function WinScreen({todaysAnswer, history, onFreePlay, characterData, difficulties, gaveUp, setGiveUp}: {
    todaysAnswer: string, 
    history: string[], 
    onFreePlay: (newAnswer?: string, newDifficulties?: number[], newShowModal?: boolean) => void,
    characterData: Map<string, string[]>,
    difficulties: number[],
    gaveUp: boolean,
    setGiveUp: (state: boolean) => void;
  }) {
    const handleResetClick = () => {
        if (difficulties.length === 0) {
            alert("Please select at least one difficulty level before resetting the game.");
            return;
        }

        const filteredKeys = Array.from(characterData.entries())
            .filter(([, values]) => values[11] !== undefined && difficulties.includes(Number(values[11])))
            .map(([key]) => key);

        if (filteredKeys.length > 0) {
            const randomIndex = Math.floor(Math.random() * filteredKeys.length);
            onFreePlay(filteredKeys[randomIndex], difficulties, false);
            if (gaveUp) {setGiveUp(false);}
        }
    };

    if (!gaveUp) {
      return (
        <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md mb-6 text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-4">You did it!</h2>
          <div className="text-lg text-gray-700 mb-2">
            Today&apos;s answer was:
          </div>
          <div className="text-2xl font-semibold text-black mb-4">
            {todaysAnswer}
          </div>
          <div className="text-sm text-gray-600 mb-6">
            Number of tries: {history.length}
          </div>
          <button
            onClick={handleResetClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl transition"
          >
            Play Again (Free Play)
          </button>
        </div>
      );
    } else {
      return (
        <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md mb-6 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">You Gave Up :(</h2>
          <div className="text-lg text-gray-700 mb-2">
            Today&apos;s answer was:
          </div>
          <div className="text-2xl font-semibold text-black mb-4">
            {todaysAnswer}
          </div>
          <div className="text-sm text-gray-600 mb-6">
            Number of tries: {history.length}
          </div>
          <button
            onClick={handleResetClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl transition"
          >
            Play Again (Free Play)
          </button>
        </div>
      );
    }
  }
  