import Box from "@mui/material/Box";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import InboxOutlined from "@mui/icons-material/InboxOutlined";
import SearchOff from "@mui/icons-material/SearchOff";
import ArticleOutlined from "@mui/icons-material/ArticleOutlined";
import PersonOff from "@mui/icons-material/PersonOff";
import ErrorOutline from "@mui/icons-material/ErrorOutline";
import WifiOff from "@mui/icons-material/WifiOff";
import LockOutlined from "@mui/icons-material/LockOutlined";
import RefreshOutlined from "@mui/icons-material/RefreshOutlined";

type EmptyVariant = "default" | "search" | "post" | "user";
type ErrorVariant = "default" | "network" | "permission" | "server";

const EMPTY_CONFIG: Record<EmptyVariant, { icon: React.ReactNode; bg: string; ring: string }> = {
    default: {
        icon: <InboxOutlined sx={{ fontSize: { xs: 32, sm: 38 }, color: "#f36730" }} />,
        bg: "linear-gradient(135deg, #fff3e0 0%, #ffe0c2 100%)",
        ring: "rgba(243,103,48,0.12)",
    },
    search: {
        icon: <SearchOff sx={{ fontSize: { xs: 32, sm: 38 }, color: "#1976d2" }} />,
        bg: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
        ring: "rgba(25,118,210,0.12)",
    },
    post: {
        icon: <ArticleOutlined sx={{ fontSize: { xs: 32, sm: 38 }, color: "#7b5ea7" }} />,
        bg: "linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)",
        ring: "rgba(123,94,167,0.12)",
    },
    user: {
        icon: <PersonOff sx={{ fontSize: { xs: 32, sm: 38 }, color: "#26a69a" }} />,
        bg: "linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%)",
        ring: "rgba(38,166,154,0.12)",
    },
};

const ERROR_CONFIG: Record<ErrorVariant, { icon: React.ReactNode; bg: string; ring: string; title: string; description: string }> = {
    default: {
        icon: <ErrorOutline sx={{ fontSize: { xs: 32, sm: 38 }, color: "#e53935" }} />,
        bg: "linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)",
        ring: "rgba(229,57,53,0.12)",
        title: "Đã xảy ra lỗi",
        description: "Không thể tải dữ liệu. Vui lòng thử lại.",
    },
    network: {
        icon: <WifiOff sx={{ fontSize: { xs: 32, sm: 38 }, color: "#f57c00" }} />,
        bg: "linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)",
        ring: "rgba(245,124,0,0.12)",
        title: "Mất kết nối mạng",
        description: "Kiểm tra kết nối internet và thử lại.",
    },
    permission: {
        icon: <LockOutlined sx={{ fontSize: { xs: 32, sm: 38 }, color: "#7b5ea7" }} />,
        bg: "linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)",
        ring: "rgba(123,94,167,0.12)",
        title: "Không có quyền truy cập",
        description: "Bạn không có quyền xem nội dung này.",
    },
    server: {
        icon: <ErrorOutline sx={{ fontSize: { xs: 32, sm: 38 }, color: "#c62828" }} />,
        bg: "linear-gradient(135deg, #ffebee 0%, #ef9a9a 100%)",
        ring: "rgba(198,40,40,0.12)",
        title: "Lỗi máy chủ",
        description: "Máy chủ đang gặp sự cố. Vui lòng thử lại sau.",
    },
};

interface LoadingOverlayProps {
    open: boolean;
    empty?: boolean;
    emptyTitle?: string;
    emptyDescription?: string;
    emptyIcon?: React.ReactNode;
    emptyVariant?: EmptyVariant;
    emptyAction?: React.ReactNode;
    error?: boolean;
    errorTitle?: string;
    errorDescription?: string;
    errorIcon?: React.ReactNode;
    onErrorDismiss?: () => void;
    errorDismissLabel?: string;
    errorVariant?: ErrorVariant;
    onRetry?: () => void;
    retryLabel?: string;
    inlineLoading?: boolean;
    minHeight?: number | string;
    children?: React.ReactNode;
}

export default function LoadingOverlay({
    open,
    empty = false,
    emptyTitle,
    emptyDescription,
    emptyIcon,
    emptyVariant = "default",
    emptyAction,
    error = false,
    errorTitle,
    errorDescription,
    errorIcon,
    onErrorDismiss,
    errorDismissLabel = "Quay lại",
    errorVariant = "default",
    onRetry,
    retryLabel = "Thử lại",
    inlineLoading = false,
    minHeight = 220,
    children,
}: LoadingOverlayProps) {

    if (open && inlineLoading) {
        return (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight, gap: 2, py: { xs: 4, sm: 6 } }}>
                <Box sx={{ position: "relative", display: "inline-flex" }}>
                    <CircularProgress size={48} thickness={2} sx={{ color: "rgba(243,103,48,0.15)", position: "absolute", top: 0, left: 0 }} variant="determinate" value={100} />
                    <CircularProgress size={48} thickness={2.5} sx={{ color: "#f36730", animationDuration: "700ms", "& .MuiCircularProgress-circle": { strokeLinecap: "round" } }} />
                    <Box sx={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#f36730", opacity: 0.85, "@keyframes pulse": { "0%,100%": { transform: "scale(1)", opacity: 0.85 }, "50%": { transform: "scale(1.4)", opacity: 0.4 } }, animation: "pulse 1.4s ease-in-out infinite" }} />
                    </Box>
                </Box>
                <Box sx={{ textAlign: "center" }}>
                    <Typography sx={{ fontSize: { xs: 13, sm: 14 }, fontWeight: 600, color: "text.primary", mb: 0.25 }}>Đang tải dữ liệu</Typography>
                    <Typography sx={{ fontSize: { xs: 11, sm: 12 }, color: "text.secondary" }}>Vui lòng chờ trong giây lát...</Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 0.6 }}>
                    {[0, 1, 2].map((i) => (
                        <Box key={i} sx={{ width: 5, height: 5, borderRadius: "50%", bgcolor: "#f36730", opacity: 0.4, "@keyframes bounce": { "0%,80%,100%": { transform: "scale(0.8)", opacity: 0.4 }, "40%": { transform: "scale(1.3)", opacity: 1 } }, animation: `bounce 1.2s ease-in-out ${i * 0.18}s infinite` }} />
                    ))}
                </Box>
            </Box>
        );
    }

    if (!open && error) {
        const cfg = ERROR_CONFIG[errorVariant];
        const title = errorTitle ?? cfg.title;
        const description = errorDescription ?? cfg.description;

        return (
            <Fade in timeout={400}>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight, px: { xs: 2, sm: 4 }, py: { xs: 4, sm: 6 }, gap: { xs: 1.5, sm: 2 }, textAlign: "center" }}>
                    <Box sx={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                        <Box sx={{ position: "absolute", width: { xs: 80, sm: 96 }, height: { xs: 80, sm: 96 }, borderRadius: "50%", bgcolor: cfg.ring, "@keyframes ripple": { "0%": { transform: "scale(0.9)", opacity: 1 }, "100%": { transform: "scale(1.4)", opacity: 0 } }, animation: "ripple 2.4s ease-out infinite" }} />
                        <Box sx={{ position: "absolute", width: { xs: 68, sm: 80 }, height: { xs: 68, sm: 80 }, borderRadius: "50%", bgcolor: cfg.ring, animation: "ripple 2.4s ease-out 0.6s infinite" }} />
                        <Box sx={{ position: "relative", width: { xs: 56, sm: 68 }, height: { xs: 56, sm: 68 }, borderRadius: "50%", background: cfg.bg, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 20px ${cfg.ring}`, flexShrink: 0 }}>
                            {errorIcon ?? cfg.icon}
                        </Box>
                    </Box>

                    <Box sx={{ maxWidth: 300 }}>
                        <Typography sx={{ fontSize: { xs: 14, sm: 16 }, fontWeight: 700, color: "text.primary", mb: 0.75, letterSpacing: "-0.01em" }}>
                            {title}
                        </Typography>
                        <Typography sx={{ fontSize: { xs: 12, sm: 13 }, color: "text.secondary", lineHeight: 1.7 }}>
                            {description}
                        </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%", maxWidth: 200, opacity: 0.35 }}>
                        <Box sx={{ flex: 1, height: "1px", bgcolor: "divider" }} />
                        <Box sx={{ width: 4, height: 4, borderRadius: "50%", bgcolor: "text.disabled" }} />
                        <Box sx={{ flex: 1, height: "1px", bgcolor: "divider" }} />
                    </Box>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "center" }}>
                        {onErrorDismiss && (
                            <Button
                                size="small"
                                variant="outlined"
                                onClick={onErrorDismiss}
                                sx={{
                                    textTransform: "none",
                                    fontWeight: 600,
                                    fontSize: { xs: 12, sm: 13 },
                                    color: "text.secondary",
                                    borderColor: "divider",
                                    borderRadius: 2,
                                    px: 2.5,
                                    "&:hover": { bgcolor: "action.hover" },
                                }}
                            >
                                {errorDismissLabel}
                            </Button>
                        )}

                        {onRetry && (
                            <Button
                                size="small"
                                startIcon={<RefreshOutlined sx={{ fontSize: 16 }} />}
                                onClick={onRetry}
                                variant="outlined"
                                sx={{
                                    textTransform: "none",
                                    fontWeight: 600,
                                    fontSize: { xs: 12, sm: 13 },
                                    color: "#e53935",
                                    borderColor: "#e53935",
                                    borderRadius: 2,
                                    px: 2.5,
                                    "&:hover": { bgcolor: "#ffebee", borderColor: "#c62828" },
                                }}
                            >
                                {retryLabel}
                            </Button>
                        )}
                    </Box>
                </Box>
            </Fade>
        );
    }

    if (!open && empty) {
        const cfg = EMPTY_CONFIG[emptyVariant];

        return (
            <Fade in timeout={400}>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight, px: { xs: 2, sm: 4 }, py: { xs: 4, sm: 6 }, gap: { xs: 1.5, sm: 2 }, textAlign: "center" }}>
                    <Box sx={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                        <Box sx={{ position: "absolute", width: { xs: 80, sm: 96 }, height: { xs: 80, sm: 96 }, borderRadius: "50%", bgcolor: cfg.ring, "@keyframes ripple": { "0%": { transform: "scale(0.9)", opacity: 1 }, "100%": { transform: "scale(1.4)", opacity: 0 } }, animation: "ripple 2.4s ease-out infinite" }} />
                        <Box sx={{ position: "absolute", width: { xs: 68, sm: 80 }, height: { xs: 68, sm: 80 }, borderRadius: "50%", bgcolor: cfg.ring, animation: "ripple 2.4s ease-out 0.6s infinite" }} />
                        <Box sx={{ position: "relative", width: { xs: 56, sm: 68 }, height: { xs: 56, sm: 68 }, borderRadius: "50%", background: cfg.bg, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 20px ${cfg.ring}`, flexShrink: 0 }}>
                            {emptyIcon ?? cfg.icon}
                        </Box>
                    </Box>
                    <Box sx={{ maxWidth: 300 }}>
                        <Typography sx={{ fontSize: { xs: 14, sm: 16 }, fontWeight: 700, color: "text.primary", mb: 0.75, letterSpacing: "-0.01em" }}>
                            {emptyTitle ?? "Chưa có dữ liệu"}
                        </Typography>
                        <Typography sx={{ fontSize: { xs: 12, sm: 13 }, color: "text.secondary", lineHeight: 1.7 }}>
                            {emptyDescription ?? "Hiện tại chưa có thông tin nào để hiển thị."}
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%", maxWidth: 200, opacity: 0.35 }}>
                        <Box sx={{ flex: 1, height: "1px", bgcolor: "divider" }} />
                        <Box sx={{ width: 4, height: 4, borderRadius: "50%", bgcolor: "text.disabled" }} />
                        <Box sx={{ flex: 1, height: "1px", bgcolor: "divider" }} />
                    </Box>
                    {emptyAction ?? null}
                </Box>
            </Fade>
        );
    }

    return (
        <Box sx={{ position: "relative" }}>
            <Backdrop open={open} sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1, flexDirection: "column", gap: 2.5, bgcolor: "rgba(15,15,20,0.6)", backdropFilter: "blur(4px)" })}>
                <Box sx={{ position: "relative", width: 64, height: 64 }}>
                    <CircularProgress size={64} thickness={1.5} sx={{ color: "rgba(255,255,255,0.15)", position: "absolute", top: 0, left: 0 }} variant="determinate" value={100} />
                    <CircularProgress size={64} thickness={2} sx={{ color: "#f36730", position: "absolute", top: 0, left: 0, animationDuration: "800ms", "& .MuiCircularProgress-circle": { strokeLinecap: "round" } }} />
                    <CircularProgress size={44} thickness={2} sx={{ color: "rgba(255,255,255,0.5)", position: "absolute", top: 10, left: 10, animationDuration: "1200ms", animationDirection: "reverse", "& .MuiCircularProgress-circle": { strokeLinecap: "round" } }} />
                    <Box sx={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "#f36730", "@keyframes pulse": { "0%,100%": { transform: "scale(1)", opacity: 1 }, "50%": { transform: "scale(1.5)", opacity: 0.5 } }, animation: "pulse 1.2s ease-in-out infinite" }} />
                    </Box>
                </Box>
                <Box sx={{ textAlign: "center" }}>
                    <Typography sx={{ fontSize: { xs: 14, sm: 15 }, fontWeight: 600, color: "#fff", mb: 0.5 }}>Đang xử lý</Typography>
                    <Typography sx={{ fontSize: { xs: 11, sm: 12 }, color: "rgba(255,255,255,0.6)" }}>Vui lòng không đóng trang này</Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 0.75 }}>
                    {[0, 1, 2].map((i) => (
                        <Box key={i} sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#f36730", opacity: 0.5, "@keyframes bounce": { "0%,80%,100%": { transform: "translateY(0) scale(0.8)", opacity: 0.5 }, "40%": { transform: "translateY(-6px) scale(1.2)", opacity: 1 } }, animation: `bounce 1.2s ease-in-out ${i * 0.18}s infinite` }} />
                    ))}
                </Box>
            </Backdrop>
            {children}
        </Box>
    );
}