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
    const [activeTab, setActiveTab] = useState("rules");

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
            <div className="relative bg-white p-6 rounded-lg shadow-lg w-[30rem] min-h-[32rem]">
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
                    <div className="overflow-y-auto max-h-[24rem] pr-2 text-sm leading-relaxed">
                        <h2 className="text-lg font-semibold text-center mb-4">Game Rules</h2>

                        <p className="mb-4">
                        Choose any character from <em>The Wandering Inn</em> and try to guess them!
                        Each column provides feedback on your guess:
                        </p>

                        <ul className="list-disc list-inside mb-4">
                        <li><span className="text-green-600 font-semibold">Green</span>: Exact match</li>
                        <li><span className="text-yellow-500 font-semibold">Yellow</span>: Partial match (subset overlap)</li>
                        <li><span className="text-red-500 font-semibold">Red</span>: No match</li>
                        </ul>

                        <p className="mb-4">
                        You can customize which columns are shown (to avoid spoilers!) on the next page,
                        and pick your difficulty on the one after that. Difficulties are subjective — 
                        <em>Hard</em> is usually the best we can do, but maybe you’re better than us!
                        </p>

                        <h2 className="text-lg font-semibold text-center mb-4">Column Definitions</h2>

                        <dl className="text-sm space-y-2">
                        <div className="flex">
                            <dt className="font-bold w-28 shrink-0">Image:</dt>
                            <dd>Main image from the (<a href="https://wiki.wanderinginn.com/The_Wandering_Inn_Wiki" className="text-blue-600 underline" target="_blank">wiki</a>)</dd>
                        </div>
                        <div className="flex">
                            <dt className="font-bold w-28 shrink-0">Mentions:</dt>
                            <dd>Number of mentions over all volumes (<a href="https://innwords.pallandor.com/" className="underline text-blue-600">InnWords</a>)</dd>
                        </div>
                        <div className="flex">
                            <dt className="font-bold w-28 shrink-0">Introduced:</dt>
                            <dd>Volume of first appearance (<a href="https://innwords.pallandor.com/" className="text-blue-600 underline" target="_blank">InnWords</a>)</dd>
                        </div>
                        <div className="flex">
                            <dt className="font-bold w-28 shrink-0">Gender:</dt>
                            <dd>Female, Male, or Non-binary</dd>
                        </div>
                        <div className="flex">
                            <dt className="font-bold w-28 shrink-0">Species:</dt>
                            <dd>Human, Drake, Gnoll, etc.</dd>
                        </div>
                        <div className="flex">
                            <dt className="font-bold w-28 shrink-0">Status:</dt>
                            <dd>Alive, Active, Deceased, or Unknown (up to the Palace of Fates Arc)</dd>
                        </div>
                        <div className="flex">
                            <dt className="font-bold w-28 shrink-0">Affiliation:</dt>
                            <dd>Groups, Nations, or people the character is connected to (standardized)</dd>
                        </div>
                        <div className="flex">
                            <dt className="font-bold w-28 shrink-0">Continent:</dt>
                            <dd>Avalon, Baleros, Chandrar, Drath, Isles, Izril, Kasignel, North America, Rhir, Sea, Terandria, Wistram</dd>
                        </div>
                        <div className="flex">
                            <dt className="font-bold w-28 shrink-0">Residence:</dt>
                            <dd>More specific than continent (standardized)</dd>
                        </div>
                        <div className="flex">
                            <dt className="font-bold w-28 shrink-0">Occupation:</dt>
                            <dd>General category of job (standardized)</dd>
                        </div>
                        <div className="flex">
                            <dt className="font-bold w-28 shrink-0">Fighting Type:</dt>
                            <dd>Archer, God, Leader, Mage, Non-combat, Priest, Rogue, Warrior</dd>
                        </div>
                        </dl>

                        <p className="mt-4 text-gray-600 italic">
                        This dataset was created manually. For corrections, complaints, or contributions, email <a href="mailto:wanderinginndle@gmail.com" className="text-blue-600 underline">wanderinginndle@gmail.com</a>.
                        </p>
                    </div>
                )}


                {/* Categories Tab Content */}
                {activeTab === "categories" && (
                    <div className="flex flex-col items-center">
                        <h2 className="text-lg font-semibold text-center mb-4">Included Categories</h2>
                        <div className="flex flex-col items-start">
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
                    </div>
                )}

                {/* Difficulties Tab Content */}
                {activeTab === "difficulties" && (
                    <div className="flex flex-col items-center">
                        <h2 className="text-lg font-semibold text-center mb-4">Included Difficulties</h2>
                        <div className="flex flex-col items-start">
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
                        </div>
                        <button
                        onClick={handleResetClick}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl transition"
                        >
                        Save & Reset
                        </button>
                    </div>
                    )}
            </div>
        </div>
    );
}
