import Close from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import { useGetApplicationByIdQuery } from "../../../app/features/application.api";
import { ConvertService } from "../../../app/services/convert.service";
import { ApplicationStatus } from "../../../app/models/enums.model";
import labelsVi from "../../../i18n/labels.vi";

interface ViewApplicationDialogProps {
    open: boolean;
    applicationId: string | null;
    onClose: () => void;
}

const STATUS_CHIP: Record<string, { bgcolor: string; color: string; border: string }> = {
    [ApplicationStatus.Accepted]: { bgcolor: "#e8f5e9", color: "#2e7d32", border: "#a5d6a7" },
    [ApplicationStatus.Rejected]: { bgcolor: "#fce4ec", color: "#c62828", border: "#ef9a9a" },
    [ApplicationStatus.Pending]: { bgcolor: "#fff8e1", color: "#e65100", border: "#ffe082" },
    [ApplicationStatus.Undefined]: { bgcolor: "#f5f5f5", color: "#757575", border: "#e0e0e0" },
};

const SectionTitle = ({ title }: { title: string }) => (
    <Box sx={{ borderBottom: "1px solid", borderColor: "primary.100", pb: 0.5, mb: 2 }}>
        <Typography variant="caption" fontWeight={700} color="primary.main" sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
            {title}
        </Typography>
    </Box>
);

const InfoRow = ({ label, value }: { label: string; value?: string | number | null }) => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
        <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: "uppercase", letterSpacing: 0.4 }}>
            {label}
        </Typography>
        {value != null && value !== "" ? (
            <Typography variant="body2" fontWeight={600} color="text.primary" sx={{ wordBreak: "break-word" }}>
                {value}
            </Typography>
        ) : (
            <Typography variant="body2" color="text.disabled" fontStyle="italic">—</Typography>
        )}
    </Box>
);

const labels = labelsVi.application;

export default function ViewApplicationDialog({ open, applicationId, onClose }: ViewApplicationDialogProps) {
    const { data, isFetching, isError } = useGetApplicationByIdQuery(applicationId!, { skip: !open || !applicationId, refetchOnMountOrArgChange: true });

    const customer = data?.Customer;
    const profile = customer?.ProfileInfo;
    const post = data?.RecruitmentPost;
    const req = post?.Requirement;

    const statusEnum = data ? ConvertService.convertApplicationStatusFromString(data.ApplicationStatus) : null;
    const statusStyle = statusEnum != null ? (STATUS_CHIP[statusEnum] ?? STATUS_CHIP[ApplicationStatus.Undefined]) : null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth PaperProps={{ sx: { maxHeight: "92vh", borderRadius: 2 } }}>
            <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 3, py: 1.5, bgcolor: "grey.50", borderBottom: "1px solid", borderColor: "divider" }}>
                <Typography variant="subtitle1" fontWeight={700}>{labels.applicationDetail}</Typography>
                <Stack direction="row" alignItems="center" gap={1.5}>
                    {statusStyle && statusEnum !== null && (
                        <Chip
                            label={ConvertService.convertApplicationStatus(statusEnum)}
                            size="medium"
                            sx={{ bgcolor: statusStyle.bgcolor, color: statusStyle.color, border: `1px solid ${statusStyle.border}`, fontWeight: 600, fontSize: 12 }}
                        />
                    )}
                    <IconButton size="small" onClick={onClose}><Close fontSize="small" /></IconButton>
                </Stack>
            </DialogTitle>

            <DialogContent sx={{ p: 0, overflow: "auto" }}>
                {isFetching && (<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 10 }}><CircularProgress size={36} /></Box>)}
                {isError && !isFetching && (<Box sx={{ display: "flex", justifyContent: "center", py: 10 }}><Typography color="error">{labels.loadDataFailed}</Typography></Box>)}

                {!isFetching && !isError && data && (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
                        <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
                            <SectionTitle title={labels.applicationInfo} />

                            <Stack direction="row" alignItems="center" gap={2} sx={{ mb: 3 }}>
                                <Avatar
                                    src={customer?.AvatarFullUrl ?? undefined}
                                    alt={customer?.FullName}
                                    sx={{ width: 56, height: 56, bgcolor: "primary.100", color: "primary.main", fontWeight: 700, fontSize: 22, flexShrink: 0, border: "2px solid", borderColor: "primary.100" }}
                                >
                                    {!customer?.AvatarFullUrl && (customer?.FullName?.charAt(0) ?? "?")}
                                </Avatar>
                                <Box>
                                    <Typography variant="subtitle2" fontWeight={700}>{customer?.FullName}</Typography>
                                    <Typography variant="body2" color="text.secondary">{customer?.Email}</Typography>
                                    <Typography variant="body2" color="text.secondary">{customer?.PhoneNumber}</Typography>
                                </Box>
                            </Stack>

                            <Grid container spacing={2.5}>
                                <Grid size={{ xs: 6, sm: 4 }}>
                                    <InfoRow label={labels.dateOfBirth} value={ConvertService.formatDateToddMMyyyy(profile?.DateOfBirth)} />
                                </Grid>
                                <Grid size={{ xs: 6, sm: 4 }}>
                                    <InfoRow label={labels.gender} value={ConvertService.convertGender(ConvertService.convertGenderFromString(profile?.Gender))} />
                                </Grid>
                                <Grid size={{ xs: 6, sm: 4 }}>
                                    <InfoRow label={labels.educationLevel} value={ConvertService.convertEducationLevel(ConvertService.convertEducationLevelFromString(profile?.EducationLevel))} />
                                </Grid>
                                <Grid size={{ xs: 6, sm: 4 }}>
                                    <InfoRow label={labels.experience} value={ConvertService.convertJobExperience(ConvertService.convertJobExperienceFromString(profile?.Experience))} />
                                </Grid>
                                <Grid size={{ xs: 6, sm: 4 }}>
                                    <InfoRow label={labels.gpa} value={profile?.Gpa} />
                                </Grid>
                                <Grid size={{ xs: 6, sm: 4 }}>
                                    <InfoRow label={labels.graduationYear} value={profile?.GraduationYear} />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <InfoRow label={labels.address} value={profile?.Address} />
                                </Grid>
                            </Grid>
                        </Box>

                        <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
                            <SectionTitle title={labels.recruitmentProgram} />
                            <Grid container spacing={2.5}>
                                <Grid size={{ xs: 12 }}>
                                    <InfoRow label={labels.recruitmentProgramName} value={post?.Name} />
                                </Grid>
                                <Grid size={{ xs: 6, sm: 4 }}>
                                    <InfoRow label={labels.province} value={post?.Province} />
                                </Grid>
                                <Grid size={{ xs: 6, sm: 4 }}>
                                    <InfoRow label={labels.quantity} value={post?.Quantity} />
                                </Grid>
                                <Grid size={{ xs: 6, sm: 4 }}>
                                    <InfoRow label={labels.currency} value={post?.Currency} />
                                </Grid>
                                <Grid size={{ xs: 6, sm: 4 }}>
                                    <InfoRow label={labels.recruitmentFromDate} value={post?.RecruitmentFromDate ? ConvertService.formatDateToddMMyyyy(post.RecruitmentFromDate) : null} />
                                </Grid>
                                <Grid size={{ xs: 6, sm: 4 }}>
                                    <InfoRow label={labels.recruitmentToDate} value={post?.RecruitmentToDate ? ConvertService.formatDateToddMMyyyy(post.RecruitmentToDate) : null} />
                                </Grid>

                                {post?.Professions && post.Professions.length > 0 && (
                                    <Grid size={{ xs: 12 }}>
                                        <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: "uppercase", letterSpacing: 0.4 }}>
                                            {labels.profession}
                                        </Typography>
                                        <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 0.75 }}>
                                            {post.Professions.map((p: { Id: string; Name: string }) => (
                                                <Chip
                                                    key={p.Id}
                                                    label={p.Name?.trim()}
                                                    size="small"
                                                    sx={{ bgcolor: "#e3f0ff", color: "#1565c0", border: "1px solid #bbdefb", fontWeight: 600, fontSize: 12 }}
                                                />
                                            ))}
                                        </Stack>
                                    </Grid>
                                )}
                            </Grid>
                        </Box>

                        {req && (
                            <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
                                <SectionTitle title={labels.requirements} />
                                <Grid container spacing={2.5}>
                                    <Grid size={{ xs: 6, sm: 4 }}>
                                        <InfoRow label={labels.ageRange} value={req.FromAge && req.ToAge ? `${req.FromAge} – ${req.ToAge} tuổi` : null} />
                                    </Grid>
                                    <Grid size={{ xs: 6, sm: 4 }}>
                                        <InfoRow label={labels.gender} value={ConvertService.convertGender(ConvertService.convertGenderFromString(req.Gender))} />
                                    </Grid>
                                    <Grid size={{ xs: 6, sm: 4 }}>
                                        <InfoRow label={labels.educationLevel} value={ConvertService.convertEducationLevel(ConvertService.convertEducationLevelFromString(req.EducationLevel))} />
                                    </Grid>
                                    <Grid size={{ xs: 6, sm: 4 }}>
                                        <InfoRow label={labels.experience} value={ConvertService.convertJobExperience(ConvertService.convertJobExperienceFromString(req.Experience))} />
                                    </Grid>
                                    <Grid size={{ xs: 6, sm: 4 }}>
                                        <InfoRow label={labels.minimumGpa} value={req.MinimumGpa} />
                                    </Grid>
                                    <Grid size={{ xs: 6, sm: 4 }}>
                                        <InfoRow label={labels.maxYearsSinceGrad} value={req.MaxYearsSinceGrad} />
                                    </Grid>
                                    <Grid size={{ xs: 6, sm: 4 }}>
                                        <InfoRow label={labels.maxAbsence} value={req.MaxAbsence} />
                                    </Grid>
                                    <Grid size={{ xs: 6, sm: 4 }}>
                                        <InfoRow label={labels.visaType} value={req.VisaType} />
                                    </Grid>

                                    {req.OtherReqs?.length > 0 && (
                                        <Grid size={{ xs: 12 }}>
                                            <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: "uppercase", letterSpacing: 0.4 }}>
                                                {labels.otherReqs}
                                            </Typography>
                                            <Box component="ul" sx={{ mt: 0.75, pl: 2.5, mb: 0 }}>
                                                {req.OtherReqs.map((r: string, i: number) => (
                                                    <Box component="li" key={i} sx={{ mb: 0.5 }}>
                                                        <Typography variant="body2" color="text.primary">{r}</Typography>
                                                    </Box>
                                                ))}
                                            </Box>
                                        </Grid>
                                    )}
                                </Grid>
                            </Box>
                        )}
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 2, py: 1.5, bgcolor: "grey.50" }}>
                <Button onClick={onClose} variant="outlined" color="inherit" size="small">{labels.close}</Button>
            </DialogActions>
        </Dialog>
    );
}