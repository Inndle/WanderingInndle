/*export default function WinScreen({todaysAnswer, history}: {todaysAnswer: string, history:string[]}) {
    return (
    <div className="finished">
        <div className="finished-background">
            <div className="congrats"><span>You did it!</span></div>
            <div className="answer">
                <div className="answer-img">

                </div>
                <div className="answer-name">
                    <span className="answer-filler">
                        Today&apos;s answer was
                    </span>
                    <br></br>
                    <div className="answer-result">
                        {todaysAnswer}
                    </div>
                </div>
            </div>
            <div className="stats">
                <div className="number-of-tries">
                    <span>Number of tries: {history.length}</span>
                </div>
            </div>
        </div>
    </div>
    )
}*/
export default function WinScreen({todaysAnswer, history, onFreePlay}: {todaysAnswer: string, history: string[], onFreePlay: () => void}) {
    return (
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md mb-6 text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-4">You did it!</h2>
        <div className="text-lg text-gray-700 mb-2">
          Today's answer was:
        </div>
        <div className="text-2xl font-semibold text-black mb-4">
          {todaysAnswer}
        </div>
        <div className="text-sm text-gray-600 mb-6">
          Number of tries: {history.length}
        </div>
        <button
          onClick={onFreePlay}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl transition"
        >
          Play Again (Free Play)
        </button>
      </div>
    );
  }
  