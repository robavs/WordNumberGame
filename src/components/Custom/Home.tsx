import { useEffect, useState } from 'react'
import { Animation } from '../../models/enums'
import { Box } from '@mui/material'

function Home() {
    const [wordIndex, setWordIndex] = useState<number>(0)
    const [typeSpeed, setTypeSpeed] = useState<number>(50)
    const [isFullMessage, setIsFullMessage] = useState<boolean>(false)
    const [animation, setAnimation] = useState<Animation>(Animation.Typing)

    const myName: string = "Aleksa Robavs"

    useEffect(() => {
        const timeoutId = setInterval(() => {
            if (!isFullMessage) {
                if (wordIndex === myName.length) {
                    setIsFullMessage((isFullMessage: boolean) => !isFullMessage)
                }
                else {
                    setWordIndex((wordIndex: number) => wordIndex + 1)
                }
                setTypeSpeed(() => wordIndex == myName.length ? 2000 : 50)
                setAnimation(() => wordIndex == myName.length ? Animation.Blinking : Animation.Typing)
            }
            else {
                if (wordIndex == 0) {
                    setIsFullMessage((isFullMessage: boolean) => !isFullMessage)
                }
                setAnimation(() => wordIndex == 0 ? Animation.Blinking : Animation.Typing)
                setWordIndex((wordIndex: number) => wordIndex == 0 ? 0 : wordIndex - 1)
                setTypeSpeed(() => wordIndex == 0 ? 1000 : 25)
            }
        }, typeSpeed)
        return () => clearInterval(timeoutId)
    }, [wordIndex, isFullMessage])

    return (
        <>
            <p></p>
            <Box style={{ position: "absolute", bottom: "10px", left: "10px" }}>
                <span className="pipe" style={{ animation: animation }}>
                    Napravio:  {myName.slice(0, wordIndex)}
                </span>
            </Box>
        </>
    )
}

export default Home
