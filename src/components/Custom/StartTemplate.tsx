import { createContext, useEffect, useState } from "react"
import Loading from "./Loading"
import { Dictionary, LongestWordContextType, MyNumberContextType } from "../../types"
import { Context } from "../../enums"
import { Training as LongestWordTraining } from "../LongestWord/Training"
import { Training as MyNumberTraining } from "../MyNumber/Training"
import { Computer as LongestWordComputer } from "../LongestWord/Computer"
import { Computer as MyNumberComputer } from "../MyNumber/Computer"
import { Box, Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material"

export const LongestWordContext = createContext<LongestWordContextType>({} as LongestWordContextType)
export const MyNumberContext = createContext<MyNumberContextType>({} as MyNumberContextType)


export const StartTemplate = ({ context, dictionary }: { context: string, dictionary?: Dictionary }) => {
    const CurrentContext = context === Context.LONGEST_WORD ? LongestWordContext : MyNumberContext
    const Training = context === Context.LONGEST_WORD ? LongestWordTraining : MyNumberTraining
    const Computer = context === Context.LONGEST_WORD ? LongestWordComputer : MyNumberComputer

    const [trainingOption, setTrainingOption] = useState<boolean>(false)
    const [computerOption, setComputerOption] = useState<boolean>(false)
    const [selectedLettersOption, setSelectedLettersOption] = useState<number>(0)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(() => {
        setIsLoading(true)
    }, [])

    if (!isLoading) {
        return <Loading />
    }

    return (
        <CurrentContext.Provider
            value={{
                dictionary: dictionary || {} as Dictionary,
                selectedLettersOption,
                setTrainingOption,
                setComputerOption
            }}
        >
            <Box >
                {(!trainingOption && !computerOption) &&
                    <>
                        <Box className="training-btn">
                            {
                                context === Context.LONGEST_WORD ?
                                    <FormControl fullWidth>
                                        <InputLabel id="training">
                                            Trening broj slova
                                        </InputLabel>

                                        <Box >
                                            <Select style={{ width: "200px" }}
                                                labelId="training"
                                                value={7}
                                            >
                                                {
                                                    Array(9).fill(true).map((_, index) => {
                                                        return (
                                                            <MenuItem
                                                                key={index}
                                                                value={index + 7}
                                                                onClick={() => {
                                                                    setTrainingOption(true)
                                                                    setSelectedLettersOption(index + 7)
                                                                }}>
                                                                {index + 7}
                                                            </MenuItem>
                                                        );
                                                    })
                                                }
                                            </Select>
                                        </Box>
                                    </FormControl>
                                    :
                                    <Box
                                        className="training-btn"
                                    >
                                        <Button
                                            variant="contained"
                                            onClick={() => setTrainingOption(true)}
                                        >
                                            Trening
                                        </Button>
                                    </Box>
                            }
                        </Box>

                        <Box className="computer-btn">
                            <Button
                                variant="contained"
                                onClick={() => setComputerOption(true)}
                            >
                                Kompjuter
                            </Button>
                        </Box>
                    </>
                }

                {trainingOption && <Training />}
                {computerOption && <Computer />}
            </Box>
        </CurrentContext.Provider >
    )
}