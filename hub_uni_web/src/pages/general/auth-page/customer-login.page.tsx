import { lazy } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
const CustomerLoginForm = lazy(() => import("../../../components/auth/customer-login-form"));

const CustomerLogin = () => {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
      <Card sx={{ width: 450, borderRadius: 3 }}>
        <CustomerLoginForm />
      </Card>
    </Box>
  );
};

export default CustomerLogin;