import {
    Box, Button, Chip, CircularProgress, FormControl, FormControlLabel,
    FormHelperText, Grid, InputLabel, MenuItem, OutlinedInput, Paper,
    Select, Switch, TextField, Typography, Autocomplete, Checkbox,
    ListItemText, SelectChangeEvent
} from "@mui/material";
import { ArrowBack, Save } from "@mui/icons-material";
import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RichTextEditorComponent from "../../components/editor";
import { useCreateRecruitmentPostMutation } from "../../app/features/recruitment-post.api";
import { useGetAllProvinceNoAuthenQuery } from "../../app/features/province.api";
import { CreateRecruitmentPostRequest, Requirement } from "../../app/models/recruitment-post.model";
import { useGetProfessionsByPageQuery } from "../../app/features/professtion.api";

const STATUS_OPTIONS = [
    { value: "Activated", label: "Đang tuyển" },
    { value: "Inactive", label: "Ngừng tuyển" },
    { value: "Pending", label: "Chờ duyệt" },
    { value: "Underfined", label: "Không xác định" },
];

const CURRENCY_OPTIONS = [
    { value: "VND", label: "VND" },
    { value: "USD", label: "USD" },
];

const defaultRequirement: Requirement = {
    FromAge: undefined,
    ToAge: undefined,
    Gender: "",
    Experience: "",
    EducationLevel: "",
};

export default function CreateRecruitmentPostPage() {
    const navigate = useNavigate();
    const [createRecruitmentPost, { isLoading: isSubmitting }] = useCreateRecruitmentPostMutation();
    const { data: provinces, isLoading: provincesLoading } = useGetAllProvinceNoAuthenQuery();

    // Profession infinite scroll
    const [professionPage, setProfessionPage] = useState(1);
    const [allProfessions, setAllProfessions] = useState<{ Id: string; Name: string }[]>([]);
    const [hasMoreProfessions, setHasMoreProfessions] = useState(true);
    const professionListRef = useRef<HTMLUListElement | null>(null);

    const { data: professionData, isFetching: professionsFetching } = useGetProfessionsByPageQuery({
        page: professionPage,
        size: 10,
    });

    useEffect(() => {
        if (professionData?.Items) {
            setAllProfessions(prev => {
                const existingIds = new Set(prev.map(p => p.Id));
                const newItems = professionData.Items.filter((p: { Id: string }) => !existingIds.has(p.Id));
                return [...prev, ...newItems];
            });
            if (professionData.Items.length < 10) {
                setHasMoreProfessions(false);
            }
        }
    }, [professionData]);

    const handleProfessionScroll = useCallback((event: React.UIEvent<HTMLUListElement>) => {
        const list = event.currentTarget;
        if (
            list.scrollTop + list.clientHeight >= list.scrollHeight - 10 &&
            !professionsFetching &&
            hasMoreProfessions
        ) {
            setProfessionPage(prev => prev + 1);
        }
    }, [professionsFetching, hasMoreProfessions]);

    // Form state
    const [form, setForm] = useState<Omit<CreateRecruitmentPostRequest, "Requirement">>({
        Status: "Activated",
        Name: "",
        ProfessionIds: [],
        Quantity: 1,
        Description: "",
        ProvinceId: "",
        Currency: "VND",
        RecruitmentToDate: "",
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

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!form.Name.trim()) newErrors.Name = "Tên bài đăng không được để trống";
        if (!form.ProvinceId) newErrors.ProvinceId = "Vui lòng chọn tỉnh/thành phố";
        if (form.ProfessionIds.length === 0) newErrors.ProfessionIds = "Vui lòng chọn ít nhất một nghề nghiệp";
        if (!form.RecruitmentToDate) newErrors.RecruitmentToDate = "Vui lòng chọn ngày hết hạn";
        if (form.Quantity < 1) newErrors.Quantity = "Số lượng phải lớn hơn 0";
        if (!form.Description.trim()) newErrors.Description = "Mô tả không được để trống";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        try {
            await createRecruitmentPost({
                ...form,
                Requirement: requirement,
            }).unwrap();
            navigate("/staff/manage-recruitment-post");
        } catch (error) {
            console.error("Failed to create recruitment post:", error);
        }
    };

    return (
        <Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 1 }}>
                <Typography variant="h5" fontWeight={600}>
                    Thêm bài đăng tuyển dụng
                </Typography>
            </Box>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 5 }}>
                    <Paper elevation={1} sx={{ p: 3, height: "100%" }}>
                        <Typography variant="h6" fontWeight={600} mb={2}>
                            Thông tin cơ bản
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid size={12}>
                                <TextField
                                    label="Tên bài đăng *"
                                    fullWidth
                                    value={form.Name}
                                    onChange={e => handleChange("Name", e.target.value)}
                                    error={!!errors.Name}
                                    helperText={errors.Name}
                                    size="small"
                                />
                            </Grid>
                            <Grid size={12}>
                                <FormControl fullWidth size="small" error={!!errors.ProvinceId}>
                                    <InputLabel>Tỉnh/Thành phố *</InputLabel>
                                    <Select
                                        value={form.ProvinceId}
                                        label="Tỉnh/Thành phố *"
                                        onChange={(e: SelectChangeEvent) => handleChange("ProvinceId", e.target.value)}
                                    >
                                        {provincesLoading ? (
                                            <MenuItem disabled><CircularProgress size={16} /></MenuItem>
                                        ) : (
                                            provinces?.map(p => (
                                                <MenuItem key={p.Id} value={p.Id}>{p.Name}</MenuItem>
                                            ))
                                        )}
                                    </Select>
                                    {errors.ProvinceId && <FormHelperText>{errors.ProvinceId}</FormHelperText>}
                                </FormControl>
                            </Grid>
                            <Grid size={12}>
                                <Autocomplete
                                    multiple
                                    options={allProfessions}
                                    getOptionLabel={(option) => option.Name}
                                    value={allProfessions.filter(p => form.ProfessionIds.includes(p.Id))}
                                    onChange={(_, newValue) => handleChange("ProfessionIds", newValue.map(v => v.Id))}
                                    loading={professionsFetching}
                                    ListboxProps={{ onScroll: handleProfessionScroll, style: { maxHeight: 240 } }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Nghề nghiệp *"
                                            size="small"
                                            error={!!errors.ProfessionIds}
                                            helperText={errors.ProfessionIds}
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <>
                                                        {professionsFetching && <CircularProgress size={14} />}
                                                        {params.InputProps.endAdornment}
                                                    </>
                                                ),
                                            }}
                                        />
                                    )}
                                    renderTags={(value, getTagProps) =>
                                        value.map((option, index) => (
                                            <Chip label={option.Name} size="small" {...getTagProps({ index })} />
                                        ))
                                    }
                                />
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <TextField
                                    label="Số lượng *"
                                    fullWidth
                                    type="number"
                                    value={form.Quantity}
                                    onChange={e => handleChange("Quantity", parseInt(e.target.value) || 1)}
                                    error={!!errors.Quantity}
                                    helperText={errors.Quantity}
                                    size="small"
                                    inputProps={{ min: 1 }}
                                />
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Đơn vị tiền tệ</InputLabel>
                                    <Select
                                        value={form.Currency}
                                        label="Đơn vị tiền tệ"
                                        onChange={(e: SelectChangeEvent) => handleChange("Currency", e.target.value)}
                                    >
                                        {CURRENCY_OPTIONS.map(c => (
                                            <MenuItem key={c.value} value={c.value}>{c.label}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <TextField
                                    label="Hạn tuyển dụng *"
                                    fullWidth
                                    type="date"
                                    value={form.RecruitmentToDate}
                                    onChange={e => handleChange("RecruitmentToDate", e.target.value)}
                                    error={!!errors.RecruitmentToDate}
                                    helperText={errors.RecruitmentToDate}
                                    size="small"
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Trạng thái</InputLabel>
                                    <Select
                                        value={form.Status}
                                        label="Trạng thái"
                                        onChange={(e: SelectChangeEvent) => handleChange("Status", e.target.value)}
                                    >
                                        {STATUS_OPTIONS.map(s => (
                                            <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid size={12}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={form.IsTop}
                                            onChange={e => handleChange("IsTop", e.target.checked)}
                                            color="primary"
                                        />
                                    }
                                    label="Nổi bật (Top)"
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                {/* Cột phải - Yêu cầu + Điểm nổi bật xếp dọc */}
                <Grid size={{ xs: 12, md: 7 }}>
                    <Grid container spacing={3} sx={{ height: "100%" }}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Paper elevation={1} sx={{ p: 3, height: "100%" }}>
                                <Typography variant="h6" fontWeight={600} mb={2}>
                                    Yêu cầu ứng viên
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 6 }}>
                                        <TextField
                                            label="Tuổi tối thiểu"
                                            fullWidth
                                            type="number"
                                            value={requirement.FromAge ?? ""}
                                            onChange={e => handleRequirementChange("FromAge", e.target.value ? parseInt(e.target.value) : undefined)}
                                            size="small"
                                            inputProps={{ min: 18 }}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 6 }}>
                                        <TextField
                                            label="Tuổi tối đa"
                                            fullWidth
                                            type="number"
                                            value={requirement.ToAge ?? ""}
                                            onChange={e => handleRequirementChange("ToAge", e.target.value ? parseInt(e.target.value) : undefined)}
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid size={12}>
                                        <TextField
                                            label="Giới tính"
                                            fullWidth
                                            value={requirement.Gender ?? ""}
                                            onChange={e => handleRequirementChange("Gender", e.target.value)}
                                            size="small"
                                            placeholder="Nam/Nữ/Không yêu cầu"
                                        />
                                    </Grid>
                                    <Grid size={12}>
                                        <TextField
                                            label="Kinh nghiệm"
                                            fullWidth
                                            value={requirement.Experience ?? ""}
                                            onChange={e => handleRequirementChange("Experience", e.target.value)}
                                            size="small"
                                            placeholder="VD: 1-2 năm"
                                        />
                                    </Grid>
                                    <Grid size={12}>
                                        <TextField
                                            label="Trình độ học vấn"
                                            fullWidth
                                            value={requirement.EducationLevel ?? ""}
                                            onChange={e => handleRequirementChange("EducationLevel", e.target.value)}
                                            size="small"
                                            placeholder="VD: Đại học"
                                        />
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Paper elevation={1} sx={{ p: 3, height: "100%" }}>
                                <Typography variant="h6" fontWeight={600} mb={2}>
                                    Điểm nổi bật
                                </Typography>
                                <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                                    <TextField
                                        label="Thêm điểm nổi bật"
                                        value={highlightInput}
                                        onChange={e => setHighlightInput(e.target.value)}
                                        onKeyDown={e => e.key === "Enter" && handleAddHighlight()}
                                        size="small"
                                        sx={{ flex: 1 }}
                                        placeholder="Nhấn Enter hoặc nút Thêm"
                                    />
                                    <Button variant="outlined" onClick={handleAddHighlight} size="small">
                                        Thêm
                                    </Button>
                                </Box>
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                    {form.Highlights.map((h, i) => (
                                        <Chip
                                            key={i}
                                            label={h}
                                            onDelete={() => handleRemoveHighlight(i)}
                                            color="primary"
                                            variant="outlined"
                                            size="small"
                                        />
                                    ))}
                                    {form.Highlights.length === 0 && (
                                        <Typography variant="body2" color="text.secondary">
                                            Chưa có điểm nổi bật nào.
                                        </Typography>
                                    )}
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>

                {/* HÀNG DƯỚI - Mô tả full width */}
                <Grid size={12}>
                    <Paper elevation={1} sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight={600} mb={2}>
                            Mô tả công việc *
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

                {/* Submit */}
                <Grid size={12}>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                        <Button variant="outlined" onClick={() => navigate("/staff/manage-recruitment-post")}>
                            Hủy
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : <Save />}
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Đang lưu..." : "Lưu bài đăng"}
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}