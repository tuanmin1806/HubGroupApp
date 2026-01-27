import { Box, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";
import Footer from "../components/footer/footer";
import StudentHeader from "../components/headers/student.header";

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