import { AdminPanelSettings, Person2 } from "@mui/icons-material";
import { Box, Card, Typography, Button, Stack, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";

const SelectRegisterType = () => {
    const navigate = useNavigate();

    return (
        <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
            <Card sx={{ p: 5, width: 450, borderRadius: 3 }}>
                <Stack spacing={3} alignItems="center">
                    <Typography variant="h5" fontWeight="bold">
                        Chọn loại đăng ký
                    </Typography>

                    <Button
                        sx={{ backgroundColor: "#faa11b" }}
                        fullWidth
                        size="medium"
                        variant="contained"
                        onClick={() => navigate("/dang-ky/customer")}
                        startIcon={<Person2 />}
                    >
                        Học sinh
                    </Button>

                    <Button
                        sx={{ border: "1px solid", borderColor: "#faa11b", color: "#faa11b" }}
                        fullWidth
                        size="medium"
                        variant="outlined"
                        onClick={() => navigate("/dang-ky/admin")}
                        startIcon={<AdminPanelSettings />}
                    >
                        Admin
                    </Button>

                    <Typography
                        variant="body2"
                        textAlign="center"
                        sx={{ color: "text.secondary" }}
                    >
                        Đã có tài khoản?
                        <Link
                            href="/dang-nhap"
                            sx={{ ml: 0.5, }}
                        >
                            Đăng nhập
                        </Link>
                    </Typography>
                </Stack>
            </Card>
        </Box>
    );
};

export default SelectRegisterType;