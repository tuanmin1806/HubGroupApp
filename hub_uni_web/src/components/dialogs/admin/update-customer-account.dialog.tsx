import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Grid, IconButton, CircularProgress, Typography, Divider, Box, Paper } from "@mui/material";
import { Close, LocationOn, PersonOutlined } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../../app/features/snackbar/snackbar.slice";
import { ProfileInfo, UpdateCustomerRequest } from "../../../app/models/customer.model";
import { Gender, AccountType, AccountStatus } from "../../../app/models/enums.model";
import { AppDispatch } from "../../../app/store";
import { useGetCustomerByIdQuery, useUpdateCustomerMutation } from "../../../app/features/customer.api";
import { ConvertService } from "../../../app/services/convert.service";
import { useGetAllCountryNoAuthenQuery } from "../../../app/features/country.api";
import { useGetProvinceByCountryQuery } from "../../../app/features/province.api";
import { useGetCommunesByProvinceQuery } from "../../../app/features/commune.api";
import { Province } from "../../../app/models/province.model";
import { Country } from "../../../app/models/country.model";


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
    Gender: Gender.Other,
    AccountStatus: AccountStatus.Undefined,
    RoleIds: [],
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
    const [updateCustomer, { isLoading: isUpdating }] = useUpdateCustomerMutation();

    const { data: customerData, isFetching } = useGetCustomerByIdQuery(customerId ?? "", { skip: !customerId || !open });
    const { data: countries = [] } = useGetAllCountryNoAuthenQuery();
    const { data: provinces = [] } = useGetProvinceByCountryQuery(
        selectedCountrySeo,
        { skip: !selectedCountrySeo }
    );

    const { data: communes = [] } = useGetCommunesByProvinceQuery(
        selectedProvinceSeo,
        { skip: !selectedProvinceSeo }
    );

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
        if (customerData) {
            setForm({
                Id: customerData.Id,
                FullName: customerData.FullName ?? "",
                Email: customerData.Email ?? "",
                PhoneNumber: customerData.PhoneNumber ?? "",
                Gender: ConvertService.convertGenderFromString(customerData.Gender),
                AccountStatus: ConvertService.convertAccountStatusFromString(customerData.AccountStatus),
                AccountType: ConvertService.convertAccountTypeFromString(customerData.AccountType),
                RoleIds: (customerData.Roles ?? []).map(r => r.Id),
                UserName: customerData.UserName ?? "",
                OrganizationId: customerData.OrganizationId ?? "",
                ProfileInfo: {
                    DateOfBirth: customerData.ProfileInfo?.DateOfBirth ?? "",
                    CountryId: customerData.ProfileInfo?.CountryId ?? "",
                    ProvinceId: customerData.ProfileInfo?.ProvinceId ?? "",
                    CommuneId: customerData.ProfileInfo?.CommuneId ?? "",
                    Address: customerData.ProfileInfo?.Address ?? "",
                }
            });
        }
    }, [customerData]);

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

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 1 }}>
                <Typography variant="h6" fontWeight={600}>Chỉnh sửa nhân viên</Typography>
                <IconButton onClick={handleClose} size="small"><Close /></IconButton>
            </DialogTitle>
            <Divider />

            <Paper sx={{ p: 2, mb: 2 }}>
                <SectionHeader icon={<PersonOutlined />} title="Thông tin tài khoản" />

                <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            label="Họ và tên"
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
                            label="Ngày sinh"
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
                            label="Giới tính"
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
                </Grid>
            </Paper>

            <Divider />
            <Paper sx={{ p: 2 }}>
                <SectionHeader icon={<LocationOn />} title="Địa chỉ" />

                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            select
                            label="Quốc gia"
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
                            label="Tỉnh / Thành phố"
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
                            label="Xã / Phường"
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
                </Grid>
            </Paper>
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