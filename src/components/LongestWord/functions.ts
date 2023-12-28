import { Dictionary } from "../../models/types"

export const random = (min: number, max: number): number => ~~(Math.random() * (max - min)) + min

const letters: Array<string> = ["а", "б", "в", "г", "д", "ђ", "е", "ж", "з", "и", "ј", "к", "л", "љ", "м", "н", "њ", "о", "п", "р", "с", "т", "у", "ф", "х", "ц", "ч", "ћ", "џ", "ш"]

export const latinToCyrilic: Record<string, string> = { "A": "а", "B": "б", "V": "в", "G": "г", "D": "д", "Đ": "ђ", "DJ": "ђ", "E": "е", "Ž": "ж", "Z": "з", "I": "и", "J": "ј", "K": "к", "L": "л", "LJ": "љ", "M": "м", "N": "н", "NJ": "њ", "O": "о", "P": "п", "R": "р", "S": "с", "T": "т", "U": "у", "F": "ф", "H": "х", "C": "ц", "Č": "ч", "Ć": "ћ", "DZ": "џ", "DŽ": "џ", "Š": "ш" }

export const cyrilicToLatin: Record<string, string> = { "а": "A", "б": "B", "в": "V", "г": "G", "д": "D", "ђ": "Đ", "е": "E", "ж": "Ž", "з": "Z", "и": "I", "ј": "J", "к": "K", "л": "L", "љ": "LJ", "м": "M", "н": "N", "њ": "NJ", "о": "O", "п": "P", "р": "R", "с": "S", "т": "T", "у": "U", "ф": "F", "х": "H", "ц": "C", "ч": "Č", "ћ": "Ć", "џ": "DŽ", "ш": "Š" }

export const findWords = (givenLetters: Array<string>, dictionary: Dictionary): Set<string> => {
    const possibleWords: Set<string> = new Set<string>()
    givenLetters.sort()

    const findAllWords = (anagram: string, index: number): void => {
        if (index === givenLetters.length) {
            if (dictionary[anagram]) {
                const validWords: Array<string> = dictionary[anagram]
                for (const validWord of validWords) {
                    possibleWords.add(validWord)
                }
            }
            return
        }

        // petlja sluzi za optimizaciju jer preskace duplikate, inicijalno sam mislio da petlja 
        // ide ispred prvog rekurzivnog poziva (sto apsolutno nema smisla jer onda pocinje da pravi subsete ne racunajuci prethodne duplikate),
        // ali sam internetu video da je nakon prvog rekurzivnog poziva
        findAllWords(anagram + givenLetters[index], index + 1)
        while (givenLetters[index] == givenLetters[index + 1]) index++
        findAllWords(anagram, index + 1)
    }

    findAllWords("", 0)
    return possibleWords
}

export const generateRandomLetters = (selectedLettersOption: number, dictionary: Dictionary): Array<string> => {
    const keys: Array<string> = Object.keys(dictionary)
    const index: number = random(0, keys.length)
    const wordLength: number = random(selectedLettersOption - 4, selectedLettersOption + 1)

    let chars: Array<string> = []
    let l: number = index
    let r: number = index

    while (l >= 0 || r < keys.length) {
        if (l >= 0) {
            if (keys[l].length === wordLength) {
                chars = [...keys[l]]
                break
            }
            l--
        }
        if (r < keys.length) {
            if (keys[r].length === wordLength) {
                chars = [...keys[r]]
                break
            }
            r++
        }
    }
    for (let i = 0; i < selectedLettersOption - wordLength; i++)
        chars.push(letters[random(0, letters.length)])

    for (let i = 0; i < selectedLettersOption; i++) {
        let rndIndex: number = random(0, selectedLettersOption);
        [chars[i], chars[rndIndex]] = [chars[rndIndex], chars[i]]
    }

    // glupo je da vracam chars sort u ovoj funkciji
    return chars
}

export function isWordValid(yourWord: string, dictionary: Dictionary): boolean {
    if (!yourWord.length) return false

    const keyFromYourWord: string = yourWord.split("").sort().join("")

    if (yourWord.length && dictionary[keyFromYourWord]) {
        for (const word of dictionary[keyFromYourWord])
            if (word === yourWord)
                return true
    }
    return false
}

export const convertToLatin = (cyrilicWord: string): string => {
    return cyrilicWord.split("").map((latinLetter: string) => cyrilicToLatin[latinLetter]).join("")
}