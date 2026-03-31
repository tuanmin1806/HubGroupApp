import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate } from "react-router-dom";

const UnauthorizedPage = () => {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f4f6f8",
                p: 2,
            }}
        >
            <Container maxWidth="sm">
                <Paper
                    elevation={6}
                    sx={{
                        p: 6,
                        textAlign: "center",
                        borderRadius: 3,
                    }}
                >
                    <LockOutlinedIcon
                        sx={{ fontSize: 70, color: "error.main", mb: 2 }}
                    />

                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        403 - Unauthorized
                    </Typography>

                    <Typography variant="body1" color="text.secondary" mb={4}>
                        Bạn không có quyền truy cập vào trang này.
                        Vui lòng liên hệ quản trị viên nếu bạn cho rằng đây là lỗi.
                    </Typography>

                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={() => navigate("/sign-out")}
                        sx={{ px: 4 }}
                    >
                        Quay về trang chủ
                    </Button>
                </Paper>
            </Container>
        </Box>
    );
};

export default UnauthorizedPage;