import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Grid, IconButton, CircularProgress, Typography, Divider, Box} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../../app/features/snackbar/snackbar.slice";
import { UpdateCustomerRequest } from "../../../app/models/customer.model";
import { Gender, AccountType, AccountStatus } from "../../../app/models/enums.model";
import { AppDispatch } from "../../../app/store";
import { useGetCustomerByIdQuery, useUpdateCustomerMutation } from "../../../app/features/customer.api";

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
    { value: Gender.Undefined, label: "Không xác định" },
];

const ACCOUNT_TYPE_OPTIONS = [
    { value: AccountType.Staff, label: "Nhân viên" },
    { value: AccountType.Manager, label: "Quản lý" },
];

const ACCOUNT_STATUS_OPTIONS = [
    { value: AccountStatus.Activated, label: "Đã kích hoạt" },
    { value: AccountStatus.NotActivated, label: "Chưa kích hoạt" },
    { value: AccountStatus.Locked, label: "Đã khóa" },
];

const defaultForm: UpdateCustomerRequest = {
    Id: "",
    FullName: "",
    Email: "",
    PhoneNumber: null,
    Gender: Gender.Male,
    AccountType: AccountType.Staff,
    AccountStatus: AccountStatus.NotActivated,
    RoleIds: [],
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
    const [updateCustomer, { isLoading: isUpdating }] = useUpdateCustomerMutation();

    const { data: customerData, isFetching } = useGetCustomerByIdQuery(customerId ?? "", { skip: !customerId || !open });

    useEffect(() => {
        if (customerData) {
            setForm({
                Id: customerData.Id,
                FullName: customerData.FullName ?? "",
                Email: customerData.Email ?? "",
                PhoneNumber: customerData.PhoneNumber ?? null,
                Gender: customerData.Gender as unknown as Gender ?? Gender.Male,
                AccountType: customerData.AccountType as unknown as AccountType ?? AccountType.Staff,
                AccountStatus: customerData.AccountStatus ?? AccountStatus.NotActivated,
                RoleIds: (customerData.Roles ?? []).map((role: { Id: string }) => role.Id),
            });
        }
    }, [customerData]);

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

    const handleSubmit = async () => {
        if (!validate()) return;
        try {
            await updateCustomer(form).unwrap();
            dispatch(showSnackbar({ message: "Cập nhật tài khoản thành công!", severity: "success" }));
            handleClose();
        } catch (err) {
            dispatch(showSnackbar({ message: "Cập nhật tài khoản thất bại. Vui lòng thử lại!", severity: "error" }));
        }
    };

    const isLoading = isFetching || isUpdating;

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 1 }}>
                <Typography variant="h6" fontWeight={600}>Chỉnh sửa nhân viên</Typography>
                <IconButton onClick={handleClose} size="small"><Close /></IconButton>
            </DialogTitle>
            <Divider />

            <DialogContent sx={{ pt: 2 }}>
                {isFetching ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                        <CircularProgress size={32} />
                    </Box>
                ) : (
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label="Họ và tên"
                                fullWidth
                                size="small"
                                required
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
                                required
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

                        <Grid size={{ xs: 12, sm: 4 }}>
                            <TextField
                                select
                                label="Giới tính"
                                fullWidth
                                size="small"
                                value={form.Gender}
                                onChange={(e) => handleChange("Gender", Number(e.target.value))}
                            >
                                {GENDER_OPTIONS.map((opt) => (
                                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 4 }}>
                            <TextField
                                select
                                label="Loại tài khoản"
                                fullWidth
                                size="small"
                                value={form.AccountType}
                                onChange={(e) => handleChange("AccountType", Number(e.target.value))}
                            >
                                {ACCOUNT_TYPE_OPTIONS.map((opt) => (
                                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 4 }}>
                            <TextField
                                select
                                label="Trạng thái"
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