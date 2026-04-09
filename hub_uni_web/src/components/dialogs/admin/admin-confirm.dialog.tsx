import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import labelsVi from "../../../i18n/labels.vi";

const labels = labelsVi.confirmDialog;

AdminConfirmDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
};

export default function AdminConfirmDialog({ open, onClose, onConfirm, title, message }) {
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
            <DialogTitle sx={{ fontWeight: 600, fontSize: "1.1rem", textAlign: "center", color: "#1975d1", pb: 1 }}>{title}</DialogTitle>

            <DialogContent>
                <Box sx={{ py: 1.5, textAlign: "center" }}>
                    <DialogContentText sx={{ fontSize: "0.9rem", color: "#444", }}> {message} </DialogContentText>
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 1, pb: 2, pt: 1, display: "flex", }}>
                <Button onClick={onClose} fullWidth variant="outlined" sx={{ borderRadius: 2, textTransform: "none", borderColor: "#1975d1", color: "#1975d1", "&:hover": { borderColor: "#1975d1", bgcolor: "#fff7ed", } }}>
                    {labels.cancel}
                </Button>

                <Button onClick={onConfirm} fullWidth variant="contained" autoFocus sx={{ borderRadius: 2, textTransform: "none", bgcolor: "#1975d1", fontWeight: 500, boxShadow: "none", "&:hover": { bgcolor: "#1975d1", boxShadow: "0 2px 8px rgba(88, 159, 252, 0.15)" } }}>
                    {labels.confirm}
                </Button>
            </DialogActions>
        </Dialog>
    );
}