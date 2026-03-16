import { CalendarToday, School, LocationOn, ErrorOutline } from "@mui/icons-material";
import { Box, Card, CardContent, Chip, Container, Stack, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ApplicationFilterParams, ApplicationResponse } from "../../app/models/application.model";
import { formatDate } from "../../utils/date.utils";
import { useGetByCustomerQuery } from "../../app/features/application.api";
import { getUserInfo } from "../../app/services/auth.service";
import ApplicationDetailDialog from "../../components/dialogs/student/application-detail.dialog";
import { useState } from "react";

function ApplicationCard({ app, onClick }: { app: ApplicationResponse; onClick: () => void }) {
    const post = app.RecruitmentPost;

    return (
        <Card elevation={0} onClick={onClick} sx={{
            border: "1px solid #e5e7eb", borderRadius: 2, cursor: "pointer",
            transition: "all .15s ease",
            "&:hover": { borderColor: "#f36730", transform: "translateY(-1px)" }
        }}>
            <CardContent sx={{ p: 2 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography fontWeight={600} sx={{ fontSize: 15, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {post?.Name ?? "Chương trình tuyển sinh"}
                        </Typography>
                        <Typography sx={{ fontSize: 13, color: "#6b7280", mb: 0.5 }}>
                            {post?.Organization?.Name ?? "—"}
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                            {post?.Province && (
                                <Chip icon={<LocationOn sx={{ fontSize: 14 }} />} label={post.Province}
                                    size="small" sx={{ height: 22 }} />
                            )}
                            <Chip icon={<CalendarToday sx={{ fontSize: 14 }} />}
                                label={formatDate(app.CreatedAt)} size="small" sx={{ height: 22 }} />
                        </Stack>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
}

function EmptyState() {
    const navigate = useNavigate();
    return (
        <Box sx={{ textAlign: "center", py: 10 }}>
            <Box sx={{ width: 72, height: 72, borderRadius: "50%", bgcolor: "#fff7ed", display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 2 }}>
                <School sx={{ fontSize: 36, color: "#f36730" }} />
            </Box>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>Chưa có đơn ứng tuyển</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 320, mx: "auto", mb: 3 }}>
                Hãy khám phá các chương trình tuyển sinh và nộp hồ sơ ngay.
            </Typography>
            <Button variant="contained" disableElevation onClick={() => navigate("/chuong-trinh-tuyen-sinh")}
                sx={{ bgcolor: "#f36730", borderRadius: 2, textTransform: "none", fontWeight: 600, "&:hover": { bgcolor: "#e05520" } }}>
                Xem chương trình tuyển sinh
            </Button>
        </Box>
    );
}

export default function ApplicationListPage() {

    const userInfo = getUserInfo();
    const customerId = userInfo?.Id ?? "";
    const queryParams: ApplicationFilterParams = { customerId };

    const { data, isError } = useGetByCustomerQuery(queryParams);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    return (
        <>
            <Box sx={{ bgcolor: "#f9fafb", minHeight: "100vh", pt: { xs: 9, md: 10 }, pb: { xs: 4, md: 6 } }}>
                <Container maxWidth="md">
                    {isError ? (
                        <Box sx={{ textAlign: "center", py: 8 }}>
                            <ErrorOutline sx={{ fontSize: 48, color: "#ef4444", mb: 1 }} />
                            <Typography color="error" fontWeight={600}>Đã xảy ra lỗi khi tải dữ liệu</Typography>
                        </Box>
                    ) : !(data?.Items?.length) ? (
                        <EmptyState />
                    ) : (
                        <Stack spacing={1.5}>
                            {data.Items.map((app: ApplicationResponse) => (
                                <ApplicationCard key={app.Id} app={app} onClick={() => setSelectedId(app.Id)} />
                            ))}
                        </Stack>
                    )}
                </Container>
            </Box>
            <ApplicationDetailDialog
                applicationId={selectedId}
                open={!!selectedId}
                onClose={() => setSelectedId(null)}
            />
        </>
    );
}