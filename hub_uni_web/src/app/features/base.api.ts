import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError, FetchBaseQueryMeta } from '@reduxjs/toolkit/query/react';
import { getToken, removeToken } from '../services/auth.service';
import { logout } from './auth/auth.slice';
import { RootState } from '../store';
import { showSnackbar } from './snackbar/snackbar.slice';
import { TAG_TYPES } from './tags';

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
        const errorMessage = 'Đã có lỗi xảy ra';
        if (status === 401 && getToken()) {
            if (result.error && result.error.status === 401) {
                api.dispatch(logout());
                removeToken();
                api.dispatch(showSnackbar({ message: 'Phiên đăng nhập không hợp lệ, vui lòng đăng nhập lại', severity: 'error' }));
            } else {
                api.dispatch(showSnackbar({ message: 'Đã làm mới phiên đăng nhập thành công', severity: 'success' }));
            }
        } else {
            api.dispatch(showSnackbar({ message: errorMessage, severity: 'error' }));
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