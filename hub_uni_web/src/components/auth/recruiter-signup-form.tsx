import { Box, Stack, Typography, TextField, Button, MenuItem, Stepper, Step, StepLabel, CircularProgress, Paper, Grid, Alert } from "@mui/material";
import { useState, useRef } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useRecruiterRegisterMutation } from "../../app/features/auth/auth.api";
import { useGetAllProvinceNoAuthenQuery } from "../../app/features/province.api";
import { useGetCommunesByProvinceQuery } from "../../app/features/commune.api";
import { useGetOrganizationTypesByPageQuery } from "../../app/features/organization-type.api";
import { Province } from "../../app/models/province.model";
import { Gender, AccountStatus } from "../../app/models/enums.model";
import { DEFAULT_PAGE } from "../../constants/common.constant";

const PAGE_SIZE = 100;
const STEPS = ["Thông tin tài khoản", "Thông tin trường"];

const RecruiterSignupForm = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [error, setError] = useState("");
    const [selectedProvinceSeo, setSelectedProvinceSeo] = useState("");

    const { data: provinces = [] } = useGetAllProvinceNoAuthenQuery();
    const { data: communes = [] } = useGetCommunesByProvinceQuery(selectedProvinceSeo, { skip: !selectedProvinceSeo, });
    const { data: orgTypesData } = useGetOrganizationTypesByPageQuery({ page: DEFAULT_PAGE, size: PAGE_SIZE });
    const orgTypes = orgTypesData?.Items ?? [];

    const [registerRecruiter] = useRecruiterRegisterMutation();

    const [form, setForm] = useState({
        UserName: "", Password: "", ConfirmPassword: "", FullName: "",
        Gender: Gender.Undefined, Email: "", PhoneNumber: "", OrganizationTypeId: "",
        OrgName: "", IssueDate: "",
        ProvinceId: "", CommuneId: "", Address: "", OrgPhoneNumber: "", OrgEmail: "",
    });

    const set = (field: string, value: any) => setForm((prev) => ({ ...prev, [field]: value }));

    const handleProvinceChange = (provinceId: string) => {
        const province = provinces.find((p: Province) => p.Id === provinceId);
        set("ProvinceId", provinceId);
        set("CommuneId", "");
        setSelectedProvinceSeo(province?.SeoUrl ?? "");
    };

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
                    OrganizationTypeId: form.OrganizationTypeId,
                    ProvinceId: form.ProvinceId,
                    CommuneId: form.CommuneId,
                    Address: form.Address,
                    PhoneNumber: form.OrgPhoneNumber,
                    Email: form.OrgEmail,
                },
            }).unwrap();

            setSubmitSuccess(true);
        } catch {
            setError("Đăng ký thất bại. Vui lòng thử lại.");
        } finally {
            setSubmitting(false);
        }
    };

    if (submitSuccess) {
        return (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: 2 }}>
                <CheckCircleIcon sx={{ fontSize: 72, color: "success.main" }} />
                <Typography variant="h5" fontWeight={700}>Đăng ký thành công!</Typography>
                <Typography color="text.secondary">Tài khoản của bạn đang chờ phê duyệt.</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 680, mx: "auto", px: { xs: 0.5, sm: 0.5 }, py: { xs: 0.5, sm: 0.5 } }}>
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
                                        <MenuItem value={Gender.Undefined}>Không yêu cầu</MenuItem>
                                        <MenuItem value={Gender.Male}>Nam</MenuItem>
                                        <MenuItem value={Gender.Female}>Nữ</MenuItem>
                                        <MenuItem value={Gender.Other}>Khác</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid size={{ xs: 12 }}> <TextField label="Họ và tên *" value={form.FullName} onChange={(e) => set("FullName", e.target.value)} fullWidth size="small" /></Grid>
                                <Grid size={{ xs: 12 }}> <TextField label="Email liên hệ *" type="email" value={form.Email} onChange={(e) => set("Email", e.target.value)} fullWidth size="small" /></Grid>
                                <Grid size={{ xs: 12 }}> <TextField label="Số điện thoại liên hệ" value={form.PhoneNumber} onChange={(e) => set("PhoneNumber", e.target.value)} fullWidth size="small" /></Grid>
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
                                <Grid size={{ xs: 12, sm: 6 }}> <TextField label="Ngày cấp phép" type="date" value={form.IssueDate} onChange={(e) => set("IssueDate", e.target.value)} fullWidth size="small" InputLabelProps={{ shrink: true }} /> </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}> <TextField select label="Loại tổ chức" value={form.OrganizationTypeId} onChange={(e) => set("OrganizationTypeId", e.target.value)} fullWidth size="small"> {orgTypes.map((ot) => (<MenuItem key={ot.Id} value={ot.Id}>{ot.Name}</MenuItem>))}</TextField> </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}><TextField select label="Tỉnh / Thành phố" value={form.ProvinceId} onChange={(e) => handleProvinceChange(e.target.value)} fullWidth size="small">{provinces.map((p: Province) => (<MenuItem key={p.Id} value={p.Id}>{p.Name}</MenuItem>))}</TextField></Grid>
                                <Grid size={{ xs: 12, sm: 6 }}><TextField select label="Quận / Xã" value={form.CommuneId} onChange={(e) => set("CommuneId", e.target.value)} fullWidth size="small" disabled={!selectedProvinceSeo}>{communes.map((c) => (<MenuItem key={c.Id} value={c.Id}>{c.Name}</MenuItem>))}</TextField></Grid>
                                <Grid size={{ xs: 12 }}><TextField label="Địa chỉ" value={form.Address} onChange={(e) => set("Address", e.target.value)} fullWidth size="small" /></Grid>
                                <Grid size={{ xs: 12, sm: 6 }}><TextField label="SĐT tổ chức" value={form.OrgPhoneNumber} onChange={(e) => set("OrgPhoneNumber", e.target.value)} fullWidth size="small" /></Grid>
                                <Grid size={{ xs: 12, sm: 6 }}><TextField label="Email tổ chức" type="email" value={form.OrgEmail} onChange={(e) => set("OrgEmail", e.target.value)} fullWidth size="small" /></Grid>
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