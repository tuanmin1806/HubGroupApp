import { lazy } from "react";
import CalendarToday from "@mui/icons-material/CalendarToday";
import LocationOn from "@mui/icons-material/LocationOn";
import School from "@mui/icons-material/School";
import WorkOutline from "@mui/icons-material/WorkOutline";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetByCustomerQuery } from "../../app/features/application.api";
import { ApplicationResponse } from "../../app/models/application.model";
import { getUserInfo } from "../../app/services/auth.service";
import { formatDate } from "../../utils/date.utils";
import { ApplicationStatus } from "../../app/models/enums.model";
import { ConvertService } from "../../app/services/convert.service";
import LoadingOverlay from "../general/loading-overlay";
const ApplicationDetailDialog = lazy(() => import("../dialogs/student/application-detail.dialog"));

const STATUS_OPTIONS = [
    { value: "", label: "Tất cả" },
    { value: ApplicationStatus.Pending, label: ConvertService.convertApplicationStatus(ApplicationStatus.Pending) },
    { value: ApplicationStatus.Accepted, label: ConvertService.convertApplicationStatus(ApplicationStatus.Accepted) },
    { value: ApplicationStatus.Rejected, label: ConvertService.convertApplicationStatus(ApplicationStatus.Rejected) },
];

const STATUS_CHIP_STYLE: Record<ApplicationStatus, { bgcolor: string; color: string; borderColor: string }> = {
    [ApplicationStatus.Undefined]: { bgcolor: "#f5f5f5", color: "#757575", borderColor: "#e0e0e0" },
    [ApplicationStatus.Pending]: { bgcolor: "#fff8e1", color: "#f59e0b", borderColor: "#fde68a" },
    [ApplicationStatus.Accepted]: { bgcolor: "#e8f5e9", color: "#388e3c", borderColor: "#c8e6c9" },
    [ApplicationStatus.Rejected]: { bgcolor: "#ffebee", color: "#c62828", borderColor: "#ffcdd2" },
};

function ApplicationCard({ app, onClick }: { app: ApplicationResponse; onClick: () => void }) {
    const post = app.RecruitmentPost;
    const status = ConvertService.convertApplicationStatusFromString(app.ApplicationStatus);
    const chipStyle = STATUS_CHIP_STYLE[status] ?? STATUS_CHIP_STYLE[ApplicationStatus.Undefined];
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
                    <Chip
                        label={ConvertService.convertApplicationStatus(status)}
                        size="small"
                        sx={{
                            flexShrink: 0,
                            alignSelf: "flex-start",
                            height: 22,
                            fontSize: "0.65rem",
                            fontWeight: 600,
                            bgcolor: chipStyle.bgcolor,
                            color: chipStyle.color,
                            border: "1px solid",
                            borderColor: chipStyle.borderColor,
                            "& .MuiChip-label": { px: 1 },
                        }}
                    />
                </Stack>

                {post?.Professions && post.Professions.length > 0 && (
                    <Stack direction="row" flexWrap="wrap" gap={0.5}>
                        {post.Professions.slice(0, 3).map((profession) => (
                            <Chip key={profession.Id} label={profession.Name} size="small" variant="outlined"
                                sx={{
                                    height: 20, fontSize: "0.65rem",
                                    borderColor: "#f36730", color: "#f36730",
                                    "& .MuiChip-label": { px: 0.75 },
                                }} />
                        ))}
                        {post.Professions.length > 3 && (
                            <Chip label={`+${post.Professions.length - 3}`} size="small" variant="outlined"
                                sx={{ height: 20, fontSize: "0.65rem", "& .MuiChip-label": { px: 0.75 } }} />
                        )}
                    </Stack>
                )}
            </Stack>
        </Paper>
    );
}

export default function ApplicationListPanel() {
    const navigate = useNavigate();
    const userInfo = getUserInfo();
    const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | "">("");
    const { data, isLoading, isError } = useGetByCustomerQuery({ customerId: userInfo?.Id ?? "", status: selectedStatus !== "" ? selectedStatus : undefined, });
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const handleStatusChange = (e: SelectChangeEvent) => {
        const val = e.target.value;
        setSelectedStatus(val === "" ? "" : Number(val) as ApplicationStatus);
    };

    return (
        <LoadingOverlay
            open={isLoading}
            error={isError}
            empty={!data?.Items?.length}
            emptyVariant="search"
            emptyTitle="Chưa có chương trình nào được ứng tuyển"
            emptyDescription="Hãy khám phá các chương trình tuyển sinh và ứng tuyển ngay."
            emptyAction={<Button variant="contained" disableElevation onClick={() => navigate("/chuong-trinh-tuyen-sinh")} sx={{ bgcolor: "#f36730", borderRadius: 2, textTransform: "none", fontWeight: 600, "&:hover": { bgcolor: "#e05520" }, }}>Xem chương trình tuyển sinh</Button>}
        >
            <Box>
                <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1} mb={0.5}>
                    <Typography variant="h6" fontWeight={700} sx={{ fontSize: "1rem" }}>
                        Danh sách chương trình đã ứng tuyển
                    </Typography>

                    <FormControl size="small" sx={{ minWidth: 160 }}>
                        <Select
                            value={String(selectedStatus)}
                            onChange={handleStatusChange}
                            displayEmpty
                            sx={{
                                fontSize: "0.8rem",
                                borderRadius: 1.5,
                                "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e0e0e0" },
                                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#f36730" },
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#f36730" },
                            }}
                        >
                            {STATUS_OPTIONS.map((opt) => (
                                <MenuItem key={String(opt.value)} value={String(opt.value)} sx={{ fontSize: "0.8rem" }}>
                                    {opt.value !== "" ? (
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <Box sx={{
                                                width: 8, height: 8, borderRadius: "50%",
                                                bgcolor: STATUS_CHIP_STYLE[opt.value as ApplicationStatus]?.color,
                                                flexShrink: 0,
                                            }} />
                                            <span>{opt.label}</span>
                                        </Stack>
                                    ) : opt.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: "0.8rem" }}>
                    {data?.Items?.length ?? 0} chương trình đã ứng tuyển
                </Typography>
                <Stack spacing={1.25}>
                    {data?.Items?.map((app: ApplicationResponse) => (
                        <ApplicationCard key={app.Id} app={app} onClick={() => setSelectedId(app.Id)} />
                    ))}
                </Stack>
            </Box>

            <ApplicationDetailDialog
                applicationId={selectedId}
                open={!!selectedId}
                onClose={() => setSelectedId(null)}
            />
        </LoadingOverlay>
    );
}