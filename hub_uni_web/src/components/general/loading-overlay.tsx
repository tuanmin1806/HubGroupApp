import { Backdrop, CircularProgress } from "@mui/material";

interface LoadingOverlayProps {
    open: boolean;
}

export default function LoadingOverlay({ open }: LoadingOverlayProps) {
    return (
        <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
            open={open}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    );
}
