import { Avatar, Box, Button, Card, CardContent, CardMedia, Container, Divider, Grid, Stack, Typography } from "@mui/material";
import DefaultImage from "../../assets/default_organization_card.jpg";
import { BookmarkBorder, CalendarMonth, Person, Share, Visibility } from "@mui/icons-material";
import ArticleCard from "../../components/cards/article-card.card";

const ArticleDetailPage = () => {
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Card>
                        <CardMedia
                            component="img"
                            height="320"
                            image={DefaultImage}
                            alt="article cover"
                        />

                        <CardContent>
                            <Typography variant="h4" fontWeight={700} gutterBottom>
                                Xu hướng ngành CNTT năm 2026
                            </Typography>

                            <Stack
                                direction="row"
                                spacing={2}
                                alignItems="center"
                                color="text.secondary"
                                sx={{ mb: 2 }}
                            >
                                <Stack direction="row" spacing={0.5} alignItems="center">
                                    <Person fontSize="small" />
                                    <Typography variant="body2">Admin</Typography>
                                </Stack>

                                <Stack direction="row" spacing={0.5} alignItems="center">
                                    <CalendarMonth fontSize="small" />
                                    <Typography variant="body2">12/01/2026</Typography>
                                </Stack>

                                <Stack direction="row" spacing={0.5} alignItems="center">
                                    <Visibility fontSize="small" />
                                    <Typography variant="body2">1,234</Typography>
                                </Stack>
                            </Stack>

                            <Divider sx={{ mb: 3 }} />

                            <Typography lineHeight={1.8} paragraph>
                                Công nghệ thông tin tiếp tục là lĩnh vực phát triển mạnh mẽ
                                trong năm 2026 với sự bùng nổ của AI, Big Data và Cloud
                                Computing...
                            </Typography>

                            <Typography lineHeight={1.8} paragraph>
                                Sinh viên theo học ngành CNTT sẽ có nhiều cơ hội việc làm
                                hấp dẫn với mức thu nhập cạnh tranh ngay sau khi ra trường.
                            </Typography>

                            <Stack direction="row" spacing={1} mt={4}>
                                <Button
                                    variant="contained"
                                    startIcon={<Share />}
                                >
                                    Chia sẻ
                                </Button>

                                <Button
                                    variant="outlined"
                                    startIcon={<BookmarkBorder />}
                                >
                                    Lưu bài
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                {/* SIDEBAR */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Stack spacing={3}>
                        <Card>
                            <CardContent>
                                <Stack spacing={2} alignItems="center">
                                    <Avatar sx={{ width: 64, height: 64 }}>
                                        <Person />
                                    </Avatar>

                                    <Box textAlign="center">
                                        <Typography fontWeight={600}>
                                            Nguyễn Văn A
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Biên tập viên
                                        </Typography>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent>
                                <Typography fontWeight={600} gutterBottom>
                                    Bài viết liên quan
                                </Typography>

                                <Stack spacing={1}>
                                    {["Ngành AI", "Kỹ sư dữ liệu", "Cloud Engineer"].map(
                                        (item) => (
                                            <Typography
                                                key={item}
                                                variant="body2"
                                                sx={{
                                                    cursor: "pointer",
                                                    "&:hover": {
                                                        color: "primary.main",
                                                    },
                                                }}
                                            >
                                                • {item}
                                            </Typography>
                                        )
                                    )}
                                </Stack>
                            </CardContent>
                        </Card>

                        {/* TAGS */}
                        <Card>
                            <CardContent>
                                <Typography fontWeight={600} gutterBottom>
                                    Danh mục
                                </Typography>

                                <Stack direction="row" spacing={1} flexWrap="wrap">
                                    {["CNTT", "AI", "Tuyển sinh"].map((tag) => (
                                        <Button
                                            key={tag}
                                            size="small"
                                            variant="outlined"
                                        >
                                            {tag}
                                        </Button>
                                    ))}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Stack>
                </Grid>
            </Grid>
            
                <Box sx={{ mt: 6 }}>
                    <Typography variant="h5" fontWeight={700} gutterBottom>
                        Bài viết liên quan
                    </Typography>

                    <Grid container spacing={3}>
                        {[1, 2, 3, 4, 5, 6].map((item) => (
                            <Grid
                                key={item}
                                size={{ xs: 12, sm: 6, md: 4 }}
                            >
                                <ArticleCard />
                            </Grid>

                        ))}
                    </Grid>
                </Box>

        </Container>
    );
}

export default ArticleDetailPage;