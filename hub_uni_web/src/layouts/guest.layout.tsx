import { Box, Toolbar } from "@mui/material";
import GuestHeader from "../components/headers/guest.header";
import { Outlet } from "react-router-dom";
import Footer from "../components/footer/footer";

const GuestLayout = () => {
    return (
        <>
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <GuestHeader />
                <Toolbar />

                <Box sx={{ flexGrow: 1 }}>
                    <Outlet />
                </Box>

                <Footer />
            </Box>
        </>
    )
}
export default GuestLayout;