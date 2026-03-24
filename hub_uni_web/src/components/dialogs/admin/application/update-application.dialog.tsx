import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, IconButton, CircularProgress, Typography, Divider, Box, Stack } from "@mui/material";
import { Autorenew, Close } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../../../app/features/snackbar/snackbar.slice";
import { ApplicationStatus } from "../../../../app/models/enums.model";
import { AppDispatch } from "../../../../app/store";
import { UpdateApplicationRequest } from "../../../../app/models/application.model";
import { useLazyGetApplicationByIdQuery, useUpdateApplicationMutation } from "../../../../app/features/application.api";
import { ConvertService } from "../../../../app/services/convert.service";

const APPLICATION_STATUS_OPTIONS = [
    { value: ApplicationStatus.Pending, label: "Chờ xử lý" },
    { value: ApplicationStatus.Accepted, label: "Đã chấp nhận" },
    { value: ApplicationStatus.Rejected, label: "Đã từ chối" },
    { value: ApplicationStatus.Undefined, label: "Không xác định" },
];

const defaultForm: UpdateApplicationRequest = {
    ApplicationId: "",
    ApplicationStatus: ApplicationStatus.Undefined,
};

export default function UpdateApplicationDialog({ open, applicationId, onClose }: any) {
    const dispatch = useDispatch<AppDispatch>();
    const [form, setForm] = useState(defaultForm);
    const [updateApplication, { isLoading: isUpdating }] = useUpdateApplicationMutation();

    const [fetchApplication, { data: applicationData, isFetching }] = useLazyGetApplicationByIdQuery();

    useEffect(() => {
        if (open && applicationId) {
            fetchApplication(applicationId);
        }
    }, [open, applicationId]);

    useEffect(() => {
        if (applicationData) {
            setForm({
                ApplicationId: applicationData.Id,
                ApplicationStatus: ConvertService.convertApplicationStatusFromString(
                    applicationData.ApplicationStatus
                ),
            });
        }
    }, [applicationData]);

    const handleChange = (value: number) => {
        setForm((prev) => ({ ...prev, ApplicationStatus: value }));
    };

    const handleClose = () => {
        setForm(defaultForm);
        onClose();
    };

    const handleSubmit = async () => {
        try {
            await updateApplication(form).unwrap();
            dispatch(showSnackbar({ message: "Cập nhật thành công!", severity: "success" }));
            handleClose();
        } catch {
            dispatch(showSnackbar({ message: "Cập nhật thất bại!", severity: "error" }));
        }
    };

    const isLoading = isFetching || isUpdating;

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{ sx: { borderRadius: 3, overflow: "hidden" } }}
        >
            {/* HEADER */}
            <DialogTitle sx={{ px: 2, py: 1 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Box
                            sx={{
                                width: 36,
                                height: 36,
                                borderRadius: 2,
                                bgcolor: "#e3f2fd",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            <Autorenew sx={{ color: "#1975d1" }} />
                        </Box>
                        <Typography fontWeight={700}>
                            Cập nhật trạng thái
                        </Typography>
                    </Stack>

                    <IconButton onClick={handleClose} size="small">
                        <Close />
                    </IconButton>
                </Stack>
            </DialogTitle>

            <Divider />

            {/* CONTENT */}
            <DialogContent sx={{ px: 2, py: 2 }}>
                {isFetching ? (
                    <Box sx={{ textAlign: "center", py: 4 }}>
                        <CircularProgress size={28} />
                        <Typography variant="body2" sx={{ mt: 1 }}> Đang tải dữ liệu... </Typography>
                    </Box>
                ) : (
                    <Stack spacing={2}>
                        <TextField
                            select
                            label="Trạng thái ứng viên"
                            fullWidth
                            size="small"
                            value={form.ApplicationStatus}
                            onChange={(e) => handleChange(Number(e.target.value))}
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "#fafafa" } }}
                        >
                            {APPLICATION_STATUS_OPTIONS.map((opt) => (<MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>))}
                        </TextField>
                    </Stack>
                )}
            </DialogContent>

            <Divider />

            <DialogActions sx={{ px: 2, py: 1 }}>
                <Button
                    onClick={handleClose}
                    variant="outlined"
                    disabled={isLoading}
                    sx={{ borderRadius: 2, textTransform: "none" }}
                >
                    Hủy
                </Button>

                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={isLoading}
                    sx={{ borderRadius: 2, textTransform: "none", bgcolor: "#1975d1", "&:hover": { bgcolor: "#1565c0" } }}
                    startIcon={isUpdating ? <CircularProgress size={16} color="inherit" /> : null}
                >
                    {isUpdating ? "Đang lưu..." : "Lưu"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}