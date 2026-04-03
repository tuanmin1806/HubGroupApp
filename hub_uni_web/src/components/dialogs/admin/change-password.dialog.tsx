import Close from "@mui/icons-material/Close";
import Lock from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CheckCircle from "@mui/icons-material/CheckCircle";
import Logout from "@mui/icons-material/Logout";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../app/store";
import { showSnackbar } from "../../../app/features/snackbar/snackbar.slice";
import { UpdatePasswordRequest } from "../../../app/models/customer.model";
import { useUpdatePasswordMutation } from "../../../app/features/customer.api";
import labelsVi from "../../../i18n/labels.vi";

const BLUE = "#1975d1";
const labels = labelsVi.changePassword;

interface Props {
    open: boolean;
    onClose: () => void;
    onLogout: () => void;
}

interface FormState {
    OldPassword: string;
    NewPassword: string;
    ConfirmPassword: string;
}

interface FormErrors {
    OldPassword?: string;
    NewPassword?: string;
    ConfirmPassword?: string;
}

const INITIAL_FORM: FormState = {
    OldPassword: "",
    NewPassword: "",
    ConfirmPassword: "",
};

export default function ChangePasswordDialog({ open, onClose, onLogout }: Props) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const [form, setForm] = useState<FormState>(INITIAL_FORM);
    const [errors, setErrors] = useState<FormErrors>({});
    const [showPass, setShowPass] = useState({ current: false, newPass: false, confirm: false });
    const [success, setSuccess] = useState(false);

    const dispatch = useDispatch<AppDispatch>();
    const [updatePassword, { isLoading }] = useUpdatePasswordMutation();

    const validate = (): boolean => {
        const errs: FormErrors = {};
        if (!form.OldPassword) errs.OldPassword = labels.currentPasswordRequired;
        if (!form.NewPassword) errs.NewPassword = labels.newPasswordRequired;
        else if (form.NewPassword.length < 3) errs.NewPassword = labels.newPasswordLengthRequired;
        else if (form.NewPassword === form.OldPassword) errs.NewPassword = labels.newPasswordMismatch;
        if (!form.ConfirmPassword) errs.ConfirmPassword = labels.confirmPasswordRequired;
        else if (form.ConfirmPassword !== form.NewPassword) errs.ConfirmPassword = labels.confirmPasswordMismatch;
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleChange = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(p => ({ ...p, [field]: e.target.value }));
        if (errors[field]) setErrors(p => ({ ...p, [field]: undefined }));
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        try {
            const payload: UpdatePasswordRequest = {
                OldPassword: form.OldPassword,
                NewPassword: form.NewPassword,
                ConfirmPassword: form.ConfirmPassword,
            };
            await updatePassword(payload).unwrap();
            setSuccess(true);
        } catch (err: any) {
            const msg = err?.data?.Message || labels.changePasswordFailed;
            dispatch(showSnackbar({ message: msg, severity: "error" }));
        }
    };

    const handleClose = () => {
        if (isLoading) return;
        setForm(INITIAL_FORM);
        setErrors({});
        setSuccess(false);
        onClose();
    };

    const toggleShow = (field: keyof typeof showPass) =>
        setShowPass(p => ({ ...p, [field]: !p[field] }));

    const passAdorn = (field: keyof typeof showPass) => (
        <InputAdornment position="end">
            <IconButton size="small" onClick={() => toggleShow(field)} edge="end">
                {showPass[field] ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
            </IconButton>
        </InputAdornment>
    );

    return (
        <Dialog
            open={open}
            onClose={() => { }}
            disableEscapeKeyDown
            fullScreen={fullScreen}
            maxWidth="xs"
            fullWidth
            PaperProps={{ sx: { borderRadius: fullScreen ? 0 : 3 } }}
        >
            {/* Header */}
            <Box
                px={1} py={2}
                display="flex" alignItems="center" justifyContent="space-between"
                sx={{ borderBottom: "1px solid #e9ecef" }}
            >
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box sx={{ width: 4, height: 20, borderRadius: 1, bgcolor: BLUE }} />
                    <Typography fontWeight={700} fontSize={16} color="#1e293b">
                        {labels.title}
                    </Typography>
                </Stack>
                {!isLoading && !success && (
                    <IconButton onClick={handleClose} size="small" sx={{ color: "#64748b" }}>
                        <Close fontSize="small" />
                    </IconButton>
                )}
            </Box>

            <DialogContent sx={{ px: 3, py: 2 }}>
                {success ? (
                    /* ── Success state ── */
                    <Stack spacing={2} alignItems="center" py={2}>
                        <Box
                            sx={{
                                width: 72, height: 72, borderRadius: "50%",
                                bgcolor: "#f0fdf4",
                                display: "flex", alignItems: "center", justifyContent: "center",
                            }}
                        >
                            <CheckCircle sx={{ fontSize: 56, color: "#14b14e" }} />
                        </Box>
                        <Box textAlign="center">
                            <Typography fontWeight={700} fontSize={15} color="#1e293b" mb={0.75}>
                                {labels.changePasswordSuccess}
                            </Typography>
                            <Typography fontSize={13} color="#64748b" lineHeight={1.6}>
                                {labels.changePasswordSuccessDescription}
                            </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            fullWidth
                            startIcon={<Logout sx={{ fontSize: 16 }} />}
                            onClick={onLogout}
                            sx={{
                                textTransform: "none",
                                fontWeight: 600,
                                fontSize: 13,
                                borderRadius: 1.5,
                                bgcolor: BLUE,
                                "&:hover": { bgcolor: "#1565c0" },
                            }}
                        >
                            {labels.logout}
                        </Button>
                    </Stack>
                ) : (
                    /* ── Form state ── */
                    <Stack spacing={2.5}>

                        {/* Current password */}
                        <TextField
                            size="small"
                            fullWidth
                            label={labels.currentPassword}
                            type={showPass.current ? "text" : "password"}
                            value={form.OldPassword}
                            onChange={handleChange("OldPassword")}
                            error={!!errors.OldPassword}
                            helperText={errors.OldPassword}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock sx={{ fontSize: 16, color: BLUE }} />
                                    </InputAdornment>
                                ),
                                endAdornment: passAdorn("current"),
                            }}
                        />

                        {/* New password */}
                        <TextField
                            size="small"
                            fullWidth
                            label={labels.newPassword}
                            type={showPass.newPass ? "text" : "password"}
                            value={form.NewPassword}
                            onChange={handleChange("NewPassword")}
                            error={!!errors.NewPassword}
                            helperText={errors.NewPassword}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock sx={{ fontSize: 16, color: BLUE }} />
                                    </InputAdornment>
                                ),
                                endAdornment: passAdorn("newPass"),
                            }}
                        />

                        {/* Confirm password */}
                        <TextField
                            size="small"
                            fullWidth
                            label={labels.confirmNewPassword}
                            type={showPass.confirm ? "text" : "password"}
                            value={form.ConfirmPassword}
                            onChange={handleChange("ConfirmPassword")}
                            error={!!errors.ConfirmPassword}
                            helperText={errors.ConfirmPassword}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock sx={{ fontSize: 16, color: BLUE }} />
                                    </InputAdornment>
                                ),
                                endAdornment: passAdorn("confirm"),
                            }}
                        />

                        {/* Actions */}
                        <Stack direction="row" spacing={1.5} pt={0.5}>
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={handleClose}
                                disabled={isLoading}
                                sx={{
                                    textTransform: "none",
                                    fontWeight: 600,
                                    fontSize: 13,
                                    borderRadius: 1.5,
                                    color: "#64748b",
                                    borderColor: "#e2e8f0",
                                    "&:hover": { borderColor: "#cbd5e1", bgcolor: "#f8fafc" },
                                }}
                            >
                                {labels.cancel}
                            </Button>
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={handleSubmit}
                                disabled={isLoading}
                                sx={{
                                    textTransform: "none",
                                    fontWeight: 600,
                                    fontSize: 13,
                                    borderRadius: 1.5,
                                    bgcolor: BLUE,
                                    "&:hover": { bgcolor: "#1565c0" },
                                }}
                            >
                                {isLoading ? <CircularProgress size={18} sx={{ color: "white" }} /> : labels.savePassword}
                            </Button>
                        </Stack>
                    </Stack>
                )}
            </DialogContent>
        </Dialog>
    );
}