import { configureStore } from "@reduxjs/toolkit";
import baseApi from "./features/base.api";
import authReducer, { restoreCredentials } from './features/auth/auth.slice';
import snackbarReducer from './features/snackbar/snackbar.slice';
import { getToken } from "./services/auth.service";
import { authApi } from "./features/auth/auth.api";

const initializeAuth = async (store: any) => {
    const token = getToken();
    if (token) {
        store.dispatch(restoreCredentials({ token }));
        await store.dispatch(
            authApi.endpoints.getUserProfile.initiate()
        ).unwrap();
    }
};

const store = configureStore({
    reducer: {
        [baseApi.reducerPath]: baseApi.reducer,
        auth: authReducer,
        snackbar: snackbarReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(baseApi.middleware),
});

initializeAuth(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;