import { Business, Delete, CloudUpload } from "@mui/icons-material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import CircularProgress from "@mui/material/CircularProgress";
import { useState, useRef } from "react";
import { useUpdateOrganizationLogoMutation } from "../../../app/features/organization.api";
import labelsVi from "../../../i18n/labels.vi";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../app/store";
import { showSnackbar } from "../../../app/features/snackbar/snackbar.slice";

const labels = labelsVi.logoUpload;

export default function LogoUploadDialog({ open, onClose, currentLogoUrl, organizationId }: {
    open: boolean;
    onClose: () => void;
    currentLogoUrl: string;
    organizationId: string;
}) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dispatch = useDispatch<AppDispatch>();
    const [updateLogo, { isLoading }] = useUpdateOrganizationLogoMutation();

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
            await updateLogo({ Id: organizationId, formData }).unwrap();
            dispatch(showSnackbar({ message: labels.updateSuccess, severity: "success" }));
            onClose();
            handleRemove();
        } catch (err) {
            dispatch(showSnackbar({ message: labels.updateFailed, severity: "error" }));
        }
    };

    const handleClose = () => {
        onClose();
        handleRemove();
    };

    const displayUrl = previewUrl || currentLogoUrl;

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3, overflow: "hidden" } }}>
            <DialogTitle sx={{ fontWeight: 700, fontSize: 16 }}>{labels.title}</DialogTitle>
            <DialogContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <Box sx={{ position: "relative", display: "inline-block" }}>
                    <Box
                        sx={{
                            width: 140,
                            height: 140,
                            borderRadius: 3,
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
                            <Business sx={{ fontSize: 48, color: "#ccc" }} />
                        )}
                    </Box>

                    {previewUrl && (
                        <Tooltip title={labels.removeImage}>
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
                        borderColor: "#1975d1",
                        color: "#1975d1",
                        fontWeight: 600,
                        "&:hover": { bgcolor: "#e8f0fd" },
                    }}
                >
                    {previewUrl ? labels.selectAnotherImage : labels.selectImage}
                </Button>
            </DialogContent>

            <DialogActions sx={{ pb: 1, gap: 0.5 }}>
                <Button onClick={handleClose} sx={{ textTransform: "none", color: "text.secondary" }}>{labels.cancel}</Button>
                <Button variant="contained" onClick={handleSave} disabled={!selectedFile || isLoading} sx={{ textTransform: "none", bgcolor: "#1975d1", fontWeight: 600, borderRadius: 2, "&:hover": { bgcolor: "#1565b8" } }}>
                    {isLoading ? <CircularProgress size={18} sx={{ color: "#fff" }} /> : labels.save}
                </Button>
            </DialogActions>
        </Dialog>
    );
}