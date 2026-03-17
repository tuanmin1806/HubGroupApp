import { configureStore } from "@reduxjs/toolkit";
import baseApi from "./features/base.api";
import authReducer, { restoreCredentials } from './features/auth/auth.slice';
import snackbarReducer from './features/snackbar/snackbar.slice';
import { getUserInfo } from "./services/auth.service";

const initializeAuth = (store: any) => {
    const user = getUserInfo();
    if (user?.Token) {
        store.dispatch(restoreCredentials(user));
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