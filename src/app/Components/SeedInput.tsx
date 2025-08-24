// SeedInput.tsx
import { useState } from "react";

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
        </div>
    );
}
