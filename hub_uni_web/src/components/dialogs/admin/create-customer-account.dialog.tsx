import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Grid, IconButton, InputAdornment, CircularProgress, Typography, Divider, Autocomplete, Box, Paper } from "@mui/material";
import { Close, Visibility, VisibilityOff, LockOutlined, PersonOutlined } from "@mui/icons-material";
import { useState } from "react";
import { useCreateCollabAccountMutation } from "../../../app/features/customer.api";
import { CreateCustomerRequest } from "../../../app/models/customer.model";
import { Gender, AccountType, AccountStatus } from "../../../app/models/enums.model";
import { showSnackbar } from "../../../app/features/snackbar/snackbar.slice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../app/store";
import { useGetAllCountryNoAuthenQuery } from "../../../app/features/country.api";
import { useGetProvinceByCountryQuery } from "../../../app/features/province.api";
import { useGetCommunesByProvinceQuery } from "../../../app/features/commune.api";
import { Province } from "../../../app/models/province.model";
import { Country } from "../../../app/models/country.model";

const RequiredStar = () => <Box component="span" sx={{ color: "error.main" }}>*</Box>;

interface CreateCustomerAccountDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const GENDER_OPTIONS = [
    { value: Gender.Male, label: "Nam" },
    { value: Gender.Female, label: "Nữ" },
    { value: Gender.Other, label: "Khác" },
];

const ACCOUNT_STATUS_OPTIONS = [
    { value: AccountStatus.Activated, label: "Đã kích hoạt" },
    { value: AccountStatus.NotActivated, label: "Chưa kích hoạt" },
    { value: AccountStatus.Locked, label: "Đã khóa" },
];

const initialState = {
    UserName: "",
    Password: "",
    ConfirmPassword: "",
    FullName: "",
    Gender: Gender.Other,
    AccountStatus: AccountStatus.Undefined,
    Email: "",
    PhoneNumber: "",
    DateOfBirth: "",
    CountryId: "",
    ProvinceId: "",
    CommuneId: "",
    Address: ""
};

interface FormErrors {
    FullName?: string;
    UserName?: string;
    Password?: string;
    Email?: string;
}

interface SectionHeaderProps {
    icon: React.ReactNode;
    title: string;
}

function SectionHeader({ icon, title }: SectionHeaderProps) {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 2,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 30,
                    height: 30,
                    borderRadius: "8px",
                    bgcolor: "primary.main",
                    color: "white",
                    flexShrink: 0,
                }}
            >
                {icon}
            </Box>
            <Typography
                variant="subtitle2"
                fontWeight={600}
                color="text.primary"
                sx={{ letterSpacing: 0.3 }}
            >
                {title}
            </Typography>
        </Box>
    );
}

export default function CreateCustomerAccountDialog({
    open,
    onClose
}: CreateCustomerAccountDialogProps) {
    const dispatch = useDispatch<AppDispatch>();
    const [form, setForm] = useState(initialState);
    const [errors, setErrors] = useState<FormErrors>({});
    const [showPassword, setShowPassword] = useState(false);
    const [createCollabAccount, { isLoading }] = useCreateCollabAccountMutation();
    const [selectedCountrySeo, setSelectedCountrySeo] = useState("");
    const [selectedProvinceSeo, setSelectedProvinceSeo] = useState("");

    const { data: countries = [] } = useGetAllCountryNoAuthenQuery();
    const { data: provinces = [] } = useGetProvinceByCountryQuery(selectedCountrySeo, { skip: !selectedCountrySeo, });
    const { data: communes = [] } = useGetCommunesByProvinceQuery(selectedProvinceSeo, { skip: !selectedProvinceSeo, });

    const set = (field: string, value: any) => setForm((prev) => ({ ...prev, [field]: value }));

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

    const handleChange = (field: keyof CreateCustomerRequest, value: unknown) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const validate = (): boolean => {
        const newErrors: FormErrors = {};
        if (!form.FullName.trim()) newErrors.FullName = "Họ và tên không được để trống";
        if (!form.UserName.trim()) newErrors.UserName = "Tên đăng nhập không được để trống";
        if (!form.Password.trim()) newErrors.Password = "Mật khẩu không được để trống";
        else if (form.Password.length < 3) newErrors.Password = "Mật khẩu phải có ít nhất 3 ký tự";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.Email)) newErrors.Email = "Email không hợp lệ";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleClose = () => {
        setForm(initialState);
        setErrors({});
        setShowPassword(false);
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const err = validate();
        try {
            await createCollabAccount({
                UserName: form.UserName,
                Password: form.Password,
                FullName: form.FullName,
                Email: form.Email,
                PhoneNumber: form.PhoneNumber,
                AccountStatus: AccountStatus.Activated,
                RoleIds: [""],
                Gender: form.Gender,
                ProfileInfo: {
                    DateOfBirth: form.DateOfBirth,
                    CountryId: form.CountryId,
                    ProvinceId: form.ProvinceId,
                    CommuneId: form.CommuneId,
                    Address: form.Address
                },
            }).unwrap();
            dispatch(showSnackbar({ message: "Thêm nhân viên thành công!", severity: "success" }));
            handleClose();
        } catch {
            dispatch(showSnackbar({ message: "Thêm nhân viên thất bại!", severity: "error" }));
        }
    };

    const isSaveDisabled = (): boolean => {
        const requiredFieldsInvalid: boolean = !form.UserName.trim() || !form.Password.trim() || !form.FullName.trim() || !form.DateOfBirth || !form.Gender || !form.CountryId || !form.ProvinceId || !form.CommuneId || !form.AccountStatus;
        return requiredFieldsInvalid;
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            PaperProps={{ sx: { borderRadius: 2 } }}
        >
            <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 1 }}>
                <Typography fontWeight={600}>Thêm nhân viên mới</Typography>
                <IconButton onClick={handleClose} size="small"><Close /></IconButton>
            </DialogTitle>
            <Divider />

            <DialogContent sx={{ pt: 1, pb: 1 }}>
                <Paper
                    variant="outlined"
                    sx={{ p: 2, mb: 2.5, borderRadius: 2 }}
                >
                    <SectionHeader
                        icon={<LockOutlined sx={{ fontSize: 16 }} />}
                        title="Thông tin đăng nhập"
                    />
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                label={<> Tên đăng nhập <RequiredStar /> </>}
                                fullWidth
                                size="small"
                                value={form.UserName}
                                onChange={(e) => handleChange("UserName", e.target.value)}
                                error={!!errors.UserName}
                                helperText={errors.UserName}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                label={<> Mật khẩu <RequiredStar /> </>}
                                type={showPassword ? "text" : "password"}
                                fullWidth
                                size="small"
                                value={form.Password}
                                onChange={(e) => handleChange("Password", e.target.value)}
                                error={!!errors.Password}
                                helperText={errors.Password}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton size="small" onClick={() => setShowPassword((v) => !v)} edge="end">
                                                {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                    </Grid>
                </Paper>

                <Paper
                    variant="outlined"
                    sx={{ p: 2, borderRadius: 2 }}
                >
                    <SectionHeader
                        icon={<PersonOutlined sx={{ fontSize: 16 }} />}
                        title="Thông tin tài khoản"
                    />
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label={<> Họ và tên <RequiredStar /> </>}
                                fullWidth
                                size="small"
                                value={form.FullName}
                                onChange={(e) => handleChange("FullName", e.target.value)}
                                error={!!errors.FullName}
                                helperText={errors.FullName}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                label="Email"
                                fullWidth
                                size="small"
                                value={form.Email}
                                onChange={(e) => handleChange("Email", e.target.value)}
                                error={!!errors.Email}
                                helperText={errors.Email}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                label="Số điện thoại"
                                fullWidth
                                size="small"
                                value={form.PhoneNumber ?? ""}
                                onChange={(e) => handleChange("PhoneNumber", e.target.value || null)}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                label={<> Ngày sinh <RequiredStar /> </>}
                                type="date"
                                value={form.DateOfBirth}
                                onChange={(e) => set("DateOfBirth", e.target.value)}
                                fullWidth
                                size="small"
                                InputLabelProps={{ shrink: true }} />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                select
                                label={<> Giới tính <RequiredStar /> </>}
                                fullWidth
                                size="small"
                                value={form.Gender}
                                onChange={(e) => set("Gender", Number(e.target.value))}
                            >
                                {GENDER_OPTIONS.map((opt) => (
                                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}><TextField select label={<> Quốc gia <RequiredStar /> </>} value={form.CountryId}
                            onChange={(e) => handleCountryChange(e.target.value)}
                            fullWidth size="small">
                            {countries.map((c: Country) => (<MenuItem key={c.Id} value={c.Id}>{c.Name}</MenuItem>))}
                        </TextField></Grid>
                        <Grid size={{ xs: 12, sm: 6 }}><TextField select label={<> Tỉnh / Thành phố <RequiredStar /> </>} value={form.ProvinceId}
                            onChange={(e) => handleProvinceChange(e.target.value)}
                            fullWidth size="small" disabled={!selectedCountrySeo}>
                            {provinces.map((p: Province) => (<MenuItem key={p.Id} value={p.Id}>{p.Name}</MenuItem>))}
                        </TextField></Grid>
                        <Grid size={{ xs: 12, sm: 6 }}><TextField select label={<> Xã / Phường <RequiredStar /> </>} value={form.CommuneId}
                            onChange={(e) => set("CommuneId", e.target.value)}
                            fullWidth size="small" disabled={!selectedProvinceSeo}>
                            {communes.map((c) => (<MenuItem key={c.Id} value={c.Id}>{c.Name}</MenuItem>))}
                        </TextField></Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                size="small"
                                fullWidth
                                label="Địa chỉ cụ thể"
                                onChange={(e) =>
                                    setForm(prev => ({
                                        ...prev,
                                        Address: e.target.value
                                    }))
                                }
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                select
                                label={<> Trạng thái <RequiredStar /> </>}
                                fullWidth
                                size="small"
                                value={form.AccountStatus}
                                onChange={(e) => handleChange("AccountStatus", Number(e.target.value))}
                            >
                                {ACCOUNT_STATUS_OPTIONS.map((opt) => (
                                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    </Grid>
                </Paper>
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
                    disabled={isLoading || isSaveDisabled()}
                    startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : null}
                >
                    {isLoading ? "Đang tạo..." : "Lưu"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}