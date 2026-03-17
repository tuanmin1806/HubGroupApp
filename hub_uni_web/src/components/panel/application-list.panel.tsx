import { CalendarToday, LocationOn, School, WorkOutline } from "@mui/icons-material";
import {
    Box, Paper, Chip, CircularProgress,
    Stack, Typography, Button
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetByCustomerQuery } from "../../app/features/application.api";
import { ApplicationResponse } from "../../app/models/application.model";
import { getUserInfo } from "../../app/services/auth.service";
import { formatDate } from "../../utils/date.utils";
import ApplicationDetailDialog from "../dialogs/student/application-detail.dialog";

function ApplicationCard({ app, onClick }: { app: ApplicationResponse; onClick: () => void }) {
    const post = app.RecruitmentPost;
    return (
        <Paper
            elevation={0}
            onClick={onClick}
            sx={{
                p: 2,
                borderRadius: 2,
                border: "1px solid #dbd8d8",
                cursor: "pointer",
                transition: "all 0.2s ease",
                "&:hover": {
                    borderColor: "#f36730",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    transform: "translateY(-2px)",
                },
            }}
        >
            <Stack spacing={1.25}>
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <Box
                        sx={{
                            width: { xs: 52, sm: 60 },
                            height: { xs: 52, sm: 60 },
                            borderRadius: 1.5,
                            backgroundColor: "#f5f5f5",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            overflow: "hidden",
                            border: "1px solid",
                            borderColor: "divider",
                        }}
                    >
                        {post?.Organization?.LogoFullUrl ? (
                            <Box component="img" src={post.Organization.LogoFullUrl} alt={post.Organization.Name}
                                sx={{ width: "100%", height: "100%", objectFit: "contain" }} />
                        ) : (
                            <WorkOutline sx={{ fontSize: 26, color: "text.secondary" }} />
                        )}
                    </Box>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography fontWeight={700}
                            sx={{
                                fontSize: { xs: "0.9rem", sm: "1rem" }, lineHeight: 1.35,
                                display: "-webkit-box", WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical", overflow: "hidden", mb: 0.25,
                            }}
                        >
                            {post?.Name ?? "Chương trình tuyển sinh"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" fontWeight={500}
                            sx={{
                                fontSize: { xs: "0.78rem", sm: "0.82rem" },
                                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", mb: 0.5,
                            }}
                        >
                            {post?.Organization?.Name ?? "—"}
                        </Typography>

                        <Stack direction="row" flexWrap="wrap" gap={{ xs: 0.75, sm: 1.5 }}>
                            {post?.Province && (
                                <Stack direction="row" spacing={0.4} alignItems="center">
                                    <LocationOn sx={{ fontSize: 14, color: "#f36730" }} />
                                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.72rem" }}>
                                        {post.Province}
                                    </Typography>
                                </Stack>
                            )}
                            <Stack direction="row" spacing={0.4} alignItems="center">
                                <CalendarToday sx={{ fontSize: 14, color: "#f36730" }} />
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.72rem" }}>
                                    Ngày nộp: {formatDate(app.CreatedAt)}
                                </Typography>
                            </Stack>
                        </Stack>
                    </Box>
                </Stack>

                {post?.Professions && post.Professions.length > 0 && (
                    <Stack direction="row" flexWrap="wrap" gap={0.5}>
                        {post.Professions.slice(0, 3).map((profession) => (
                            <Chip key={profession.ProfessionId} label={profession.ProfessionName} size="small" variant="outlined"
                                sx={{
                                    height: 20, fontSize: "0.65rem",
                                    borderColor: "primary.light", color: "primary.main",
                                    "& .MuiChip-label": { px: 0.75 },
                                }} />
                        ))}
                        {post.Professions.length > 3 && (
                            <Chip label={`+${post.Professions.length - 3}`} size="small" variant="outlined"
                                sx={{ height: 20, fontSize: "0.65rem", "& .MuiChip-label": { px: 0.75 } }} />
                        )}
                    </Stack>
                )}

                <Stack direction="row" alignItems="center" justifyContent="flex-end">
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={(e) => { e.stopPropagation(); }}
                        sx={{
                            borderColor: "#f36730", color: "#f36730", borderRadius: 1.5,
                            fontSize: "0.72rem", px: 1.5, height: 30,
                            textTransform: "none", fontWeight: 600,
                            "&:hover": { bgcolor: "#fff3e0", borderColor: "#e05520" },
                        }}
                    >
                        Xem chi tiết
                    </Button>
                </Stack>
            </Stack>
        </Paper>
    );
}

export default function ApplicationListPanel() {
    const navigate = useNavigate();
    const userInfo = getUserInfo();
    const { data, isLoading, isError } = useGetByCustomerQuery({ customerId: userInfo?.Id ?? "" });
    const [selectedId, setSelectedId] = useState<string | null>(null);

    if (isLoading) return (
        <Box sx={{ textAlign: "center", py: 8 }}>
            <CircularProgress size={36} sx={{ color: "#f36730" }} />
        </Box>
    );

    if (isError) return (
        <Box sx={{ textAlign: "center", py: 6 }}>
            <Typography color="error" fontWeight={600}>Đã xảy ra lỗi khi tải dữ liệu</Typography>
        </Box>
    );

    return (
        <>
            <Box>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5, fontSize: "1rem" }}>
                    Danh sách tin đã ứng tuyển
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: "0.8rem" }}>
                    {data?.Items?.length ?? 0} đơn ứng tuyển
                </Typography>

                {!data?.Items?.length ? (
                    <Box sx={{ textAlign: "center", py: 8 }}>
                        <Box sx={{
                            width: 64, height: 64, borderRadius: "50%", bgcolor: "#fff7ed",
                            display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 2,
                        }}>
                            <School sx={{ fontSize: 30, color: "#f36730" }} />
                        </Box>
                        <Typography fontWeight={700} sx={{ mb: 0.5 }}>Chưa có đơn ứng tuyển</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 280, mx: "auto", mb: 2.5 }}>
                            Hãy khám phá các chương trình tuyển sinh và nộp hồ sơ ngay.
                        </Typography>
                        <Button variant="contained" disableElevation
                            onClick={() => navigate("/chuong-trinh-tuyen-sinh")}
                            sx={{
                                bgcolor: "#f36730", borderRadius: 2, textTransform: "none",
                                fontWeight: 600, "&:hover": { bgcolor: "#e05520" },
                            }}>
                            Xem chương trình tuyển sinh
                        </Button>
                    </Box>
                ) : (
                    <Stack spacing={1.25}>
                        {data.Items.map((app: ApplicationResponse) => (
                            <ApplicationCard key={app.Id} app={app} onClick={() => setSelectedId(app.Id)} />
                        ))}
                    </Stack>
                )}
            </Box>

            <ApplicationDetailDialog
                applicationId={selectedId}
                open={!!selectedId}
                onClose={() => setSelectedId(null)}
            />
        </>
    );
}