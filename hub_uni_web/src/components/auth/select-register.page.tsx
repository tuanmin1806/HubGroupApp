import { Box, Card, Typography, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

const SelectRegisterType = () => {
    const navigate = useNavigate();

    return (
        <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
            <Card sx={{ p: 5, width: 520, borderRadius: 3 }}>
                <Stack spacing={3} alignItems="center">
                    <Typography variant="h5" fontWeight="bold">
                        Chọn loại đăng ký
                    </Typography>

                    <Button
                        fullWidth
                        size="large"
                        variant="contained"
                        onClick={() => navigate("/dang-ky/customer")}
                    >
                        Học sinh
                    </Button>

                    <Button
                        fullWidth
                        size="large"
                        variant="outlined"
                        onClick={() => navigate("/dang-ky/admin")}
                    >
                        Admin
                    </Button>
                </Stack>
            </Card>
        </Box>
    );
};

export default SelectRegisterType;