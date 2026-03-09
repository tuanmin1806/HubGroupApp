import { Box, Card } from "@mui/material";
import LoginForm from "../../../components/auth/admin-login-form";

const AdminLogin = () => {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
      <Card sx={{ width: 600, p: 3, borderRadius: 3 }}>
        <LoginForm />
      </Card>
    </Box>
  );
};

export default AdminLogin;