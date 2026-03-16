import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Grid, IconButton, CircularProgress, Typography, Divider, Box } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useUpdateCustomerMutation, useGetCustomerByIdQuery } from "../../../../app/features/customer.api";
import { showSnackbar } from "../../../../app/features/snackbar/snackbar.slice";
import { UpdateCustomerRequest } from "../../../../app/models/customer.model";
import { Gender, AccountType, AccountStatus, ApplicationStatus } from "../../../../app/models/enums.model";
import { AppDispatch } from "../../../../app/store";
import { UpdateApplicationRequest } from "../../../../app/models/application.model";
import { useGetApplicationByIdQuery, useUpdateApplicationMutation } from "../../../../app/features/application.api";
import { ConvertService } from "../../../../app/services/convert.service";

interface UpdateApplicationDialogProps {
    open: boolean;
    applicationId: string | null;
    onClose: () => void;
    onSuccess?: () => void;
}

const APPLICATION_STATUS_OPTIONS = [
    { value: ApplicationStatus.Pending, label: "Chờ xử lý" },
    { value: ApplicationStatus.Accepted, label: "Đã duyệt" },
    { value: ApplicationStatus.Rejected, label: "Đã từ chối" },
    { value: ApplicationStatus.Undefined, label: "Không xác định" },
];

const defaultForm: UpdateApplicationRequest = {
    ApplicationId: "",
    ApplicationStatus: ApplicationStatus.Undefined,
};

interface FormErrors {
    ApplicationStatus?: ApplicationStatus;
}

export default function UpdateApplicationDialog({
    open,
    applicationId,
    onClose
}: UpdateApplicationDialogProps) {
    const dispatch = useDispatch<AppDispatch>();
    const [form, setForm] = useState<UpdateApplicationRequest>(defaultForm);
    const [errors, setErrors] = useState<FormErrors>({});
    const [updateApplication, { isLoading: isUpdating }] = useUpdateApplicationMutation();

    const { data: applicationData, isFetching } = useGetApplicationByIdQuery(applicationId ?? "", { skip: !applicationId || !open });

    useEffect(() => {
        if (applicationData) {
            setForm({
                ApplicationId: applicationData.Id,
                ApplicationStatus: ConvertService.convertApplicationStatusFromString(applicationData.ApplicationStatus),
            });
        }
    }, [applicationData]);

    const handleChange = (field: keyof UpdateApplicationRequest, value: unknown) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const validate = (): boolean => {
        const newErrors: FormErrors = {};
        if (!form.ApplicationStatus) newErrors.ApplicationStatus = ApplicationStatus.Undefined;
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
            await updateApplication(form).unwrap();
            dispatch(showSnackbar({ message: "Cập nhật đơn ứng tuyển thành công!", severity: "success" }));
            handleClose();
        } catch (err) {
            dispatch(showSnackbar({ message: "Cập nhật đơn ứng tuyển thất bại. Vui lòng thử lại!", severity: "error" }));
        }
    };

    const isLoading = isFetching || isUpdating;

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 1 }}>
                <Typography variant="h6" fontWeight={600}>Chỉnh sửa đơn ứng tuyển</Typography>
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
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <TextField
                                select
                                label="Trạng thái"
                                fullWidth
                                size="small"
                                value={form.ApplicationStatus}
                                onChange={(e) => handleChange("ApplicationStatus", Number(e.target.value))}
                            >
                                {APPLICATION_STATUS_OPTIONS.map((opt) => (
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