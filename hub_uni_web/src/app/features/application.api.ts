import { ApiPaginationResponse } from "../models/api.model";
import { ApplicationFilterParams, ApplicationRequest, ApplicationResponse, UpdateApplicationRequest } from "../models/application.model";
import baseApi from "./base.api";

const buildQueryString = (params?: ApplicationFilterParams): string => {
    if (!params) return "";
    return new URLSearchParams(
        Object.entries(params)
            .filter(
                ([_, value]) => value !== undefined && value !== null && value !== ""
            )
            .map(([key, value]) => [key, String(value)])
    ).toString();
};

const applicationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getApplicationByOrganization: builder.query<ApiPaginationResponse<ApplicationResponse[]>, ApplicationFilterParams>({
            query: (params) => {
                const queryString = buildQueryString(params);
                return {
                    url: `application/getbyorganization?${queryString}`,
                    method: "GET",
                };
            },
            transformResponse: (responseData: {
                Items: ApplicationResponse[];
                Total: number;
            }): ApiPaginationResponse<ApplicationResponse[]> => ({
                Items: responseData.Items,
                Total: responseData.Total,
            }),
        }),

        getByCustomer: builder.query<ApiPaginationResponse<ApplicationResponse[]>, ApplicationFilterParams>({
            query: (params) => {
                const queryString = buildQueryString(params);
                return {
                    url: `application/getbycustomer?${queryString}`,
                    method: "GET",
                };
            },
            transformResponse: (responseData: {
                Items: ApplicationResponse[];
                Total: number;
            }): ApiPaginationResponse<ApplicationResponse[]> => ({
                Items: responseData.Items,
                Total: responseData.Total,
            }),
        }),

        createApplication: builder.mutation<void, ApplicationRequest>({
            query: (body) => ({
                url: "application/add",
                method: "POST",
                body,
            }),
        }),

        updateApplication: builder.mutation<void, UpdateApplicationRequest>({
            query: (body) => ({
                url: `application/setstatus`,
                method: "PUT",
                body,
            }),
        }),

        getApplicationById: builder.query<ApplicationResponse, string>({
            query: (id) => ({
                url: `application/getbyid?id=${id}`,
                method: 'GET',
            }),
        }),
    }),
});

export const {
    useCreateApplicationMutation,
    useGetApplicationByOrganizationQuery,
    useUpdateApplicationMutation,
    useGetApplicationByIdQuery,
    useGetByCustomerQuery
} = applicationApi;