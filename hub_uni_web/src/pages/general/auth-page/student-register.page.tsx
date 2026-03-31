import { lazy } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
const StudentSignupForm = lazy(() => import("../../../components/auth/student-signup-form"));

const StudentRegister = () => {
    return (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <Card sx={{ width: 550, p: 2.5, borderRadius: 3 }}>
                <StudentSignupForm />
            </Card>
        </Box>
    );
};

export default StudentRegister;