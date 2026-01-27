import { ApiResponse } from "../../models/api.model";
import { AuthChangePasswordRequestBody, AuthForgotPasswordRequestBody, AuthInfo, AuthLoginRequestBody, AuthReconfirmPasswordRequestBody, AuthRegisterRequestBody } from "../../models/auth.model";
import { removeToken, saveUserInfo } from "../../services/auth.service";
import baseApi from "../base.api";
import { TAG_TYPES } from "../tags";
import { logout, setCredentials } from "./auth.slice";

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // LOGIN
        login: builder.mutation<AuthInfo, AuthLoginRequestBody>({
            query: (credentials) => ({
                url: "/account/login",
                method: "POST",
                body: credentials,
            }),

            onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled;
                    saveUserInfo(data);
                    dispatch(setCredentials(data));
                } catch (err) {
                    console.error("Login failed", err);
                }
            },

        }),

        // LOGOUT
        logout: builder.mutation<ApiResponse<void>, void>({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                await queryFulfilled;
                setTimeout(() => {
                    dispatch(logout());
                    removeToken();
                }, 100);
            },
            invalidatesTags: [TAG_TYPES.AUTH]
        }),

        // REGISTER
        register: builder.mutation<ApiResponse<void>, AuthRegisterRequestBody>({
            query: (body) => ({
                url: '/auth/register',
                method: 'POST',
                body
            }),
        }),

        // FORGOT_PASSWORD
        forgotPassword: builder.mutation<ApiResponse<void>, AuthForgotPasswordRequestBody>({
            query: (body) => ({
                url: '/auth/forgot-password',
                method: 'POST',
                body
            }),
        }),

        // RECONFIRM_PASSWORD
        reconfirmPassword: builder.mutation<ApiResponse<void>, AuthReconfirmPasswordRequestBody>({
            query: (body) => ({
                url: '/auth/re-confirm-verification',
                method: 'POST',
                body
            }),
        }),

        // CHANGE_PASSWORD
        changePassword: builder.mutation<ApiResponse<void>, AuthChangePasswordRequestBody>({
            query: (body) => ({
                url: '/users/change-password',
                method: 'PUT',
                body
            }),
            invalidatesTags: [
                TAG_TYPES.AUTH
            ]
        }),
    }),
});
export const {
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation,
    useForgotPasswordMutation,
    useReconfirmPasswordMutation,
    useChangePasswordMutation,
} = authApi;