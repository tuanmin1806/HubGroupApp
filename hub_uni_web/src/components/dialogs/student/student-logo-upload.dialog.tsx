import Delete from "@mui/icons-material/Delete";
import CloudUpload from "@mui/icons-material/CloudUpload";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import CircularProgress from "@mui/material/CircularProgress";
import Avatar from "@mui/material/Avatar";
import { useState, useRef } from "react";
import { useUpdateCustomerAvatarMutation } from "../../../app/features/customer.api";

export default function StudentLogoUploadDialog({ open, onClose, currentLogoUrl }: {
    open: boolean;
    onClose: () => void;
    currentLogoUrl: string;
}) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [updateLogo, { isLoading }] = useUpdateCustomerAvatarMutation();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = () => setPreviewUrl(reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleRemove = () => {
        setPreviewUrl(null);
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSave = async () => {
        if (!selectedFile) return;
        try {
            const formData = new FormData();
            formData.append("LogoUrl", selectedFile);
            await updateLogo(formData).unwrap();
            onClose();
            handleRemove();
        } catch (err) {
            console.error("Failed to update logo:", err);
        }
    };

    const handleClose = () => {
        onClose();
        handleRemove();
    };

    const displayUrl = previewUrl || currentLogoUrl;

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 2, overflow: "hidden" } }}>
            <DialogTitle sx={{ fontWeight: 700, fontSize: 16 }}>Cập nhật ảnh đại diện</DialogTitle>
            <DialogContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                <Box sx={{ position: "relative", display: "inline-block" }}>
                    <Box
                        sx={{
                            width: 140,
                            height: 140,
                            borderRadius: 2,
                            overflow: "hidden",
                            border: "2px solid #e0e0e0",
                            bgcolor: "#f9f9f9",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        {displayUrl ? (
                            <Box
                                component="img"
                                src={displayUrl}
                                sx={{ width: "100%", height: "100%", objectFit: "contain", p: 0.5 }}
                            />
                        ) : (
                            <Avatar sx={{ fontSize: 48 }} />
                        )}
                    </Box>

                    {previewUrl && (
                        <Tooltip title="Xóa ảnh đã chọn">
                            <IconButton
                                onClick={handleRemove}
                                size="small"
                                sx={{
                                    position: "absolute",
                                    top: -5,
                                    right: -8,
                                    bgcolor: "#fff",
                                    border: "1px solid #e0e0e0",
                                    boxShadow: 1,
                                    "&:hover": { bgcolor: "#ffeaea", borderColor: "#f44336" },
                                    color: "#f44336",
                                    width: 28,
                                    height: 28,
                                }}
                            >
                                <Delete sx={{ fontSize: 15 }} />
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleFileChange}
                />
                <Button
                    variant="outlined"
                    startIcon={<CloudUpload />}
                    onClick={() => fileInputRef.current?.click()}
                    sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        borderColor: "#faa11b",
                        color: "#faa11b",
                        fontWeight: 600,
                        "&:hover": { bgcolor: "#fae7b3ff" },
                    }}
                >
                    {previewUrl ? "Chọn ảnh khác" : "Chọn ảnh"}
                </Button>
            </DialogContent>

            <DialogActions sx={{ pb: 1 }}>
                <Button onClick={handleClose} sx={{ textTransform: "none", color: "text.secondary" }}>Hủy</Button>
                <Button variant="contained" onClick={handleSave} disabled={!selectedFile || isLoading} sx={{ textTransform: "none", bgcolor: "#faa11b", fontWeight: 600, borderRadius: 2, "&:hover": { bgcolor: "#fc9d0eff" } }}>
                    {isLoading ? <CircularProgress size={18} sx={{ color: "#fff" }} /> : "Lưu"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}