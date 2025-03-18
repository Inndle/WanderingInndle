
import GameWrapper from "./Components/GameWrapper";


/**
 * Performs data loading outside of rendering the game so it only happens once.
 * @returns <Game>
 */
export default function Home() {
  //// Recieve correct answer of the day from API (Might need loading bar)
  // Use parser to read in data 

  return <div className="background bg-cover bg-center flex justify-center"
              style={{
                height: "100vh",
                backgroundAttachment: "fixed",
                backgroundPosition: "center",
                backgroundImage: `url(https://static.wixstatic.com/media/94aeec_7f348c6465ca474aa9503b3640e76faf~mv2.jpg/v1/fill/w_1290,h_885,al_c,q_90/file.jpg)`
              }}> 
              <div className="game-container overflow-y-scroll w-full h-full">
                <GameWrapper/>
                {/* <Game todaysAnswer={todaysAnswer} allCharacterData={allCharacterData} initialDifficulties={difficulties}></Game> */}
              </div>
          </div> 
}


