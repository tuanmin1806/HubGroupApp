import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError, FetchBaseQueryMeta } from '@reduxjs/toolkit/query/react';
import { getToken, removeToken } from '../services/auth.service';
import { logout } from './auth/auth.slice';
import { RootState } from '../store';
import { showSnackbar } from './snackbar/snackbar.slice';
import { TAG_TYPES } from './tags';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;
console.log("API_URL =", API_URL);
const baseQuery = fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers, { getState, endpoint }) => {
        if (endpoint !== 'refreshToken' && endpoint !== 'forgotPassword') {
            const token = (getState() as RootState).auth.token || getToken();
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
        }
        return headers;
    },
});
let isHandling401 = false;
const baseQueryWithAuth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError,
    {},
    FetchBaseQueryMeta
> = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error) {
        const status = result.error.status;

        if (status === 401 && !isHandling401) {
            isHandling401 = true;

            api.dispatch(logout());
            removeToken();

            api.dispatch(showSnackbar({
                message: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại',
                severity: 'error'
            }));

            setTimeout(() => {
                window.location.href = '/sign-out';
                isHandling401 = false;
            }, 1500);

        } else if (status !== 401) {
            const errorMessage = (result.error.data as any)?.message || 'Đã có lỗi xảy ra';
            api.dispatch(showSnackbar({
                message: errorMessage,
                severity: 'error'
            }));
        }
    }

    return result;
};

const baseApi = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithAuth,
    tagTypes: Object.values(TAG_TYPES),
    endpoints: () => ({}),
});

export const apiMiddleware = (api: any) => (next: any) => (action: any) => {
    return next(action);
};

export default baseApi;