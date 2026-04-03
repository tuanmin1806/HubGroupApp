import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
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
import labelsVi from "../../i18n/labels.vi";

const GENDER_OPTIONS = [
    { value: Gender.Male, label: "Nam" },
    { value: Gender.Female, label: "Nữ" },
    { value: Gender.Other, label: "Khác" },
];

const jobExperienceOptions = [
    { value: JobExperience.Undefined, label: "Không có" },
    { value: JobExperience.LessThan1Year, label: "< 1 năm" },
    { value: JobExperience.From1To2Years, label: "1-2 năm" },
    { value: JobExperience.From2To3Years, label: "2-3 năm" },
    { value: JobExperience.From3To5Years, label: "3-5 năm" },
    { value: JobExperience.From5To10Years, label: "5-10 năm" },
    { value: JobExperience.Above10Years, label: "> 10 năm" },
];

const educationLevelOptions = [
    { value: EducationLevel.Undefined, label: "Không có" },
    { value: EducationLevel.PrimarySchool, label: "Tiểu học" },
    { value: EducationLevel.MiddleSchool, label: "THCS" },
    { value: EducationLevel.HighSchool, label: "THPT" },
    { value: EducationLevel.VocationalSchool, label: "Trung cấp" },
    { value: EducationLevel.College, label: "Cao đẳng" },
    { value: EducationLevel.University, label: "Đại học" },
    { value: EducationLevel.Postgraduate, label: "Sau đại học" },
];

const RequiredStar = () => <Box component="span" sx={{ color: "error.main" }}>*</Box>;

const initialState = {
    UserName: "",
    Password: "",
    ConfirmPassword: "",
    FullName: "",
    Gender: Gender.Other,
    Email: "",
    PhoneNumber: "",
    DateOfBirth: "",
    Experience: JobExperience.Undefined,
    EducationLevel: EducationLevel.Undefined,
    CountryId: "",
    ProvinceId: "",
    CommuneId: "",
    Address: ""
};
const labels = labelsVi.studentRegister;
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
        if (!form.UserName.trim()) return labels.usernameRequired;
        if (form.UserName.trim().length < 3) return labels.usernameLengthRequired;
        if (!form.Password) return labels.passwordRequired;
        if (form.Password !== form.ConfirmPassword) return labels.passwordMismatch;
        if (!form.FullName.trim()) return labels.fullNameRequired;
        if (!form.PhoneNumber.trim()) return labels.phoneNumberRequired;
        if (!form.DateOfBirth) return labels.dateOfBirthRequired;
        if (!form.CountryId) return labels.countryRequired;
        if (!form.ProvinceId) return labels.provinceRequired;
        if (!form.CommuneId) return labels.communeRequired;
        if (!form.Address.trim()) return labels.addressRequired;
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
            setError(labels.registerFailed);
        } finally {
            setSubmitting(false);
        }
    };

    if (submitSuccess) {
        return (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "40vh", gap: 2 }}>
                <CheckCircleIcon sx={{ fontSize: 72, color: "#008631" }} />
                <Typography variant="h5" fontWeight={700} color="#008631">{labels.registerSuccess}</Typography>
                <Button variant="contained" onClick={() => navigate("/dang-nhap")} sx={{ mt: 1, backgroundColor: "#faa11b", px: 3, fontWeight: 600, "&:hover": { backgroundColor: "#fcb448ff" } }}> Đăng nhập </Button>
            </Box>
        );
    }
    return (
        <Box sx={{ maxWidth: 600, mx: "auto", px: { xs: 0.5, sm: 0.5 }, py: { xs: 0.5, sm: 0.5 } }}>
            <Typography variant="h5" fontWeight={700} textAlign="center" color="#faa11b" mb={0.5}> {labels.registerTitle} </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center" mb={1}> {labels.registerDescription} </Typography>

            {error && (<Alert severity="error" sx={{ mb: 1 }} onClose={() => setError("")}>{error}</Alert>)}

            <Paper elevation={0}>
                <Box component="form" onSubmit={handleSubmit} onKeyDown={(e) => { if (e.key === "Enter") e.preventDefault(); }}>
                    <Stack spacing={2}>
                        <Box>
                            <Typography variant="subtitle2" fontWeight={600} color="#faa11b" mb={1}> {labels.accountInfo} </Typography>
                            <Grid container spacing={2.5}>
                                <Grid size={{ xs: 12 }}> <TextField label={<> {labels.username} <RequiredStar /></>} size="small" fullWidth value={form.UserName} onChange={(e) => set("UserName", e.target.value)} /> </Grid>
                                <Grid size={{ xs: 12 }}> <TextField label={<> {labels.password} <RequiredStar /></>} type="password" size="small" fullWidth value={form.Password} onChange={(e) => set("Password", e.target.value)} /></Grid>
                                <Grid size={{ xs: 12 }}> <TextField label={<> {labels.confirmPassword} <RequiredStar /></>} type="password" size="small" fullWidth value={form.ConfirmPassword} onChange={(e) => set("ConfirmPassword", e.target.value)} error={!!form.ConfirmPassword && form.Password !== form.ConfirmPassword} helperText={form.ConfirmPassword && form.Password !== form.ConfirmPassword ? labels.passwordMismatch : ""} /></Grid>
                            </Grid>
                        </Box>

                        <Box>
                            <Typography variant="subtitle2" fontWeight={600} color="#faa11b" mb={1}> {labels.personalInfo} </Typography>
                            <Grid container spacing={2.5}>
                                <Grid size={{ xs: 12 }}> <TextField label={<> {labels.fullName} <RequiredStar /></>} size="small" fullWidth value={form.FullName} onChange={(e) => set("FullName", e.target.value)} /></Grid>
                                <Grid size={{ xs: 12, sm: 6 }}> <TextField label={<> {labels.email}</>} type="email" size="small" fullWidth value={form.Email} onChange={(e) => set("Email", e.target.value)} /></Grid>
                                <Grid size={{ xs: 12, sm: 6 }}> <TextField label={<> {labels.phoneNumber} <RequiredStar /></>} size="small" fullWidth value={form.PhoneNumber} onChange={(e) => set("PhoneNumber", e.target.value)} /></Grid>
                                <Grid size={{ xs: 12, sm: 6 }}> <TextField select label={<> {labels.gender} <RequiredStar /></>} size="small" fullWidth value={form.Gender} onChange={(e) => set("Gender", e.target.value)}>
                                    {GENDER_OPTIONS.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}> <TextField label={<> {labels.dateOfBirth} <RequiredStar /></>} type="date" value={form.DateOfBirth} onChange={(e) => set("DateOfBirth", e.target.value)} fullWidth size="small" InputLabelProps={{ shrink: true }} /></Grid>
                                <Grid size={{ xs: 12, sm: 6 }}><TextField select label={<> {labels.country} <RequiredStar /></>} value={form.CountryId} onChange={(e) => handleCountryChange(e.target.value)} fullWidth size="small">{countries.map((c: Country) => (<MenuItem key={c.Id} value={c.Id}>{c.Name}</MenuItem>))}</TextField></Grid>
                                <Grid size={{ xs: 12, sm: 6 }}><TextField select label={<> {labels.province} <RequiredStar /></>} value={form.ProvinceId} onChange={(e) => handleProvinceChange(e.target.value)} fullWidth size="small" disabled={!selectedCountrySeo}>{provinces.map((p: Province) => (<MenuItem key={p.Id} value={p.Id}>{p.Name}</MenuItem>))}</TextField></Grid>
                                <Grid size={{ xs: 12, sm: 6 }}><TextField select label={<> {labels.commune} <RequiredStar /></>} value={form.CommuneId} onChange={(e) => set("CommuneId", e.target.value)} fullWidth size="small" disabled={!selectedProvinceSeo}>{communes.map((c) => (<MenuItem key={c.Id} value={c.Id}>{c.Name}</MenuItem>))}</TextField></Grid>
                                <Grid size={{ xs: 12 }}><TextField label={<> {labels.address} <RequiredStar /></>} value={form.Address} onChange={(e) => set("Address", e.target.value)} fullWidth size="small" /></Grid>
                            </Grid>
                        </Box>

                        <Box>
                            <Typography variant="subtitle2" fontWeight={600} color="#faa11b" mb={2}> {labels.educationLevel} & {labels.experience} </Typography>
                            <Grid container spacing={1.5}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField select label={<> {labels.educationLevel}</>} size="small" fullWidth value={form.EducationLevel} onChange={(e) => set("EducationLevel", e.target.value)}>
                                        {educationLevelOptions.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField select label={<> {labels.experience}</>} size="small" fullWidth value={form.Experience} onChange={(e) => set("Experience", e.target.value)}>
                                        {jobExperienceOptions.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                            </Grid>
                        </Box>

                        <Button
                            type="submit"
                            variant="contained"
                            size="medium"
                            fullWidth
                            disabled={submitting}
                            startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <CheckCircleIcon />}
                            sx={{ backgroundColor: "#faa11b", borderRadius: 1 }}
                        >
                            {submitting ? labels.submitting : labels.register}
                        </Button>

                        <Typography
                            variant="body2"
                            textAlign="center"
                            sx={{ color: "text.secondary" }}
                        >
                            {labels.wantToCreateSchoolAccount}
                            <Link
                                href="/dang-ky/admin"
                                sx={{ ml: 0.5, }}
                            >
                                {labels.here}
                            </Link>
                        </Typography>
                    </Stack>
                </Box>
            </Paper>
        </Box>
    );
};

export default StudentSignupForm;