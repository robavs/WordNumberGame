import { useState, useEffect } from 'react';
import BackArrow from '../Custom/BackArrow'
import Loading from '../Custom/Loading';
import { findCombinations } from './functions';
import { Context } from '../../models/enums';
import { Alert, AlertTitle, Box, Button, Grid, TextField } from '@mui/material';
import { ICombinations } from '../../models/interfaces';
import FunctionsRoundedIcon from '@mui/icons-material/FunctionsRounded';
import "./myNumber.css"

export const Computer = () => {
    const [calculating, setIsCalculating] = useState<boolean>(false)
    const [combinations, setCombinations] = useState<Array<string>>([])
    const [hasCorrectCombinationFound, setHasCorrectCombinationFound] = useState<boolean>(false)
    const [result, setResult] = useState<number>(0)
    const [numbers, setNumbers] = useState<Record<number, number>>({ 1: 0, 2: 0, 3: 0, 4: 0 })
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        setIsLoading(false)
    }, [])

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (calculating) {
                const { correctCombinationFound, combinations }: ICombinations = findCombinations(Object.values(numbers), result)
                setHasCorrectCombinationFound(correctCombinationFound)
                setCombinations(combinations)
                setIsCalculating(false)
            }
        }, 100)
        return () => clearTimeout(timeoutId)
    }, [calculating])

    if (isLoading) {
        return <Loading />
    }

    return (
        <>
            <BackArrow context={Context.MY_NUMBER} />

            <Box className="my-number-computer-container">
                <Box className="result-input-box">
                    <TextField
                        id="result"
                        label="Result"
                        variant="outlined"
                        autoComplete="off"

                        onChange={e => {
                            setResult(Number(e.target.value))
                            setCombinations([])
                            setHasCorrectCombinationFound(false)
                        }}
                    />
                </Box>

                <Box className="number-inputs-container">

                    <Box className="number-inputs-box">
                        <Grid container spacing={2}>

                            {Array(Object.keys(numbers).length)
                                .fill(0)
                                .map((_, index) => {
                                    return (
                                        <Grid
                                            item
                                            xs={6}
                                            key={index}
                                        >
                                            <TextField
                                                label={`Num${index + 1}`}
                                                variant="outlined"
                                                id={(index + 1).toString()}
                                                autoComplete="off"
                                                className="number-input-option"

                                                onChange={(e) => {
                                                    setNumbers(numbers => ({ ...numbers, [Number(e.target.id)]: parseInt(e.target.value) }))
                                                    setCombinations([])
                                                    setHasCorrectCombinationFound(false)
                                                }}
                                            />
                                        </Grid>

                                    );
                                })}
                        </Grid>
                    </Box>

                </Box>

                <Box className="find-btn-box">
                    <Button
                        className="find-btn"
                        variant="contained"
                        endIcon={<FunctionsRoundedIcon />}
                        onClick={() => setIsCalculating(true)}
                    >
                        Izračunaj
                    </Button >
                </Box>


                <Box className="combinations">
                    {calculating && <Loading />}

                    {/* Proveri za ovo dal radi ispravno */}

                    {!calculating && combinations.length !== 0 &&
                        <Box className="computer-combinations-box">

                            <Alert severity={`${!hasCorrectCombinationFound ? "warning" : "success"}`}>
                                <AlertTitle>
                                    {!hasCorrectCombinationFound ?
                                        <>
                                            <h2>
                                                Nismo uspeli da pronadjemo tačnu kombinaciju

                                            </h2>
                                            <h3>Rešenje se razlikuje za {Math.abs(Number(combinations[0].split("=")[1]) - result).toFixed(2)}</h3>
                                        </>
                                        :
                                        <h2>Tačna kombinacija</h2>
                                    }
                                </AlertTitle>

                                {
                                    combinations
                                        .slice(0, 150)
                                        .map((combination: string, index: number) => {
                                            return (
                                                <li key={index}>
                                                    {combination}
                                                </li>
                                            )
                                        })
                                }
                            </Alert>

                        </Box>
                    }
                </Box >
            </Box>

        </>
    )
}