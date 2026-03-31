import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Dashboard from "@mui/icons-material/Dashboard";
import PendingActions from "@mui/icons-material/PendingActions";
import People from "@mui/icons-material/People";

export default function AdminDashboardPage() {
    return (
        <Box>
            <Typography variant="h5" fontWeight={600} gutterBottom>
                Tổng quan
            </Typography>

            <Typography variant="body2" color="text.secondary" mb={3}>
                Tổng quan hoạt động trường
            </Typography>

            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
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

                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ borderRadius: 3 }}>
                        <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <People color="warning" fontSize="large" />
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

                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ borderRadius: 3 }}>
                        <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <PendingActions color="info" fontSize="large" />
                            <Box>
                                <Typography variant="body2" color="text.secondary">
                                    Số lượng bài tuyển sinh
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