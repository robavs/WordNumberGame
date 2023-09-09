import { Box, Button } from "@mui/material"
import { NavigateFunction, useNavigate } from "react-router-dom"
import UndoIcon from '@mui/icons-material/Undo';

const Error = () => {
    const navigate: NavigateFunction = useNavigate()

    return (
        <Box className="error404-box">

            <Box>
                <h2>Greška 404! Nepostojeća stranica</h2>
            </Box>

            <Box>
                <Button
                    variant="contained"
                    endIcon={<UndoIcon />}

                    onClick={() => {
                        navigate("/")
                    }}
                >
                    Vrati na početnu
                </Button>
            </Box>
        </Box>
    )
}

export default Error
