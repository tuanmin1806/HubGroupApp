import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Close from "@mui/icons-material/Close";
import School from "@mui/icons-material/School";
import Person2 from "@mui/icons-material/Person2";
import { useNavigate } from "react-router-dom";
import labelsVi from "../../i18n/labels.vi";

const labels = labelsVi.selectRegister;

interface Props {
    open: boolean;
    onClose: () => void;
}

export default function SelectRegisterType({ open, onClose }: Props) {
    const navigate = useNavigate();

    const handleSelect = (path: string) => {
        onClose();
        navigate(path);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth
            PaperProps={{ sx: { borderRadius: 3 } }}>
            <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 1 }}>
                <Typography fontWeight={700} fontSize={17}>{labels.title}</Typography>
                <IconButton size="small" onClick={onClose}><Close fontSize="small" /></IconButton>
            </DialogTitle>

            <DialogContent>
                <Stack spacing={2} pt={0.5}>
                    <Button
                        fullWidth size="large" variant="outlined"
                        startIcon={<School />}
                        onClick={() => handleSelect("/dang-ky/admin")}
                        sx={{ borderColor: "#faa11b", color: "#faa11b", "&:hover": { borderColor: "#e28e13", bgcolor: "rgba(250,161,27,0.05)" }, textTransform: "none", fontWeight: 600, borderRadius: 2 }}
                    >
                        {labels.school}
                    </Button>
                    <Button
                        fullWidth size="large" variant="contained"
                        startIcon={<Person2 />}
                        onClick={() => handleSelect("/dang-ky/customer")}
                        sx={{ bgcolor: "#faa11b", "&:hover": { bgcolor: "#e28e13" }, textTransform: "none", fontWeight: 600, borderRadius: 2 }}
                    >
                        {labels.student}
                    </Button>
                </Stack>
            </DialogContent>
        </Dialog>
    );
}