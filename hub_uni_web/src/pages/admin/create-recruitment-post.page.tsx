import { Box, Button, Chip, CircularProgress, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Paper, Select, TextField, Typography, Autocomplete, SelectChangeEvent, IconButton } from "@mui/material";
import { Save, Add, Remove } from "@mui/icons-material";
import { useState, useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import RichTextEditorComponent from "../../components/editor";
import { useCreateRecruitmentPostMutation } from "../../app/features/recruitment-post.api";
import { useGetAllProvinceNoAuthenQuery } from "../../app/features/province.api";
import { useGetAllVisaTypesQuery } from "../../app/features/visa-type.api";
import { CreateRecruitmentPostRequest, Requirement } from "../../app/models/recruitment-post.model";
import { useGetProfessionsByPageQuery } from "../../app/features/professtion.api";
import { EducationLevel, Gender, JobExperience, RecruitPostStatus } from "../../app/models/enums.model";
import { ConvertService } from "../../app/services/convert.service";

const defaultRequirement: Requirement = {
    FromAge: undefined,
    ToAge: undefined,
    Gender: Gender.Undefined,
    Experience: JobExperience.Undefined,
    EducationLevel: EducationLevel.Undefined,
    MinimumGpa: undefined,
    MaxYearsSinceGrad: undefined,
    MaxAbsence: undefined,
    VisaTypeId: "",
    OtherReqs: [],
};

const STATUS_OPTIONS = [
    RecruitPostStatus.Active,
    RecruitPostStatus.Inactive,
    RecruitPostStatus.Draft,
];

export default function CreateRecruitmentPostPage() {
    const navigate = useNavigate();
    const [createRecruitmentPost, { isLoading: isSubmitting }] = useCreateRecruitmentPostMutation();
    const { data: provinces, isLoading: provincesLoading } = useGetAllProvinceNoAuthenQuery();
    const { data: visaTypesData } = useGetAllVisaTypesQuery();

    const visaTypeOptions = useMemo(
        () => visaTypesData?.map((v: { Id: string; Name: string }) => ({ value: v.Id, label: v.Name })) ?? [],
        [visaTypesData]
    );

    const [professionPage, setProfessionPage] = useState(1);
    const [allProfessions, setAllProfessions] = useState<{ Id: string; Name: string }[]>([]);
    const [hasMoreProfessions, setHasMoreProfessions] = useState(true);

    const { data: professionData, isFetching: professionsFetching } = useGetProfessionsByPageQuery({ page: professionPage, size: 10 });

    useEffect(() => {
        if (professionData?.Items) {
            setAllProfessions(prev => {
                const existingIds = new Set(prev.map(p => p.Id));
                const newItems = professionData.Items.filter((p: { Id: string }) => !existingIds.has(p.Id));
                return [...prev, ...newItems];
            });
            if (professionData.Items.length < 10) setHasMoreProfessions(false);
        }
    }, [professionData]);

    const handleProfessionScroll = useCallback((event: React.UIEvent<HTMLUListElement>) => {
        const list = event.currentTarget;
        if (list.scrollTop + list.clientHeight >= list.scrollHeight - 10 && !professionsFetching && hasMoreProfessions)
            setProfessionPage(prev => prev + 1);
    }, [professionsFetching, hasMoreProfessions]);

    const [form, setForm] = useState<Omit<CreateRecruitmentPostRequest, "Requirement">>({
        RecruitPostStatus: RecruitPostStatus.Active,
        Name: "",
        ProfessionIds: [],
        Quantity: 1,
        Description: "",
        ProvinceId: "",
        RecruitmentFromDate: null,
        RecruitmentToDate: null,
        IsTop: false,
        Highlights: [],
    });
    const [requirement, setRequirement] = useState<Requirement>(defaultRequirement);
    const [highlightInput, setHighlightInput] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = useCallback((field: string, value: unknown) => {
        setForm(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: "" }));
    }, []);

    const handleRequirementChange = useCallback((field: string, value: unknown) => {
        setRequirement(prev => ({ ...prev, [field]: value }));
    }, []);

    const handleAddHighlight = useCallback(() => {
        if (highlightInput.trim()) {
            setForm(prev => ({ ...prev, Highlights: [...prev.Highlights, highlightInput.trim()] }));
            setHighlightInput("");
        }
    }, [highlightInput]);

    const handleRemoveHighlight = useCallback((index: number) => {
        setForm(prev => ({ ...prev, Highlights: prev.Highlights.filter((_, i) => i !== index) }));
    }, []);

    const handleAddOtherReq = () => setRequirement(prev => ({ ...prev, OtherReqs: [...prev.OtherReqs, ""] }));
    const handleOtherReqChange = (i: number, val: string) => {
        const arr = [...requirement.OtherReqs]; arr[i] = val;
        setRequirement(prev => ({ ...prev, OtherReqs: arr }));
    };
    const handleRemoveOtherReq = (i: number) => {
        setRequirement(prev => ({ ...prev, OtherReqs: prev.OtherReqs.filter((_, idx) => idx !== i) }));
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!form.Name.trim()) newErrors.Name = "Tên chương trình tuyển sinh không được để trống";
        if (!form.ProvinceId) newErrors.ProvinceId = "Vui lòng chọn tỉnh/thành phố";
        if (form.ProfessionIds.length === 0) newErrors.ProfessionIds = "Vui lòng chọn ít nhất một ngành nghề";
        if (!form.RecruitmentToDate) newErrors.RecruitmentToDate = "Vui lòng chọn ngày hết hạn";
        if (form.Quantity < 1) newErrors.Quantity = "Số lượng phải lớn hơn 0";
        if (!form.Description.trim()) newErrors.Description = "Mô tả không được để trống";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        try {
            await createRecruitmentPost({
                ...form,
                Requirement: {
                    ...requirement,
                    OtherReqs: requirement.OtherReqs.filter(r => r.trim()),
                },
            }).unwrap();
            navigate("/admin/manage-recruitment-post");
        } catch (error) {
            console.error("Failed to create recruitment post:", error);
        }
    };

    const selectedVisaType = visaTypeOptions.find(v => v.value === requirement.VisaTypeId) ?? null;
    const sectionLabelSx = { fontSize: "1rem", fontWeight: 700, color: "text.secondary", mb: 1 };

    return (
        <Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 1 }}>
                <Typography variant="h5" fontWeight={600}>Thêm chương trình tuyển sinh</Typography>
            </Box>

            <Grid container spacing={2}>
                <Grid size={12}>
                    <Paper elevation={1} sx={{ p: 2 }}>
                        <Grid container spacing={2.5}>

                            {/* ── THÔNG TIN CƠ BẢN ── */}
                            <Grid size={12}><Typography sx={sectionLabelSx}>Thông tin cơ bản</Typography></Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Tên chương trình tuyển sinh *" fullWidth size="small"
                                    value={form.Name} onChange={e => handleChange("Name", e.target.value)}
                                    error={!!errors.Name} helperText={errors.Name}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <FormControl fullWidth size="small" error={!!errors.ProvinceId}>
                                    <InputLabel>Tỉnh/Thành phố *</InputLabel>
                                    <Select value={form.ProvinceId} label="Tỉnh/Thành phố *"
                                        onChange={(e: SelectChangeEvent) => handleChange("ProvinceId", e.target.value)}>
                                        {provincesLoading
                                            ? <MenuItem disabled><CircularProgress size={16} /></MenuItem>
                                            : provinces?.map(p => <MenuItem key={p.Id} value={p.Id}>{p.Name}</MenuItem>)}
                                    </Select>
                                    {errors.ProvinceId && <FormHelperText>{errors.ProvinceId}</FormHelperText>}
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Autocomplete
                                    multiple options={allProfessions}
                                    getOptionLabel={(option) => option.Name}
                                    value={allProfessions.filter(p => form.ProfessionIds.includes(p.Id))}
                                    onChange={(_, newValue) => handleChange("ProfessionIds", newValue.map(v => v.Id))}
                                    loading={professionsFetching}
                                    ListboxProps={{ onScroll: handleProfessionScroll, style: { maxHeight: 240 } }}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Ngành nghề *" size="small"
                                            error={!!errors.ProfessionIds} helperText={errors.ProfessionIds}
                                            InputProps={{ ...params.InputProps, endAdornment: (<>{professionsFetching && <CircularProgress size={14} />}{params.InputProps.endAdornment}</>) }}
                                        />
                                    )}
                                    renderTags={(value, getTagProps) =>
                                        value.map((option, index) => <Chip label={option.Name} size="small" {...getTagProps({ index })} />)
                                    }
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Số lượng" fullWidth type="number" size="small"
                                    value={form.Quantity} onChange={e => handleChange("Quantity", parseInt(e.target.value) || 1)}
                                    error={!!errors.Quantity} helperText={errors.Quantity}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Tuyển từ ngày" fullWidth type="date" size="small"
                                    value={form.RecruitmentFromDate ?? ""}
                                    onChange={e => handleChange("RecruitmentFromDate", e.target.value || null)}
                                    slotProps={{ inputLabel: { shrink: true } }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Tuyển đến ngày" fullWidth type="date" size="small"
                                    value={form.RecruitmentToDate ?? ""}
                                    onChange={e => handleChange("RecruitmentToDate", e.target.value || null)}
                                    error={!!errors.RecruitmentToDate} helperText={errors.RecruitmentToDate}
                                    slotProps={{ inputLabel: { shrink: true } }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Trạng thái *</InputLabel>
                                    <Select
                                        value={form.RecruitPostStatus ?? RecruitPostStatus.Inactive}
                                        label="Trạng thái *"
                                        onChange={(e: SelectChangeEvent<number>) => handleChange("RecruitPostStatus", e.target.value as RecruitPostStatus)}
                                    >
                                        {STATUS_OPTIONS.map(s => <MenuItem key={s} value={s}>{ConvertService.convertPostStatus(s)}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* ── YÊU CẦU ỨNG VIÊN ── */}
                            <Grid size={12} sx={{ mt: 1 }}><Typography sx={sectionLabelSx}>Yêu cầu ứng viên</Typography></Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Từ tuổi" fullWidth type="number" size="small"
                                    value={requirement.FromAge ?? ""}
                                    onChange={e => handleRequirementChange("FromAge", e.target.value ? parseInt(e.target.value) : undefined)}
                                    inputProps={{ min: 0 }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Đến tuổi" fullWidth type="number" size="small"
                                    value={requirement.ToAge ?? ""}
                                    onChange={e => handleRequirementChange("ToAge", e.target.value ? parseInt(e.target.value) : undefined)}
                                    inputProps={{ min: 0 }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Giới tính</InputLabel>
                                    <Select value={requirement.Gender ?? Gender.Undefined} label="Giới tính"
                                        onChange={(e: SelectChangeEvent<number>) => handleRequirementChange("Gender", Number(e.target.value))}>
                                        {Object.values(Gender).filter(v => typeof v === "number").map(g => (
                                            <MenuItem key={g} value={g}>{ConvertService.convertGender(g as Gender)}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Kinh nghiệm</InputLabel>
                                    <Select value={requirement.Experience ?? JobExperience.Undefined} label="Kinh nghiệm"
                                        onChange={(e: SelectChangeEvent<number>) => handleRequirementChange("Experience", Number(e.target.value))}>
                                        {Object.values(JobExperience).filter(v => typeof v === "number").map(exp => (
                                            <MenuItem key={exp} value={exp}>{ConvertService.convertJobExperience(exp as JobExperience)}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Trình độ học vấn</InputLabel>
                                    <Select value={requirement.EducationLevel ?? EducationLevel.Undefined} label="Trình độ học vấn"
                                        onChange={(e: SelectChangeEvent<number>) => handleRequirementChange("EducationLevel", Number(e.target.value))}>
                                        {Object.values(EducationLevel).filter(v => typeof v === "number").map(edu => (
                                            <MenuItem key={edu} value={edu}>{ConvertService.convertEducationLevel(edu as EducationLevel)}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="GPA tối thiểu" fullWidth type="number" size="small"
                                    value={requirement.MinimumGpa ?? ""}
                                    onChange={e => handleRequirementChange("MinimumGpa", e.target.value ? Number(e.target.value) : undefined)}
                                    inputProps={{ min: 0, step: 0.1 }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Thời hạn tốt nghiệp tối đa (năm)" fullWidth type="number" size="small"
                                    value={requirement.MaxYearsSinceGrad ?? ""}
                                    onChange={e => handleRequirementChange("MaxYearsSinceGrad", e.target.value ? Number(e.target.value) : undefined)}
                                    inputProps={{ min: 0 }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Số buổi nghỉ tối đa" fullWidth type="number" size="small"
                                    value={requirement.MaxAbsence ?? ""}
                                    onChange={e => handleRequirementChange("MaxAbsence", e.target.value ? Number(e.target.value) : undefined)}
                                    inputProps={{ min: 0 }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Autocomplete
                                    fullWidth size="small"
                                    options={visaTypeOptions}
                                    getOptionLabel={(opt) => opt.label}
                                    isOptionEqualToValue={(opt, val) => opt.value === val?.value}
                                    value={selectedVisaType}
                                    onChange={(_, opt) => handleRequirementChange("VisaTypeId", opt?.value ?? "")}
                                    renderInput={(params) => <TextField {...params} label="Loại visa" size="small" />}
                                />
                            </Grid>

                            <Grid size={12}>
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                                    <Typography variant="body2" fontWeight={600} color="text.secondary">Yêu cầu khác</Typography>
                                    <Button size="small" startIcon={<Add />} onClick={handleAddOtherReq} sx={{ textTransform: "none", fontSize: 12 }}>Thêm</Button>
                                </Box>
                                {requirement.OtherReqs.length === 0 && (
                                    <Typography variant="body2" color="text.disabled" sx={{ fontStyle: "italic" }}>Chưa có yêu cầu nào.</Typography>
                                )}
                                {requirement.OtherReqs.map((req, i) => (
                                    <Box key={i} sx={{ display: "flex", gap: 1, mb: 1 }}>
                                        <TextField fullWidth size="small" placeholder={`Yêu cầu ${i + 1}`}
                                            value={req} onChange={e => handleOtherReqChange(i, e.target.value)} />
                                        <IconButton size="small" color="error" onClick={() => handleRemoveOtherReq(i)}>
                                            <Remove fontSize="small" />
                                        </IconButton>
                                    </Box>
                                ))}
                            </Grid>

                            <Grid size={12} sx={{ mt: 1 }}><Typography sx={sectionLabelSx}>Điểm nổi bật</Typography></Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Box sx={{ display: "flex", gap: 1 }}>
                                    <TextField
                                        label="Thêm điểm nổi bật" value={highlightInput} size="small" sx={{ flex: 1 }}
                                        placeholder="Nhấn Enter hoặc nút Thêm"
                                        onChange={e => setHighlightInput(e.target.value)}
                                        onKeyDown={e => e.key === "Enter" && handleAddHighlight()}
                                    />
                                    <Button variant="outlined" onClick={handleAddHighlight} size="small">Thêm</Button>
                                </Box>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, minHeight: 36, alignItems: "center" }}>
                                    {form.Highlights.map((h, i) => (
                                        <Chip key={i} label={h} onDelete={() => handleRemoveHighlight(i)}
                                            color="primary" variant="outlined" size="small" />
                                    ))}
                                    {form.Highlights.length === 0 && (
                                        <Typography variant="body2" color="text.secondary">Chưa có điểm nổi bật nào.</Typography>
                                    )}
                                </Box>
                            </Grid>

                        </Grid>
                    </Paper>
                </Grid>

                {/* ── MÔ TẢ ── */}
                <Grid size={12}>
                    <Paper elevation={1} sx={{ p: 2 }}>
                        <Typography sx={{ ...sectionLabelSx, mb: 1 }}>Mô tả *</Typography>
                        <RichTextEditorComponent value={form.Description} onChange={(value: string) => handleChange("Description", value)} />
                        {errors.Description && <FormHelperText error sx={{ mt: 1 }}>{errors.Description}</FormHelperText>}
                    </Paper>
                </Grid>

                <Grid size={12}>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                        <Button variant="outlined" onClick={() => navigate("/staff/manage-recruitment-post")}>Hủy</Button>
                        <Button variant="contained" color="primary" onClick={handleSubmit} disabled={isSubmitting}
                            startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : <Save />}>
                            {isSubmitting ? "Đang lưu..." : "Lưu chương trình tuyển sinh"}
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}