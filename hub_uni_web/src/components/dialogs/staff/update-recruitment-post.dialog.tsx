import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Grid, IconButton, CircularProgress, Typography, Divider, Box, Chip, Autocomplete, FormControlLabel, Switch, Paper, FormHelperText } from "@mui/material";
import { Close, Add, Remove } from "@mui/icons-material";
import { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useGetProfessionsByPageQuery } from "../../../app/features/professtion.api";
import { useGetAllProvinceNoAuthenQuery } from "../../../app/features/province.api";
import { useGetRecruitmentPostByIdQuery, useUpdateRecruitmentPostMutation } from "../../../app/features/recruitment-post.api";
import { showSnackbar } from "../../../app/features/snackbar/snackbar.slice";
import { RecruitPostStatus, Gender, JobExperience, EducationLevel } from "../../../app/models/enums.model";
import { ProfessionResponse } from "../../../app/models/profession.model";
import { Province } from "../../../app/models/province.model";
import { UpdateRecruitmentPostRequest } from "../../../app/models/recruitment-post.model";
import { ConvertService } from "../../../app/services/convert.service";
import { AppDispatch } from "../../../app/store";
import RichTextEditorComponent from "../../editor";

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

const defaultForm: UpdateRecruitmentPostRequest = {
    Id: "",
    RecruitPostStatus: RecruitPostStatus.Draft,
    Name: "",
    OrganizationId: "",
    ProfessionIds: [],
    Quantity: 1,
    Description: "",
    ProvinceId: "",
    Requirement: {
        FromAge: undefined,
        ToAge: undefined,
        Gender: Gender.Undefined,
        Experience: JobExperience.Undefined,
        EducationLevel: EducationLevel.Undefined,
    },
    RecruitmentFromDate: null,
    RecruitmentToDate: null,
    IsTop: false,
    Highlights: [],
};

interface FormErrors {
    Name?: string;
    ProvinceId?: string;
    Quantity?: string;
    Description?: string;
    RecruitmentFromDate?: string;
    RecruitmentToDate?: string;
}

export default function UpdateRecruitmentPostDialog({
    open,
    postId,
    onClose,
    onSuccess,
}: UpdateRecruitmentPostDialogProps) {
    const dispatch = useDispatch<AppDispatch>();

    const [form, setForm] = useState<UpdateRecruitmentPostRequest>(defaultForm);
    const [errors, setErrors] = useState<FormErrors>({});
    const [selectedProfessions, setSelectedProfessions] = useState<ProfessionResponse[]>([]);

    const [professionPage, setProfessionPage] = useState(1);
    const [professionList, setProfessionList] = useState<ProfessionResponse[]>([]);
    const [hasMoreProfessions, setHasMoreProfessions] = useState(true);
    const professionListboxRef = useRef<HTMLUListElement | null>(null);

    const { data: postData, isFetching: isFetchingPost } = useGetRecruitmentPostByIdQuery(postId ?? "", { skip: !postId || !open });
    const { data: professionData, isFetching: isFetchingProfessions } = useGetProfessionsByPageQuery({ page: professionPage, size: 10 }, { skip: !open });
    const { data: provinces = [] } = useGetAllProvinceNoAuthenQuery(undefined, { skip: !open });
    const [updateRecruitmentPost, { isLoading: isUpdating }] = useUpdateRecruitmentPostMutation();

    useEffect(() => {
        if (professionData?.Items) {
            setProfessionList((prev) => {
                const existingIds = new Set(prev.map((p) => p.Id));
                const newItems = professionData.Items.filter((p: ProfessionResponse) => !existingIds.has(p.Id));
                return [...prev, ...newItems];
            });
            if (professionData.Items.length < 10) setHasMoreProfessions(false);
        }
    }, [professionData]);

    const handleProfessionScroll = useCallback((event: React.UIEvent<HTMLUListElement>) => {
        const list = event.currentTarget;
        if (list.scrollTop + list.clientHeight >= list.scrollHeight - 30 && hasMoreProfessions && !isFetchingProfessions) {
            setProfessionPage((prev) => prev + 1);
        }
    }, [hasMoreProfessions, isFetchingProfessions]);

    useEffect(() => {
        if (postData) {
            setForm({
                Id: postData.Id,
                RecruitPostStatus: ConvertService.convertPostStatusFromString(postData.RecruitPostStatus),
                Name: postData.Name ?? "",
                OrganizationId: postData.OrganizationId ?? "",
                ProfessionIds: postData.ProfessionIds ?? [],
                Quantity: postData.Quantity ?? 1,
                Description: postData.Description ?? "",
                ProvinceId: postData.ProvinceId ?? "",
                Requirement: {
                    FromAge: postData.Requirement?.FromAge ?? undefined,
                    ToAge: postData.Requirement?.ToAge ?? undefined,
                    Gender: ConvertService.convertGenderFromString(postData.Requirement?.Gender),
                    Experience: ConvertService.convertJobExperienceFromString(postData.Requirement?.Experience),
                    EducationLevel: ConvertService.convertEducationLevelFromString(postData.Requirement?.EducationLevel),
                },
                RecruitmentFromDate: postData.RecruitmentFromDate ?? null,
                RecruitmentToDate: postData.RecruitmentToDate ?? null,
                IsTop: postData.IsTop ?? false,
                Highlights: postData.Highlights ?? [],
            });
            setSelectedProfessions(postData.Professions ?? []);
        }
    }, [postData]);

    const handleChange = (field: keyof UpdateRecruitmentPostRequest, value: unknown) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const handleRequirementChange = (field: keyof UpdateRecruitmentPostRequest["Requirement"], value: unknown) => { setForm((prev) => ({ ...prev, Requirement: { ...prev.Requirement, [field]: value } })); };

    const handleAddHighlight = () => { setForm((prev) => ({ ...prev, Highlights: [...prev.Highlights, ""] })); };

    const handleHighlightChange = (index: number, value: string) => {
        setForm((prev) => {
            const updated = [...prev.Highlights];
            updated[index] = value;
            return { ...prev, Highlights: updated };
        });
    };

    const handleRemoveHighlight = (index: number) => { setForm((prev) => ({ ...prev, Highlights: prev.Highlights.filter((_, i) => i !== index) })); };

    const handleProfessionChange = (_: unknown, value: ProfessionResponse[]) => {
        setSelectedProfessions(value);
        setForm((prev) => ({ ...prev, ProfessionIds: value.map((p) => p.Id) }));
    };

    const validate = (): boolean => {
        const newErrors: FormErrors = {};
        if (!form.Name.trim()) newErrors.Name = "Tên bài đăng không được để trống";
        if (!form.ProvinceId) newErrors.ProvinceId = "Vui lòng chọn tỉnh thành";
        if (!form.Quantity || form.Quantity < 1) newErrors.Quantity = "Số lượng phải lớn hơn 0";
        if (!form.Description.trim()) newErrors.Description = "Mô tả không được để trống";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleClose = () => {
        setForm(defaultForm);
        setErrors({});
        setSelectedProfessions([]);
        setProfessionPage(1);
        setProfessionList([]);
        setHasMoreProfessions(true);
        onClose();
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        try {
            await updateRecruitmentPost(form).unwrap();
            dispatch(showSnackbar({ message: "Cập nhật bài tuyển sinh thành công!", severity: "success" }));
            handleClose();
        } catch (err) {
            dispatch(showSnackbar({ message: "Cập nhật bài tuyển sinh thất bại. Vui lòng thử lại!", severity: "error" }));
        }
    };

    const isLoading = isFetchingPost || isUpdating;

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 1 }}>
                <Typography variant="h6" fontWeight={600}>Chỉnh sửa bài tuyển sinh</Typography>
                <IconButton onClick={handleClose} size="small"><Close /></IconButton>
            </DialogTitle>
            <Divider />

            <DialogContent sx={{ pt: 2 }}>
                {isFetchingPost ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                        <CircularProgress size={36} />
                    </Box>
                ) : (
                    <Grid container spacing={2}>

                        <Grid size={{ xs: 12 }}>
                            <Typography variant="subtitle2" fontWeight={600} color="text.secondary" sx={{ mb: 1 }}>
                                THÔNG TIN CƠ BẢN
                            </Typography>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 8 }}>
                            <TextField
                                label="Tên bài đăng"
                                fullWidth size="small" required
                                value={form.Name}
                                onChange={(e) => handleChange("Name", e.target.value)}
                                error={!!errors.Name}
                                helperText={errors.Name}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 4 }}>
                            <TextField
                                select label="Trạng thái"
                                fullWidth size="small"
                                value={form.RecruitPostStatus}
                                onChange={(e) => handleChange("RecruitPostStatus", Number(e.target.value))}
                            >
                                {POST_STATUS_OPTIONS.map((opt) => (
                                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 4 }}>
                            <TextField
                                select label="Tỉnh / Thành phố"
                                fullWidth size="small" required
                                value={form.ProvinceId}
                                onChange={(e) => handleChange("ProvinceId", e.target.value)}
                                error={!!errors.ProvinceId}
                                helperText={errors.ProvinceId}
                            >
                                {provinces.map((prov: Province) => (
                                    <MenuItem key={prov.Id} value={prov.Id}>{prov.Name}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 4 }}>
                            <TextField
                                label="Số lượng tuyển"
                                type="number" fullWidth size="small" required
                                value={form.Quantity}
                                onChange={(e) => handleChange("Quantity", Number(e.target.value))}
                                error={!!errors.Quantity}
                                helperText={errors.Quantity}
                                inputProps={{ min: 1 }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 4 }}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={form.IsTop}
                                        onChange={(e) => handleChange("IsTop", e.target.checked)}
                                        color="primary"
                                    />
                                }
                                label="Bài đăng nổi bật"
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Autocomplete
                                multiple
                                options={professionList}
                                getOptionLabel={(opt) => opt.Name}
                                value={selectedProfessions}
                                onChange={handleProfessionChange}
                                isOptionEqualToValue={(opt, val) => opt.Id === val.Id}
                                loading={isFetchingProfessions}
                                ListboxProps={{
                                    onScroll: handleProfessionScroll,
                                    ref: professionListboxRef,
                                    style: { maxHeight: 220 },
                                }}
                                renderTags={(value, getTagProps) =>
                                    value.map((opt, index) => {
                                        const { key, ...tagProps } = getTagProps({ index });
                                        return (
                                            <Chip
                                                key={opt.Id}
                                                label={opt.Name}
                                                size="small"
                                                {...tagProps}
                                            />
                                        );
                                    })
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Ngành nghề"
                                        size="small"
                                        placeholder="Chọn ngành nghề..."
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <>
                                                    {isFetchingProfessions && <CircularProgress size={16} />}
                                                    {params.InputProps.endAdornment}
                                                </>
                                            ),
                                        }}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                label="Ngày bắt đầu tuyển dụng"
                                type="date" fullWidth size="small"
                                value={form.RecruitmentFromDate ?? ""}
                                onChange={(e) => handleChange("RecruitmentFromDate", e.target.value || null)}
                                InputLabelProps={{ shrink: true }}
                                error={!!errors.RecruitmentFromDate}
                                helperText={errors.RecruitmentFromDate}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                label="Ngày kết thúc tuyển dụng"
                                type="date" fullWidth size="small"
                                value={form.RecruitmentToDate ?? ""}
                                onChange={(e) => handleChange("RecruitmentToDate", e.target.value || null)}
                                InputLabelProps={{ shrink: true }}
                                error={!!errors.RecruitmentToDate}
                                helperText={errors.RecruitmentToDate}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Paper elevation={1} sx={{ p: 2 }}>
                                <Typography variant="subtitle2" fontWeight={600} color="text.secondary" sx={{ mb: 1 }}>
                                    Mô tả *
                                </Typography>
                                <RichTextEditorComponent
                                    value={form.Description}
                                    onChange={(value: string) => handleChange("Description", value)}
                                />
                                {errors.Description && (
                                    <FormHelperText error sx={{ mt: 1 }}>{errors.Description}</FormHelperText>
                                )}
                            </Paper>
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Divider sx={{ my: 1 }} />
                            <Typography variant="subtitle2" fontWeight={600} color="text.secondary" sx={{ mb: 1 }}>
                                YÊU CẦU ỨNG VIÊN
                            </Typography>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 3 }}>
                            <TextField
                                label="Tuổi từ"
                                type="number" fullWidth size="small"
                                value={form.Requirement.FromAge ?? ""}
                                onChange={(e) => handleRequirementChange("FromAge", e.target.value ? Number(e.target.value) : undefined)}
                                inputProps={{ min: 0 }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 3 }}>
                            <TextField
                                label="Tuổi đến"
                                type="number" fullWidth size="small"
                                value={form.Requirement.ToAge ?? ""}
                                onChange={(e) => handleRequirementChange("ToAge", e.target.value ? Number(e.target.value) : undefined)}
                                inputProps={{ min: 0 }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 3 }}>
                            <TextField
                                select label="Giới tính"
                                fullWidth size="small"
                                value={form.Requirement.Gender}
                                onChange={(e) => handleRequirementChange("Gender", Number(e.target.value))}
                            >
                                {GENDER_OPTIONS.map((opt) => (
                                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 3 }}>
                            <TextField
                                select label="Trình độ học vấn"
                                fullWidth size="small"
                                value={form.Requirement.EducationLevel}
                                onChange={(e) => handleRequirementChange("EducationLevel", Number(e.target.value))}
                            >
                                {EDUCATION_OPTIONS.map((opt) => (
                                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 4 }}>
                            <TextField
                                select label="Kinh nghiệm"
                                fullWidth size="small"
                                value={form.Requirement.Experience}
                                onChange={(e) => handleRequirementChange("Experience", Number(e.target.value))}
                            >
                                {EXPERIENCE_OPTIONS.map((opt) => (
                                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Divider sx={{ my: 1 }} />
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                                <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
                                    ĐIỂM NỔI BẬT
                                </Typography>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={<Add />}
                                    onClick={handleAddHighlight}
                                >
                                    Thêm
                                </Button>
                            </Box>

                            {form.Highlights.length === 0 && (
                                <Typography variant="body2" color="text.disabled" sx={{ fontStyle: "italic" }}>
                                    Chưa có điểm nổi bật nào. Nhấn "Thêm" để bổ sung.
                                </Typography>
                            )}

                            {form.Highlights.map((highlight, index) => (
                                <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                    <TextField
                                        fullWidth size="small"
                                        placeholder={`Điểm nổi bật ${index + 1}`}
                                        value={highlight}
                                        onChange={(e) => handleHighlightChange(index, e.target.value)}
                                    />
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => handleRemoveHighlight(index)}
                                    >
                                        <Remove fontSize="small" />
                                    </IconButton>
                                </Box>
                            ))}
                        </Grid>

                    </Grid>
                )}
            </DialogContent>

            <Divider />
            <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
                <Button onClick={handleClose} variant="outlined" color="inherit" disabled={isLoading}>
                    Hủy
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    disabled={isLoading}
                    startIcon={isUpdating ? <CircularProgress size={16} color="inherit" /> : null}
                >
                    {isUpdating ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}