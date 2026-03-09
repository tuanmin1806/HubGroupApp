import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Logo from "../components/general/logo";

const AuthLayout = () => {
    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f9fafb",
            }}
        >
            {/* Logo */}
            <Box>
                <Logo />
            </Box>

            {/* Form */}
            <Box
                sx={{
                    width: "100%",
                    maxWidth: 500,
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
};

export default AuthLayout;