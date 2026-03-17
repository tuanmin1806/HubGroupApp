import { AccountResponse, ResetPasswordRequest } from "../models/account.model";
import baseApi from "./base.api";

const accountApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        updateAvatar: builder.mutation<string, FormData>({
            query: (formData) => ({
                url: "account/updateavatar",
                method: "POST",
                body: formData,
                headers: {
                    accept: "*/*",
                },
            }),
        }),

        updatePassword: builder.mutation<void, { OldPassword: string; NewPassword: string; ConfirmPassword: string; }>({
            query: (body) => ({
                url: "account/updatepassword",
                method: "POST",
                body,
            }),
        }),

        resetPassword: builder.mutation<void, ResetPasswordRequest>({
            query: (body) => ({
                url: `account/resetpassword`,
                method: "PUT",
                body,
            }),
        }),

        getAccountById: builder.query<AccountResponse, string>({
            query: (id) => ({
                url: `account/getbyid?id=${id}`,
                method: 'GET',
            }),
        }),
    }),
});

export const {
    useUpdateAvatarMutation,
    useUpdatePasswordMutation,
    useResetPasswordMutation,
    useGetAccountByIdQuery,
} = accountApi;