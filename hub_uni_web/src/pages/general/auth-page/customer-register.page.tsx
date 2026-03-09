import { Box, Card } from "@mui/material";
import StudentSignupForm from "../../../components/auth/student-signup-form";

const CustomerRegister = () => {
    return (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <Card sx={{ width: 600, p: 3, borderRadius: 3 }}>
                <StudentSignupForm />
            </Card>
        </Box>
    );
};

export default CustomerRegister;