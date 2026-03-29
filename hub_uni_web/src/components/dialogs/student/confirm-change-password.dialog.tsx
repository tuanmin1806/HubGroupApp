import { CheckCircle } from "@mui/icons-material";
import { Dialog, DialogContent, Stack, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface ConfirmChangePasswordDialogProps {
    open: boolean;
}

export default function ConfirmChangePasswordDialog({ open }: ConfirmChangePasswordDialogProps) {
    const navigate = useNavigate();

    const handleConfirm = () => {
        navigate("/sign-out");
    };

    return (
        <Dialog open={open} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 2, p: 1 } }}>
            <DialogContent>
                <Stack spacing={2} alignItems="center" sx={{ py: 1 }}>
                    <CheckCircle sx={{ fontSize: 56, color: "#4caf50" }} />
                    <Typography variant="h6" fontWeight={700} textAlign="center" fontSize="1rem">
                        Thay đổi mật khẩu thành công!
                    </Typography>
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                        Mật khẩu của bạn đã được cập nhật. Vui lòng đăng nhập lại để tiếp tục.
                    </Typography>
                    <Button
                        variant="contained"
                        disableElevation
                        fullWidth
                        onClick={handleConfirm}
                        sx={{
                            bgcolor: "#f36730",
                            borderRadius: 1.5,
                            textTransform: "none",
                            fontWeight: 600,
                            mt: 1,
                            "&:hover": { bgcolor: "#e05520" },
                        }}
                    >
                        Đồng ý
                    </Button>
                </Stack>
            </DialogContent>
        </Dialog>
    );
}