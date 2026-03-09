import { Box, Card } from "@mui/material";
import CustomerLoginForm from "../../../components/auth/customer-login-form";

const CustomerLogin = () => {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
      <Card sx={{ width: 600, p: 3, borderRadius: 3 }}>
        <CustomerLoginForm />
      </Card>
    </Box>
  );
};

export default CustomerLogin;