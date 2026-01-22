import { Box, Toolbar } from "@mui/material";
import GuestHeader from "../components/headers/guest.header";
import { Outlet } from "react-router-dom";
import Footer from "../components/footer/footer";

const GuestLayout = () => {
    return (
        <>
            <Box>
                <GuestHeader />

                <Toolbar />

                <Outlet />

                <Footer />
            </Box>
        </>
    )
}
export default GuestLayout;