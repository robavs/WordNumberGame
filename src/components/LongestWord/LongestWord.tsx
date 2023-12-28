import { Context } from "../../models/enums"
import { Dictionary } from "../../models/types"
import { StartTemplate } from "../Custom/StartTemplate"
import './longestWord.css'

const LongestWord = ({ dictionary }: { dictionary: Dictionary }) => {
    return (
        <StartTemplate context={Context.LONGEST_WORD} dictionary={dictionary} />
    )
}

export default LongestWord