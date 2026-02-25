import { Box, Stack, Typography, TextField, Divider, Button, MenuItem, Checkbox, ListItemText, OutlinedInput, Select, FormControl, InputLabel, SelectChangeEvent, Stepper, Step, StepLabel, IconButton, CircularProgress, Chip, Paper, Grid, LinearProgress, Alert } from "@mui/material";
import { useState, useRef } from "react";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useRecruiterRegisterMutation } from "../../app/features/auth/auth.api";
import { useGetAllProvinceNoAuthenQuery } from "../../app/features/province.api";
import { useGetAllProfessionNoAuthenQuery } from "../../app/features/profession.api";
import { useGetCommunesByProvinceQuery } from "../../app/features/commune.api";
import { useGetOrganizationTypesByPageQuery } from "../../app/features/organization-type.api";
import { useUploadOneFileMutation } from "../../app/features/mediafile.api";
import { Province } from "../../app/models/province.model";
import { ProfessionResponse } from "../../app/models/profession.model";
import { Gender, AccountStatus } from "../../app/models/enums.model";
import { DEFAULT_PAGE } from "../../constants/common.constant";

const PAGE_SIZE = 100;
const STEPS = ["Thông tin cá nhân", "Thông tin tổ chức", "Mạng xã hội & Hình ảnh"];

interface ImageField {
    file: File | null;
    preview: string;
    uploading: boolean;
    relativeUrl: string;
}

const defaultImageField = (): ImageField => ({ file: null, preview: "", uploading: false, relativeUrl: "" });

const RecruiterSignupForm = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [error, setError] = useState("");
    const [selectedProvinceSeo, setSelectedProvinceSeo] = useState("");

    // Image states
    const [logoImg, setLogoImg] = useState<ImageField>(defaultImageField());
    const [wallpaperImg, setWallpaperImg] = useState<ImageField>(defaultImageField());

    const logoRef = useRef<HTMLInputElement>(null);
    const wallpaperRef = useRef<HTMLInputElement>(null);

    const { data: provinces = [] } = useGetAllProvinceNoAuthenQuery();
    const { data: professions = [] } = useGetAllProfessionNoAuthenQuery();
    const { data: communes = [] } = useGetCommunesByProvinceQuery(selectedProvinceSeo, { skip: !selectedProvinceSeo, });
    const { data: orgTypesData } = useGetOrganizationTypesByPageQuery({ page: DEFAULT_PAGE, size: PAGE_SIZE });
    const orgTypes = orgTypesData?.Items ?? [];

    const [registerRecruiter] = useRecruiterRegisterMutation();
    const [uploadOneFile] = useUploadOneFileMutation();

    const [form, setForm] = useState({
        UserName: "", Password: "", ConfirmPassword: "", FullName: "",
        Gender: Gender.Undefined, Email: "", PhoneNumber: "",
        OrgName: "", InternationalName: "", TaxCode: "", IssueDate: "",
        OrganizationTypeId: "", ProfessionIds: [] as string[], MainProfessionId: "",
        ProvinceId: "", CommuneId: "", Address: "", OrgPhoneNumber: "", OrgEmail: "",
        ManagedBy: "", Summary: "", Description: "",
        WebsiteUrl: "", FacebookUrl: "", LinkedinUrl: "", YoutubeUrl: "",
        GoogleMapUrl: "", TwitterUrl: "", InstagramUrl: "",
    });

    const set = (field: string, value: any) => setForm((prev) => ({ ...prev, [field]: value }));

    const handleProvinceChange = (provinceId: string) => {
        const province = provinces.find((p: Province) => p.Id === provinceId);
        set("ProvinceId", provinceId);
        set("CommuneId", "");
        setSelectedProvinceSeo(province?.Seo ?? "");
    };

    const handleProfessionChange = (event: SelectChangeEvent<string[]>) => {
        const value = event.target.value as string[];
        set("ProfessionIds", value);
        if (value.length > 0 && !value.includes(form.MainProfessionId)) {
            set("MainProfessionId", value[0]);
        }
        if (value.length === 0) set("MainProfessionId", "");
    };

    // --- Image handling ---
    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<ImageField>>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const preview = URL.createObjectURL(file);
        setter({ file, preview, uploading: false, relativeUrl: "" });
        e.target.value = "";
    };

    const uploadImage = async (imgField: ImageField, setter: React.Dispatch<React.SetStateAction<ImageField>>): Promise<string> => {
        if (!imgField.file) return imgField.relativeUrl;
        if (imgField.relativeUrl) return imgField.relativeUrl;
        setter((prev) => ({ ...prev, uploading: true }));
        try {
            const res = await uploadOneFile(imgField.file).unwrap();
            setter((prev) => ({ ...prev, uploading: false, relativeUrl: res.RelativeUrl }));
            return res.RelativeUrl;
        } catch {
            setter((prev) => ({ ...prev, uploading: false }));
            throw new Error("Upload ảnh thất bại");
        }
    };

    const removeImage = (setter: React.Dispatch<React.SetStateAction<ImageField>>) => { setter(defaultImageField()); };

    const validateStep = (step: number): string => {
        if (step === 0) {
            if (!form.UserName.trim()) return "Vui lòng nhập tên đăng nhập";
            if (!form.Password) return "Vui lòng nhập mật khẩu";
            if (form.Password !== form.ConfirmPassword) return "Mật khẩu xác nhận không khớp";
            if (!form.FullName.trim()) return "Vui lòng nhập họ và tên";
            if (!form.Email.trim()) return "Vui lòng nhập email";
        }
        if (step === 1) {
            if (!form.OrgName.trim()) return "Vui lòng nhập tên tổ chức";
        }
        return "";
    };

    const handleNext = () => {
        const err = validateStep(activeStep);
        if (err) { setError(err); return; }
        setError("");
        setActiveStep((s) => s + 1);
    };

    const handleBack = () => {
        setError("");
        setActiveStep((s) => s - 1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const err = validateStep(activeStep);
        if (err) { setError(err); return; }
        setError("");
        setSubmitting(true);
        try {
            const [logoUrl, wallpaperUrl] = await Promise.all([
                uploadImage(logoImg, setLogoImg),
                uploadImage(wallpaperImg, setWallpaperImg),
            ]);

            await registerRecruiter({
                CustomerModel: {
                    UserName: form.UserName,
                    Password: form.Password,
                    FullName: form.FullName,
                    Gender: form.Gender,
                    Email: form.Email,
                    PhoneNumber: form.PhoneNumber,
                    AccountStatus: AccountStatus.Activated,
                },
                OrganizationModel: {
                    Name: form.OrgName,
                    InternationalName: form.InternationalName,
                    TaxCode: form.TaxCode,
                    IssueDate: form.IssueDate,
                    OrganizationTypeId: form.OrganizationTypeId,
                    ProfessionIds: form.ProfessionIds,
                    MainProfessionId: form.MainProfessionId,
                    ProvinceId: form.ProvinceId,
                    CommuneId: form.CommuneId,
                    Address: form.Address,
                    PhoneNumber: form.OrgPhoneNumber,
                    Email: form.OrgEmail,
                    ManagedBy: form.ManagedBy,
                    LogoUrl: logoUrl,
                    WallpaperUrl: wallpaperUrl,
                    Summary: form.Summary,
                    Description: form.Description,
                    WebsiteUrl: form.WebsiteUrl,
                    FacebookUrl: form.FacebookUrl,
                    LinkedinUrl: form.LinkedinUrl,
                    YoutubeUrl: form.YoutubeUrl,
                    GoogleMapUrl: form.GoogleMapUrl,
                    TwitterUrl: form.TwitterUrl,
                    InstagramUrl: form.InstagramUrl,
                },
            }).unwrap();

            setSubmitSuccess(true);
        } catch {
            setError("Đăng ký thất bại. Vui lòng thử lại.");
        } finally {
            setSubmitting(false);
        }
    };

    const ImageUploadBox = ({ label, imgField, setter, inputRef, shape = "square", }: {
        label: string;
        imgField: ImageField;
        setter: React.Dispatch<React.SetStateAction<ImageField>>;
        inputRef: React.RefObject<HTMLInputElement | null>;
        shape?: "circle" | "square";
    }) => (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
            <Typography variant="caption" color="text.secondary">{label}</Typography>
            <Box
                sx={{ position: "relative",
                    width: shape === "circle" ? 90 : 140,
                    height: shape === "circle" ? 90 : 90,
                    borderRadius: shape === "circle" ? "50%" : 2,
                    border: "2px dashed",
                    borderColor: imgField.preview ? "primary.main" : "divider",
                    overflow: "hidden",
                    cursor: "pointer",
                    bgcolor: "grey.50",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    "&:hover .overlay": { opacity: 1 },
                }}
                onClick={() => inputRef.current?.click()}
            >
                {imgField.preview ? (
                    <>
                        <Box component="img" src={imgField.preview} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        <Box className="overlay" sx={{
                            position: "absolute", inset: 0, bgcolor: "rgba(0,0,0,0.45)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            opacity: 0, transition: "opacity 0.2s",
                        }}>
                            <PhotoCameraIcon sx={{ color: "white", fontSize: 22 }} />
                        </Box>
                    </>
                ) : (
                    <PhotoCameraIcon sx={{ color: "text.disabled", fontSize: 28 }} />
                )}
                {imgField.uploading && (
                    <Box sx={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "rgba(255,255,255,0.7)" }}>
                        <CircularProgress size={24} />
                    </Box>
                )}
            </Box>
            {imgField.preview && (
                <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); removeImage(setter); }}>
                    <DeleteIcon fontSize="small" />
                </IconButton>
            )}
            <input ref={inputRef} type="file" accept="image/*" hidden onChange={(e) => handleImageSelect(e, setter)} />
        </Box>
    );

    if (submitSuccess) {
        return (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: 2 }}>
                <CheckCircleIcon sx={{ fontSize: 72, color: "success.main" }} />
                <Typography variant="h5" fontWeight={700}>Đăng ký thành công!</Typography>
                <Typography color="text.secondary">Tài khoản của bạn đang chờ phê duyệt.</Typography>
            </Box>
        );
    }

    const professionMap = Object.fromEntries(professions.map((p: ProfessionResponse) => [p.Id, p.Name]));

    return (
        <Box sx={{ maxWidth: 680, mx: "auto", px: { xs: 1, sm: 1 }, py: { xs: 1, sm: 1 } }}>
            {/* Header */}
            <Typography variant="h5" fontWeight={700} textAlign="center" mb={0.5}> Đăng ký thông tin </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}> Vui lòng điền đầy đủ thông tin để tạo tài khoản </Typography>

            {/* Stepper */}
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 2 }}>
                {STEPS.map((label) => (
                    <Step key={label}>
                        <StepLabel sx={{ "& .MuiStepLabel-label": { fontSize: { xs: "0.65rem", sm: "0.75rem" } } }}> {label} </StepLabel>
                    </Step>
                ))}
            </Stepper>

            <LinearProgress variant="determinate" value={((activeStep) / (STEPS.length - 1)) * 100} sx={{ mb: 2, borderRadius: 1, height: 4 }} />

            {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>{error}</Alert>}

            <Paper elevation={0} sx={{ p: { xs: 1, sm: 1 } }}>
                <Box component="form" onSubmit={handleSubmit}>
                    {/* STEP1 */}
                    {activeStep === 0 && (
                        <Stack spacing={1}>
                            <Typography fontWeight={600} color="primary"> Thông tin tài khoản </Typography>

                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6 }}> <TextField label="Tên đăng nhập *" value={form.UserName} onChange={(e) => set("UserName", e.target.value)} fullWidth size="small" /> </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField select label="Giới tính" value={form.Gender} onChange={(e) => set("Gender", e.target.value)} fullWidth size="small">
                                        <MenuItem value={Gender.Male}>Nam</MenuItem>
                                        <MenuItem value={Gender.Female}>Nữ</MenuItem>
                                        <MenuItem value={Gender.Other}>Khác</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid size={{ xs: 12 }}> <TextField label="Họ và tên *" value={form.FullName} onChange={(e) => set("FullName", e.target.value)} fullWidth size="small" /></Grid>
                                <Grid size={{ xs: 12 }}> <TextField label="Email *" type="email" value={form.Email} onChange={(e) => set("Email", e.target.value)} fullWidth size="small" /></Grid>
                                <Grid size={{ xs: 12 }}> <TextField label="Số điện thoại" value={form.PhoneNumber} onChange={(e) => set("PhoneNumber", e.target.value)} fullWidth size="small" /></Grid>
                                <Grid size={{ xs: 12 }}> <TextField label="Mật khẩu *" type="password" value={form.Password} onChange={(e) => set("Password", e.target.value)} fullWidth size="small" /></Grid>
                                <Grid size={{ xs: 12 }}> <TextField label="Xác nhận mật khẩu *" type="password" value={form.ConfirmPassword} onChange={(e) => set("ConfirmPassword", e.target.value)} fullWidth size="small" error={!!form.ConfirmPassword && form.Password !== form.ConfirmPassword} helperText={form.ConfirmPassword && form.Password !== form.ConfirmPassword ? "Không khớp" : ""} /></Grid>
                            </Grid>
                        </Stack>
                    )}

                    {/* STEP 2 */}
                    {activeStep === 1 && (
                        <Stack spacing={2}>
                            <Typography variant="subtitle1" fontWeight={600} color="primary"> Thông tin tổ chức </Typography>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12 }}> <TextField label="Tên tổ chức *" value={form.OrgName} onChange={(e) => set("OrgName", e.target.value)} fullWidth size="small" /> </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}> <TextField label="Tên quốc tế" value={form.InternationalName} onChange={(e) => set("InternationalName", e.target.value)} fullWidth size="small" /> </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}> <TextField label="Mã số thuế" value={form.TaxCode} onChange={(e) => set("TaxCode", e.target.value)} fullWidth size="small" /> </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}> <TextField label="Ngày cấp phép" type="date" value={form.IssueDate} onChange={(e) => set("IssueDate", e.target.value)} fullWidth size="small" /> </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}> <TextField select label="Loại tổ chức" value={form.OrganizationTypeId} onChange={(e) => set("OrganizationTypeId", e.target.value)} fullWidth size="small"> {orgTypes.map((ot) => (<MenuItem key={ot.Id} value={ot.Id}>{ot.Name}</MenuItem>))}</TextField> </Grid>

                                {/* Multi-select professions */}
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Ngành nghề</InputLabel>
                                        <Select multiple value={form.ProfessionIds} onChange={handleProfessionChange} input={<OutlinedInput label="Ngành nghề" />} renderValue={(selected) => (
                                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                                {(selected as string[]).slice(0, 2).map((id) => (<Chip key={id} label={professionMap[id]} size="small" />))}
                                                {(selected as string[]).length > 2 && (<Chip label={`+${(selected as string[]).length - 2}`} size="small" />)}
                                            </Box>
                                        )}
                                        >
                                            {professions.map((p: ProfessionResponse) => (<MenuItem key={p.Id} value={p.Id}> <Checkbox checked={form.ProfessionIds.includes(p.Id)} size="small" /> <ListItemText primary={p.Name} /> </MenuItem>))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                {form.ProfessionIds.length > 0 && (<Grid size={{ xs: 12, sm: 6 }}><TextField select label="Ngành nghề chính" value={form.MainProfessionId} onChange={(e) => set("MainProfessionId", e.target.value)} fullWidth size="small">{professions.filter((p: ProfessionResponse) => form.ProfessionIds.includes(p.Id)).map((p: ProfessionResponse) => (<MenuItem key={p.Id} value={p.Id}>{p.Name}</MenuItem>))}</TextField></Grid>)}

                                <Grid size={{ xs: 12, sm: 6 }}><TextField select label="Tỉnh / Thành phố" value={form.ProvinceId} onChange={(e) => handleProvinceChange(e.target.value)} fullWidth size="small">{provinces.map((p: Province) => (<MenuItem key={p.Id} value={p.Id}>{p.Name}</MenuItem>))}</TextField></Grid>
                                <Grid size={{ xs: 12, sm: 6 }}><TextField select label="Quận / Xã" value={form.CommuneId} onChange={(e) => set("CommuneId", e.target.value)} fullWidth size="small" disabled={!selectedProvinceSeo}>{communes.map((c) => (<MenuItem key={c.Id} value={c.Id}>{c.Name}</MenuItem>))}</TextField></Grid>
                                <Grid size={{ xs: 12 }}><TextField label="Địa chỉ" value={form.Address} onChange={(e) => set("Address", e.target.value)} fullWidth size="small" /></Grid>
                                <Grid size={{ xs: 12, sm: 6 }}><TextField label="SĐT tổ chức" value={form.OrgPhoneNumber} onChange={(e) => set("OrgPhoneNumber", e.target.value)} fullWidth size="small" /></Grid>
                                <Grid size={{ xs: 12, sm: 6 }}><TextField label="Email tổ chức" type="email" value={form.OrgEmail} onChange={(e) => set("OrgEmail", e.target.value)} fullWidth size="small" /></Grid>
                                <Grid size={{ xs: 12, sm: 6 }}><TextField label="Người quản lý" value={form.ManagedBy} onChange={(e) => set("ManagedBy", e.target.value)} fullWidth size="small" /></Grid>
                                <Grid size={{ xs: 12 }}><TextField label="Tóm tắt" value={form.Summary} onChange={(e) => set("Summary", e.target.value)} fullWidth size="small" multiline rows={2} /></Grid>
                                <Grid size={{ xs: 12 }}><TextField label="Mô tả chi tiết" value={form.Description} onChange={(e) => set("Description", e.target.value)} fullWidth size="small" multiline rows={3} /></Grid>
                            </Grid>
                        </Stack>
                    )}

                    {/* STEP 3 */}
                    {activeStep === 2 && (
                        <Stack spacing={2.5}>
                            <Typography variant="subtitle1" fontWeight={600} color="primary"> Hình ảnh tổ chức </Typography>
                            <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", justifyContent: { xs: "center", sm: "flex-start" } }}>
                                <ImageUploadBox label="Logo" imgField={logoImg} setter={setLogoImg} inputRef={logoRef} shape="circle" />
                                <ImageUploadBox label="Ảnh bìa (Wallpaper)" imgField={wallpaperImg} setter={setWallpaperImg} inputRef={wallpaperRef} shape="square" />
                            </Box>

                            <Divider />

                            <Typography variant="subtitle1" fontWeight={600} color="primary"> Mạng xã hội & Liên kết </Typography>
                            <Grid container spacing={2}>
                                {[
                                    { label: "Website", field: "WebsiteUrl" },
                                    { label: "Facebook", field: "FacebookUrl" },
                                    { label: "LinkedIn", field: "LinkedinUrl" },
                                    { label: "YouTube", field: "YoutubeUrl" },
                                    { label: "Google Map", field: "GoogleMapUrl" },
                                    { label: "Twitter", field: "TwitterUrl" },
                                    { label: "Instagram", field: "InstagramUrl" },
                                ].map(({ label, field }) => (<Grid size={{ xs: 12, sm: 6 }} key={field}> <TextField label={label} value={(form as any)[field]} onChange={(e) => set(field, e.target.value)} fullWidth size="small" placeholder="https://" /> </Grid>))}
                            </Grid>
                        </Stack>
                    )}

                    {/* Navigation buttons */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3, gap: 1 }}>
                        <Button type="button" variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleBack} disabled={activeStep === 0} sx={{ minWidth: 110 }}> Quay lại </Button>

                        {activeStep < STEPS.length - 1 ? (<Button type="button" variant="contained" endIcon={<ArrowForwardIcon />} onClick={handleNext} sx={{ minWidth: 110 }}> Tiếp theo </Button>) : (<Button type="button" onClick={handleSubmit} variant="contained" color="success" disabled={submitting} sx={{ minWidth: 140 }} startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : <CheckCircleIcon />}> {submitting ? "Đang xử lý..." : "Hoàn tất đăng ký"} </Button>)}
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default RecruiterSignupForm;