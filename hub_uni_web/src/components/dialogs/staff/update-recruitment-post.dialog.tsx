import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Grid, IconButton, CircularProgress, Typography, Divider, Box, Chip, Autocomplete, Paper, FormHelperText, Accordion, AccordionSummary, AccordionDetails, FormControlLabel, Checkbox, } from "@mui/material";
import { Close, Add, Remove, ExpandMore } from "@mui/icons-material";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useGetProfessionsByPageQuery } from "../../../app/features/professtion.api";
import { useGetAllProvinceNoAuthenQuery } from "../../../app/features/province.api";
import { useLazyGetRecruitmentPostByIdQuery, useUpdateRecruitmentPostMutation } from "../../../app/features/recruitment-post.api";
import { useGetOrganizationByIdQuery, useGetProfessionsByOrganizationQuery } from "../../../app/features/organization.api";
import { showSnackbar } from "../../../app/features/snackbar/snackbar.slice";
import { RecruitPostStatus, Gender, JobExperience, EducationLevel } from "../../../app/models/enums.model";
import { Province } from "../../../app/models/province.model";
import { Profession, Requirement, UpdateRecruitmentPostRequest } from "../../../app/models/recruitment-post.model";
import { ConvertService } from "../../../app/services/convert.service";
import { AppDispatch } from "../../../app/store";
import RichTextEditorComponent from "../../editor";
import { useGetAllVisaTypesQuery } from "../../../app/features/visa-type.api";

interface UpdateRecruitmentPostDialogProps {
    open: boolean;
    postId: string | null;
    onClose: () => void;
    onSuccess?: () => void;
}

const POST_STATUS_OPTIONS = [
    { value: RecruitPostStatus.Active, label: "Hoạt động" },
    { value: RecruitPostStatus.Inactive, label: "Dừng hoạt động" },
    { value: RecruitPostStatus.Draft, label: "Nháp" },
];

const GENDER_OPTIONS = [
    { value: Gender.Undefined, label: "Không yêu cầu" },
    { value: Gender.Male, label: "Nam" },
    { value: Gender.Female, label: "Nữ" },
    { value: Gender.Other, label: "Khác" },
];

const EXPERIENCE_OPTIONS = [
    { value: JobExperience.Undefined, label: "Không yêu cầu" },
    { value: JobExperience.LessThan1Year, label: "< 1 năm" },
    { value: JobExperience.From1To2Years, label: "1-2 năm" },
    { value: JobExperience.From2To3Years, label: "2-3 năm" },
    { value: JobExperience.From3To5Years, label: "3-5 năm" },
    { value: JobExperience.From5To10Years, label: "5-10 năm" },
    { value: JobExperience.Above10Years, label: "> 10 năm" },
];

const EDUCATION_OPTIONS = [
    { value: EducationLevel.Undefined, label: "Không yêu cầu" },
    { value: EducationLevel.PrimarySchool, label: "Tiểu học" },
    { value: EducationLevel.MiddleSchool, label: "THCS" },
    { value: EducationLevel.HighSchool, label: "THPT" },
    { value: EducationLevel.VocationalSchool, label: "Trung cấp" },
    { value: EducationLevel.College, label: "Cao đẳng" },
    { value: EducationLevel.University, label: "Đại học" },
    { value: EducationLevel.Postgraduate, label: "Sau đại học" },
];

const emptyRequirement: Requirement = {
    FromAge: undefined,
    ToAge: undefined,
    Gender: Gender.Undefined,
    Experience: JobExperience.Undefined,
    EducationLevel: EducationLevel.Undefined,
    MinimumGpa: 0,
    MaxYearsSinceGrad: 0,
    MaxAbsence: 0,
    VisaTypeId: "",
    OtherReqs: [""],
};

const defaultForm: UpdateRecruitmentPostRequest = {
    Id: "",
    RecruitPostStatus: RecruitPostStatus.Draft,
    Name: "",
    OrganizationId: "",
    ProfessionIds: [],
    Quantity: 1,
    Description: "",
    ProvinceId: "",
    Requirement: emptyRequirement,
    RecruitmentFromDate: null,
    RecruitmentToDate: null,
    IsTop: false,
    Highlights: [],
};

interface FormErrors {
    Name?: string;
    ProvinceId?: string;
    ProfessionIds?: string;
    Quantity?: string;
    Description?: string;
}

export default function UpdateRecruitmentPostDialog({ open, postId, onClose, onSuccess }: UpdateRecruitmentPostDialogProps) {
    const dispatch = useDispatch<AppDispatch>();

    const [form, setForm] = useState<UpdateRecruitmentPostRequest>(defaultForm);
    const [errors, setErrors] = useState<FormErrors>({});
    const [selectedProfessions, setSelectedProfessions] = useState<Profession[]>([]);
    const [orgChangedManually, setOrgChangedManually] = useState(false);

    const [fetchRecruitmentPost, { data: postData, isFetching: isFetchingPost }] = useLazyGetRecruitmentPostByIdQuery();
    const { data: provinces = [] } = useGetAllProvinceNoAuthenQuery(undefined, { skip: !open });
    const { data: visaTypesData } = useGetAllVisaTypesQuery(undefined, { skip: !open });
    const { data: organizationDetail, isFetching: isOrgDetailFetching } = useGetOrganizationByIdQuery(form.OrganizationId, { skip: !form.OrganizationId || !orgChangedManually });
    const [updateRecruitmentPost, { isLoading: isUpdating }] = useUpdateRecruitmentPostMutation();

    const { data: professionData, isFetching: isFetchingProfessions } = useGetProfessionsByOrganizationQuery(form.OrganizationId, { skip: !form.OrganizationId || !open });

    const [professionList, setProfessionList] = useState<Profession[]>([]);

    const visaTypeOptions = useMemo(() => visaTypesData?.map((v: { Id: string; Name: string }) => ({ value: v.Id, label: v.Name })) ?? [], [visaTypesData]);
    useEffect(() => {
        if (!professionData) return;

        const mapped: Profession[] = professionData.map((p: any) => ({
            ProfessionId: p.ProfessionId,
            ProfessionName: p.ProfessionName,
            ProfessionSeoUrl: p.ProfessionSeoUrl ?? "",
            Cost: 0,
        }));

        const merged = [
            ...mapped,
            ...selectedProfessions.filter(
                (sp) => !mapped.some((m) => m.ProfessionId === sp.ProfessionId)
            ),
        ];

        setProfessionList(merged);

    }, [professionData, selectedProfessions]);
    useEffect(() => {
        if (!open || !postId) return;

        setSelectedProfessions([]);
        setOrgChangedManually(false);
        setForm(defaultForm);
        setErrors({});

        fetchRecruitmentPost(postId, false)
            .unwrap()
            .then((data) => {
                if (!data) return;
                setForm({
                    Id: data.Id,
                    RecruitPostStatus: ConvertService.convertPostStatusFromString(data.RecruitPostStatus),
                    Name: data.Name ?? "",
                    OrganizationId: data.OrganizationId ?? "",
                    ProfessionIds: data.ProfessionIds ?? [],
                    Quantity: data.Quantity ?? 1,
                    Description: data.Description ?? "",
                    ProvinceId: data.ProvinceId ?? "",
                    Requirement: {
                        FromAge: data.Requirement?.FromAge ?? undefined,
                        ToAge: data.Requirement?.ToAge ?? undefined,
                        Gender: ConvertService.convertGenderFromString(data.Requirement?.Gender),
                        Experience: ConvertService.convertJobExperienceFromString(data.Requirement?.Experience),
                        EducationLevel: ConvertService.convertEducationLevelFromString(data.Requirement?.EducationLevel),
                        MinimumGpa: data.Requirement?.MinimumGpa ?? 0,
                        MaxYearsSinceGrad: data.Requirement?.MaxYearsSinceGrad ?? 0,
                        MaxAbsence: data.Requirement?.MaxAbsence ?? 0,
                        VisaTypeId: data.Requirement?.VisaTypeId ?? "",
                        OtherReqs: data.Requirement?.OtherReqs?.length > 0
                            ? data.Requirement.OtherReqs
                            : [""],
                    },
                    RecruitmentFromDate: data.RecruitmentFromDate ?? null,
                    RecruitmentToDate: data.RecruitmentToDate ?? null,
                    IsTop: data.IsTop ?? false,
                    Highlights: data.Highlights?.length > 0 ? data.Highlights : [],
                });
            });
    }, [open, postId]);


    useEffect(() => {
        if (!postData || !open) return;

        const mapped: Profession[] = postData.Professions?.map((p) => ({
            ProfessionId: p.ProfessionId,
            ProfessionName: p.ProfessionName ?? "",
            ProfessionSeoUrl: p.ProfessionSeoUrl ?? "",
            Cost: p.Cost ?? 0,
        })) ?? [];

        setSelectedProfessions(mapped);

        setForm((prev) => ({
            ...prev,
            ProfessionIds: mapped.map((p) => p.ProfessionId),
        }));

    }, [postData, open]);

    useEffect(() => {
        if (!organizationDetail || !orgChangedManually) return;

        if (organizationDetail.ProvinceId) {
            setForm((prev) => ({ ...prev, ProvinceId: organizationDetail.ProvinceId }));
        }

        const allIds: string[] = [];
        if (organizationDetail.MainProfession?.ProfessionId) {
            allIds.push(organizationDetail.MainProfession.ProfessionId);
        }
        organizationDetail.Professions?.forEach((p: { ProfessionId: string }) => {
            if (p.ProfessionId && !allIds.includes(p.ProfessionId)) allIds.push(p.ProfessionId);
        });

        if (allIds.length > 0) {
            const matched = allIds
                .map((id) => professionList.find((p) => p.ProfessionId === id))
                .filter((p): p is Profession => p !== undefined);
            setSelectedProfessions(matched);
            setForm((prev) => ({ ...prev, ProfessionIds: allIds }));
        }
    }, [organizationDetail, orgChangedManually]);

    const handleChange = <K extends keyof UpdateRecruitmentPostRequest>(field: K, value: UpdateRecruitmentPostRequest[K]) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const handleRequirementChange = <K extends keyof Requirement>(field: K, value: Requirement[K]) => setForm((prev) => ({ ...prev, Requirement: { ...prev.Requirement, [field]: value } }));

    const handleProfessionChange = (_: unknown, value: Profession[]) => {
        setSelectedProfessions(value);
        setForm((prev) => ({ ...prev, ProfessionIds: value.map((p) => p.ProfessionId) }));
        setErrors((prev) => ({ ...prev, ProfessionIds: undefined }));
    };

    const selectedProvince = provinces.find((p: Province) => p.Id === form.ProvinceId) ?? null;
    const handleProvinceChange = (_: React.SyntheticEvent, opt: Province | null) => {
        setForm((prev) => ({ ...prev, ProvinceId: opt?.Id ?? "" }));
        setErrors((prev) => ({ ...prev, ProvinceId: undefined }));
    };

    const handleAddHighlight = () => handleChange("Highlights", [...form.Highlights, ""]);
    const handleHighlightChange = (i: number, val: string) => { const arr = [...form.Highlights]; arr[i] = val; handleChange("Highlights", arr); };
    const handleRemoveHighlight = (i: number) => handleChange("Highlights", form.Highlights.filter((_, idx) => idx !== i));

    const handleOtherReqChange = (i: number, val: string) => { const arr = [...form.Requirement.OtherReqs]; arr[i] = val; handleRequirementChange("OtherReqs", arr); };
    const handleAddOtherReq = () => handleRequirementChange("OtherReqs", [...form.Requirement.OtherReqs, ""]);
    const handleRemoveOtherReq = (i: number) => { const arr = form.Requirement.OtherReqs.filter((_, idx) => idx !== i); handleRequirementChange("OtherReqs", arr.length ? arr : [""]); };

    const validate = (): boolean => {
        const e: FormErrors = {};
        if (!form.Name.trim()) e.Name = "Tên bài đăng không được để trống";
        if (!form.ProvinceId) e.ProvinceId = "Vui lòng chọn tỉnh thành";
        if (!form.ProfessionIds.length) e.ProfessionIds = "Vui lòng chọn ít nhất một ngành nghề";
        if (!form.Quantity || form.Quantity < 1) e.Quantity = "Số lượng phải lớn hơn 0";
        if (!form.Description.trim()) e.Description = "Mô tả không được để trống";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleClose = () => {
        setForm(defaultForm);
        setErrors({});
        setSelectedProfessions([]);
        onClose();
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        try {
            await updateRecruitmentPost({
                ...form,
                Highlights: form.Highlights.filter((h) => h.trim()),
                Requirement: { ...form.Requirement, OtherReqs: form.Requirement.OtherReqs.filter((r) => r.trim()) },
            }).unwrap();
            dispatch(showSnackbar({ message: "Cập nhật bài tuyển sinh thành công!", severity: "success" }));
            onSuccess?.();
            handleClose();
        } catch {
            dispatch(showSnackbar({ message: "Cập nhật bài tuyển sinh thất bại. Vui lòng thử lại!", severity: "error" }));
        }
    };

    const isLoading = isFetchingPost || isUpdating;
    const selectedVisaType = visaTypeOptions.find((v) => v.value === form.Requirement.VisaTypeId) ?? null;

    const tf = { size: "small" as const, fullWidth: true };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="xl" fullWidth PaperProps={{ sx: { maxHeight: "95vh" } }}>
            <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 1 }}>
                <Typography fontWeight={600}>Chỉnh sửa bài tuyển sinh</Typography>
                <IconButton onClick={handleClose} size="small"><Close /></IconButton>
            </DialogTitle>
            <Divider />

            <DialogContent sx={{ pt: 2 }}>
                {isFetchingPost ? <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}><CircularProgress size={36} /></Box> : (
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12 }}><Typography variant="subtitle2" fontWeight={600} color="text.secondary">THÔNG TIN CƠ BẢN</Typography></Grid>
                        <Grid size={{ xs: 12, sm: 6 }}><TextField {...tf} label="Tên bài đăng" required value={form.Name} onChange={(e) => handleChange("Name", e.target.value)} error={!!errors.Name} helperText={errors.Name} /></Grid>
                        <Grid size={{ xs: 12, sm: 6 }}><TextField {...tf} select label="Trạng thái" value={form.RecruitPostStatus} onChange={(e) => handleChange("RecruitPostStatus", Number(e.target.value) as RecruitPostStatus)}>{POST_STATUS_OPTIONS.map((opt) => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)} </TextField></Grid>
                        <Grid size={{ xs: 12, sm: 6 }}><Autocomplete<Province> {...tf} options={provinces} getOptionLabel={(opt) => opt.Name ?? ""} isOptionEqualToValue={(opt, val) => opt.Id === val?.Id} value={selectedProvince} onChange={handleProvinceChange} renderInput={(params) => <TextField {...params} label="Tỉnh / Thành phố" required error={!!errors.ProvinceId} helperText={errors.ProvinceId} />} /></Grid>
                        <Grid size={{ xs: 12, sm: 6 }}><Autocomplete<Profession, true> multiple {...tf} options={professionList} getOptionLabel={(opt) => opt.ProfessionName ?? opt.ProfessionId} value={selectedProfessions} onChange={handleProfessionChange} isOptionEqualToValue={(opt, val) => opt.ProfessionId === val.ProfessionId} loading={isFetchingProfessions || isOrgDetailFetching} renderTags={(value, getTagProps) => value.map((opt, index) => { const { key, ...tagProps } = getTagProps({ index }); return <Chip key={opt.ProfessionId} label={opt.ProfessionName ?? opt.ProfessionId} size="small" {...tagProps} />; })} renderInput={(params) => (<TextField {...params} label="Ngành nghề" required placeholder={selectedProfessions.length === 0 ? "Chọn ngành nghề..." : ""} error={!!errors.ProfessionIds} helperText={errors.ProfessionIds} InputProps={{ ...params.InputProps, endAdornment: (<> {(isFetchingProfessions || isOrgDetailFetching) && <CircularProgress size={16} />} {params.InputProps.endAdornment}</>) }} />)} /></Grid>
                        <Grid size={{ xs: 12, sm: 6 }}><TextField {...tf} label="Số lượng tuyển" type="number" required value={form.Quantity} onChange={(e) => handleChange("Quantity", Number(e.target.value))} error={!!errors.Quantity} helperText={errors.Quantity} inputProps={{ min: 1 }} /></Grid>
                        <Grid size={{ xs: 12, sm: 6 }}><TextField {...tf} label="Tuyển từ ngày" type="date" value={form.RecruitmentFromDate ?? ""} onChange={(e) => handleChange("RecruitmentFromDate", e.target.value || null)} InputLabelProps={{ shrink: true }} /></Grid>
                        <Grid size={{ xs: 12, sm: 6 }}><TextField {...tf} label="Tuyển đến ngày" type="date" value={form.RecruitmentToDate ?? ""} onChange={(e) => handleChange("RecruitmentToDate", e.target.value || null)} InputLabelProps={{ shrink: true }} /></Grid>
                        <Grid size={{ xs: 12 }}><Accordion variant="outlined" disableGutters sx={{ borderRadius: 1 }}><AccordionSummary expandIcon={<ExpandMore />}><Typography variant="subtitle2" fontWeight={600} color="text.secondary"> Yêu cầu ứng viên </Typography></AccordionSummary><AccordionDetails><Grid container spacing={2}>
                            <Grid size={{ xs: 6 }}><TextField {...tf} label="Tuổi từ" type="number" value={form.Requirement.FromAge ?? ""} onChange={(e) => handleRequirementChange("FromAge", e.target.value ? Number(e.target.value) : undefined)} inputProps={{ min: 0 }} /></Grid>
                            <Grid size={{ xs: 6 }}><TextField {...tf} label="Tuổi đến" type="number" value={form.Requirement.ToAge ?? ""} onChange={(e) => handleRequirementChange("ToAge", e.target.value ? Number(e.target.value) : undefined)} inputProps={{ min: 0 }} /></Grid>
                            <Grid size={{ xs: 12, sm: 6 }}><TextField {...tf} select label="Giới tính" value={form.Requirement.Gender} onChange={(e) => handleRequirementChange("Gender", Number(e.target.value) as Gender)}>{GENDER_OPTIONS.map((opt) => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)} </TextField></Grid>
                            <Grid size={{ xs: 12, sm: 6 }}><TextField {...tf} select label="Kinh nghiệm" value={form.Requirement.Experience} onChange={(e) => handleRequirementChange("Experience", Number(e.target.value) as JobExperience)}>{EXPERIENCE_OPTIONS.map((opt) => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)} </TextField></Grid>
                            <Grid size={{ xs: 12, sm: 6 }}><TextField {...tf} select label="Trình độ học vấn" value={form.Requirement.EducationLevel} onChange={(e) => handleRequirementChange("EducationLevel", Number(e.target.value) as EducationLevel)}>{EDUCATION_OPTIONS.map((opt) => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)} </TextField></Grid>
                            <Grid size={{ xs: 12, sm: 6 }}><TextField {...tf} label="GPA tối thiểu" type="number" value={form.Requirement.MinimumGpa ?? 0} onChange={(e) => handleRequirementChange("MinimumGpa", Number(e.target.value))} inputProps={{ min: 0, step: 0.1 }} /></Grid>
                            <Grid size={{ xs: 12, sm: 6 }}><TextField {...tf} label="Thời hạn tốt nghiệp tối đa (năm)" type="number" value={form.Requirement.MaxYearsSinceGrad ?? 0} onChange={(e) => handleRequirementChange("MaxYearsSinceGrad", Number(e.target.value))} inputProps={{ min: 0 }} /></Grid>
                            <Grid size={{ xs: 12, sm: 6 }}><TextField {...tf} label="Số buổi nghỉ tối đa" type="number" value={form.Requirement.MaxAbsence ?? 0} onChange={(e) => handleRequirementChange("MaxAbsence", Number(e.target.value))} inputProps={{ min: 0 }} /></Grid>
                            <Grid size={{ xs: 12, sm: 6 }}><Autocomplete {...tf} options={visaTypeOptions} getOptionLabel={(opt) => opt.label} isOptionEqualToValue={(opt, val) => opt.value === val?.value} value={selectedVisaType} onChange={(_, opt) => handleRequirementChange("VisaTypeId", opt?.value ?? "")} renderInput={(params) => <TextField {...params} label="Loại visa" />} /></Grid>
                            <Grid size={{ xs: 12 }}>
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                                    <Typography variant="body2" fontWeight={600} color="text.secondary"> Yêu cầu khác </Typography>
                                    <Button size="small" startIcon={<Add />} onClick={handleAddOtherReq} sx={{ textTransform: "none", fontSize: 12 }}> Thêm </Button>
                                </Box>
                                {form.Requirement.OtherReqs.map((req, i) => (
                                    <Box key={i} sx={{ display: "flex", gap: 1, mb: 1 }}>
                                        <TextField {...tf} size="small" placeholder={`Yêu cầu ${i + 1}`} value={req} onChange={(e) => handleOtherReqChange(i, e.target.value)} />
                                        <IconButton size="small" color="error" onClick={() => handleRemoveOtherReq(i)} disabled={form.Requirement.OtherReqs.length === 1 && !req.trim()}><Remove fontSize="small" /></IconButton>
                                    </Box>
                                ))}
                            </Grid>
                        </Grid>
                        </AccordionDetails>
                        </Accordion>
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Divider sx={{ my: 1 }} />
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                                <Typography variant="subtitle2" fontWeight={600} color="text.secondary"> THÔNG TIN NỔI BẬT </Typography>
                                <Button size="small" variant="outlined" startIcon={<Add />} onClick={handleAddHighlight}> Thêm </Button>
                            </Box>

                            {form.Highlights.length === 0 && <Typography variant="body2" color="text.disabled" sx={{ fontStyle: "italic" }}> Chưa có điểm nổi bật nào. Nhấn "Thêm" để bổ sung. </Typography>}

                            {form.Highlights.map((h, i) => (
                                <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                    <TextField fullWidth size="small" placeholder={`Điểm nổi bật ${i + 1}`} value={h} onChange={(e) => handleHighlightChange(i, e.target.value)} />
                                    <IconButton size="small" color="error" onClick={() => handleRemoveHighlight(i)}><Remove fontSize="small" /></IconButton>
                                </Box>
                            ))}
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Paper elevation={1} sx={{ p: 2 }}>
                                <Typography variant="subtitle2" fontWeight={600} color="text.secondary" sx={{ mb: 1 }}> Mô tả * </Typography>
                                <RichTextEditorComponent
                                    key={form.Description}
                                    value={form.Description}
                                    onChange={(value) => handleChange("Description", value)}
                                />
                                {errors.Description && <FormHelperText error sx={{ mt: 1 }}>{errors.Description}</FormHelperText>}
                            </Paper>
                        </Grid>
                    </Grid>
                )}
            </DialogContent>
            <Divider />
            <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
                <Button onClick={handleClose} variant="outlined" color="inherit" disabled={isLoading}> Hủy </Button>
                <Button onClick={handleSubmit} variant="contained" color="primary" disabled={isLoading} startIcon={isUpdating ? <CircularProgress size={16} color="inherit" /> : null}>
                    {isUpdating ? "Đang lưu..." : "Lưu"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}