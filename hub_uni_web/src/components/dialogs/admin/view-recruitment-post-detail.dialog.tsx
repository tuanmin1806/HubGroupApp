import { lazy } from "react";
import Close from "@mui/icons-material/Close";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import Paper from "@mui/material/Paper";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { useMemo } from "react";
import { useGetRecruitmentPostByIdQuery } from "../../../app/features/recruitment-post.api";
import { useGetProfessionsByPageQuery } from "../../../app/features/professtion.api";
import { useGetAllProvinceNoAuthenQuery } from "../../../app/features/province.api";
import { useGetAllVisaTypesQuery } from "../../../app/features/visa-type.api";
import { ConvertService } from "../../../app/services/convert.service";
import { RecruitPostStatus, Gender, JobExperience, EducationLevel } from "../../../app/models/enums.model";
import { Province } from "../../../app/models/province.model";
import { Profession } from "../../../app/models/recruitment-post.model";
import { formatDate } from "../../../utils/date.utils";
import labelsVi from "../../../i18n/labels.vi";
const RichTextEditorComponent = lazy(() => import("../../editor"));

interface ViewRecruitmentPostDialogProps {
    open: boolean;
    postId: string | null;
    onClose: () => void;
}

const POST_STATUS_LABELS: Record<number, string> = {
    [RecruitPostStatus.Active]: "Hoạt động",
    [RecruitPostStatus.Inactive]: "Dừng hoạt động",
    [RecruitPostStatus.Draft]: "Nháp",
};

const GENDER_LABELS: Record<number, string> = {
    [Gender.Undefined]: "Không yêu cầu",
    [Gender.Male]: "Nam",
    [Gender.Female]: "Nữ",
    [Gender.Other]: "Khác",
};

const EXPERIENCE_LABELS: Record<number, string> = {
    [JobExperience.Undefined]: "Không yêu cầu",
    [JobExperience.LessThan1Year]: "< 1 năm",
    [JobExperience.From1To2Years]: "1-2 năm",
    [JobExperience.From2To3Years]: "2-3 năm",
    [JobExperience.From3To5Years]: "3-5 năm",
    [JobExperience.From5To10Years]: "5-10 năm",
    [JobExperience.Above10Years]: "> 10 năm",
};

const EDUCATION_LABELS: Record<number, string> = {
    [EducationLevel.Undefined]: "Không yêu cầu",
    [EducationLevel.PrimarySchool]: "Tiểu học",
    [EducationLevel.MiddleSchool]: "THCS",
    [EducationLevel.HighSchool]: "THPT",
    [EducationLevel.VocationalSchool]: "Trung cấp",
    [EducationLevel.College]: "Cao đẳng",
    [EducationLevel.University]: "Đại học",
    [EducationLevel.Postgraduate]: "Sau đại học",
};

const labels = labelsVi.recruitmentPost;

export default function ViewRecruitmentPostDialog({ open, postId, onClose }: ViewRecruitmentPostDialogProps) {
    const { data: postData, isFetching: isFetchingPost } = useGetRecruitmentPostByIdQuery(postId!, { skip: !open || !postId, });
    const { data: provinces = [] } = useGetAllProvinceNoAuthenQuery(undefined, { skip: !open });
    const { data: professionData } = useGetProfessionsByPageQuery({ page: 1, size: 100 }, { skip: !open });
    const { data: visaTypesData } = useGetAllVisaTypesQuery(undefined, { skip: !open });

    const professionList: Profession[] = useMemo(
        () =>
            professionData?.Items?.map((p: { Id: string; Name: string }) => ({
                ProfessionId: p.Id,
                ProfessionName: p.Name,
                ProfessionSeoUrl: "",
                Cost: 0,
            })) ?? [],
        [professionData]
    );

    const visaTypeOptions = useMemo(
        () => visaTypesData?.map((v: { Id: string; Name: string }) => ({ value: v.Id, label: v.Name })) ?? [],
        [visaTypesData]
    );

    const req = postData?.Requirement;
    const status = ConvertService.convertPostStatusFromString(postData?.RecruitPostStatus);
    const gender = ConvertService.convertGenderFromString(req?.Gender);
    const experience = ConvertService.convertJobExperienceFromString(req?.Experience);
    const educationLevel = ConvertService.convertEducationLevelFromString(req?.EducationLevel);

    const selectedProvince = provinces.find((p: Province) => p.Id === postData?.ProvinceId) ?? null;

    const selectedProfessions: Profession[] = useMemo(() => {
        const ids: string[] = postData?.Professions?.length ? postData.Professions.map((p: { ProfessionId: string }) => p.ProfessionId) : (postData?.ProfessionIds ?? []);
        return ids.map((id) => professionList.find((p) => p.ProfessionId === id)).filter((p): p is Profession => p !== undefined);
    }, [postData, professionList]);

    const selectedVisaType = visaTypeOptions.find((v) => v.value === req?.VisaTypeId) ?? null;

    const otherReqs: string[] = req?.OtherReqs?.filter((r: string) => r.trim()) ?? [];
    const highlights: string[] = postData?.Highlights?.filter((h: string) => h.trim()) ?? [];

    const tf = { size: "small" as const, fullWidth: true };
    const roProps = { InputProps: { readOnly: true }, sx: { "& .MuiInputBase-root": { bgcolor: "action.hover" } } };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth PaperProps={{ sx: { maxHeight: "95vh" } }}>
            <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 1 }}>
                <Typography fontWeight={600}>{labels.viewRecruitmentPostDetail}</Typography>
                <IconButton onClick={onClose} size="small"><Close /></IconButton>
            </DialogTitle>
            <Divider />

            <DialogContent sx={{ pt: 2 }}>
                {isFetchingPost ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}> <CircularProgress size={36} /> </Box>
                ) : !postData ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}> <Typography color="text.secondary">{labels.noData}</Typography> </Box>
                ) : (
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12 }}>
                            <Typography variant="subtitle2" fontWeight={600} color="text.secondary">{labels.basicInfo}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField {...tf} {...roProps} label={labels.recruitmentProgramName} value={postData.Name ?? ""} />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                {...tf} {...roProps}
                                label={labels.status}
                                value={POST_STATUS_LABELS[status] ?? "—"}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Autocomplete<Province>
                                {...tf}
                                options={provinces}
                                getOptionLabel={(opt) => opt.Name ?? ""}
                                value={selectedProvince}
                                readOnly
                                renderInput={(params) => (
                                    <TextField {...params} label={labels.province} sx={roProps.sx} />
                                )}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Autocomplete<Profession, true>
                                multiple
                                {...tf}
                                options={professionList}
                                getOptionLabel={(opt) => opt.ProfessionName ?? opt.ProfessionId}
                                value={selectedProfessions}
                                readOnly
                                renderTags={(value, getTagProps) =>
                                    value.map((opt, index) => {
                                        const { key, ...tagProps } = getTagProps({ index });
                                        return (
                                            <Chip
                                                key={opt.ProfessionId}
                                                label={opt.ProfessionName ?? opt.ProfessionId}
                                                size="small"
                                                {...tagProps}
                                                onDelete={undefined}
                                            />
                                        );
                                    })
                                }
                                renderInput={(params) => (
                                    <TextField {...params} label={labels.profession} sx={roProps.sx} />
                                )}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField {...tf} {...roProps} label={labels.quantity} value={postData.Quantity ?? ""} />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                {...tf} {...roProps}
                                label={labels.recruitmentFromDate}
                                value={formatDate(postData.RecruitmentFromDate) ?? "—"}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                {...tf} {...roProps}
                                label={labels.recruitmentToDate}
                                value={formatDate(postData.RecruitmentToDate) ?? "—"}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Accordion variant="outlined" disableGutters sx={{ borderRadius: 1 }}>
                                <AccordionSummary expandIcon={<ExpandMore />}>
                                    <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
                                        {labels.requirements}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Grid container spacing={2}>
                                        <Grid size={{ xs: 6 }}>
                                            <TextField {...tf} {...roProps} label={labels.fromAge} value={req?.FromAge ?? "—"} />
                                        </Grid>
                                        <Grid size={{ xs: 6 }}>
                                            <TextField {...tf} {...roProps} label={labels.toAge} value={req?.ToAge ?? "—"} />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField {...tf} {...roProps} label={labels.gender} value={GENDER_LABELS[gender] ?? "—"} />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField {...tf} {...roProps} label={labels.experience} value={EXPERIENCE_LABELS[experience] ?? "—"} />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField {...tf} {...roProps} label={labels.educationLevel} value={EDUCATION_LABELS[educationLevel] ?? "—"} />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField {...tf} {...roProps} label={labels.minimumGpa} value={req?.MinimumGpa ?? 0} />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField {...tf} {...roProps} label={labels.maxYearsSinceGrad} value={req?.MaxYearsSinceGrad ?? 0} />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField {...tf} {...roProps} label={labels.maxAbsence} value={req?.MaxAbsence ?? 0} />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <Autocomplete
                                                {...tf}
                                                options={visaTypeOptions}
                                                getOptionLabel={(opt) => opt.label}
                                                value={selectedVisaType}
                                                readOnly
                                                renderInput={(params) => (
                                                    <TextField {...params} label={labels.visaType} sx={roProps.sx} />
                                                )}
                                            />
                                        </Grid>

                                        {otherReqs.length > 0 && (
                                            <Grid size={{ xs: 12 }}>
                                                <Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ mb: 1 }}>
                                                    {labels.otherReqs}
                                                </Typography>
                                                {otherReqs.map((req, i) => (
                                                    <Box key={i} sx={{ mb: 1 }}>
                                                        <TextField
                                                            {...tf} {...roProps}
                                                            size="small"
                                                            value={req}
                                                            placeholder={`${labels.requirement} ${i + 1}`}
                                                        />
                                                    </Box>
                                                ))}
                                            </Grid>
                                        )}
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>
                        </Grid>

                        {highlights.length > 0 && (
                            <Grid size={{ xs: 12 }}>
                                <Divider sx={{ my: 1 }} />
                                <Typography variant="subtitle2" fontWeight={600} color="text.secondary" sx={{ mb: 1 }}>
                                    {labels.highlights}
                                </Typography>
                                {highlights.map((h, i) => (
                                    <Box key={i} sx={{ mb: 1 }}>
                                        <TextField {...tf} {...roProps} size="small" value={h} />
                                    </Box>
                                ))}
                            </Grid>
                        )}

                        <Grid size={{ xs: 12 }}>
                            <Paper elevation={1} sx={{ p: 2 }}>
                                <Typography variant="subtitle2" fontWeight={600} color="text.secondary" sx={{ mb: 1 }}>
                                    {labels.description}
                                </Typography>
                                <RichTextEditorComponent
                                    key={postData.Description}
                                    value={postData.Description}
                                />
                            </Paper>
                        </Grid>
                    </Grid>
                )}
            </DialogContent>

            <Divider />
            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={onClose} variant="outlined" color="inherit">{labels.close}</Button>
            </DialogActions>
        </Dialog>
    );
}