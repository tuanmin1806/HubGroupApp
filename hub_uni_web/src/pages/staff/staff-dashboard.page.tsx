import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import { Dashboard, Article, PendingActions, CheckCircle } from "@mui/icons-material";

export default function StaffDashboardPage() {
    return (
        <Box>
            {/* Page Title */}
            <Typography variant="h5" fontWeight={600} gutterBottom>
                Dashboard Nhân viên
            </Typography>

            <Typography variant="body2" color="text.secondary" mb={3}>
                Tổng quan hoạt động hệ thống
            </Typography>

            {/* Summary Cards */}
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ borderRadius: 3 }}>
                        <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Dashboard color="primary" fontSize="large" />
                            <Box>
                                <Typography variant="body2" color="text.secondary">
                                    Tổng bài đăng
                                </Typography>
                                <Typography variant="h6" fontWeight={600}>
                                    0
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ borderRadius: 3 }}>
                        <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <PendingActions color="warning" fontSize="large" />
                            <Box>
                                <Typography variant="body2" color="text.secondary">
                                    Đang chờ duyệt
                                </Typography>
                                <Typography variant="h6" fontWeight={600}>
                                    0
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ borderRadius: 3 }}>
                        <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <CheckCircle color="success" fontSize="large" />
                            <Box>
                                <Typography variant="body2" color="text.secondary">
                                    Đã hoàn thành
                                </Typography>
                                <Typography variant="h6" fontWeight={600}>
                                    0
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Placeholder Section */}
            <Box mt={4}>
                <Card sx={{ borderRadius: 3, p: 3 }}>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        Biểu đồ hoạt động
                    </Typography>

                    <Box
                        sx={{
                            height: 200,
                            bgcolor: "#f5f5f5",
                            borderRadius: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "text.secondary",
                        }}
                    >
                        (Chart sẽ hiển thị tại đây)
                    </Box>
                </Card>
            </Box>
        </Box>
    );
}