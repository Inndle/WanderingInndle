// SeedInput.tsx
import { useState } from "react";
import { hardcodedAnswers } from "./dailyAnswers";

function encodeWithNonce(input: string): string {
    const nonce = Math.random().toString(16).slice(2, 10);
    const disguised = Array.from(input)
        .map((char, i) => String.fromCharCode(char.charCodeAt(0) ^ nonce.charCodeAt(i % nonce.length)))
        .join("");

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

interface SeedInputProps {
    resetFunc: (newAnswer?: string, newDifficulties?: number[], newShowModal?: boolean) => void;
    enabledLevels: number[];
    allCharacterData: Map<string, string[]>;
}

export default function SeedInput({ resetFunc, enabledLevels, allCharacterData }: SeedInputProps) {
    const [inputValue, setInputValue] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [generatedSeed, setGeneratedSeed] = useState<string | null>(null);
    const [hasNoData, setHasNoData] = useState(false);
    const [seedCopied, setSeedCopied] = useState(false);

    const handleSubmit = () => {
        try {
            const decodedChar = decodeWithNonce(inputValue);
            if (allCharacterData.has(decodedChar)) {
                resetFunc(decodedChar, enabledLevels, false);
            } else {
                alert("Invalid seed")
            }
        } catch {
            alert("Invalid seed");
        }
    };

    const handleDateChange = (date: string) => {
        setSelectedDate(date);
        setSeedCopied(false);

        const character = hardcodedAnswers[date];
        setGeneratedSeed(character ? encodeWithNonce(character) : null);
        setHasNoData(Boolean(date) && !character);
    };

    const copyGeneratedSeed = async () => {
        if (!generatedSeed) return;

        await navigator.clipboard.writeText(generatedSeed);
        setSeedCopied(true);
    };

    return (
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

            <section className="mt-8 border-t pt-6 text-center">
                <h2 className="text-lg font-semibold mb-4">Generate Seed</h2>
                <label htmlFor="seed-date" className="block text-gray-700 text-sm font-semibold mb-2">
                    Select a date:
                </label>
                <input
                    id="seed-date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className="mx-auto block rounded-lg border p-2 focus:outline-none focus:ring focus:ring-indigo-300"
                />

                {generatedSeed && (
                    <button
                        type="button"
                        onClick={copyGeneratedSeed}
                        className="mt-4 w-full break-all rounded-lg bg-gray-100 p-3 font-mono text-sm text-gray-800 hover:bg-gray-200"
                        title="Copy seed"
                    >
                        {seedCopied ? "Copied!" : generatedSeed}
                    </button>
                )}

                {hasNoData && <p className="mt-4 text-sm text-red-600">No data for entered day. Sorry!</p>}
            </section>
        </div>
    );
}
