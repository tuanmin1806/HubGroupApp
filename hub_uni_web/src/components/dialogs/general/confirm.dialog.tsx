import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, useMediaQuery, useTheme, Box } from "@mui/material";
import PropTypes from "prop-types";

ConfirmDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
};

export default function ConfirmDialog({ open, onClose, onConfirm, title, message }) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullScreen={fullScreen}
            maxWidth="xs"
            fullWidth
            PaperProps={{ sx: { borderRadius: 2, p: 1, } }}
        >
            <DialogTitle sx={{ fontWeight: 600, fontSize: "1.1rem", textAlign: "center", color: "#d97706", pb: 1 }}>{title}</DialogTitle>

            <DialogContent>
                <Box sx={{ py: 1.5, textAlign: "center" }}>
                    <DialogContentText sx={{ fontSize: "0.9rem", color: "#444", }}> {message} </DialogContentText>
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 1, pb: 2, pt: 1, display: "flex", }}>
                <Button onClick={onClose} fullWidth variant="outlined" sx={{ borderRadius: 2, textTransform: "none", borderColor: "#faa11b", color: "#faa11b", "&:hover": { borderColor: "#d97706", bgcolor: "#fff7ed", } }}>
                    Hủy bỏ
                </Button>

                <Button onClick={onConfirm} fullWidth variant="contained" autoFocus sx={{ borderRadius: 2, textTransform: "none", bgcolor: "#faa11b", fontWeight: 500, boxShadow: "none", "&:hover": { bgcolor: "#d97706", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" } }}>
                    Chấp nhận
                </Button>
            </DialogActions>
        </Dialog>
    );
}