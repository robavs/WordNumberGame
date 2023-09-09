import { Context } from "../../enums"
import { StartTemplate } from "../Custom/StartTemplate"

const MyNumber = () => {
    return (
        <StartTemplate context={Context.MY_NUMBER} />
    )
}

export default MyNumber