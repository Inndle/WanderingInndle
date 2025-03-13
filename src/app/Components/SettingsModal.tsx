import { useState, useEffect } from "react";

interface SettingsModalProps {
    onClose: () => void;
    initialSettings: {
        difficultyCheckbox1: boolean;
        difficultyCheckbox2: boolean;
        difficultyCheckbox3: boolean;
    };
    onSettingsChange: (updatedSettings: {
        difficultyCheckbox1: boolean;
        difficultyCheckbox2: boolean;
        difficultyCheckbox3: boolean;
    }) => void;
    resetFunction: (newAnswer?: string, newDifficulties?: number[]) => void;
    allCharacterData: Map<string, string[]>;
    toggleCategoryFunc: (category: string) => void
    displayedCategories: string[]
}

export default function SettingsModal({ onClose, initialSettings, onSettingsChange, resetFunction, allCharacterData, toggleCategoryFunc, displayedCategories }: SettingsModalProps) {
    const [settings, setSettings] = useState(initialSettings);
    const [activeTab, setActiveTab] = useState("categories");

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, checked } = event.target;
        setSettings((prev) => ({
            ...prev,
            [name]: checked,
        }));
    }

    useEffect(() => {
        onSettingsChange(settings);
    }, [settings]);

    const handleResetClick = () => {
        const enabledLevels = Object.entries(settings)
            .filter(([_, value]) => value)
            .map(([key]) => Number(key.replace("difficultyCheckbox", "")));

        if (enabledLevels.length === 0) {
            alert("Please select at least one difficulty level before resetting the game.");
            return;
        }

        const filteredKeys = Array.from(allCharacterData.entries())
            .filter(([_, values]) => values[11] !== undefined && enabledLevels.includes(Number(values[11])))
            .map(([key]) => key);

        if (filteredKeys.length > 0) {
            const randomIndex = Math.floor(Math.random() * filteredKeys.length);
            resetFunction(filteredKeys[randomIndex], enabledLevels);
        }
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="relative bg-white p-6 rounded-lg shadow-lg w-80">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-700 hover:text-black bg-transparent p-2 text-2xl"
                >
                    &times;
                </button>

                {/* Tab Navigation */}
                <div className="flex border-b mb-4">
                    <button
                        className={`flex-1 p-2 ${activeTab === "categories" ? "border-b-2 border-blue-500 font-bold" : "text-gray-500"}`}
                        onClick={() => setActiveTab("categories")}
                    >
                        Categories Settings
                    </button>
                    <button
                        className={`flex-1 p-2 ${activeTab === "difficulties" ? "border-b-2 border-blue-500 font-bold" : "text-gray-500"}`}
                        onClick={() => setActiveTab("difficulties")}
                    >
                        Difficulty Settings
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === "categories" && (

                    <div>
                        <h2 className="text-lg font-semibold text-center">Included Categories</h2>

                        <label className="flex items-center space-x-2 mb-2">
                        <input 
                            type="checkbox" 
                            name="mentionsCheckbox" 
                            checked={displayedCategories.includes("Mentions")} 
                            onChange={() => toggleCategoryFunc("Mentions")} 
                        />
                        <span>Mentions</span>
                        </label>

                        <label className="flex items-center space-x-2 mb-2">
                        <input 
                            type="checkbox" 
                            name="introducedCheckbox" 
                            checked={displayedCategories.includes("Introduced")} 
                            onChange={() => toggleCategoryFunc("Introduced")} 
                        />
                        <span>Introduced</span>
                        </label>

                        <label className="flex items-center space-x-2 mb-2">
                        <input 
                            type="checkbox" 
                            name="genderCheckbox" 
                            checked={displayedCategories.includes("Gender")} 
                            onChange={() => toggleCategoryFunc("Gender")} 
                        />
                        <span>Gender</span>
                        </label>

                        <label className="flex items-center space-x-2 mb-2">
                        <input 
                            type="checkbox" 
                            name="speciesCheckbox" 
                            checked={displayedCategories.includes("Species")} 
                            onChange={() => toggleCategoryFunc("Species")} 
                        />
                        <span>Species</span>
                        </label>

                        <label className="flex items-center space-x-2 mb-2">
                        <input 
                            type="checkbox" 
                            name="StatusCheckbox" 
                            checked={displayedCategories.includes("Status")} 
                            onChange={() => toggleCategoryFunc("Status")} 
                        />
                        <span>Status</span>
                        </label>

                        <label className="flex items-center space-x-2 mb-2">
                        <input 
                            type="checkbox" 
                            name="affiliationCheckbox" 
                            checked={displayedCategories.includes("Affiliation")} 
                            onChange={() => toggleCategoryFunc("Affiliation")} 
                        />
                        <span>Affiliation</span>
                        </label>

                        <label className="flex items-center space-x-2 mb-2">
                        <input 
                            type="checkbox" 
                            name="continentCheckbox" 
                            checked={displayedCategories.includes("Continent")} 
                            onChange={() => toggleCategoryFunc("Continent")} 
                        />
                        <span>Continent</span>
                        </label>

                        <label className="flex items-center space-x-2 mb-2">
                        <input 
                            type="checkbox" 
                            name="residenceCheckbox" 
                            checked={displayedCategories.includes("Residence")} 
                            onChange={() => toggleCategoryFunc("Residence")} 
                        />
                        <span>Residence</span>
                        </label>

                        <label className="flex items-center space-x-2 mb-2">
                        <input 
                            type="checkbox" 
                            name="occupationCheckbox" 
                            checked={displayedCategories.includes("Occupation")} 
                            onChange={() => toggleCategoryFunc("Occupation")} 
                        />
                        <span>Occupation</span>
                        </label>
                        
                        <label className="flex items-center space-x-2 mb-2">
                        <input 
                            type="checkbox" 
                            name="fightingTypeCheckbox" 
                            checked={displayedCategories.includes("Fighting Type")} 
                            onChange={() => toggleCategoryFunc("Fighting Type")} 
                        />
                        <span>Fighting Type</span>
                        </label>
                    </div>
                    
                )}

                {activeTab === "difficulties" && (
                    <div>
                        <h2 className="text-lg font-semibold text-center">Included Difficulties</h2>
                        <label className="flex items-center space-x-2 mb-2">
                            <input type="checkbox" name="difficultyCheckbox1" checked={settings.difficultyCheckbox1} onChange={handleChange} />
                            <span>Easy</span>
                        </label>
                        <label className="flex items-center space-x-2 mb-2">
                            <input type="checkbox" name="difficultyCheckbox2" checked={settings.difficultyCheckbox2} onChange={handleChange} />
                            <span>Medium</span>
                        </label>
                        <label className="flex items-center space-x-2 mb-4">
                            <input type="checkbox" name="difficultyCheckbox3" checked={settings.difficultyCheckbox3} onChange={handleChange} />
                            <span>Hard</span>
                        </label>
                        <div className="flex justify-center">
                            <button onClick={handleResetClick} className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">
                                Save & Reset
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}