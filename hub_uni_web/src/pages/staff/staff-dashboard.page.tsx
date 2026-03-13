import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import { Dashboard, PendingActions, CheckCircle } from "@mui/icons-material";

export default function StaffDashboardPage() {
    return (
        <Box>
            <Typography variant="h5" fontWeight={600} gutterBottom>
               Tổng quan
            </Typography>

            <Typography variant="body2" color="text.secondary" mb={3}>
                Tổng quan hoạt động trường
            </Typography>

            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card sx={{ borderRadius: 3 }}>
                        <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Dashboard color="primary" fontSize="large" />
                            <Box>
                                <Typography variant="body2" color="text.secondary">
                                    Số lượng chương trình tuyển sinh
                                </Typography>
                                <Typography variant="h6" fontWeight={600}>
                                    0
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <Card sx={{ borderRadius: 3 }}>
                        <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <PendingActions color="warning" fontSize="large" />
                            <Box>
                                <Typography variant="body2" color="text.secondary">
                                    Số lượng nhân viên
                                </Typography>
                                <Typography variant="h6" fontWeight={600}>
                                    0
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}