import Close from "@mui/icons-material/Close";
import LocationOn from "@mui/icons-material/LocationOn";
import CheckCircle from "@mui/icons-material/CheckCircle";
import HourglassEmpty from "@mui/icons-material/HourglassEmpty";
import Cancel from "@mui/icons-material/Cancel";
import OpenInNew from "@mui/icons-material/OpenInNew";
import Person from "@mui/icons-material/Person";
import School from "@mui/icons-material/School";
import Work from "@mui/icons-material/Work";
import Cake from "@mui/icons-material/Cake";
import StarRate from "@mui/icons-material/StarRate";
import WatchLater from "@mui/icons-material/WatchLater";
import EventAvailable from "@mui/icons-material/EventAvailable";
import Badge from "@mui/icons-material/Badge";
import Visibility from "@mui/icons-material/Visibility";
import AccessTime from "@mui/icons-material/AccessTime";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useGetApplicationByIdQuery } from "../../../app/features/application.api";
import { ConvertService } from "../../../app/services/convert.service";
import { ApplicationStatus } from "../../../app/models/enums.model";

const brand = "#f36730";
const brandLight = "#fff4ef";
const brandDark = "#c94e1a";

function StatusChip({ status }: { status?: ApplicationStatus }) {
    switch (status) {
        case ApplicationStatus.Accepted:
            return <Chip icon={<CheckCircle sx={{ fontSize: 14 }} />} label="Đã duyệt" color="success" size="small" sx={{ fontWeight: 600 }} />;
        case ApplicationStatus.Pending:
            return <Chip icon={<HourglassEmpty sx={{ fontSize: 14 }} />} label="Đang chờ" color="warning" size="small" sx={{ fontWeight: 600 }} />;
        case ApplicationStatus.Rejected:
            return <Chip icon={<Cancel sx={{ fontSize: 14 }} />} label="Từ chối" color="error" size="small" sx={{ fontWeight: 600 }} />;
        default:
            return <Chip label="Không xác định" color="default" size="small" sx={{ fontWeight: 600 }} />;
    }
}

interface InfoRowProps {
    icon: React.ReactNode;
    label: string;
    value?: string | null;
}

function InfoRow({ icon, label, value }: InfoRowProps) {
    if (!value) return null;
    return (
        <Stack direction="row" spacing={1.5} alignItems="flex-start">
            <Box sx={{ color: "#94a3b8", display: "flex", mt: "2px", flexShrink: 0 }}>{icon}</Box>
            <Box>
                <Typography sx={{ fontSize: 11, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", mb: 0.25 }}>
                    {label}
                </Typography>
                <Typography sx={{ fontSize: 13, fontWeight: 500, color: "#1e293b" }}>
                    {value}
                </Typography>
            </Box>
        </Stack>
    );
}

function SectionCard({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
    return (
        <Paper elevation={0} sx={{ border: "1px solid #e9ecef", borderRadius: 2, overflow: "hidden", bgcolor: "#fff" }}>
            <Box sx={{ px: 2, py: 1.25, bgcolor: "#f8fafc", borderBottom: "1px solid #e9ecef" }}>
                <Stack direction="row" spacing={0.75} alignItems="center">
                    {icon && <Box sx={{ color: "#64748b", display: "flex", fontSize: 15 }}>{icon}</Box>}
                    <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        {title}
                    </Typography>
                </Stack>
            </Box>
            <Box p={2}>
                {children}
            </Box>
        </Paper>
    );
}

function LoadingSkeleton() {
    return (
        <Stack spacing={2} p={3}>
            <Stack direction="row" spacing={2} alignItems="center">
                <Skeleton variant="circular" width={52} height={52} />
                <Box flex={1}><Skeleton width="55%" /><Skeleton width="40%" /></Box>
            </Stack>
            <Skeleton height={60} sx={{ borderRadius: 2 }} />
            <Skeleton height={160} sx={{ borderRadius: 2 }} />
            <Skeleton height={160} sx={{ borderRadius: 2 }} />
        </Stack>
    );
}

interface Props {
    applicationId: string | null;
    open: boolean;
    onClose: () => void;
}

export default function ApplicationDetailDialog({ applicationId, open, onClose }: Props) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const { data, isLoading, isError } = useGetApplicationByIdQuery(applicationId ?? "", { skip: !applicationId });

    const customer = data?.Customer;
    const post = data?.RecruitmentPost;
    const req = post?.Requirement;
    const profile = customer?.ProfileInfo;

    const appStatus = ConvertService.convertApplicationStatusFromString(data?.ApplicationStatus);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullScreen={fullScreen}
            maxWidth="md"
            fullWidth
            PaperProps={{ sx: { borderRadius: fullScreen ? 0 : 3, maxHeight: "92vh", background: "#f8fafc" } }}
        >
            <Box
                px={2} py={1}
                display="flex" alignItems="center" justifyContent="space-between"
                sx={{ background: "#fff", borderBottom: "1px solid #e9ecef", flexShrink: 0 }}
            >
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box sx={{ width: 4, height: 20, borderRadius: 1, bgcolor: brand }} />
                    <Typography fontWeight={700} fontSize={17} color="#1e293b">
                        Chi tiết chương trình ứng tuyển
                    </Typography>
                </Stack>
                <Box display="flex" alignItems="center" gap={1.5}>
                    {appStatus && <StatusChip status={appStatus} />}
                    <IconButton onClick={onClose} size="small" sx={{ color: "#64748b" }}>
                        <Close fontSize="small" />
                    </IconButton>
                </Box>
            </Box>

            <DialogContent sx={{ p: { xs: 1, sm: 1 }, overflowY: "auto" }}>
                {isLoading && <LoadingSkeleton />}

                {isError && (
                    <Box p={5} textAlign="center">
                        <Typography color="error" fontWeight={500}>Không thể tải dữ liệu</Typography>
                    </Box>
                )}

                {data && (
                    <Stack spacing={1}>
                        <Paper elevation={0} sx={{ border: "1px solid #e9ecef", borderRadius: 2, p: 2, bgcolor: "#fff" }}>
                            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ xs: "flex-start", sm: "center" }} justifyContent="space-between">
                                <Box flex={1}>
                                    <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                                        <Badge sx={{ fontSize: 15, color: brand }} />
                                        <Typography fontWeight={700} fontSize={14} color="#1e293b">{post?.Name}</Typography>
                                    </Stack>
                                    {post?.Organization?.Name && (
                                        <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                                            <School sx={{ fontSize: 15, color: brand }} />
                                            <Typography fontSize={13} color="#64748b" mb={0.5}>{post.Organization.Name}</Typography>
                                        </Stack>
                                    )}
                                    <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                                        {post?.Province && (
                                            <Stack direction="row" spacing={0.5} alignItems="center">
                                                <LocationOn sx={{ fontSize: 13, color: "#94a3b8" }} />
                                                <Typography fontSize={12} color="#64748b">{post.Province}</Typography>
                                            </Stack>
                                        )}
                                        {post?.RecruitmentFromDate && post?.RecruitmentToDate && (
                                            <Stack direction="row" spacing={0.5} alignItems="center">
                                                <AccessTime sx={{ fontSize: 13, color: "#94a3b8" }} />
                                                <Typography fontSize={12} color="#64748b">
                                                    {ConvertService.formatDateToddMMyyyy(post.RecruitmentFromDate)} – {ConvertService.formatDateToddMMyyyy(post.RecruitmentToDate)}
                                                </Typography>
                                            </Stack>
                                        )}
                                    </Stack>
                                </Box>
                                {post?.Id && (
                                    <Button
                                        variant="outlined" size="small"
                                        endIcon={<OpenInNew />}
                                        onClick={() => window.open(`/chuong-trinh-tuyen-sinh/${post.SeoUrl}`, "_blank")}
                                        sx={{
                                            textTransform: "none", borderColor: brand, color: brand,
                                            borderRadius: 1.5, fontSize: 11, flexShrink: 0, "&:hover": { borderColor: brandDark, color: brandDark, bgcolor: brandLight },
                                        }}
                                    >
                                        Xem chi tiết
                                    </Button>
                                )}
                            </Stack>
                        </Paper>

                        <Grid container spacing={1}>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <SectionCard title="Yêu cầu" icon={<Visibility sx={{ fontSize: 15 }} />}>
                                    <Stack spacing={1.75}>
                                        <InfoRow
                                            icon={<Cake sx={{ fontSize: 14 }} />}
                                            label="Độ tuổi"
                                            value={req?.FromAge || req?.ToAge ? [req.FromAge ? `Từ ${req.FromAge}` : null, req.ToAge ? `đến ${req.ToAge}` : null].filter(Boolean).join(" ") + " tuổi" : "Không yêu cầu"}
                                        />
                                        <InfoRow icon={<Person sx={{ fontSize: 14 }} />} label="Giới tính" value={ConvertService.convertGender(ConvertService.convertGenderFromString(req?.Gender))} />
                                        <InfoRow icon={<Work sx={{ fontSize: 14 }} />} label="Kinh nghiệm" value={ConvertService.convertJobExperience(ConvertService.convertJobExperienceFromString(req?.Experience))} />
                                        <InfoRow icon={<School sx={{ fontSize: 14 }} />} label="Trình độ học vấn" value={ConvertService.convertEducationLevel(ConvertService.convertEducationLevelFromString(req?.EducationLevel))} />
                                        <InfoRow icon={<StarRate sx={{ fontSize: 14 }} />} label="GPA tối thiểu" value={req?.MinimumGpa != null ? `≥ ${req.MinimumGpa}` : null} />
                                        <InfoRow icon={<EventAvailable sx={{ fontSize: 14 }} />} label="Thời gian tốt nghiệp tối đa" value={req?.MaxYearsSinceGrad ? `${req.MaxYearsSinceGrad} năm` : null} />
                                        <InfoRow icon={<WatchLater sx={{ fontSize: 14 }} />} label="Số buổi nghỉ tối đa" value={req?.MaxAbsence != null ? `≤ ${req.MaxAbsence} buổi` : null} />
                                    </Stack>
                                </SectionCard>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <SectionCard title="Hồ sơ ứng viên" icon={<Person sx={{ fontSize: 15 }} />}>
                                    <Stack spacing={1.75}>
                                        <InfoRow icon={<Cake sx={{ fontSize: 14 }} />} label="Ngày sinh" value={ConvertService.formatDateToddMMyyyy(profile?.DateOfBirth)} />
                                        <InfoRow icon={<Person sx={{ fontSize: 14 }} />} label="Giới tính" value={ConvertService.convertGender(ConvertService.convertGenderFromString(profile?.Gender))} />
                                        <InfoRow icon={<Work sx={{ fontSize: 14 }} />} label="Kinh nghiệm" value={ConvertService.convertJobExperience(ConvertService.convertJobExperienceFromString(profile?.Experience))} />
                                        <InfoRow icon={<School sx={{ fontSize: 14 }} />} label="Trình độ học vấn" value={ConvertService.convertEducationLevel(ConvertService.convertEducationLevelFromString(profile?.EducationLevel))} />
                                        <InfoRow icon={<StarRate sx={{ fontSize: 14 }} />} label="GPA" value={profile?.Gpa != null ? `${Number(profile.Gpa).toFixed(1)}` : null} />
                                        <InfoRow icon={<EventAvailable sx={{ fontSize: 14 }} />} label="Năm tốt nghiệp" value={profile?.GraduationYear ? `Năm ${profile.GraduationYear}` : null} />
                                    </Stack>
                                </SectionCard>
                            </Grid>
                        </Grid>
                    </Stack>
                )}
            </DialogContent>
        </Dialog>
    );
}