import { useState, useEffect } from "react";

interface SettingsModalProps {
    onClose: () => void;
    initialSettings: {
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
    resetFunction: (newAnswer?: string, newDifficulties?: number[], newShowModal?: boolean) => void;
    allCharacterData: Map<string, string[]>;
    toggleCategoryFunc: (category: string) => void
    displayedCategories: string[]
}

export default function SettingsModal({ onClose, initialSettings, onSettingsChange, resetFunction, allCharacterData, toggleCategoryFunc, displayedCategories }: SettingsModalProps) {
    const [settings, setSettings] = useState(initialSettings);
    const [activeTab, setActiveTab] = useState("rules"); // ✅ Set default tab to "rules"

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
            .filter(([, value]) => value)
            .map(([key]) => Number(key.replace("difficultyCheckbox", "")));

        if (enabledLevels.length === 0) {
            alert("Please select at least one difficulty level before resetting the game.");
            return;
        }

        const filteredKeys = Array.from(allCharacterData.entries())
            .filter(([, values]) => values[11] !== undefined && enabledLevels.includes(Number(values[11])))
            .map(([key]) => key);

        if (filteredKeys.length > 0) {
            const randomIndex = Math.floor(Math.random() * filteredKeys.length);
            resetFunction(filteredKeys[randomIndex], enabledLevels, false);
        }
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="relative bg-white p-6 rounded-lg shadow-lg w-[28rem] min-h-[32rem]">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-700 hover:text-black bg-transparent p-2 text-2xl"
                >
                    &times;
                </button>

                {/* Tab Navigation */}
                <div className="flex border-b mb-4">
                    <button
                        className={`flex-1 p-2 ${activeTab === "rules" ? "border-b-2 border-blue-500 font-bold" : "text-gray-500"}`}
                        onClick={() => setActiveTab("rules")}
                    >
                        Rules
                    </button>
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

                {/* Rules Tab Content */}
                {activeTab === "rules" && (
                    <div className="overflow-y-auto max-h-[24rem] pr-2">
                        <h2 className="text-lg font-semibold text-center mb-2">Game Rules</h2>
                        <p className="text-sm leading-relaxed">
                            Choose any character from the Wandering Inn and guess them! If the category matches perfectly, it will be green. If it doesn&apos;t match at all, it will be red. And if a subset of your guess matches a subset of the correct answer, it will be yellow. 

                            You can choose your allowed columns (to prevent spoilers!) on the next page and your allowed difficulties on the page after that. The difficulties are subjective. (Hard is about the limit that we can get, but maybe you&apos;re better than us!)

                            Image: Main Image from the Wiki
                            Mentions: Number of mentions over all volumes (source)[https://innwords.pallandor.com/]
                            Introduced: Volume in which the character first appears (source)[https://innwords.pallandor.com/]
                            Gender: Female, Male, or Non-binary
                            Species: Human, Drake, Gnoll, etc.
                            Status: Alive, Deceased, or Unknown (up to the Palace of Fates Arc)
                            Affiliation: Groups, Nations, or People person is connected to (standardized to this format)
                            Continent: Avalon, Baleros, Chandrar, Drath, Isles, Izril, Kasignel, North America, Rhir, Sea, Terandria, Wistram
                            Residence: More specific than continent (standardized to this format)
                            Occupation: General category of their job (standardized to this format)
                            Fighting Type: Archer, God, Leader, Mage, Non-combat, Priest, Rogue, Warrior

                            The dataset was made manually, please direct all complaints and issues to wanderinginndle@gmail.com
                        </p>
                    </div>
                )}

                {/* Categories Tab Content */}
                {activeTab === "categories" && (
                    <div>
                        <h2 className="text-lg font-semibold text-center">Included Categories</h2>
                        {[
                            "Mentions", "Introduced", "Gender", "Species", "Status",
                            "Affiliation", "Continent", "Residence", "Occupation", "Fighting Type"
                        ].map((category) => (
                            <label key={category} className="flex items-center space-x-2 mb-2">
                                <input
                                    type="checkbox"
                                    name={`${category.toLowerCase().replace(/\s/g, "")}Checkbox`}
                                    checked={displayedCategories.includes(category)}
                                    onChange={() => toggleCategoryFunc(category)}
                                />
                                <span>{category}</span>
                            </label>
                        ))}
                    </div>
                )}

                {/* Difficulties Tab Content */}
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
                        <label className="flex items-center space-x-2 mb-2">
                            <input type="checkbox" name="difficultyCheckbox3" checked={settings.difficultyCheckbox3} onChange={handleChange} />
                            <span>Hard</span>
                        </label>
                        <label className="flex items-center space-x-2 mb-4">
                            <input type="checkbox" name="difficultyCheckbox4" checked={settings.difficultyCheckbox4} onChange={handleChange} />
                            <span>Expert</span>
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
