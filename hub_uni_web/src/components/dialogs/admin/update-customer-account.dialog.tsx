import Close from "@mui/icons-material/Close";
import LockOutlined from "@mui/icons-material/LockOutlined";
import PersonOutlined from "@mui/icons-material/PersonOutlined";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../../app/features/snackbar/snackbar.slice";
import { ProfileInfo, UpdateCustomerRequest } from "../../../app/models/customer.model";
import { Gender, AccountStatus } from "../../../app/models/enums.model";
import { AppDispatch } from "../../../app/store";
import { useLazyGetCustomerByIdQuery, useUpdateCustomerMutation } from "../../../app/features/customer.api";
import { ConvertService } from "../../../app/services/convert.service";
import { useGetAllCountryNoAuthenQuery } from "../../../app/features/country.api";
import { useGetProvinceByCountryQuery } from "../../../app/features/province.api";
import { useGetCommunesByProvinceQuery } from "../../../app/features/commune.api";
import { Province } from "../../../app/models/province.model";
import { Country } from "../../../app/models/country.model";

const RequiredStar = () => <Box component="span" sx={{ color: "error.main" }}>*</Box>;

const ACCOUNT_STATUS_OPTIONS = [
    { value: AccountStatus.Activated, label: "Đã kích hoạt" },
    { value: AccountStatus.NotActivated, label: "Chưa kích hoạt" },
    { value: AccountStatus.Locked, label: "Đã khóa" },
];

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

interface UpdateCustomerAccountDialogProps {
    open: boolean;
    customerId: string | null;
    onClose: () => void;
    onSuccess?: () => void;
}

const GENDER_OPTIONS = [
    { value: Gender.Male, label: "Nam" },
    { value: Gender.Female, label: "Nữ" },
    { value: Gender.Other, label: "Khác" },
];

const defaultForm: UpdateCustomerRequest = {
    Id: "",
    FullName: "",
    Email: "",
    PhoneNumber: "",
    AccountStatus: AccountStatus.Undefined,
    RoleIds: [],
    Gender: Gender.Other,
    ProfileInfo: {
        DateOfBirth: "",
        CountryId: "",
        ProvinceId: "",
        CommuneId: "",
        Address: "",
    },
};

interface FormErrors {
    FullName?: string;
    Email?: string;
}

export default function UpdateCustomerAccountDialog({
    open,
    customerId,
    onClose
}: UpdateCustomerAccountDialogProps) {
    const dispatch = useDispatch<AppDispatch>();
    const [form, setForm] = useState<UpdateCustomerRequest>(defaultForm);
    const [errors, setErrors] = useState<FormErrors>({});
    const [selectedCountrySeo, setSelectedCountrySeo] = useState("");
    const [selectedProvinceSeo, setSelectedProvinceSeo] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [updateCustomer, { isLoading: isUpdating }] = useUpdateCustomerMutation();

    const [fetchCustomer, { data: customerData, isFetching }] = useLazyGetCustomerByIdQuery();
    const { data: countries = [] } = useGetAllCountryNoAuthenQuery();
    const { data: provinces = [] } = useGetProvinceByCountryQuery(selectedCountrySeo, { skip: !selectedCountrySeo });
    const { data: communes = [] } = useGetCommunesByProvinceQuery(selectedProvinceSeo, { skip: !selectedProvinceSeo });

    const handleCountryChange = (countryId: string) => {
        const country = countries.find((c: Country) => c.Id === countryId);

        setForm(prev => ({
            ...prev,
            ProfileInfo: {
                ...prev.ProfileInfo,
                CountryId: countryId,
                ProvinceId: "",
                CommuneId: ""
            }
        }));

        setSelectedCountrySeo(country?.SeoUrl ?? "");
        setSelectedProvinceSeo("");
    };

    const handleProvinceChange = (provinceId: string) => {
        const province = provinces.find((p: Province) => p.Id === provinceId);

        setForm(prev => ({
            ...prev,
            ProfileInfo: {
                ...prev.ProfileInfo,
                ProvinceId: provinceId,
                CommuneId: ""
            }
        }));

        setSelectedProvinceSeo(province?.SeoUrl ?? "");
    };

    const handleCommuneChange = (communeId: string) => {
        setForm(prev => ({
            ...prev,
            ProfileInfo: {
                ...prev.ProfileInfo,
                CommuneId: communeId
            }
        }));
    };

    useEffect(() => {
        if (!open || !customerId) return;
        setForm(defaultForm);
        setErrors({});
        setSelectedCountrySeo("");
        setSelectedProvinceSeo("");

        fetchCustomer(customerId, false)
            .unwrap()
            .then((data) => {
                if (!data) return;

                setForm({
                    Id: data.Id,
                    FullName: data.FullName ?? "",
                    Email: data.Email ?? "",
                    PhoneNumber: data.PhoneNumber ?? "",
                    AccountStatus: ConvertService.convertAccountStatusFromString(data.AccountStatus),
                    AccountType: ConvertService.convertAccountTypeFromString(data.AccountType),
                    RoleIds: (data.Roles ?? []).map(r => r.Id),
                    UserName: data.UserName ?? "",
                    OrganizationId: data.OrganizationId ?? "",
                    Gender: ConvertService.convertGenderFromString(data.Gender),
                    ProfileInfo: {
                        DateOfBirth: data.ProfileInfo?.DateOfBirth ?? "",
                        CountryId: data.ProfileInfo?.CountryId ?? "",
                        ProvinceId: data.ProfileInfo?.ProvinceId ?? "",
                        CommuneId: data.ProfileInfo?.CommuneId ?? "",
                        Address: data.ProfileInfo?.Address ?? "",
                    }
                });
            });
    }, [open, customerId]);

    useEffect(() => {
        if (form.ProfileInfo.CountryId && countries.length > 0) {
            const country = countries.find(
                (c: Country) => c.Id === form.ProfileInfo.CountryId
            );

            setSelectedCountrySeo(country?.SeoUrl ?? "");
        }
    }, [form.ProfileInfo.CountryId, countries]);

    useEffect(() => {
        if (form.ProfileInfo.ProvinceId && provinces.length > 0) {
            const province = provinces.find(
                (p: Province) => p.Id === form.ProfileInfo.ProvinceId
            );

            setSelectedProvinceSeo(province?.SeoUrl ?? "");
        }
    }, [form.ProfileInfo.ProvinceId, provinces]);

    const handleChange = (field: keyof UpdateCustomerRequest, value: unknown) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const validate = (): boolean => {
        const newErrors: FormErrors = {};
        if (!form.FullName.trim()) newErrors.FullName = "Họ và tên không được để trống";
        if (!form.Email.trim()) newErrors.Email = "Email không được để trống";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.Email)) newErrors.Email = "Email không hợp lệ";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleClose = () => {
        setForm(defaultForm);
        setErrors({});
        onClose();
    };

    const handleProfileChange = (field: keyof ProfileInfo, value: any) => {
        setForm(prev => ({
            ...prev,
            ProfileInfo: {
                ...prev.ProfileInfo,
                [field]: value
            }
        }));
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        try {
            await updateCustomer({
                ...form,
                ProfileInfo: {
                    ...form.ProfileInfo
                }
            }).unwrap();
            dispatch(showSnackbar({ message: "Cập nhật tài khoản thành công!", severity: "success" }));
            handleClose();
        } catch (err) {
            dispatch(showSnackbar({ message: "Cập nhật tài khoản thất bại. Vui lòng thử lại!", severity: "error" }));
        }
    };

    const isLoading = isFetching || isUpdating;

    const isSaveDisabled = (): boolean => {
        const requiredFieldsInvalid: boolean = !form.FullName.trim() || !form.ProfileInfo.DateOfBirth || !form.Gender || !form.ProfileInfo.CountryId || !form.ProfileInfo.ProvinceId || !form.ProfileInfo.CommuneId || !form.AccountStatus;
        return requiredFieldsInvalid;
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 1 }}>
                <Typography variant="h6" fontWeight={600}>Chỉnh sửa nhân viên</Typography>
                <IconButton onClick={handleClose} size="small"><Close /></IconButton>
            </DialogTitle>
            <Divider />
            <DialogContent>
                {isFetching ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
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
                                        disabled
                                        size="small"
                                        value={form.UserName}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>
                        <Paper sx={{ p: 2, mb: 2 }}>
                            <SectionHeader icon={<PersonOutlined />} title="Thông tin tài khoản" />

                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12 }}>
                                    <TextField
                                        label={<> Họ và tên <RequiredStar /></>}
                                        fullWidth
                                        size="small"
                                        value={form.FullName}
                                        onChange={(e) => handleChange("FullName", e.target.value)}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        label="Email"
                                        fullWidth
                                        size="small"
                                        value={form.Email}
                                        onChange={(e) => handleChange("Email", e.target.value)}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        label="Số điện thoại"
                                        fullWidth
                                        size="small"
                                        value={form.PhoneNumber ?? ""}
                                        onChange={(e) => handleChange("PhoneNumber", e.target.value)}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        type="date"
                                        label={<> Ngày sinh <RequiredStar /></>}
                                        fullWidth
                                        size="small"
                                        InputLabelProps={{ shrink: true }}
                                        value={form.ProfileInfo.DateOfBirth ?? ""}
                                        onChange={(e) => handleProfileChange("DateOfBirth", e.target.value)}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        select
                                        label={<> Giới tính <RequiredStar /></>}
                                        fullWidth
                                        size="small"
                                        value={form.Gender}
                                        onChange={(e) => handleChange("Gender", Number(e.target.value))}
                                    >
                                        {GENDER_OPTIONS.map(opt => (
                                            <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        select
                                        label={<> Quốc gia <RequiredStar /></>}
                                        value={form.ProfileInfo.CountryId}
                                        onChange={(e) => handleCountryChange(e.target.value)}
                                        fullWidth
                                        size="small"
                                    >
                                        {countries.map(c => (
                                            <MenuItem key={c.Id} value={c.Id}>{c.Name}</MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        select
                                        label={<> Tỉnh / Thành phố <RequiredStar /></>}
                                        value={form.ProfileInfo.ProvinceId}
                                        onChange={(e) => handleProvinceChange(e.target.value)}
                                        fullWidth
                                        size="small"
                                        disabled={!selectedCountrySeo}
                                    >
                                        {provinces.map(p => (
                                            <MenuItem key={p.Id} value={p.Id}>{p.Name}</MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        select
                                        label={<> Xã / Phường <RequiredStar /></>}
                                        value={form.ProfileInfo.CommuneId}
                                        onChange={(e) => handleCommuneChange(e.target.value)}
                                        fullWidth
                                        size="small"
                                        disabled={!selectedProvinceSeo}
                                    >
                                        {communes.map(c => (
                                            <MenuItem key={c.Id} value={c.Id}>{c.Name}</MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        label="Địa chỉ cụ thể"
                                        fullWidth
                                        size="small"
                                        value={form.ProfileInfo.Address ?? ""}
                                        onChange={(e) => handleProfileChange("Address", e.target.value)}
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
                    </>
                )}
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
                <Button onClick={handleClose} variant="outlined" color="inherit" disabled={isLoading}>
                    Hủy
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    disabled={isLoading || isSaveDisabled()}
                    startIcon={isUpdating ? <CircularProgress size={16} color="inherit" /> : null}
                >
                    {isUpdating ? "Đang lưu..." : "Lưu"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}