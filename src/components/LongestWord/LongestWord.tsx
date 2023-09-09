import { Context } from "../../enums"
import { Dictionary } from "../../types"
import { StartTemplate } from "../Custom/StartTemplate"
import './longestWord.css'

const LongestWord = ({ dictionary }: { dictionary: Dictionary }) => {
    return (
        <StartTemplate context={Context.LONGEST_WORD} dictionary={dictionary} />
    )
}

export default LongestWord