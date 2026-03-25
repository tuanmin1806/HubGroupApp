import { ApiPaginationResponse } from "../models/api.model";
import { CreateCustomerRequest, CustomerFilterParams, CustomerResponse, UpdateCustomerAvatarRequest, UpdateCustomerRequest, UpdatePasswordRequest } from "../models/customer.model";
import baseApi from "./base.api";
import { TAG_TYPES } from "./tags";

const buildQueryString = (params?: CustomerFilterParams): string => {
    if (!params) return "";
    return new URLSearchParams(
        Object.entries(params)
            .filter(
                ([_, value]) => value !== undefined && value !== null && value !== ""
            )
            .map(([key, value]) => [key, String(value)])
    ).toString();
};

const customerApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getCustomerByOrganizationWithPage: builder.query<ApiPaginationResponse<CustomerResponse[]>, CustomerFilterParams>({
            query: (params) => {
                const queryString = buildQueryString(params);
                return {
                    url: `customer/getbyorganization?${queryString}`,
                    method: "GET",
                };
            },
            transformResponse: (responseData: {
                Items: CustomerResponse[];
                Total: number;
            }): ApiPaginationResponse<CustomerResponse[]> => ({
                Items: responseData.Items,
                Total: responseData.Total,
            }),
            providesTags: [TAG_TYPES.CUSTOMER],
        }),

        createCollabAccount: builder.mutation<void, CreateCustomerRequest>({
            query: (body) => ({
                url: "customer/addcollab",
                method: "POST",
                body,
            }),
            invalidatesTags: [TAG_TYPES.CUSTOMER],
        }),

        updateCustomer: builder.mutation<void, UpdateCustomerRequest>({
            query: (body) => ({
                url: "customer/update",
                method: "PUT",
                body,
            }),
            invalidatesTags: [TAG_TYPES.CUSTOMER],
        }),

        updatePassword: builder.mutation<void, UpdatePasswordRequest>({
            query: (body) => ({
                url: "customer/updatepassword",
                method: "POST",
                body,
            }),
            invalidatesTags: [TAG_TYPES.CUSTOMER],
        }),

        getCustomerInfor: builder.query<CustomerResponse, string>({
            query: (id) => ({
                url: `customer/getbyid?id=${id}`,
                method: 'GET',
            }),
            providesTags: [TAG_TYPES.CUSTOMER],
        }),

        getCustomerById: builder.query<CustomerResponse, string>({
            query: (id) => ({
                url: `customer/getbyid?id=${id}`,
                method: 'GET',
            }),
            providesTags: [TAG_TYPES.CUSTOMER],
        }),

        updateCustomerAvatar: builder.mutation<void, FormData>({
            query: (formData) => ({
                url: `customer/updateavatar`,
                method: "POST",
                body: formData,
            }),
            invalidatesTags: [TAG_TYPES.CUSTOMER],
        }),

        deleteCustomer: builder.mutation<void, string>({
            query: (id) => ({
                url: `customer/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [TAG_TYPES.CUSTOMER],
        }),
    }),
});

export const {
    useGetCustomerByOrganizationWithPageQuery,
    useCreateCollabAccountMutation,
    useGetCustomerInforQuery,
    useGetCustomerByIdQuery,
    useLazyGetCustomerByIdQuery,
    useUpdateCustomerMutation,
    useUpdateCustomerAvatarMutation,
    useDeleteCustomerMutation
} = customerApi;