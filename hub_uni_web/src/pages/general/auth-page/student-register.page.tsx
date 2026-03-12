import { Box, Card } from "@mui/material";
import StudentSignupForm from "../../../components/auth/student-signup-form";

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