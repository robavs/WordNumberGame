import { useContext } from "react"
import { LongestWordContext } from "./StartTemplate"
import { MyNumberContext } from "./StartTemplate"
import { Context } from "../../enums";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { LongestWordContextType, MyNumberContextType } from "../../types";
import './custom.css'

const BackArrow = ({ context }: { context: Context }) => {
    const CurrentContext = (context === Context.LONGEST_WORD
        ? useContext(LongestWordContext)
        : useContext(MyNumberContext)) as MyNumberContextType | LongestWordContextType;

    return (
        <ArrowBackIcon
            className="back-arrow"

            onClick={() => {
                CurrentContext.setTrainingOption(false)
                CurrentContext.setComputerOption(false)
            }}
        />
    )
}

export default BackArrow