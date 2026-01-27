import { createSlice } from "@reduxjs/toolkit";
import { AuthInfo } from "../../models/auth.model";
interface AuthState {
    user: AuthInfo | null;
    token: string | null;
    isLoggedIn: boolean;
}
const initialState: AuthState = {
    user: null,
    token: null,
    isLoggedIn: false,
};
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.user = action.payload;
            state.token = action.payload.Token;
            state.isLoggedIn = true;
        },
        restoreCredentials: (state, action) => {
            state.user = action.payload;
            state.token = action.payload.Token;
            state.isLoggedIn = true;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isLoggedIn = false;
        },
    },
});

export const { setCredentials, restoreCredentials, logout } = authSlice.actions;
export default authSlice.reducer;