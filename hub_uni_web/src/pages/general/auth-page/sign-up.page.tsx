import { Tabs, Tab, Box, Card } from "@mui/material";
import { useState } from "react";
import StudentSignupForm from "../../../components/auth/student-signup-form";
import RecruiterSignupForm from "../../../components/auth/recruiter-signup-form";

const SignupPage = () => {
    const [tab, setTab] = useState(0);

    return (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <Card sx={{ width: 600, p: 3, borderRadius: 3 }}>
                <Tabs
                    value={tab}
                    onChange={(_, v) => setTab(v)}
                    centered
                    sx={{ mb: 1 }}
                >
                    <Tab label="Học sinh đăng ký" />
                    <Tab label="Admin trường" />
                </Tabs>

                {tab === 0 && <StudentSignupForm />}
                {tab === 1 && <RecruiterSignupForm />}
            </Card>
        </Box>
    );
};

export default SignupPage;