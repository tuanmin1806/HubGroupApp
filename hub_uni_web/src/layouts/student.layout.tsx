import { lazy } from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { Outlet } from "react-router-dom";
const Footer = lazy(() => import("../components/footer/footer"));
const StudentHeader = lazy(() => import("../components/headers/student.header"));

const StudentLayout = () => {
    return (
        <>
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <StudentHeader />
                <Toolbar />

                <Box sx={{ flexGrow: 1 }}>
                    <Outlet />
                </Box>

                <Footer />
            </Box>
        </>
    )
}
export default StudentLayout;