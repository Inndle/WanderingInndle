import { ChangeEvent, useState } from "react"

interface InputContainerProps {
    allCharacterData: Map<string, string[]>,
    history: string[]
    onGuess: (guess: string)=>void
  }
export default function InputContainer({allCharacterData, history, onGuess} : InputContainerProps) {
    return <div className="input-container flex items-center space-x-2 bg-transparent">
                <InputBar allCharacterData={allCharacterData} history={history} onGuess={onGuess} ></InputBar>
                <SubmitButton></SubmitButton>
            </div> 
}

function InputBar({ allCharacterData, history, onGuess }: InputContainerProps) {
    const [input, setInput] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const names: string[] = Array.from(allCharacterData.keys());

    const options: string[] = names
        .filter(name => !history.includes(name))
        .filter(name => {
            const lowerInput = input.toLowerCase();
            const data = allCharacterData.get(name);
            if (!data) return false;

            const aliasNames = data[0]?.split('|').map(n => n.trim().toLowerCase()) || [];

            return (
                name.toLowerCase().includes(lowerInput) || // Match key
                aliasNames.some(alias => alias.includes(lowerInput)) // Match alias names
            );
        })
        .sort((a, b) => {
            const lowerInput = input.toLowerCase();
            const aStarts = a.toLowerCase().startsWith(lowerInput);
            const bStarts = b.toLowerCase().startsWith(lowerInput);

            if (aStarts && !bStarts) return -1;
            if (!aStarts && bStarts) return 1;

            const extractPriority = (name: string): number => {
                const data = allCharacterData.get(name);
                if (!data) return -Infinity;
                return parseInt(data[12], 10) || -Infinity;
            };

            const priorityA = extractPriority(a);
            const priorityB = extractPriority(b);

            return priorityB - priorityA || a.localeCompare(b);
        });

    function handleSubmit(guess: string) {
        setInput("");
        setShowDropdown(false);
        onGuess(guess);
        // console.log(`Guessed ${guess}`);
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter" && input !== "" && options.length > 0) {
            handleSubmit(options[0]);
        }
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
        setShowDropdown(event.target.value !== "");
    };

    const handleClick = (option: string) => {
        handleSubmit(option);
    };

    return (
        <div className="input-bar relative w-72">
            <input
                className="w-full px-4 py-2 text-white bg-gray-900 border-2 border-cyan-500 rounded-lg outline-none focus:ring-2 focus:ring-cyan-400 placeholder-gray-400"
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                type="text"
                placeholder="Guess the character here!"
                autoComplete="off"
            />
            {showDropdown && (
                <ul className="absolute left-0 right-0 mt-1 overflow-y-auto bg-gray-800 shadow-md max-h-48 rounded-md max-h-50" style={{ zIndex: "1" }}>
                    {(() => {
                        const lowerInput = input.toLowerCase();

                        return options.map((option, index) => {
                            const data = allCharacterData.get(option);
                            const aliases = data?.[0]?.split('|').map(alias => alias.trim()) || [];
                            const firstAlias = aliases[0] || option;

                            const matchedAlias = aliases.find(alias => alias.toLowerCase().includes(lowerInput));
                            const showMatched = matchedAlias && !firstAlias.toLowerCase().includes(matchedAlias.toLowerCase());

                            return (
                                <li
                                    key={index}
                                    onClick={() => handleClick(option)}
                                    className="p-2 text-white cursor-pointer hover:bg-cyan-600"
                                >
                                    <div className="leading-tight">
                                        <div>{firstAlias}</div>
                                        {showMatched && (
                                            <div className="text-sm text-gray-400">{matchedAlias}</div>
                                        )}
                                    </div>
                                </li>
                            );
                        });
                    })()}
    </ul>
)}

        </div>
    );
}

function SubmitButton() {
    //onClick={()=> {}}
    return <div className="submit-button"><img></img></div>
}