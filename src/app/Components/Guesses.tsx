import InputContainer from "./Input"
import SettingsGear from "./SettingsGear"
import { useState, useEffect } from "react";

//// Interfaces for Guesses Components
interface GuessContainerProps {
  allCharacterData: Map<string, string[]>,
  history: string[],
  onGuess: (guess: string) => void,
  todaysAnswer: string,
  difficulties: number[],
  onReset: (newAnswer?: string, newDifficulties?: number[], newShowModal?: boolean, maxVolume?: number) => void;
  setGiveUp: (state: boolean) => void,
  settingsStartOpen?: number;
  settingsModalFunc: (page: number) => void;
  maxVolume: number;
}

interface GuessBoxProps {
  allCharacterData: Map<string, string[]>,
  history: string[],
  todaysAnswer: string,
  onGuess: (guess: string) => void,
  difficultyLevels: number[],
  resetFunc: (newAnswer?: string, newDifficulties?: number[], newShowModal?: boolean, maxVolume?: number) => void;
  toggleCategoryFunc: (category: string) => void,
  displayedCategories: string[],
  setGiveUp: (state: boolean) => void,
  settingsStartOpen?: number;
  settingsModalFunc: (page: number) => void;
  maxVolume: number;
}

interface GiveUpModalProps {
  setGiveUp: (state: boolean) => void;
  onClose: () => void;
}

interface GuessesProps {
  allCharacterData: Map<string, string[]>,
  history: string[],
  todaysAnswer: string
}

interface GuessProps {
  allCharacterData: Map<string, string[]>,
  guess: string,
  todaysAnswer: string
}

//// Declaring useful constants
const CATEGORIES = [
  "id", "Aliases", "Gender", "Age", "Species", "Status", "Affiliation", "Continent", "Residence", "Occupation", "Fighting Type", "Image", "Difficulty", "Mentions", "Introduced"
]

const CATEGORY_ORDER = [
  "Image", "Mentions", "Introduced", "Gender", "Species", "Status", "Affiliation", "Continent", "Residence", "Occupation", "Fighting Type"
]

let DISPLAYED_CATEGORIES = [
  "Image", "Mentions", "Introduced", "Gender", "Species", "Status", "Affiliation", "Continent", "Residence", "Occupation", "Fighting Type"
]

// const CATEGORY_TO_TYPE = {
//   "Image": "Image",
//   "Mentions": "Scalar",
//   "Introduced": "Scalar",
//   "Gender": "Binary",
//   "Species": "Binary",
//   "Status": "Binary",
//   "Affiliation": "Categorical",
//   "Continent": "Categorical",
//   "Residence": "Categorical",
//   "Occupation": "Categorical",
//   "Fighting Type": "Categorical"
// }

const categoryTypeMap: Map<string, string> = new Map<string, string>;
categoryTypeMap.set("Image", "Image");
categoryTypeMap.set("Mentions", "Scalar");
categoryTypeMap.set("Introduced", "Scalar");
categoryTypeMap.set("Gender", "Binary");
categoryTypeMap.set("Species", "Category");
categoryTypeMap.set("Status", "Binary");
categoryTypeMap.set("Affiliation", "Category");
categoryTypeMap.set("Continent", "Category");
categoryTypeMap.set("Residence", "Category");
categoryTypeMap.set("Occupation", "Category");
categoryTypeMap.set("Fighting Type", "Category");

// const DEBUGGING = true;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//// Begin component declaration
export default function GuessContainer({ allCharacterData, history, onGuess, todaysAnswer, difficulties, onReset, setGiveUp, settingsStartOpen = -1, settingsModalFunc, maxVolume }: GuessContainerProps) {
  const [displayedCategories, setDisplayedCategories] = useState([...DISPLAYED_CATEGORIES]);

  const toggleCategory = (category: string) => {
    let updatedCategories;
    if (displayedCategories.includes(category)) {
      // Remove the category
      updatedCategories = displayedCategories.filter((c) => c !== category);
    } else {
      // Add it back while maintaining order
      updatedCategories = [...displayedCategories, category].sort(
        (a, b) => CATEGORY_ORDER.indexOf(a) - CATEGORY_ORDER.indexOf(b)
      );
    }
    // Update both global and local states
    DISPLAYED_CATEGORIES = updatedCategories;
    setDisplayedCategories(updatedCategories);
  };

  // Sync with global variable when it changes elsewhere
  useEffect(() => {
    setDisplayedCategories([...DISPLAYED_CATEGORIES]);
  }, [DISPLAYED_CATEGORIES]);

  return (
    <div className="guess-container flex flex-col items-center justify-center w-full">
      <GuessBox
        allCharacterData={allCharacterData}
        history={history}
        todaysAnswer={todaysAnswer}
        onGuess={onGuess}
        difficultyLevels={difficulties}
        resetFunc={onReset}
        toggleCategoryFunc={toggleCategory}
        displayedCategories={displayedCategories}
        setGiveUp={setGiveUp}
        settingsStartOpen={settingsStartOpen}
        settingsModalFunc={settingsModalFunc}
        maxVolume={maxVolume}
      >
      </GuessBox>
      {history.length > 0 && <Guesses allCharacterData={allCharacterData} history={history} todaysAnswer={todaysAnswer}></Guesses>}
    </div>
  )
}

function GuessBox({ allCharacterData, history, todaysAnswer, onGuess, difficultyLevels, resetFunc, setGiveUp, toggleCategoryFunc, displayedCategories, settingsStartOpen = -1, settingsModalFunc, maxVolume }: GuessBoxProps) {
  const [settings, setSettings] = useState({
    difficultyCheckbox1: difficultyLevels.includes(1),
    difficultyCheckbox2: difficultyLevels.includes(2),
    difficultyCheckbox3: difficultyLevels.includes(3),
    difficultyCheckbox4: difficultyLevels.includes(4),
  });

  const handleSettingsChange = (updatedSettings: typeof settings) => {
    // console.log("Updated settings in GuessBox:", updatedSettings);
    setSettings(updatedSettings);
  };

  const [giveUpIsOpen, setGiveUpIsOpen] = useState(false);

  return (
    <div className="guessbox relative flex justify-center w-2/3 my-4">
      <InputContainer allCharacterData={allCharacterData} history={history} onGuess={onGuess} />
      <div className="absolute top-0 right-0">
        <SettingsGear
          settings={settings}
          onSettingsChange={handleSettingsChange}
          resetFunction={resetFunc}
          charData={allCharacterData}
          toggleCategoryFunc={toggleCategoryFunc}
          displayedCategories={displayedCategories}
          startOpen={settingsStartOpen}
          settingsModalFunc={settingsModalFunc}
          maxVolume={maxVolume}
        />
      </div>
      {history.length > 4 && !history.includes(todaysAnswer) && <div className="absolute top-0 left-0">
        <button
          onClick={() => { setGiveUpIsOpen(true) }}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          Give Up
        </button>
      </div>}
      {giveUpIsOpen && <GiveUpModal setGiveUp={setGiveUp} onClose={() => setGiveUpIsOpen(false)} />}
    </div>
  );
}

function GiveUpModal({ setGiveUp, onClose }: GiveUpModalProps) {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-[14rem] min-h-[2rem]">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-700 hover:text-black bg-transparent p-1 text-2xl"
        >
          &times;
        </button>
        <h2 className="text-lg font-semibold text-center mb-4">Are you sure you want to give up?</h2>
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => { setGiveUp(true); onClose(); }}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            Give Up
          </button>
        </div>
      </div>
    </div>
  );
}

function Guesses({ allCharacterData, history, todaysAnswer }: GuessesProps) {
  return (
    <div className="guesses-container flex flex-col justify-center w-full">
      <div className="overflow-x-auto w-full">
        <div className="min-w-max mx-auto sm:w-1/2">
          <div className="category-bar grid mb-4 flex" style={{ gridTemplateColumns: `repeat(${DISPLAYED_CATEGORIES.length}, minmax(0, 1fr))` }} >
            {DISPLAYED_CATEGORIES.map((category, index) => (
              <div key={index} className="w-20 sm:w-24 h-12 category-title border-0">
                <div className="justify-center flex text-white text-sm sm:text-base">
                  {category === "Image" ? "Name" : category}
                </div>
                <hr className="w-12 sm:w-16 h-0.5 mx-auto my-1 bg-gray-100 border-0 md:my-1"></hr>
              </div>
            ))}
          </div>
          <div className="guess-history w-full flex flex-col items-center">
            <ul className="w-full">
              {
                history.map((guess, index) => {
                  // Only animate the most recent guess
                  const isLatest = index === 0;

                  return <li key={index} className="w-full">
                    <Guess
                      todaysAnswer={todaysAnswer}
                      allCharacterData={allCharacterData}
                      guess={guess}
                      isLatest={isLatest}
                    >
                    </Guess>
                  </li>
                })
              }
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export type CellPlan = CellResponse & {
  guess: string,
  content: string,
  /** Name of the category */
  name: string,
  /** Index in the list */
  index: number,
}

export type CellResponse = {
  type: "Image",
  /** Image of the guessed person */
  response: string
} | {
  type: "Scalar",
  response: "High" | "Low" | "Correct"
} | {
  type: "Binary",
  response: "Correct" | "Incorrect"
} | {
  type: "Category",
  response: "None" | "Match" | "Partial"
}

export function planRow({todaysAnswer, allCharacterData, guess}: GuessProps): CellPlan[] {
  // Call function to determine types in GuessDetail
  const allResponses: Map<string, string> = determineResponse({ todaysAnswer, guess, allCharacterData });
  const guessDetailsMap = getCharacterDetailsMap(guess, allCharacterData);

  return DISPLAYED_CATEGORIES.map((category, index) => {
    const responseDetail = allResponses.get(category);
    let type: string;
    let content: string;
    let response: string;

    if (responseDetail === undefined) {
      type = "ERROR"
      content = "ERROR"
      response = "Error"
    } else {
      type = categoryTypeMap.get(category)!; // sin of exclamation mark!!
      response = responseDetail!;
      content = guessDetailsMap.get(category)!.join(", "); // sin of exclamation mark!!
    }

    // Trusting `compareDetails` to satisfy this type
    const tr = {type, response} as CellResponse;

    return {
      guess,
      ...tr,
      content,
      index,
      name: category
    };
  })
}

function Guess(props: GuessProps & { isLatest: boolean }) {
  const rowPlan = planRow(props);

  // Dynamically populate the guess row with the correct response according to given guess
  return (
    <div
      className="guess grid gap-1 sm:gap-2 rounded-lg w-full mb-2 sm:mb-4 text-white"
      style={{ gridTemplateColumns: `repeat(${DISPLAYED_CATEGORIES.length}, minmax(0, 1fr))` }}
    >
      {
        rowPlan.map((cellPlan, index) => {
          return (
            <GuessDetail
              {...cellPlan}
              key={index}
              isLatest={props.isLatest}
            />
          )
        })
      }
    </div>
  )

  function GuessDetail({ guess, type, response, content, name, isLatest, index }: CellPlan & { isLatest?: boolean }) {
    // Add animation styles with delay based on index
    const animationDelay = `${index * 220}ms`;
    const animationStyle = isLatest ? { animationDelay } : {};

    // Determine what css to apply and how to apply content depending on the given
    const generic_styling = "hover:brightness-90 flex items-center justify-center text-center border border-gray-600 rounded w-20 h-20 sm:w-24 sm:h-24 ";
    const animationClass = isLatest ? "animate-flip-in" : "";

    if (content === "") {
      content = "Unknown";
    }

    switch (type) {
      case "Image":
        // if (content === "Unknown") {
        return (
          <div
            className={`${generic_styling} bg-white text-black font-bold sm:text-base ${animationClass}`}
            style={animationStyle}
          >
            {guess}
          </div>
        );
      // } else {
      //   return (
      //     <div 
      //       className={`${generic_styling} relative group ${animationClass}`}
      //       style={animationStyle}
      //     >
      //       <img className="w-full h-full object-cover rounded" src={content} alt="Profile Photo" />
      //       <div className="absolute inset-0 bg-white text-black flex items-center justify-center font-bold sm:text-base rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      //         {guess}
      //       </div>
      //     </div>
      //   );
      // }
      case "Scalar":
        let scalarStyling = "";
        switch (response) {
          case "High":
            scalarStyling = "bg-red-500 up-arrow-clip-path display:inline-block"
            break;
          case "Low":
            scalarStyling = "bg-red-500 down-arrow-clip-path display:inline-block"
            break;
          case "Correct":
            scalarStyling = "bg-green-500 display:inline-block"
            break;
        }
        if (name === "Introduced") {
          return (
            <div
              className={`${generic_styling} ${scalarStyling} ${animationClass} sm:text-base`}
              style={animationStyle}
            >
              <span>{"Vol. " + content}</span>
            </div>
          )
        } else {
          return (
            <div
              className={`${generic_styling} ${scalarStyling} ${animationClass} sm:text-base`}
              style={animationStyle}
            >
              <span>{content}</span>
            </div>
          )
        }
      case "Binary":
        let binaryStyling = "";
        switch (response) {
          case "Incorrect":
            binaryStyling = "bg-red-500"
            break;
          case "Correct":
            binaryStyling = "bg-green-500"
            break;
        }
        return (
          <div
            className={`${generic_styling} ${binaryStyling} ${animationClass} sm:text-base`}
            style={animationStyle}
          >
            <span>{content}</span>
          </div>
        )
      case "Category":
        let categoryStyling = "";
        switch (response) {
          case "None":
            categoryStyling = "bg-red-500"
            break;
          case "Partial":
            categoryStyling = "bg-yellow-500"
            break;
          case "Match":
            categoryStyling = "bg-green-500"
            break;
        }
        // Calculate font size based on content length
        const isMobile = window.screen.width < 640;
        const minFontSize = isMobile ? 8 : 10;
        const maxFontSize = 16;
        const fontSize = Math.max(minFontSize, maxFontSize - Math.floor(content.length / 8));

        return (
          <div
            className={`${generic_styling} ${categoryStyling} ${animationClass}`}
            style={{ ...animationStyle, fontSize: `${fontSize}px` }}
          >
            <span>{content}</span>
          </div>
        )
    }
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
//// Helper functions

/**
 * Takes a guess and compares it to the correct answer for the day. Afterwards, it sends a
 * response for the frontend to display of the form:
 * {
 *   Mentions : "Lower",
 *   Affiliations : "Partial",
 *   ...
 * }
 * @param todaysAnswer
 * @param guess
 * returns a map of Map<string, string>
 */
function determineResponse({ todaysAnswer, allCharacterData, guess }: GuessProps): Map<string, string> {
  // Get guess details
  const guessMap: Map<string, string[]> = getCharacterDetailsMap(guess, allCharacterData);
  // Get today's answer details
  const answerMap: Map<string, string[]> = getCharacterDetailsMap(todaysAnswer, allCharacterData);
  // Call function on details of guess and todays answer to create the response
  return compareDetails({ guessMap, answerMap });
}

/**
 * Creates a map of {category : detailsArray} for the specified character
 * @param characterName: name of the character to get details of
 * @param allCharacterData: Map containing the CSV of the character data
 * @returns characterDetailsMap, a Map<string, string[]> of {category : detailsArray}
 */
function getCharacterDetailsMap(characterName: string, allCharacterData: Map<string, string[]>) {
  // Get guess details for the given character and confirm that it exists
  const characterDetails: string[] | undefined = allCharacterData.get(characterName);
  if (characterDetails === undefined) {
    // console.log(`Could not find details for ${characterName}`)
    throw new Error(`Could not find details for ${characterName}`)
  }

  // Organize details of both answer and guess into maps of category : detail so it's parseable
  // Detail is a string array, looking like: ["Erin Solstice", "Sky", "Goblinfriend", etc...]
  const characterDetailsMap: Map<string, string[]> = new Map<string, string[]>

  // i starts at 1 because CATEGORIES includes id but guessDetails does not
  for (let i = 1; i < CATEGORIES.length; i++) {
    // if (DEBUGGING) {
    //   console.log(`CATEGORIES[i]: ${CATEGORIES[i]}, characterDetails: ${characterDetails[i - 1]}`)
    // }
    characterDetailsMap.set(CATEGORIES[i], parseCategory(characterDetails[i - 1]))
  }

  return characterDetailsMap;
}

/**
 * Used to help clean up CSV data and turn it into an array of strings
 * @param row, a string representing a category from the CSV looking like "Erin Solstice | Sky | etc..."
 * @returns ans, an array of strings (e.g. ["Erin Solstice", "Sky", "Goblinfriend", etc...])
 */
function parseCategory(categoryString: string): string[] {
  const categoryEntries = categoryString.split(" |")
  const ans: string[] = [];
  categoryEntries.forEach((entry) => {
    ans.push(entry.trim());
    // Check if there was inconsistent entry into the CSV (i.e. inclusion of " |" or not)
    if (ans.length > 1 && ans[ans.length - 1] === "") {
      ans.pop()
    }
  })
  return ans;
}

/**
 * Takes the details of two characters and compares them, then sends the appropriate response
 * in the form:
 * {
 *   Mentions : "Lower",
 *   Affiliations : "Partial",
 *   ...
 * }
 * Responses depend on the type of comparison made and range from the following:
 * {
 *   Image: Image URL,
 *   Scalar: ["High", "Low", "Correct"],
 *   Binary: ["Incorrect", "Correct"],
 *   Category: ["None", "Partial", "Match"]
 * }
 * @param guessMap
 * @param answerMap
 * @returns a map of Map<string, string>
 */
function compareDetails({ guessMap, answerMap }: { guessMap: Map<string, string[]>, answerMap: Map<string, string[]> }): Map<string, string> {
  // Create the response that we will be returning back up
  const response: Map<string, string> = new Map<string, string>

  // Fill out the response according to the categories we have to display
  DISPLAYED_CATEGORIES.forEach((category) => {
    const guessDetail = guessMap.get(category);
    const answerDetail = answerMap.get(category);

    // if (DEBUGGING) {
    //   console.log(`Comparing Guess (${guessDetail}) and Answer (${answerDetail})`)
    // }

    // Ensure map has elements we want in it (this is mainly for typescript)
    if (guessDetail === undefined) {
      // console.log(`Could not find details for ${category}`)
      throw new Error(`Could not find details for ${category}`)
    }
    if (answerDetail === undefined) {
      // console.log(`Could not find details for ${category}`)
      throw new Error(`Could not find details for ${category}`)
    }

    switch (categoryTypeMap.get(category)) {
      // Respond with the image of the guessed person
      case "Image":
        response.set(category, guessDetail[0]);
        break;
      // Respond with whether the detail is larger, smaller, or equal
      case "Scalar":
        let scalarAns: string = "";
        const diff: number = parseInt(guessDetail[0]) - parseInt(answerDetail[0]);
        if (diff > 0) {
          scalarAns = "High"
        } else if (diff < 0) {
          scalarAns = "Low"
        } else {
          scalarAns = "Correct"
        }
        response.set(category, scalarAns);
        break;
      // Respond with whether the detail is correct or not
      case "Binary":
        const binaryAns: string = guessDetail[0] === answerDetail[0] ? "Correct" : "Incorrect";
        response.set(category, binaryAns)
        break;
      // Respond with whether there are some entries that overlap or not
      case "Category":
        let categoryAns: string = ""
        const guessSet = new Set(guessDetail);
        const answerSet = new Set(answerDetail);
        const elementsInCommon: number = guessSet.intersection(answerSet).size;
        // console.log(elementsInCommon)
        if (elementsInCommon === 0) {
          categoryAns = "None"
        } else if (elementsInCommon === answerSet.size && elementsInCommon === guessSet.size) {
          categoryAns = "Match"
        } else {
          categoryAns = "Partial"
        }
        response.set(category, categoryAns);
        break;
    }
  })

  return response
}
