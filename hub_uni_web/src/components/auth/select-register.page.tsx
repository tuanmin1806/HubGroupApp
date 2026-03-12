import { Dialog, DialogTitle, DialogContent, Stack, Button, Typography, IconButton, Link, } from "@mui/material";
import { Close, School } from "@mui/icons-material";
import { Person2 } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

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
                <Typography fontWeight={700} fontSize={17}>Chọn loại tài khoản</Typography>
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
                        Trường
                    </Button>
                    <Button
                        fullWidth size="large" variant="contained"
                        startIcon={<Person2 />}
                        onClick={() => handleSelect("/dang-ky/customer")}
                        sx={{ bgcolor: "#faa11b", "&:hover": { bgcolor: "#e28e13" }, textTransform: "none", fontWeight: 600, borderRadius: 2 }}
                    >
                        Học sinh
                    </Button>
                </Stack>
            </DialogContent>
        </Dialog>
    );
}