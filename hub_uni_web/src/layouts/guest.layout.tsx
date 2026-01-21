import { Box, Grid } from "@mui/material";
import GuestHeader from "../components/headers/guest.header";
import { Outlet } from "react-router-dom";

const GuestLayout = () => {
    return (
        <>
            <Box sx={{ backgroundColor: "black", color: "white" }}>
                <Grid container >
                    <Grid size={12}>
                        <GuestHeader></GuestHeader>
                    </Grid>
                    <Grid size={12} >
                        <Outlet />
                    </Grid>
                </Grid >
            </Box>
        </>
    )
}
export default GuestLayout;