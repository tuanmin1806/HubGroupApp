import { Box, Card } from "@mui/material";
import RecruiterSignupForm from "../../../components/auth/recruiter-signup-form";

const AdminRegister = () => {
    return (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <Card sx={{ width: 550,  borderRadius: 3 }}>
                <RecruiterSignupForm />
            </Card>
        </Box>
    );
};

export default AdminRegister;