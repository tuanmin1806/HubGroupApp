import { SxProps, Theme } from "@mui/material";

export const fieldSx = (editing?: boolean): SxProps<Theme> => ({
    "& .MuiOutlinedInput-root": {
        bgcolor: editing ? "#fff" : "#fafafa",
        fontSize: "0.855rem",
        borderRadius: "6px",
        transition: "box-shadow 0.2s, border-color 0.2s",
        "& fieldset": {
            borderWidth: "1px",
            borderColor: "#e0e0e0",
        },
        "&:hover fieldset": {
            borderColor: editing ? "#f36730" : "#e0e0e0",
            borderWidth: "1px",
        },
        "&.Mui-focused fieldset": {
            borderWidth: "1.5px",
            borderColor: "#f36730",
        },
        "&.Mui-disabled fieldset": {
            borderColor: "#ebebeb",
            borderWidth: "1px",
        },
    },
    "& .MuiInputLabel-root": {
        fontSize: "0.78rem",
        color: "#9e9e9e",
        "&.Mui-focused": { color: "#f36730" },
    },
    "& .MuiInputAdornment-root svg": {
        color: editing ? "#f36730" : "#bdbdbd",
        transition: "color 0.2s",
    },
    "& .MuiInputBase-input.Mui-disabled": {
        WebkitTextFillColor: "#555",
        cursor: "default",
    },
});

export const adminFieldSx: SxProps<Theme> = {
    "& .MuiOutlinedInput-root": {
        bgcolor: "#fff",
        fontSize: "0.875rem",
        borderRadius: "8px",
        transition: "box-shadow 0.2s, border-color 0.2s",
        "& fieldset": { borderWidth: "1px", borderColor: "#e5e7eb" },
        "&:hover fieldset": { borderColor: "#9ca3af", borderWidth: "1px" },
        "&.Mui-focused fieldset": { borderWidth: "1.5px", borderColor: "primary.main" },
        "&.Mui-focused": { boxShadow: "0 0 0 3px rgba(25,118,210,0.08)" },
        "&.Mui-error fieldset": { borderColor: "#ef4444", borderWidth: "1px" },
        "&.Mui-error.Mui-focused fieldset": { borderWidth: "1.5px" },
    },
    "& .MuiInputLabel-root": {
        fontSize: "0.8rem",
        color: "#6b7280",
        "&.Mui-focused": { color: "primary.main" },
        "&.Mui-error": { color: "#ef4444" },
    },
    "& .MuiFormHelperText-root": {
        fontSize: "0.72rem",
        mt: "3px",
    },
};