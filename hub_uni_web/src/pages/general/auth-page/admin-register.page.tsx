import { lazy } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
const RecruiterSignupForm = lazy(() => import("../../../components/auth/recruiter-signup-form"));

const AdminRegister = () => {
    return (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <Card sx={{ width: 550, borderRadius: 3 }}>
                <RecruiterSignupForm />
            </Card>
        </Box>
    );
};

export default AdminRegister;