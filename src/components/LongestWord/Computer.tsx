import { useState, useEffect, useContext } from "react"
import { LongestWordContext } from "../Custom/StartTemplate"
import { latinToCyrilic, findWords, convertToLatin } from "./functions"
import Loading from "../Custom/Loading"
import BackArrow from "../Custom/BackArrow"
import { Dictionary } from "../../types"
import { Context } from "../../enums"
import { Alert, AlertTitle, Box, Button, TextField } from "@mui/material"
import SearchIcon from '@mui/icons-material/Search';

export const Computer = () => {
    const { dictionary }: { dictionary: Dictionary } = useContext(LongestWordContext)
    const [computerWords, setComputerWords] = useState<Array<string>>([])
    const [typingError, setTypingError] = useState<string>("")
    const [userInput, setUserInput] = useState<string>("")
    const [isSolvedBtnClicked, setIsSolvedBtnClicked] = useState<boolean>(false)

    useEffect(() => {
        // dodali smo timeout da bi smo simulirali asinhronu funkciju
        if (isSolvedBtnClicked) {
            const timeoutId: NodeJS.Timeout = setTimeout((): void => {
                generateComputerWords()
            }, 100)
            return () => clearTimeout(timeoutId)
        }
    }, [isSolvedBtnClicked])

    const isInputValid = (): void => {
        if (!userInput.length)
            return setTypingError("Nema unetih slova")

        const letters: Array<string> = userInput.toUpperCase().split(",")

        if (new Set(letters).size === letters.length && letters.length > 25)
            return setTypingError("Sva različita slova sa više od 25 karaktera nisu dozovljena")

        for (const letter of letters) {
            if (!latinToCyrilic[letter])
                return setTypingError("Nevalidan karakter!")
        }

        if (letters.length > 30)
            return setTypingError("Predugačka reč. Maksimalna dužina reči je 30 karatkera")

        setIsSolvedBtnClicked(true)
        setComputerWords([])
    }

    const generateComputerWords = (): void => {
        const letters: Array<string> = userInput
            .toUpperCase()
            .split(",")
            .map((letter: string) => latinToCyrilic[letter])
            .sort()

        console.time("vreme")

        let computerGeneratedWords: Array<string> = [...findWords(letters, dictionary)]
            .sort((a: string, b: string) => b.length - a.length)

        // dodacu neku state dugme, cisto da moze na zahtev da prikaze sve reci
        // if (computerGeneratedWords.length > 100) {
        //     computerGeneratedWords = computerGeneratedWords.slice(0, 101)
        // }

        console.timeEnd("vreme")

        setIsSolvedBtnClicked(false)
        setComputerWords(computerGeneratedWords)
    }

    return (
        <Box className="longest-word-training-container">

            <Box className="instructions">
                <BackArrow context={Context.LONGEST_WORD} />

                <h2>
                    Posle svakog slova stavi zapetu
                </h2>
            </Box>


            <Box className="training-input">
                <TextField
                    label="Unesi slova"
                    fullWidth
                    onChange={e => {
                        e.target.value = e.target.value.toUpperCase()
                        setTypingError("")
                        setComputerWords([])
                        setUserInput(e.target.value)
                        setIsSolvedBtnClicked(false)
                    }}
                />
            </Box>


            <Box className="find-words-btn">
                <Button
                    variant="contained"
                    endIcon={<SearchIcon />}
                    onClick={isInputValid}
                >
                    Pronađi
                </Button>
            </Box>

            <Box className="computer-words">
                {
                    isSolvedBtnClicked && <Loading />
                }

                {
                    typingError &&
                    <Alert severity="error" >
                        <strong>
                            {typingError}
                        </strong>
                    </Alert>
                }

                {
                    computerWords.length !== 0 &&
                    <Alert severity="success">
                        <AlertTitle>
                            Pronašli smo {computerWords.length}

                            {`${computerWords.length % 10 === 1 && computerWords.length != 11 ? " reč" : " reči"}`}
                        </AlertTitle>

                        {
                            computerWords.map((word: string, index: number) => {
                                // ovde tek konvertujemo reči da ne bi došlo do zabune da lj i  nj smatra kao dva slova umesto jednog
                                const latinicWord: string = convertToLatin(word)

                                return (
                                    <li key={index}>
                                        {`${latinicWord} ----> ${word.length} ${word.length % 10 === 1 && word.length != 11 ? "slovo" : " slova"}`}
                                    </li>
                                )
                            })
                        }
                    </Alert>
                }

            </Box>
        </Box>
    )
}