export default function WinScreen({todaysAnswer, history}: {todaysAnswer: string, history:string[]}) {
    return (
    <div className="finished">
        <div className="finished-background">
            <div className="congrats"><span>You did it!</span></div>
            <div className="answer">
                <div className="answer-img">

                </div>
                <div className="answer-name">
                    <span className="answer-filler">
                        Today's answer was
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
}