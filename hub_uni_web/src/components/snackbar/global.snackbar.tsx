import { useDispatch, useSelector } from "react-redux";
import { hideSnackbar } from "../../app/features/snackbar/snackbar.slice";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { AppDispatch, RootState } from "../../app/store";

const GlobalSnackbar = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { success, error } = useSelector(
        (state: RootState) => state.snackbar
    );

    const handleCloseSuccess = (event: any, reason: string) => {
        if (reason === "clickaway") {
            return;
        }
        dispatch(hideSnackbar("success"));
    };

    const handleCloseError = (event: any, reason: string) => {
        if (reason === "clickaway") {
            return;
        }
        dispatch(hideSnackbar("error"));
    };

    const handleCloseAlertSuccess = () => {
        dispatch(hideSnackbar("success"));
    };

    const handleCloseAlertError = () => {
        dispatch(hideSnackbar("error"));
    };

    return (
        <>
            <Snackbar
                open={success.open}
                autoHideDuration={2000}
                onClose={handleCloseSuccess}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert
                    onClose={handleCloseAlertSuccess}
                    severity="success"
                    sx={{ width: "100%" }}
                >
                    {success.message}
                </Alert>
            </Snackbar>

            <Snackbar
                open={error.open}
                autoHideDuration={2000}
                onClose={handleCloseError}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert
                    onClose={handleCloseAlertError}
                    severity="error"
                    sx={{ width: "100%" }}
                >
                    {error.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default GlobalSnackbar;
