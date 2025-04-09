import { useState } from "react";
import SettingsModal from "./SettingsModal";
import gearIcon from "../settingsGear.png"; // Store your PNG inside the assets folder

interface SettingsGearProps {
    settings: {
        difficultyCheckbox1: boolean;
        difficultyCheckbox2: boolean;
        difficultyCheckbox3: boolean;
        difficultyCheckbox4: boolean;
    };
    onSettingsChange: (updatedSettings: {
        difficultyCheckbox1: boolean;
        difficultyCheckbox2: boolean;
        difficultyCheckbox3: boolean;
        difficultyCheckbox4: boolean;
    }) => void;
    resetFunction: (newAnswer?: string, newDifficulties?: number[], newShowModal?: boolean) => void; // Accept reset function
    charData: Map<string, string[]>;
    toggleCategoryFunc: (category: string) => void;
    displayedCategories: string[];
    startOpen: number;
}

export default function SettingsGear({ settings, onSettingsChange, resetFunction, charData, toggleCategoryFunc, displayedCategories, startOpen }: SettingsGearProps) {
    const [isOpen, setIsOpen] = useState(false);
    let page: number = 0;
    if (startOpen > -1) {
        setIsOpen(true);
        page = startOpen;
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 rounded-full hover:bg-gray-200 transition duration-200"
            >
                <img src={gearIcon.src} alt="Settings" className="w-8 h-8" />
            </button>

            {isOpen && (
                <SettingsModal
                    onClose={() => setIsOpen(false)}
                    initialSettings={settings}
                    onSettingsChange={onSettingsChange}
                    resetFunction={resetFunction}
                    allCharacterData={charData}
                    toggleCategoryFunc={toggleCategoryFunc}
                    displayedCategories={displayedCategories}
                    settingsPage={page}
                />
            )}
        </>
    );
}
