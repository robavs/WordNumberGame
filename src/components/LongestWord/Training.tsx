import { useState, useEffect, useRef, useContext } from "react";
import { LongestWordContext } from "../Custom/StartTemplate";
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { generateRandomLetters, isWordValid, findWords, cyrilicToLatin, latinToCyrilic, convertToLatin } from "./functions";
import BackArrow from "../Custom/BackArrow";
import Loading from "../Custom/Loading";
import LinearProgress from '@mui/material/LinearProgress';
import { LongestWordContextType } from "../../models/types";
import { Alert, AlertColor, AlertTitle, Box } from "@mui/material";
import { WordStatus, Context } from "../../models/enums";

// DODAJ funkciju za reload, u smislu da se ne vraca na pocetnu stranu
// nego da startuje game ponovo

export const Training = () => {
    const { dictionary, selectedLettersOption }: Pick<LongestWordContextType, "dictionary" | "selectedLettersOption"> = useContext(LongestWordContext)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [progressBarValue, setProgressBarValue] = useState<number>(0)
    const [randomLetters, setRandomLetters] = useState<Array<string>>([])
    const [message, setMessage] = useState<string>("")
    const [yourWord, setYourWord] = useState<string>("")
    const [wordStatus, setWordStatus] = useState<WordStatus>(WordStatus.Empty)
    const [isGameFinished, setIsGameFinished] = useState<boolean>(false)
    const [computerWord, setComputerWord] = useState<string>("")
    // sluzi kao stack za slova da bi se prilikom brisanja brisalo unazad
    const [chosenLetters, setChosenLetters] = useState<Array<HTMLDivElement>>([])
    const lettersRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // mora ovako zbog fecovanja recenika, cak i to baca neku gresku kad zovem generateRandomLetters
        if (Object.keys(dictionary).length !== 0) {
            setIsLoading(false)
            setRandomLetters(() => generateRandomLetters(selectedLettersOption, dictionary))
        }
    }, [dictionary])

    useEffect(() => {
        if (!isGameFinished) {
            const intervalId = setInterval(() => {
                setProgressBarValue((prev: number) => prev + 2)
            }, 1000)
            return () => clearInterval(intervalId)
        }
        else {
            checkOrSubmit(true)
        }
    }, [isGameFinished])

    useEffect(() => {
        if (progressBarValue === 100) {
            setIsGameFinished(true)
        }
    }, [progressBarValue])

    const addLetter = (e: React.MouseEvent<HTMLDivElement>): void => {
        const clickedLetter = e.target as HTMLDivElement
        const newChosenLetters: Array<HTMLDivElement> = [...chosenLetters]
        if (lettersRef.current) {
            newChosenLetters.push(lettersRef.current.childNodes[Number(clickedLetter.id)] as HTMLDivElement)
        }
        clickedLetter.classList.add("used-letter")

        setYourWord(yourWord + latinToCyrilic[clickedLetter.innerText])
        setChosenLetters(newChosenLetters)
        setMessage("")
        setWordStatus(WordStatus.Empty)
    }

    const deleteLetter = (): void => {
        if (chosenLetters.length > 0) {
            const newChosenLetters: Array<HTMLDivElement> = [...chosenLetters]
            const lastAddedLetter = newChosenLetters.pop() as HTMLDivElement
            lastAddedLetter.classList.remove("used-letter")

            setChosenLetters(newChosenLetters)
            setMessage("")
            setWordStatus(WordStatus.Empty)
            setYourWord((yourWord: string) => yourWord.slice(0, yourWord.length - 1))
        }
    }

    const checkOrSubmit = (isSubmitting: boolean): void => {
        if (isWordValid(yourWord, dictionary)) {
            const yourLatinWord: string = convertToLatin(yourWord)
            setMessage(
                isSubmitting ?
                    `Vaša reč ${yourLatinWord.toUpperCase()} je validna i ima ${yourWord.length} ${yourWord.length > 1 ? "slova" : "slovo"}!` :
                    "Vaša reč je validna"
            )
            setWordStatus(WordStatus.Correct)
        }

        else {
            setMessage(yourWord.length === 0 ? "Nema unetih slova" : "Reč nije validna")
            setWordStatus(yourWord.length === 0 ? WordStatus.Empty : WordStatus.Incorrect)
        }

        if (isSubmitting) {
            const computerWords: Array<string> = [...findWords(randomLetters, dictionary)].sort((a: string, b: string) => b.length - a.length)
            const longestWordCyrilic: string = computerWords[0]
            const longestWordLatinic: string = convertToLatin(longestWordCyrilic)

            setComputerWord("Naša reč je " + longestWordLatinic.toUpperCase() + " i ima " + longestWordCyrilic.length + " slova!")
            setIsGameFinished(true)
        }
    }

    if (isLoading) {
        return <Loading />
    }

    return (
        <Box className="longest-word-computer-container">
            <Box>
                <BackArrow context={Context.LONGEST_WORD} />

                <LinearProgress
                    value={progressBarValue}
                    variant="determinate"
                    color="info"
                    style={{
                        height: "15px",
                        width: "90%",
                        position: "absolute",
                        left: "50%",
                        transform: "translateX(-50%)"
                    }}
                />
            </Box>


            <Box className={`letters ${isGameFinished ? "disabled" : ""}`} ref={lettersRef}>
                {randomLetters.map((letter: string, index: number) => {
                    return (
                        <Box
                            key={index}
                            id={index.toString()}
                            className="letter"
                            onClick={addLetter}
                        >
                            {cyrilicToLatin[letter]}
                        </Box>
                    )
                })}
            </Box>

            <Box className="computer-word">
                {computerWord}
            </Box>

            <Box className="current-word-input">
                <CheckIcon
                    color="success"
                    className={`submit-btn ${isGameFinished ? "disabled" : ""}`}
                    fontSize="large"
                    onClick={() => checkOrSubmit(true)}
                />

                <QuestionMarkIcon
                    color="info"
                    className={`check-btn ${isGameFinished ? "disabled" : ""}`}
                    fontSize="large"
                    onClick={() => checkOrSubmit(false)}
                />

                <ClearIcon
                    color="error"
                    className={`delete-btn ${isGameFinished ? "disabled" : ""}`}
                    fontSize="large"
                    onClick={deleteLetter}
                />

                <Box className="your-word">
                    <p>{convertToLatin(yourWord)}</p>
                </Box>
            </Box>

            <Box className="end-game-message">
                {
                    message.length !== 0 &&
                    <Alert severity={wordStatus as AlertColor} >
                        <AlertTitle>
                            <strong>
                                {`${wordStatus === WordStatus.Correct ? "Uspešno" : "Neuspešno"}`}
                            </strong>
                        </AlertTitle>

                        <strong>
                            {message}
                        </strong>
                    </Alert>
                }
            </Box>

        </Box>
    )
}