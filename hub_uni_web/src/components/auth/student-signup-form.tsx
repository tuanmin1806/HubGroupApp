import { Box, Button, Stack, TextField, Typography, MenuItem, Grid, Alert, CircularProgress, Paper, Link } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useStudentRegisterMutation } from "../../app/features/auth/auth.api";
import { useState } from "react";
import { AccountStatus, AccountType, EducationLevel, Gender, JobExperience } from "../../app/models/enums.model";
import { useGetProvinceByCountryQuery } from "../../app/features/province.api";
import { Province } from "../../app/models/province.model";
import { useGetCommunesByProvinceQuery } from "../../app/features/commune.api";
import { useGetAllCountryNoAuthenQuery } from "../../app/features/country.api";
import { Country } from "../../app/models/country.model";
import { useNavigate } from "react-router-dom";

const RequiredStar = () => <Box component="span" sx={{ color: "error.main" }}>*</Box>;

const initialState = {
    UserName: "",
    Password: "",
    ConfirmPassword: "",
    FullName: "",
    Gender: Gender.Male,
    Email: "",
    PhoneNumber: "",
    DateOfBirth: "",
    Experience: JobExperience.LessThan1Year,
    EducationLevel: EducationLevel.Undefined,
    CountryId: "",
    ProvinceId: "",
    CommuneId: "",
    Address: ""
};

const StudentSignupForm = () => {
    const [registerStudent] = useStudentRegisterMutation();
    const navigate = useNavigate();

    const [form, setForm] = useState(initialState);
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const [selectedCountrySeo, setSelectedCountrySeo] = useState("");
    const [selectedProvinceSeo, setSelectedProvinceSeo] = useState("");

    const { data: countries = [] } = useGetAllCountryNoAuthenQuery();
    const { data: provinces = [] } = useGetProvinceByCountryQuery(selectedCountrySeo, { skip: !selectedCountrySeo, });
    const { data: communes = [] } = useGetCommunesByProvinceQuery(selectedProvinceSeo, { skip: !selectedProvinceSeo, });

    const set = (field: string, value: any) => setForm((prev) => ({ ...prev, [field]: value }));

    const validate = (): string => {
        if (!form.UserName.trim()) return "Vui lòng nhập tên đăng nhập";
        if (form.UserName.trim().length < 3) return "Tên đăng nhập phải có ít nhất 3 ký tự";
        if (!form.Password) return "Vui lòng nhập mật khẩu";
        if (form.Password !== form.ConfirmPassword) return "Mật khẩu xác nhận không khớp";
        if (!form.FullName.trim()) return "Vui lòng nhập họ và tên";
        if (!form.Email.trim()) return "Vui lòng nhập email";
        return "";
    };

    const handleProvinceChange = (provinceId: string) => {
        const province = provinces.find((p: Province) => p.Id === provinceId);
        set("ProvinceId", provinceId);
        set("CommuneId", "");
        setSelectedProvinceSeo(province?.SeoUrl ?? "");
    };

    const handleCountryChange = (countryId: string) => {
        const country = countries.find((c: Country) => c.Id === countryId);
        set("CountryId", countryId);
        set("ProvinceId", "");
        set("CommuneId", "");
        setSelectedCountrySeo(country?.SeoUrl ?? "");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const err = validate();
        if (err) { setError(err); return; }
        setError("");
        setSubmitting(true);
        try {
            await registerStudent({
                UserName: form.UserName,
                Password: form.Password,
                FullName: form.FullName,
                Gender: form.Gender,
                Email: form.Email,
                PhoneNumber: form.PhoneNumber,
                AccountType: AccountType.Student,
                AccountStatus: AccountStatus.Activated,
                ProfileInfo: {
                    DateOfBirth: form.DateOfBirth,
                    Gender: form.Gender,
                    CountryId: form.CountryId,
                    ProvinceId: form.ProvinceId,
                    CommuneId: form.CommuneId,
                    Address: form.Address,
                    Experience: form.Experience,
                    EducationLevel: form.EducationLevel,
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
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "40vh", gap: 2 }}>
                <CheckCircleIcon sx={{ fontSize: 72, color: "#008631" }} />
                <Typography variant="h5" fontWeight={700} color="#008631">Tài khoản đã đăng ký thành công!</Typography>
                <Button variant="contained" onClick={() => navigate("/dang-nhap")} sx={{ mt: 1, backgroundColor: "#faa11b", px: 3, fontWeight: 600, "&:hover": { backgroundColor: "#fcb448ff" } }}> Đăng nhập </Button>
            </Box>
        );
    }
    return (
        <Box sx={{ maxWidth: 600, mx: "auto", px: { xs: 0.5, sm: 0.5 }, py: { xs: 0.5, sm: 0.5 } }}>
            <Typography variant="h5" fontWeight={700} textAlign="center" color="#faa11b" mb={0.5}> Đăng ký tài khoản </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center" mb={1}> Vui lòng điền đầy đủ thông tin để tạo tài khoản </Typography>

            {error && (<Alert severity="error" sx={{ mb: 1 }} onClose={() => setError("")}>{error}</Alert>)}

            <Paper elevation={0}>
                <Box component="form" onSubmit={handleSubmit} onKeyDown={(e) => { if (e.key === "Enter") e.preventDefault(); }}>
                    <Stack spacing={2}>
                        <Box>
                            <Typography variant="subtitle2" fontWeight={600} color="#faa11b" mb={1}> Thông tin tài khoản </Typography>
                            <Grid container spacing={2.5}>
                                <Grid size={{ xs: 12 }}> <TextField label={<>Tên đăng nhập <RequiredStar /></>} size="small" fullWidth value={form.UserName} onChange={(e) => set("UserName", e.target.value)} /> </Grid>
                                <Grid size={{ xs: 12 }}> <TextField label={<>Mật khẩu <RequiredStar /></>} type="password" size="small" fullWidth value={form.Password} onChange={(e) => set("Password", e.target.value)} /></Grid>
                                <Grid size={{ xs: 12 }}> <TextField label={<>Xác nhận mật khẩu <RequiredStar /></>} type="password" size="small" fullWidth value={form.ConfirmPassword} onChange={(e) => set("ConfirmPassword", e.target.value)} error={!!form.ConfirmPassword && form.Password !== form.ConfirmPassword} helperText={form.ConfirmPassword && form.Password !== form.ConfirmPassword ? "Mật khẩu không khớp" : ""} /></Grid>
                            </Grid>
                        </Box>

                        <Box>
                            <Typography variant="subtitle2" fontWeight={600} color="#faa11b" mb={1}> Thông tin cá nhân </Typography>
                            <Grid container spacing={2.5}>
                                <Grid size={{ xs: 12 }}> <TextField label={<>Họ và tên <RequiredStar /></>} size="small" fullWidth value={form.FullName} onChange={(e) => set("FullName", e.target.value)} /></Grid>
                                <Grid size={{ xs: 12, sm: 6 }}> <TextField label="Email" type="email" size="small" fullWidth value={form.Email} onChange={(e) => set("Email", e.target.value)} /></Grid>
                                <Grid size={{ xs: 12, sm: 6 }}> <TextField label={<>Số điện thoại <RequiredStar /></>} size="small" fullWidth value={form.PhoneNumber} onChange={(e) => set("PhoneNumber", e.target.value)} /></Grid>
                                <Grid size={{ xs: 12, sm: 6 }}> <TextField select label="Giới tính" size="small" fullWidth value={form.Gender} onChange={(e) => set("Gender", e.target.value)}>
                                    <MenuItem value={Gender.Undefined}>Không yêu cầu</MenuItem>
                                    <MenuItem value={Gender.Male}>Nam</MenuItem>
                                    <MenuItem value={Gender.Female}>Nữ</MenuItem>
                                    <MenuItem value={Gender.Other}>Khác</MenuItem>
                                </TextField>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}> <TextField label="Ngày sinh" type="date" value={form.DateOfBirth} onChange={(e) => set("DateOfBirth", e.target.value)} fullWidth size="small" InputLabelProps={{ shrink: true }} /></Grid>
                                <Grid size={{ xs: 12, sm: 6 }}><TextField select label="Quốc gia" value={form.CountryId} onChange={(e) => handleCountryChange(e.target.value)} fullWidth size="small">{countries.map((c: Country) => (<MenuItem key={c.Id} value={c.Id}>{c.Name}</MenuItem>))}</TextField></Grid>
                                <Grid size={{ xs: 12, sm: 6 }}><TextField select label="Tỉnh / Thành phố" value={form.ProvinceId} onChange={(e) => handleProvinceChange(e.target.value)} fullWidth size="small" disabled={!selectedCountrySeo}>{provinces.map((p: Province) => (<MenuItem key={p.Id} value={p.Id}>{p.Name}</MenuItem>))}</TextField></Grid>
                                <Grid size={{ xs: 12, sm: 6 }}><TextField select label="Xã / Phường" value={form.CommuneId} onChange={(e) => set("CommuneId", e.target.value)} fullWidth size="small" disabled={!selectedProvinceSeo}>{communes.map((c) => (<MenuItem key={c.Id} value={c.Id}>{c.Name}</MenuItem>))}</TextField></Grid>
                                <Grid size={{ xs: 12 }}><TextField label="Địa chỉ" value={form.Address} onChange={(e) => set("Address", e.target.value)} fullWidth size="small" /></Grid>
                            </Grid>
                        </Box>

                        <Box>
                            <Typography variant="subtitle2" fontWeight={600} color="#faa11b" mb={2}> Học vấn & Kinh nghiệm </Typography>
                            <Grid container spacing={1.5}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField select label="Trình độ học vấn" size="small" fullWidth value={form.EducationLevel} onChange={(e) => set("EducationLevel", e.target.value)}>
                                        <MenuItem value={EducationLevel.Undefined}>Không xác định</MenuItem>
                                        <MenuItem value={EducationLevel.HighSchool}>Trung học phổ thông</MenuItem>
                                        <MenuItem value={EducationLevel.College}>Cao đẳng</MenuItem>
                                        <MenuItem value={EducationLevel.University}>Đại học</MenuItem>
                                        <MenuItem value={EducationLevel.Postgraduate}>Sau đại học</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField select label="Kinh nghiệm" size="small" fullWidth value={form.Experience} onChange={(e) => set("Experience", e.target.value)}>
                                        <MenuItem value={JobExperience.Undefined}>Không xác định</MenuItem>
                                        <MenuItem value={JobExperience.LessThan1Year}>Dưới 1 năm</MenuItem>
                                        <MenuItem value={JobExperience.From1To2Years}>Từ 1 - 2 năm</MenuItem>
                                        <MenuItem value={JobExperience.From2To3Years}>Từ 2 - 3 năm</MenuItem>
                                        <MenuItem value={JobExperience.From3To5Years}>Từ 3 - 5 năm</MenuItem>
                                        <MenuItem value={JobExperience.From5To10Years}>Từ 5 - 10 năm</MenuItem>
                                        <MenuItem value={JobExperience.Above10Years}>Trên 10 năm</MenuItem>
                                    </TextField>
                                </Grid>
                            </Grid>
                        </Box>

                        <Button
                            type="submit"
                            variant="contained"
                            size="small"
                            fullWidth
                            disabled={submitting}
                            startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <CheckCircleIcon />}
                            sx={{ backgroundColor: "#faa11b", borderRadius: 1 }}
                        >
                            {submitting ? "Đang xử lý..." : "Đăng ký"}
                        </Button>

                        <Typography
                            variant="body2"
                            textAlign="center"
                            sx={{ color: "text.secondary" }}
                        >
                            Bạn muốn tạo tài khoản trường? Đăng ký
                            <Link
                                href="/dang-ky/admin"
                                sx={{ ml: 0.5, }}
                            >
                                tại đây
                            </Link>
                        </Typography>
                    </Stack>
                </Box>
            </Paper>
        </Box>
    );
};

export default StudentSignupForm;