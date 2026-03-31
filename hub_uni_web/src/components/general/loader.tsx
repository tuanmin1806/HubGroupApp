import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

const Loader = (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
    </Box>
);

export default Loader;