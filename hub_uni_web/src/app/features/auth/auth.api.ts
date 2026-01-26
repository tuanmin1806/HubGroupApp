import { ApiResponse } from "../../models/api.model";
import { AuthChangePasswordRequestBody, AuthForgotPasswordRequestBody, AuthInfo, AuthLoginRequestBody, AuthLoginResponse, AuthReconfirmPasswordRequestBody, AuthRegisterRequestBody } from "../../models/auth.model";
import { User } from "../../models/user.model";
import { getToken, removeToken, saveToken } from "../../services/auth.service";
import baseApi from "../base.api";
import { TAG_TYPES } from "../tags";
import { logout, setCredentials } from "./auth.slice";

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // GET user-profile
        getUserProfile: builder.query<AuthInfo, void>({
            query: () => ({
                url: `/users/my-profile`,
                method: 'GET',
            }),
            transformResponse: (responseData: ApiResponse<AuthInfo>): AuthInfo => {
                return responseData.data;
            },
            onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
                const { data } = await queryFulfilled;
                const token = getToken();
                if (token) {
                    dispatch(setCredentials({ user: data, token }));
                }
            },
            providesTags: [
                TAG_TYPES.AUTH,
            ]
        }),

        // UPDATE user-profile
        updateUserProfile: builder.mutation<ApiResponse<null>, User>({
            query: (body) => ({
                url: `/users/my-profile`,
                method: 'PUT',
                body
            }),
            invalidatesTags: [TAG_TYPES.AUTH]
        }),

        // LOGIN
        login: builder.mutation<AuthLoginResponse, AuthLoginRequestBody>({
            query: (credentials) => ({
                url: '/account/login',
                method: 'POST',
                body: credentials,
            }),
            transformResponse: (responseData: ApiResponse<AuthLoginResponse>): AuthLoginResponse => {
                return responseData.data;
            },
            onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
                const { data } = await queryFulfilled;
                saveToken(data.accessToken);
                dispatch(setCredentials({
                    user: data.userResponse,
                    token: data.accessToken,
                }));
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
    useGetUserProfileQuery,
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation,
    useForgotPasswordMutation,
    useReconfirmPasswordMutation,
    useChangePasswordMutation,
    useUpdateUserProfileMutation
} = authApi;