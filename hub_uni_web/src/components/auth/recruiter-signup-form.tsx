import { Box, Stack, Typography, TextField, Button, MenuItem, Stepper, Step, StepLabel, CircularProgress, Grid, Alert, Autocomplete, Divider, Chip } from "@mui/material";
import { useState, useCallback, useRef } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useRecruiterRegisterMutation } from "../../app/features/auth/auth.api";
import { useGetAllProvinceNoAuthenQuery } from "../../app/features/province.api";
import { useGetCommunesByProvinceQuery } from "../../app/features/commune.api";
import { useGetOrganizationTypesByPageQuery } from "../../app/features/organization-type.api";
import { useLazyOrganizationsNameSearchQuery, useLazyGetOrganizationBySeoQuery } from "../../app/features/organization.api";
import { Province } from "../../app/models/province.model";
import { OrganizationResponse } from "../../app/models/organization.model";
import { Gender, AccountStatus } from "../../app/models/enums.model";
import { RecruiterRegisterRequestBody } from "../../app/models/auth.model";
import { DEFAULT_PAGE } from "../../constants/common.constant";
import LogoImage from "../../assets/hub_logo.png";
import { useNavigate } from "react-router-dom";

const PAGE_SIZE = 100;
const STEPS = ["Thông tin tài khoản", "Thông tin trường"];
const DEBOUNCE_DELAY = 2000;

const RequiredStar = () => <Box component="span" sx={{ color: "error.main" }}>*</Box>;

const RecruiterSignupForm = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [error, setError] = useState("");
    const [selectedProvinceSeo, setSelectedProvinceSeo] = useState("");
    const navigate = useNavigate();

    const [orgSearchInput, setOrgSearchInput] = useState("");
    const [orgOptions, setOrgOptions] = useState<OrganizationResponse[]>([]);
    const [orgSearchLoading, setOrgSearchLoading] = useState(false);
    const [orgSearchDone, setOrgSearchDone] = useState(false);
    const [selectedOrg, setSelectedOrg] = useState<OrganizationResponse | null>(null);
    const [orgDetailLoading, setOrgDetailLoading] = useState(false);
    const [isNewOrg, setIsNewOrg] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const { data: provinces = [] } = useGetAllProvinceNoAuthenQuery();
    const { data: communes = [] } = useGetCommunesByProvinceQuery(selectedProvinceSeo, { skip: !selectedProvinceSeo });
    const { data: orgTypesData } = useGetOrganizationTypesByPageQuery({ page: DEFAULT_PAGE, size: PAGE_SIZE });
    const orgTypes = orgTypesData?.Items ?? [];

    const [registerRecruiter] = useRecruiterRegisterMutation();
    const [searchOrgs] = useLazyOrganizationsNameSearchQuery();
    const [getOrgBySeo] = useLazyGetOrganizationBySeoQuery();

    const [form, setForm] = useState({
        UserName: "", Password: "", ConfirmPassword: "", FullName: "",
        Gender: Gender.Other, Email: "", PhoneNumber: "",
        OrganizationTypeId: "", OrgName: "",
        ProvinceId: "", CommuneId: "", Address: "", OrgPhoneNumber: "", OrgEmail: "",
    });

    const set = (field: string, value: any) => setForm((prev) => ({ ...prev, [field]: value }));

    const handleProvinceChange = (provinceId: string) => {
        const province = provinces.find((p: Province) => p.Id === provinceId);
        set("ProvinceId", provinceId);
        set("CommuneId", "");
        setSelectedProvinceSeo(province?.SeoUrl ?? "");
    };

    const resetOrgForm = () => { setForm((prev) => ({ ...prev, OrgName: "", OrganizationTypeId: "", ProvinceId: "", CommuneId: "", Address: "", OrgPhoneNumber: "", OrgEmail: "", })); setSelectedProvinceSeo(""); };

    const handleOrgInputChange = useCallback((_: any, value: string) => {
        setOrgSearchInput(value);
        setSelectedOrg(null);
        setIsNewOrg(false);
        setOrgSearchDone(false);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        if (!value.trim()) { setOrgOptions([]); return; }
        setOrgSearchLoading(true);
        debounceRef.current = setTimeout(async () => {
            try {
                const result = await searchOrgs({ page: DEFAULT_PAGE, size: 10, searchValue: value }).unwrap();
                setOrgOptions(result.Items ?? []);
            } catch {
                setOrgOptions([]);
            } finally {
                setOrgSearchLoading(false);
                setOrgSearchDone(true);
            }
        }, DEBOUNCE_DELAY);
    }, [searchOrgs]);

    const handleOrgSelect = useCallback(async (_: any, value: OrganizationResponse | string | null) => {
        const org = value && typeof value !== "string" ? value : null;
        setSelectedOrg(org);
        setIsNewOrg(false);

        if (!org) { resetOrgForm(); return; }

        setOrgDetailLoading(true);
        try {
            const detail = await getOrgBySeo(org.Code).unwrap();
            const province = provinces.find((p: Province) => p.Id === detail.ProvinceId);
            setSelectedProvinceSeo(province?.SeoUrl ?? "");
            setForm((prev) => ({
                ...prev,
                OrgName: detail.Name ?? "",
                OrganizationTypeId: detail.OrganizationTypeId ?? "",
                ProvinceId: detail.ProvinceId ?? "",
                CommuneId: detail.CommuneId ?? "",
                Address: detail.Address ?? "",
                OrgPhoneNumber: detail.PhoneNumber ?? "",
                OrgEmail: detail.Email ?? "",
            }));
        } catch {
            setError("Không thể tải thông tin trường. Vui lòng thử lại.");
        } finally { setOrgDetailLoading(false); }
    }, [getOrgBySeo, provinces]);

    const handleCreateNewOrg = () => {
        setIsNewOrg(true);
        setSelectedOrg(null);
        setOrgSearchDone(false);
        setForm((prev) => ({ ...prev, OrgName: orgSearchInput, OrganizationTypeId: "", ProvinceId: "", CommuneId: "", Address: "", OrgPhoneNumber: "", OrgEmail: "", }));
        setSelectedProvinceSeo("");
    };

    const handleClearOrg = () => {
        setSelectedOrg(null);
        setIsNewOrg(false);
        setOrgSearchInput("");
        setOrgOptions([]);
        setOrgSearchDone(false);
        resetOrgForm();
    };

    const validateStep = (step: number): string => {
        if (step === 0) {
            if (!form.UserName.trim()) return "Vui lòng nhập tên đăng nhập";
            if (!form.Password) return "Vui lòng nhập mật khẩu";
            if (form.Password !== form.ConfirmPassword) return "Mật khẩu xác nhận không khớp";
            if (!form.FullName.trim()) return "Vui lòng nhập họ và tên";
            if (!form.PhoneNumber.trim()) return "Vui lòng nhập số điện thoại liên hệ";
            if (!form.Email.trim()) return "Vui lòng nhập email";
        }
        if (step === 1) {
            if (!selectedOrg && !isNewOrg) return "Vui lòng chọn hoặc tạo mới trường";
            if (isNewOrg && !form.OrgName.trim()) return "Vui lòng nhập tên trường";
        }
        return "";
    };

    const handleNext = () => {
        const err = validateStep(activeStep);
        if (err) { setError(err); return; }
        setError("");
        setActiveStep((s) => s + 1);
    };

    const handleBack = () => { setError(""); setActiveStep((s) => s - 1); };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const err = validateStep(activeStep);
        if (err) { setError(err); return; }
        setError("");
        setSubmitting(true);
        try {
            let payload: RecruiterRegisterRequestBody;

            if (selectedOrg) {
                payload = {
                    CustomerModel: {
                        UserName: form.UserName, Password: form.Password, FullName: form.FullName,
                        Gender: form.Gender, Email: form.Email, PhoneNumber: form.PhoneNumber,
                        AccountStatus: AccountStatus.Activated,
                    },
                    OrganizationId: selectedOrg.Id,
                } as RecruiterRegisterRequestBody;
            } else {
                payload = {
                    CustomerModel: {
                        UserName: form.UserName, Password: form.Password, FullName: form.FullName,
                        Gender: form.Gender, Email: form.Email, PhoneNumber: form.PhoneNumber,
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
                };
            }

            await registerRecruiter(payload).unwrap();
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
                <CheckCircleIcon sx={{ fontSize: 72, color: "#008631" }} />
                <Typography variant="h5" fontWeight={700} color="#008631">Đăng ký thành công!</Typography>
                <Typography color="#008631">Tài khoản của bạn đang chờ phê duyệt.</Typography>
                <Button variant="contained" onClick={() => navigate("/dang-nhap")} sx={{ mt: 1, backgroundColor: "#008631", px: 3, fontWeight: 600, "&:hover": { backgroundColor: "#09a743" } }}> Đăng nhập </Button>
            </Box>
        );
    }

    const showCreateNewButton = orgSearchDone && !orgSearchLoading && orgOptions.length === 0 && orgSearchInput.trim().length > 0 && !selectedOrg && !isNewOrg;

    return (
        <Box sx={{ maxWidth: 720, mx: "auto", px: { xs: 2, sm: 3 }, py: { xs: 3, sm: 4 } }}>

            <Stack alignItems="center" spacing={1} mb={2}>
                <Box component="img" src={LogoImage} sx={{ height: { xs: 32, sm: 48 }, objectFit: "contain" }} />
                <Typography variant="h5" fontWeight={700} sx={{ color: "#faa11b", textAlign: "center" }}>Đăng ký thông tin</Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", textAlign: "center", maxWidth: 420 }}>  Vui lòng điền đầy đủ thông tin để tạo tài khoản </Typography>
            </Stack>

            <Stepper
                activeStep={activeStep} alternativeLabel
                sx={{ mb: 2, "& .MuiStepIcon-root.Mui-active": { color: "#faa11b" }, "& .MuiStepIcon-root.Mui-completed": { color: "#faa11b" } }}
            >
                {STEPS.map((label) => (<Step key={label}> <StepLabel sx={{ "& .MuiStepLabel-label": { fontSize: { xs: "0.75rem", sm: "0.85rem" } } }}>{label}</StepLabel> </Step>))}
            </Stepper>

            {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>{error}</Alert>}

            <Box component="form" onSubmit={handleSubmit}>
                {activeStep === 0 && (
                    <Stack spacing={2}>
                        <Box>
                            <Typography fontWeight={600} color="#faa11b" mb={2}>Thông tin đăng nhập</Typography>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12 }}> <TextField label={<>Tên đăng nhập <RequiredStar /></>} value={form.UserName} onChange={(e) => set("UserName", e.target.value)} fullWidth size="small" /> </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}> <TextField label={<>Mật khẩu <RequiredStar /></>} type="password" value={form.Password} onChange={(e) => set("Password", e.target.value)} fullWidth size="small" /> </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        label={<>Xác nhận mật khẩu <RequiredStar /></>} type="password"
                                        value={form.ConfirmPassword} onChange={(e) => set("ConfirmPassword", e.target.value)}
                                        fullWidth size="small"
                                        error={!!form.ConfirmPassword && form.Password !== form.ConfirmPassword}
                                        helperText={form.ConfirmPassword && form.Password !== form.ConfirmPassword ? "Không khớp" : ""}
                                    />
                                </Grid>
                            </Grid>
                        </Box>

                        <Box>
                            <Typography fontWeight={600} color="#faa11b" mb={2}>Thông tin cá nhân</Typography>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12 }}> <TextField label={<>Họ và tên <RequiredStar /></>} value={form.FullName} onChange={(e) => set("FullName", e.target.value)} fullWidth size="small" /></Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField select label="Giới tính" value={form.Gender} onChange={(e) => set("Gender", e.target.value)} fullWidth size="small">
                                        <MenuItem value={Gender.Male}>Nam</MenuItem>
                                        <MenuItem value={Gender.Female}>Nữ</MenuItem>
                                        <MenuItem value={Gender.Other}>Khác</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}> <TextField label={<>Số điện thoại liên hệ <RequiredStar /></>} value={form.PhoneNumber} onChange={(e) => set("PhoneNumber", e.target.value)} fullWidth size="small" /> </Grid>
                                <Grid size={{ xs: 12 }}> <TextField label={<>Email liên hệ <RequiredStar /></>} type="email" value={form.Email} onChange={(e) => set("Email", e.target.value)} fullWidth size="small" /></Grid>
                            </Grid>
                        </Box>
                    </Stack>
                )}

                {activeStep === 1 && (
                    <Stack spacing={2}>
                        <Typography fontWeight={600} color="#faa11b">Thông tin trường</Typography>

                        <Box>
                            <Autocomplete<OrganizationResponse, false, false, true>
                                freeSolo
                                options={orgOptions}
                                getOptionLabel={(opt) => (typeof opt === "string" ? opt : opt.Name)}
                                inputValue={orgSearchInput}
                                onInputChange={handleOrgInputChange}
                                onChange={handleOrgSelect}
                                loading={orgSearchLoading}
                                filterOptions={(x) => x}
                                noOptionsText="Không tìm thấy trường phù hợp"
                                renderOption={(props, option) => (
                                    <Box component="li" {...props} key={option.Id}>
                                        <Stack>
                                            <Typography variant="body2" fontWeight={600}>{option.Name}</Typography>
                                            {option.Address && <Typography variant="caption" color="text.secondary">{option.Address}</Typography>}
                                        </Stack>
                                    </Box>
                                )}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        size="small"
                                        placeholder="Nhập tên trường để tìm kiếm..."
                                        InputProps={{
                                            ...params.InputProps,
                                            startAdornment: <SearchIcon sx={{ color: "text.disabled", mr: 0.5, fontSize: 18 }} />,
                                            endAdornment: (
                                                <>
                                                    {orgSearchLoading && <CircularProgress size={16} />}
                                                    {params.InputProps.endAdornment}
                                                </>
                                            ),
                                        }}
                                    />
                                )}
                            />

                            {orgSearchLoading && (
                                <Box mt={1} display="flex" alignItems="center" gap={1}>
                                    <CircularProgress size={14} sx={{ color: "#faa11b" }} />
                                    <Typography variant="caption" color="text.secondary">Đang tìm kiếm...</Typography>
                                </Box>
                            )}

                            {showCreateNewButton && (
                                <Box mt={1.5} display="flex" alignItems="center" gap={1}>
                                    <Typography variant="body2" color="text.secondary">Không tìm thấy trường phù hợp.</Typography>
                                    <Button
                                        size="small"
                                        startIcon={<AddCircleOutlineIcon />}
                                        onClick={handleCreateNewOrg}
                                        sx={{ color: "#faa11b", fontWeight: 600, p: 0, minWidth: "auto", textTransform: "none" }}
                                    >
                                        Tạo mới "{orgSearchInput}"
                                    </Button>
                                </Box>
                            )}

                            {selectedOrg && (
                                <Box mt={1} display="flex" alignItems="center" gap={1} flexWrap="wrap">
                                    <Chip size="small" label={`Đã chọn: ${selectedOrg.Name}`} color="success" variant="outlined" onDelete={handleClearOrg} />
                                    <Typography variant="caption" color="text.secondary">Thông tin trường đã được điền tự động</Typography>
                                </Box>
                            )}
                            {isNewOrg && (
                                <Box mt={1} display="flex" alignItems="center" gap={1} flexWrap="wrap">
                                    <Chip size="small" label="Tạo trường mới" color="warning" variant="outlined" onDelete={handleClearOrg} />
                                    <Typography variant="caption" color="text.secondary">Vui lòng điền đầy đủ thông tin bên dưới</Typography>
                                </Box>
                            )}
                        </Box>

                        {(selectedOrg || isNewOrg) && (
                            <Box>
                                {orgDetailLoading ? (
                                    <Box display="flex" justifyContent="center" py={3}>
                                        <CircularProgress size={28} sx={{ color: "#faa11b" }} />
                                    </Box>
                                ) : (
                                    <>
                                        <Divider sx={{ mb: 2 }}>
                                            <Typography variant="caption" color="text.secondary"> {selectedOrg ? "Thông tin trường (xem trước)" : "Thông tin trường mới"} </Typography>
                                        </Divider>
                                        <Grid container spacing={2}>
                                            <Grid size={{ xs: 12 }}>
                                                <TextField label={<>Tên trường <RequiredStar /></>} value={form.OrgName} onChange={(e) => set("OrgName", e.target.value)} fullWidth size="small" disabled={!!selectedOrg} />
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <TextField select label="Loại trường" value={form.OrganizationTypeId} onChange={(e) => set("OrganizationTypeId", e.target.value)} fullWidth size="small" disabled={!!selectedOrg}>
                                                    {orgTypes.map((ot) => <MenuItem key={ot.Id} value={ot.Id}>{ot.Name}</MenuItem>)}
                                                </TextField>
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <TextField select label="Tỉnh / Thành phố" value={form.ProvinceId} onChange={(e) => handleProvinceChange(e.target.value)} fullWidth size="small" disabled={!!selectedOrg}>
                                                    {provinces.map((p: Province) => <MenuItem key={p.Id} value={p.Id}>{p.Name}</MenuItem>)}
                                                </TextField>
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <TextField select label="Quận / Xã" value={form.CommuneId} onChange={(e) => set("CommuneId", e.target.value)} fullWidth size="small" disabled={!!selectedOrg || !selectedProvinceSeo}>
                                                    {communes.map((c) => <MenuItem key={c.Id} value={c.Id}>{c.Name}</MenuItem>)}
                                                </TextField>
                                            </Grid>
                                            <Grid size={{ xs: 12 }}>
                                                <TextField label="Địa chỉ" value={form.Address} onChange={(e) => set("Address", e.target.value)} fullWidth size="small" disabled={!!selectedOrg} />
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <TextField label="SĐT trường" value={form.OrgPhoneNumber} onChange={(e) => set("OrgPhoneNumber", e.target.value)} fullWidth size="small" disabled={!!selectedOrg} />
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <TextField label="Email trường" type="email" value={form.OrgEmail} onChange={(e) => set("OrgEmail", e.target.value)} fullWidth size="small" disabled={!!selectedOrg} />
                                            </Grid>
                                        </Grid>
                                    </>
                                )}
                            </Box>
                        )}
                    </Stack>
                )}

                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4, gap: 1 }}>
                    <Button type="button" variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleBack} disabled={activeStep === 0}
                        sx={{ minWidth: 110, borderColor: "#faa11b", color: "#faa11b" }}>
                        Quay lại
                    </Button>

                    {activeStep < STEPS.length - 1 ? (
                        <Button type="button" variant="contained" endIcon={<ArrowForwardIcon />} onClick={handleNext}
                            sx={{ minWidth: 110, backgroundColor: "#faa11b", "&:hover": { backgroundColor: "#e28e13" } }}>
                            Tiếp theo
                        </Button>
                    ) : (
                        <Button type="button" onClick={handleSubmit} variant="contained" disabled={submitting}
                            sx={{ minWidth: 150, backgroundColor: "#faa11b", "&:hover": { backgroundColor: "#e28e13" } }}
                            startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : <CheckCircleIcon />}>
                            {submitting ? "Đang xử lý..." : "Hoàn tất đăng ký"}
                        </Button>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default RecruiterSignupForm;