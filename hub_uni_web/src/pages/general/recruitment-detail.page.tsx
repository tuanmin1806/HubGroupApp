import { BookmarkBorder, Category, Groups, Info, LocationOn, MonetizationOn, Schedule, School, Send } from "@mui/icons-material";
import { Box, Button, Card, CardContent, CardMedia, Divider, Grid, Stack, Typography } from "@mui/material";
import defaultImage from "../../assets/default_organization_card.jpg";
import SelectActionCard from "../../components/cards/select-action-card.card";

const RecruitmentDetailPage = () => {
    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: "auto" }}>
            <Grid container spacing={3}>
                {/* LEFT */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <Stack spacing={3}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" fontWeight={600} gutterBottom>
                                    Tuyển sinh ngành Công nghệ Thông tin
                                </Typography>

                                <Grid container spacing={2} mt={1}>
                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <LocationOn fontSize="small" color="primary" />
                                            <Typography>Hà Nội</Typography>
                                        </Stack>
                                    </Grid>

                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Schedule fontSize="small" color="primary" />
                                            <Typography>4 năm</Typography>
                                        </Stack>
                                    </Grid>

                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <MonetizationOn fontSize="small" color="primary" />
                                            <Typography>12 – 20 triệu</Typography>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent>
                                <Typography variant="h6" fontWeight={600} gutterBottom>
                                    Chi tiết thông tin tuyển sinh
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                <Typography color="text.secondary" lineHeight={1.7}>
                                    Chương trình đào tạo chú trọng thực hành, cập nhật công nghệ
                                    mới, giúp sinh viên sẵn sàng làm việc ngay sau tốt nghiệp.
                                </Typography>
                                <Box
                                    sx={{
                                        mt: 3,
                                        width: { xs: "calc(100% - 32px)", sm: "auto" },
                                    }}
                                >
                                    <Stack direction="row" spacing={1}>
                                        <Button
                                            variant="contained"
                                            size="medium"
                                            startIcon={<Send />}
                                        >
                                            Ứng tuyển
                                        </Button>

                                        <Button
                                            variant="outlined"
                                            size="medium"
                                            startIcon={<BookmarkBorder />}
                                        >
                                            Lưu tin
                                        </Button>
                                    </Stack>
                                </Box>
                            </CardContent>

                        </Card>

                        <Card>
                            <CardContent>
                                <Typography variant="h6" fontWeight={600} gutterBottom>
                                    Ngành tuyển liên quan
                                </Typography>
                                <SelectActionCard />
                            </CardContent>
                        </Card>
                    </Stack>
                </Grid>

                {/* RIGHT */}
                <Grid size={{ xs: 12, sm: 4 }}>
                    <Stack spacing={3}>
                        <Card>
                            <CardMedia
                                component="img"
                                height="160"
                                image={defaultImage}
                            />
                            <CardContent>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <School color="primary" />
                                    <Typography variant="h6" fontWeight={600}>
                                        Đại học ABC
                                    </Typography>
                                </Stack>

                                <Stack spacing={1} mt={1}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Groups fontSize="small" />
                                        <Typography variant="body2">
                                            15.000 học viên
                                        </Typography>
                                    </Stack>

                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <LocationOn fontSize="small" />
                                        <Typography variant="body2">
                                            Hà Nội
                                        </Typography>
                                    </Stack>

                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Category fontSize="small" />
                                        <Typography variant="body2">
                                            Công nghệ thông tin
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent>
                                <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                                    <Info color="primary" />
                                    <Typography fontWeight={600}>
                                        Thông tin chung
                                    </Typography>
                                </Stack>
                                <Typography variant="body2" color="text.secondary">
                                    Hình thức: Chính quy
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Bằng cấp: Kỹ sư
                                </Typography>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent>
                                <Typography fontWeight={600} gutterBottom>
                                    Danh mục liên quan
                                </Typography>
                                <Stack spacing={1}>
                                    <Typography variant="body2">• CNTT</Typography>
                                    <Typography variant="body2">• AI</Typography>
                                    <Typography variant="body2">• Khoa học dữ liệu</Typography>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
        
    );
}

export default RecruitmentDetailPage;