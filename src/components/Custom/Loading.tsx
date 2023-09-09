import { Box } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

const Loading = () => {
    return (
        <Box className="loading-spinner">
            <CircularProgress size={70} disableShrink />
        </Box>
    )
}

export default Loading