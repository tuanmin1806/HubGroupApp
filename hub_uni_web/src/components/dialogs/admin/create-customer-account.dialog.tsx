import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Grid, IconButton, InputAdornment, CircularProgress, Typography, Divider } from "@mui/material";
import { Close, Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { useCreateCollabAccountMutation } from "../../../app/features/customer.api";
import { CreateCustomerRequest } from "../../../app/models/customer.model";
import { Gender, AccountType, AccountStatus } from "../../../app/models/enums.model";
import { showSnackbar } from "../../../app/features/snackbar/snackbar.slice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../app/store";

interface CreateCustomerAccountDialogProps {
    open: boolean;
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
];

const ACCOUNT_STATUS_OPTIONS = [
    { value: AccountStatus.Activated, label: "Đã kích hoạt" },
    { value: AccountStatus.NotActivated, label: "Chưa kích hoạt" },
    { value: AccountStatus.Locked, label: "Đã khóa" },
];

const defaultForm: CreateCustomerRequest = {
    UserName: "",
    Password: "",
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
    UserName?: string;
    Password?: string;
    Email?: string;
}

export default function CreateCustomerAccountDialog({
    open,
    onClose
}: CreateCustomerAccountDialogProps) {
    const dispatch = useDispatch<AppDispatch>();
    const [form, setForm] = useState<CreateCustomerRequest>(defaultForm);
    const [errors, setErrors] = useState<FormErrors>({});
    const [showPassword, setShowPassword] = useState(false);
    const [createCollabAccount, { isLoading }] = useCreateCollabAccountMutation();

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
        if (!form.Email.trim()) newErrors.Email = "Email không được để trống";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.Email)) newErrors.Email = "Email không hợp lệ";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleClose = () => {
        setForm(defaultForm);
        setErrors({});
        setShowPassword(false);
        onClose();
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        try {
            await createCollabAccount(form).unwrap();
            dispatch(showSnackbar({ message: "Tạo tài khoản thành công!", severity: "success" }));
            handleClose();
        } catch (err) {
            dispatch(showSnackbar({ message: "Tạo tài khoản thất bại. Vui lòng thử lại!", severity: "error" }));
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 1 }}>
                <Typography fontWeight={600}>Thêm nhân viên mới</Typography>
                <IconButton onClick={handleClose} size="small"><Close /></IconButton>
            </DialogTitle>
            <Divider />

            <DialogContent sx={{ pt: 2 }}>
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
                            label="Tên đăng nhập"
                            fullWidth
                            size="small"
                            required
                            value={form.UserName}
                            onChange={(e) => handleChange("UserName", e.target.value)}
                            error={!!errors.UserName}
                            helperText={errors.UserName}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            label="Mật khẩu"
                            type={showPassword ? "text" : "password"}
                            fullWidth
                            size="small"
                            required
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

                    <Grid size={{ xs: 12, sm: 6 }}>
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

                    <Grid size={{ xs: 12, sm: 6 }}>
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

                    <Grid size={{ xs: 12, sm: 6 }}>
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
                    startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : null}
                >
                    {isLoading ? "Đang tạo..." : "Tạo tài khoản"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}