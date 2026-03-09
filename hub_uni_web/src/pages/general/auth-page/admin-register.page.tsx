import { Box, Card } from "@mui/material";
import RecruiterSignupForm from "../../../components/auth/recruiter-signup-form";

const AdminRegister = () => {
    return (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <Card sx={{ width: 600, p: 3, borderRadius: 3 }}>
                <RecruiterSignupForm />
            </Card>
        </Box>
    );
};

export default AdminRegister;