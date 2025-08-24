import { useState, useEffect } from "react";
import SeedInput from "./SeedInput";

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
    resetFunction: (newAnswer?: string, newDifficulties?: number[], newShowModal?: boolean, maxVolume?: number) => void;
    allCharacterData: Map<string, string[]>;
    toggleCategoryFunc: (category: string) => void
    displayedCategories: string[]
    settingsPage?: number;
    settingsModalFunc: (page: number) => void;
    maxVolume: number;
}

const spoilerGroups: Record<string, string[]> = {
    "No Spoilers": ["Mentions", "Introduced", "Species", "Occupation", "Fighting Type"],
    "Minor Spoilers": ["Gender"],
    "Moderate Spoilers": ["Continent", "Residence"],
    "Major Spoilers": ["Status", "Affiliation"],
};

export default function SettingsModal({ onClose, initialSettings, onSettingsChange, resetFunction, allCharacterData, toggleCategoryFunc, displayedCategories, settingsPage = 0, settingsModalFunc, maxVolume }: SettingsModalProps) {
    const [settings, setSettings] = useState(initialSettings);
    const tabOptions = ["rules", "categories", "difficulties", "seed"];
    const [activeTab, setActiveTab] = useState(tabOptions[settingsPage]);
    const [dropdownValue, setDropdownValue] = useState(maxVolume);


    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, checked } = event.target;
        setSettings((prev) => ({
            ...prev,
            [name]: checked,
        }));
    }

    function changeModalStateAndClose() {
        settingsModalFunc(-1);
        onClose();
    }

    useEffect(() => {
        onSettingsChange(settings);
    }, [settings, onSettingsChange]);

    const handleResetClick = () => {
        const enabledLevels = Object.entries(settings)
            .filter(([, value]) => value)
            .map(([key]) => Number(key.replace("difficultyCheckbox", "")));

        if (enabledLevels.length === 0) {
            alert("Please select at least one difficulty level before resetting the game.");
            return;
        }

        const filteredKeys = Array.from(allCharacterData.entries())
            .filter(([, values]) => values[11] !== undefined && enabledLevels.includes(Number(values[11])) && Number(values[13]) <= dropdownValue)
            .map(([key]) => key);

        if (filteredKeys.length > 0) {
            const randomIndex = Math.floor(Math.random() * filteredKeys.length);
            resetFunction(filteredKeys[randomIndex], enabledLevels, false, dropdownValue);
        } else {
            alert("There are no characters who meet your desired settings.")
        }
    };

    const noSpoilers = spoilerGroups["No Spoilers"];
    const otherSpoilerGroups = Object.entries(spoilerGroups).filter(([level]) => level !== "No Spoilers");

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-[100]">
            <div className="relative bg-white p-6 rounded-lg shadow-lg w-[30rem] min-h-[32rem]">
                <button
                    onClick={changeModalStateAndClose}
                    className="absolute top-2 right-2 text-gray-700 hover:text-black bg-transparent p-2 text-2xl"
                >
                    &times;
                </button>

                {/* Tab Navigation */}
                <div className="flex border-b mb-4">
                    {tabOptions.map((tabKey) => (
                        <button
                            key={tabKey}
                            className={`flex-1 p-2 text-center transition font-medium ${activeTab === tabKey
                                    ? "bg-gray-200 text-black border-b-2 border-blue-500"
                                    : "text-gray-500 hover:bg-gray-100"
                                }`}
                            onClick={() => setActiveTab(tabKey)}
                        >
                            {tabKey === "rules"
                                ? "Rules"
                                : tabKey === "categories"
                                    ? "Spoiler Settings"
                                    : tabKey === "difficulties"
                                        ? "Difficulty Settings"
                                        : "Seed Input"} {/* 👈 label for new tab */}
                        </button>
                    ))}
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
                            <em> Hard</em> is usually the best we can do, but maybe you’re better than us!
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
                                <dd>Alive, Active, Deceased, or Unknown (up to Chapter 10.30)</dd>
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
                        <div className="space-y-6">

                            {/* No Spoilers section */}
                            <div className="mx-auto w-[300px]">
                                <div className="grid grid-cols-2 gap-y-2">
                                    <div className="col-span-2 text-sm underline text-gray-600 mb-1 text-center">No Spoilers</div>
                                    {noSpoilers.map((category, idx) => {
                                        // Center the last little dude
                                        const isLastOdd = noSpoilers.length % 2 === 1 && idx === noSpoilers.length - 1;

                                        return (
                                            <div
                                                key={category}
                                                className={
                                                    isLastOdd
                                                        ? "col-span-2 flex justify-center"
                                                        : "flex justify-start pl-10"}
                                            >
                                                <label className="flex items-center space-x-2 text-base">
                                                    <input
                                                        type="checkbox"
                                                        name={`${category.toLowerCase().replace(/\s/g, "")}Checkbox`}
                                                        checked={displayedCategories.includes(category)}
                                                        onChange={() => toggleCategoryFunc(category)}
                                                        className="w-5 h-5 accent-blue-600"
                                                    />
                                                    <span className="text-sm">{category}</span>
                                                </label>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Other Spoiler Sections */}
                            <div className="columns-3 gap-x-8 space-y-2">
                                {otherSpoilerGroups.map(([level, categories]) => (
                                    <div key={level} className="break-inside-avoid mb-4">
                                        <div className="text-sm text-center underline text-gray-600 mb-1">{level}</div>
                                        {categories.map((category) => (
                                            <label key={category} className="flex items-center space-x-2 text-base mb-1">
                                                <input
                                                    type="checkbox"
                                                    name={`${category.toLowerCase().replace(/\s/g, "")}Checkbox`}
                                                    checked={displayedCategories.includes(category)}
                                                    onChange={() => toggleCategoryFunc(category)}
                                                    className="w-5 h-5 accent-blue-600"
                                                />
                                                <span className="text-sm">{category}</span>
                                            </label>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="mt-6 flex flex-col items-center">
                            <h2 className="text-lg font-semibold text-center mb-2">Included Volumes</h2>
                            <div> Max Volume:
                                <select
                                    id="dropdown"
                                    value={dropdownValue}
                                    onChange={(e) => setDropdownValue(Number(e.target.value))}
                                    className="border border-gray-300 rounded-md p-2 text-base mb-2 ml-2"
                                >
                                    {[...Array(10)].map((_, index) => (
                                        <option key={index + 1} value={index + 1}>
                                            Volume {index + 1}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <button
                            onClick={handleResetClick}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition"
                        >
                            Save & Reset
                        </button>
                    </div>
                )}

                {/* Difficulties Tab Content */}
                {activeTab === "difficulties" && (
                    <div className="flex flex-col items-center">
                        <h2 className="text-lg font-semibold text-center mb-4">Included Difficulties</h2>
                        <p className="text-center mb-4">These change the pool of characters based on their approximate difficulty to guess</p>
                        <div className="flex flex-col items-start mb-6">
                            {[
                                { label: "Easy", name: "difficultyCheckbox1" },
                                { label: "Medium", name: "difficultyCheckbox2" },
                                { label: "Hard", name: "difficultyCheckbox3" },
                                { label: "Expert", name: "difficultyCheckbox4" },
                            ].map(({ label, name }, index) => (
                                <label key={index} className="flex items-center space-x-3 mb-4 text-m cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name={name}
                                        checked={settings[name as keyof typeof settings]}
                                        onChange={handleChange}
                                        className="w-5 h-5 accent-blue-600"
                                    />
                                    <span className="text-m">{label}</span>
                                </label>
                            ))}
                        </div>
                        <button
                            onClick={handleResetClick}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition"
                        >
                            Save & Reset
                        </button>
                    </div>
                )}
                {activeTab === "seed" && (
                    <div className="flex flex-col items-center">
                        <h2 className="text-lg font-semibold text-center mb-4">Enter Seed</h2>
                        <SeedInput
                            resetFunc={(newAnswer, newDifficulties, newShowModal) =>
                                resetFunction(newAnswer, newDifficulties, newShowModal, dropdownValue)
                            }
                            enabledLevels={Object.entries(settings)
                                .filter(([, value]) => value)
                                .map(([key]) => Number(key.replace("difficultyCheckbox", "")))}
                            allCharacterData={allCharacterData} />
                    </div>
                )}
            </div>
        </div>
    );
}
