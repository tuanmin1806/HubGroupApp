import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import HomeOutlined from "@mui/icons-material/HomeOutlined";
import SearchOff from "@mui/icons-material/SearchOff";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    minHeight: '80vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    gap: 2,
                }}
            >
                <SearchOff sx={{ fontSize: 80, color: 'text.disabled' }} />

                <Typography
                    variant="h1"
                    fontWeight={800}
                    sx={{ fontSize: { xs: '4rem', md: '6rem' }, color: '#faa11b', lineHeight: 1 }}
                >
                    404
                </Typography>

                <Typography variant="h5" fontWeight={600} color="text.primary">
                    Trang không tìm thấy
                </Typography>

                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 360 }}>
                    Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
                </Typography>

                <Button
                    variant="contained"
                    size="large"
                    startIcon={<HomeOutlined />}
                    onClick={() => navigate('/')}
                    sx={{ mt: 1, textTransform: 'none', borderRadius: 1, px: 2, backgroundColor: '#faa11b', fontWeight: 'bold' }}
                >
                    Về trang chủ
                </Button>
            </Box>
        </Container>
    );
};

export default NotFoundPage;