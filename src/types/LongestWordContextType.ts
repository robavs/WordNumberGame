import { Dictionary } from ".";

export type LongestWordContextType = {
    dictionary: Dictionary
    selectedLettersOption: number
    setTrainingOption: React.Dispatch<React.SetStateAction<boolean>>
    setComputerOption: React.Dispatch<React.SetStateAction<boolean>>
}