import { Box, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";
import GuestHeader from "../components/headers/guest.header";
import Footer from "../components/footer/footer";

const AuthLayout = () => {
    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <GuestHeader />
            <Toolbar />

            <Box sx={{ flexGrow: 1 , backgroundColor: "#fffbf2" }}>
                <Outlet />
            </Box>

            <Footer />
        </Box>
    );
};

export default AuthLayout;