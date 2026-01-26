import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SnackbarState } from "../../models/snackbar.model";

const initialState: SnackbarState = {
    success: {
        open: false,
        message: '',
    },
    error: {
        open: false,
        message: '',
    },
};

const snackbarSlice = createSlice({
    name: 'snackbar',
    initialState,
    reducers: {
        showSnackbar: (
            state,
            action: PayloadAction<{ message: string; severity: 'success' | 'error' | 'info' | 'warning' }>
        ) => {
            if (action.payload.severity === 'success') {
                state.success.open = true;
                state.success.message = action.payload.message;
            } else if (action.payload.severity === 'error') {
                state.error.open = true;
                state.error.message = action.payload.message;
            }
        },
        hideSnackbar: (state, action: PayloadAction<'success' | 'error'>) => {
            if (action.payload === 'success') {
                state.success.open = false;
            } else if (action.payload === 'error') {
                state.error.open = false;
            }
        },
    },
});

export const { showSnackbar, hideSnackbar } = snackbarSlice.actions;
export default snackbarSlice.reducer;