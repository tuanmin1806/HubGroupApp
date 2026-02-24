import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogActions, Button, Typography, Box, Stack, Checkbox, FormControlLabel, Divider, Avatar, IconButton, Link, Paper, CircularProgress, Alert,} from "@mui/material";
import { Close, Warning, CheckCircle, Business} from "@mui/icons-material";
import { useCreateApplicationMutation } from "../../../app/features/application";
import { getUserInfo } from "../../../app/services/auth.service";

interface ApplyConfirmDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    organizationName: string;
    organizationLogo?: string;
    jobTitle: string;
    recruitmentPostId: string;
}

const ApplyConfirmDialog = ({
    open,
    onClose,
    onSuccess,
    organizationName,
    organizationLogo,
    jobTitle,
    recruitmentPostId,
}: ApplyConfirmDialogProps) => {
    const [agreed, setAgreed] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const [createApplication, { isLoading }] = useCreateApplicationMutation();

    const handleClose = () => {
        if (isLoading) return;
        setAgreed(false);
        setErrorMsg(null);
        onClose();
    };

    const handleConfirm = async () => {
        if (!agreed || isLoading) return;

        const userInfo = getUserInfo();
        if (!userInfo?.Id) {
            setErrorMsg("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
            return;
        }

        try {
            setErrorMsg(null);
            await createApplication({
                CustomerId: userInfo.Id,
                RecruitmentPostId: recruitmentPostId,
            }).unwrap();

            handleClose();
            onSuccess?.();
        } catch (err: any) {
            setErrorMsg(
                err?.data?.message || "Ứng tuyển thất bại. Vui lòng thử lại sau."
            );
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
        >
            {/* Header */}
            <DialogTitle
                sx={{
                    background: "linear-gradient(135deg, #fc7248 0%, #ff9800 100%)",
                    color: "white",
                    py: 2.5,
                    px: 3,
                    position: "relative",
                }}
            >
                <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                        src={organizationLogo || undefined}
                        sx={{
                            width: 52,
                            height: 52,
                            bgcolor: "rgba(255,255,255,0.25)",
                            border: "2px solid rgba(255,255,255,0.5)",
                            fontSize: "1.25rem",
                            fontWeight: 700,
                        }}
                    >
                        {!organizationLogo && <Business sx={{ fontSize: 26 }} />}
                    </Avatar>
                    <Box flex={1}>
                        <Typography
                            variant="caption"
                            sx={{
                                color: "rgba(255,255,255,0.85)",
                                fontWeight: 500,
                                letterSpacing: 0.5,
                                textTransform: "uppercase",
                                fontSize: "0.7rem",
                            }}
                        >
                            Xác nhận ứng tuyển tại
                        </Typography>
                        <Typography
                            variant="h6"
                            fontWeight={700}
                            sx={{
                                lineHeight: 1.3,
                                fontSize: { xs: "1rem", sm: "1.15rem" },
                            }}
                        >
                            {organizationName}
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                color: "rgba(255,255,255,0.8)",
                                mt: 0.25,
                                fontSize: "0.8rem",
                                display: "-webkit-box",
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                            }}
                        >
                            {jobTitle}
                        </Typography>
                    </Box>
                    <IconButton
                        onClick={handleClose}
                        size="small"
                        disabled={isLoading}
                        sx={{
                            color: "white",
                            bgcolor: "rgba(255,255,255,0.15)", "&:hover": { bgcolor: "rgba(255,255,255,0.25)" },
                            alignSelf: "flex-start",
                        }}
                    >
                        <Close fontSize="medium" />
                    </IconButton>
                </Stack>
            </DialogTitle>

            <DialogContent sx={{ p: 3, paddingTop: "24px !important" }}>
                <Stack spacing={2.5}>
                    {/* Warning Notice */}
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            bgcolor: "#fff8f0",
                            border: "1px solid #ffe0b2",
                            borderLeft: "4px solid #ff9800",
                            borderRadius: 2,
                        }}
                    >
                        <Stack direction="row" spacing={1.5} alignItems="flex-start">
                            <Warning
                                sx={{
                                    color: "#ff9800",
                                    fontSize: 22,
                                    mt: 0.2,
                                    flexShrink: 0,
                                }}
                            />
                            <Box>
                                <Typography
                                    variant="subtitle2"
                                    fontWeight={700}
                                    color="#e65100"
                                    gutterBottom
                                    sx={{ fontSize: "0.85rem" }}
                                >
                                    Lưu ý quan trọng từ HUBUNI
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ lineHeight: 1.7, fontSize: "0.82rem" }}
                                >
                                    HUBUNI khuyên tất cả các bạn hãy luôn cẩn trọng trong quá
                                    trình tìm việc và chủ động nghiên cứu về thông tin công ty,
                                    vị trí việc làm trước khi ứng tuyển. Ứng viên cần có trách
                                    nhiệm với hành vi ứng tuyển của mình. Nếu bạn gặp phải tin
                                    tuyển dụng hoặc nhận được liên lạc đáng ngờ của nhà tuyển
                                    dụng, hãy báo cáo ngay cho HUBUNI qua email{" "}
                                    <Link
                                        href="mailto:hotro@hubuni.vn"
                                        sx={{
                                            color: "#ff5722",
                                            fontWeight: 600,
                                            textDecorationColor: "#ff5722",
                                        }}
                                    >
                                        hotro@hubuni.vn
                                    </Link>{" "}
                                    để được hỗ trợ kịp thời.
                                </Typography>
                                <Link
                                    href="#"
                                    sx={{
                                        color: "#ff5722",
                                        fontWeight: 600,
                                        fontSize: "0.82rem",
                                        display: "inline-block",
                                        mt: 1,
                                        textDecorationColor: "#ff5722",
                                    }}
                                >
                                    Tìm hiểu thêm kinh nghiệm phòng tránh lừa đảo tại đây →
                                </Link>
                            </Box>
                        </Stack>
                    </Paper>

                    <Divider />

                    {/* Agreement Checkbox */}
                    <Box>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={agreed}
                                    onChange={(e) => setAgreed(e.target.checked)}
                                    disabled={isLoading}
                                    sx={{
                                        color: "#ff5722",
                                        "&.Mui-checked": { color: "#ff5722" },
                                        pt: 0.5,
                                        alignSelf: "flex-start",
                                    }}
                                />
                            }
                            label={
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ lineHeight: 1.6, fontSize: "0.85rem" }}
                                >
                                    Tôi đã đọc và đồng ý với{" "}
                                    <Link
                                        href="#"
                                        sx={{
                                            color: "#ff5722",
                                            fontWeight: 600,
                                            textDecorationColor: "#ff5722",
                                        }}
                                    >
                                        "Thoả thuận sử dụng dữ liệu cá nhân"
                                    </Link>{" "}
                                    của Nhà tuyển dụng
                                </Typography>
                            }
                            sx={{ alignItems: "flex-start", mx: 0 }}
                        />
                    </Box>

                    {/* Error message */}
                    {errorMsg && (
                        <Alert severity="error" sx={{ borderRadius: 2 }}>
                            {errorMsg}
                        </Alert>
                    )}
                </Stack>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3, pt: 0, gap: 1.5 }}>
                <Button
                    variant="outlined"
                    onClick={handleClose}
                    disabled={isLoading}
                    fullWidth
                    sx={{
                        borderColor: "#e0e0e0",
                        color: "text.secondary",
                        fontWeight: 600,
                        py: 1.25,
                        borderRadius: 2,
                        "&:hover": {
                            borderColor: "#bdbdbd",
                            bgcolor: "#f5f5f5",
                        },
                    }}
                >
                    Hủy bỏ
                </Button>
                <Button
                    variant="contained"
                    onClick={handleConfirm}
                    disabled={!agreed || isLoading}
                    fullWidth
                    startIcon={
                        isLoading ? (
                            <CircularProgress size={18} sx={{ color: "white" }} />
                        ) : agreed ? (
                            <CheckCircle />
                        ) : undefined
                    }
                    sx={{
                        fontWeight: 700,
                        py: 1.25,
                        borderRadius: 2,
                        fontSize: "0.95rem",
                        background:
                            agreed && !isLoading
                                ? "linear-gradient(135deg, #fc7248 0%, #ff9800 100%)"
                                : undefined,
                        boxShadow:
                            agreed && !isLoading
                                ? "0 4px 15px rgba(252,114,72,0.4)"
                                : "none",
                        transition: "all 0.3s ease",
                        "&:hover": {
                            background:
                                agreed && !isLoading
                                    ? "linear-gradient(135deg, #e64a19 0%, #f57c00 100%)"
                                    : undefined,
                            boxShadow:
                                agreed && !isLoading
                                    ? "0 6px 20px rgba(252,114,72,0.5)"
                                    : "none",
                        },
                        "&.Mui-disabled": {
                            background: "#e0e0e0",
                            color: "#9e9e9e",
                        },
                    }}
                >
                    {isLoading ? "Đang xử lý..." : "Xác nhận ứng tuyển"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ApplyConfirmDialog;