import { lazy } from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { Outlet } from "react-router-dom";
const GuestHeader = lazy(() => import("../components/headers/guest.header"));
const Footer = lazy(() => import("../components/footer/footer"));

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