import { Box, Card, Tab, Tabs } from "@mui/material";
import LoginForm from "../../../components/auth/admin-login-form";
import { useState } from "react";
import CustomerLoginForm from "../../../components/auth/customer-login-form";

const Login = () => {
    const [tab, setTab] = useState(0);

    return (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <Card sx={{ width: 600, p: 3, borderRadius: 3 }}>
                <Tabs
                    value={tab}
                    onChange={(_, v) => setTab(v)}
                    centered
                >
                    <Tab label="Học sinh/ Nhân viên" sx={{fontWeight: 'bold'}} />
                    <Tab label="Admin" sx={{fontWeight: 'bold'}} />
                </Tabs>

                {tab === 0 && <CustomerLoginForm />}
                {tab === 1 && <LoginForm />}
            </Card>
        </Box>
    );
};

export default Login;