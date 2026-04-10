import { lazy } from "react";
import Lock from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { useState } from "react";
import { useUpdatePasswordMutation } from "../../app/features/account.api";
import LoadingOverlay from "../general/loading-overlay";
const ConfirmChangePasswordDialog = lazy(() => import("../dialogs/student/confirm-change-password.dialog"));

export default function ChangePasswordPanel() {
    const [form, setForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
    const [show, setShow] = useState({ oldPassword: false, newPassword: false, confirmPassword: false });
    const [error, setError] = useState("");
    const [showError, setShowError] = useState(false);
    const [updatePassword, { isLoading, reset }] = useUpdatePasswordMutation();
    const [success, setSuccess] = useState(false);

    const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({ ...prev, [field]: e.target.value }));
        setError(""); setSuccess(false);
    };

    const toggleShow = (field: keyof typeof show) => setShow(prev => ({ ...prev, [field]: !prev[field] }));

    const handleSubmit = async () => {
        if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
            setError("Vui lòng điền đầy đủ thông tin.");
            return;
        }

        if (form.newPassword.length < 4) {
            setError("Mật khẩu mới phải có ít nhất 4 ký tự.");
            return;
        }

        if (form.newPassword !== form.confirmPassword) {
            setError("Mật khẩu xác nhận không khớp.");
            return;
        }

        try {
            await updatePassword({
                OldPassword: form.oldPassword,
                NewPassword: form.newPassword,
                ConfirmPassword: form.confirmPassword,
            }).unwrap();

            setSuccess(true);
            setShowError(false);
            setError("");
            setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });

        } catch (err: any) {
            setSuccess(false);
            setShowError(true);
            setError(err?.data?.message || "Đổi mật khẩu thất bại.");
        }
    };

    const handleErrorDismiss = () => {
        setShowError(false);
        setError("");
        reset();
    };

    const fields: { key: keyof typeof form; label: string }[] = [
        { key: "oldPassword", label: "Mật khẩu hiện tại" },
        { key: "newPassword", label: "Mật khẩu mới" },
        { key: "confirmPassword", label: "Xác nhận mật khẩu mới" },
    ];

    return (
        <LoadingOverlay
            open={isLoading}
            error={showError}
            errorVariant="default"
            errorTitle="Đổi mật khẩu thất bại"
            errorDescription={error || "Vui lòng kiểm tra lại mật khẩu hiện tại và thử lại."}
            onErrorDismiss={handleErrorDismiss}
            errorDismissLabel="Quay lại"
            onRetry={handleSubmit}
            retryLabel="Thử lại"
        >
            <Box>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5, fontSize: "1rem" }}>Thay đổi mật khẩu</Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={2}>
                    {fields.map(({ key, label }) => (
                        <TextField
                            key={key}
                            label={label}
                            type={show[key] ? "text" : "password"}
                            size="small"
                            value={form[key]}
                            onChange={handleChange(key)}
                            InputProps={{ startAdornment: (<InputAdornment position="start"><Lock sx={{ fontSize: 16, color: "#f36730" }} /></InputAdornment>), endAdornment: (<InputAdornment position="end"><IconButton size="small" onClick={() => toggleShow(key)}>{show[key] ? <VisibilityOff sx={{ fontSize: 16 }} /> : <Visibility sx={{ fontSize: 16 }} />}</IconButton></InputAdornment>), }}
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
                        />
                    ))}

                    {error && <Alert severity="error" sx={{ py: 0.5, fontSize: "0.8rem" }}>{error}</Alert>}
                    <ConfirmChangePasswordDialog open={success} />
                    <Button
                        variant="contained"
                        disableElevation
                        onClick={handleSubmit}
                        disabled={isLoading}
                        sx={{
                            bgcolor: "#f36730",
                            borderRadius: 1.5,
                            textTransform: "none",
                            fontWeight: 600,
                            alignSelf: "flex-start",
                            px: 3,
                            "&:hover": { bgcolor: "#e05520" },
                        }}
                    >
                        {isLoading ? <CircularProgress size={16} color="inherit" /> : "Cập nhật mật khẩu"}
                    </Button>
                </Stack>
            </Box>
        </LoadingOverlay>
    );
}