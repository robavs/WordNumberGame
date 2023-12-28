import { Box, LinearProgress } from "@mui/material"
import { Context } from "../../models/enums"
import BackArrow from "../Custom/BackArrow"
import { useEffect, useRef, useState } from "react"
import Loading from "../Custom/Loading"
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { random } from "../LongestWord/functions"

export const Training = () => {
    const [progressBarValue, setProgressBarValue] = useState<number>(0)
    const [isGameFinished, setIsGameFinished] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [numbers, setNumbers] = useState<Array<number>>(Array(4).fill(0))
    const [combinations, setCombinations] = useState<Array<string>>([])
    const [hasCorrectCombinationFound, setHasCorrectCombinationFound] = useState<boolean>(false)
    const [yourExpression, setYourExpression] = useState<string>("")
    const [message, setMessage] = useState<string>("")
    const [computerExpression, setComputerExpression] = useState<string>("")
    // stack zbog redosleda kojim smo upisivali slova
    const [choosenNumbers, setChoosenNumbers] = useState<Array<HTMLDivElement>>([])
    const generatedNumbers = useRef<HTMLDivElement>()
    const result: number = 24

    useEffect(() => {
        setNumbers(() => Array(numbers.length).fill(0).map(() => random(1, 9)))
        setIsLoading(false)
    }, [])

    useEffect(() => {
        if (!isGameFinished) {
            const intervalId = setInterval(() => {
                setProgressBarValue(prev => prev + 2)
            }, 1000)
            return () => clearInterval(intervalId)
        }
    }, [isGameFinished])

    const toggleCanPlacingNumbers = (canPlace: boolean): void => {
        if (generatedNumbers.current) {
            for (const num of generatedNumbers.current.children) {
                (num as HTMLDivElement).style.pointerEvents = canPlace ? "auto" : "none"
            }
        }
    }

    const addNumber = (e: React.MouseEvent<HTMLDivElement>): void => {
        const clickedNumber = e.target as HTMLDivElement
        clickedNumber.classList.add("used-number")
        toggleCanPlacingNumbers(false)
        setYourExpression(prev => prev + clickedNumber.innerText)
        setChoosenNumbers((prev) => [...prev, clickedNumber])
        setMessage("")
    }

    const addOperation = (e: React.MouseEvent<HTMLDivElement>): void => {
        const clickedOperation = e.target as HTMLDivElement
        setYourExpression(prev => prev + clickedOperation.innerText)
        toggleCanPlacingNumbers(true)
        setMessage("")
    }

    const deleteLast = (): void => {
        if (yourExpression.length > 0) {
            const lastDeleted = yourExpression.slice(-1)
            if (!isNaN(parseInt(lastDeleted))) {
                choosenNumbers.slice(-1)[0].classList.remove("used-number")
                setChoosenNumbers((prev) => prev.slice(0, prev.length - 1))
                toggleCanPlacingNumbers(true)
            }
            setYourExpression((prev) => prev.slice(0, prev.length - 1))
        }
    }

    if (isLoading) return <Loading />

    return (
        <>
            <BackArrow context={Context.MY_NUMBER} />

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

            <Box style={{ marginTop: "15px" }} className="my-number-training-container">
                <Box className="result-number-container">
                    <Box className="result-number">
                        {result}
                    </Box>
                </Box>
                <Box ref={generatedNumbers} className="generated-numbers">
                    {numbers
                        .map((number, index) => {
                            return (
                                <div
                                    key={index}
                                >
                                    <Box
                                        id={(index + 1).toString()}
                                        className="number"
                                        onClick={addNumber}
                                    >
                                        {number}
                                    </Box>
                                </div>

                            )
                        })}
                </Box>

                <Box className="operations">
                    <Box className="number" onClick={addOperation}>+</Box>
                    <Box className="number" onClick={addOperation}>-</Box>
                    <Box className="number" onClick={addOperation}>*</Box>
                    <Box className="number" onClick={addOperation}>/</Box>
                    <Box className="number" onClick={addOperation}>{`(`}</Box>
                    <Box className="number" onClick={addOperation}>{`)`}</Box>
                </Box>

                <Box className="expression-container">
                    <Box className="current-expression-input">
                        <CheckIcon
                            color="success"
                            className={`submit-btn ${isGameFinished ? "disabled" : ""}`}
                            fontSize="large"
                        />

                        <QuestionMarkIcon
                            color="info"
                            className={`check-btn ${isGameFinished ? "disabled" : ""}`}
                            fontSize="large"
                        />

                        <ClearIcon
                            color="error"
                            className={`delete-btn ${isGameFinished ? "disabled" : ""}`}
                            fontSize="large"
                            onClick={deleteLast}
                        />

                        <Box className="your-word">
                            {yourExpression}
                        </Box>
                    </Box>
                </Box>

            </Box>
        </>

    )
}