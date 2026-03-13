import { ApiPaginationResponse } from "../models/api.model";
import { OrganizationDetailResponse, OrganizationFilterParams, OrganizationResponse, UpdateOrganizationLogoRequest, UpdateOrganizationRequest } from "../models/organization.model";
import baseApi from "./base.api";

const buildQueryString = (params?: OrganizationFilterParams): string => {
    if (!params) return "";
    return new URLSearchParams(
        Object.entries(params)
            .filter(
                ([_, value]) => value !== undefined && value !== null && value !== ""
            )
            .map(([key, value]) => [key, String(value)])
    ).toString();
};

const organizationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        organizationsFullTextSearch: builder.query<ApiPaginationResponse<OrganizationResponse[]>, OrganizationFilterParams>({
            query: (params) => {
                const queryString = buildQueryString(params);
                return {
                    url: `organization/fulltextsearch?${queryString}`,
                    method: "GET",
                };
            },
            transformResponse: (responseData: {
                Items: OrganizationResponse[];
                Total: number;
            }): ApiPaginationResponse<OrganizationResponse[]> => ({
                Items: responseData.Items,
                Total: responseData.Total,
            }),
        }),

        organizationsGetByPageNoAuthen: builder.query<ApiPaginationResponse<OrganizationResponse[]>, OrganizationFilterParams>({
            query: (params) => {
                const queryString = buildQueryString(params);
                return {
                    url: `organization/getbypagenoauthen?${queryString}`,
                    method: "GET",
                };
            },
            transformResponse: (responseData: {
                Items: OrganizationResponse[];
                Total: number;
            }): ApiPaginationResponse<OrganizationResponse[]> => ({
                Items: responseData.Items,
                Total: responseData.Total,
            }),
        }),

        organizationsNameSearch: builder.query<ApiPaginationResponse<OrganizationResponse[]>, OrganizationFilterParams>({
            query: (params) => {
                const queryString = buildQueryString(params);
                return {
                    url: `organization/namesearch?${queryString}`,
                    method: "GET",
                };
            },
            transformResponse: (responseData: {
                Items: OrganizationResponse[];
                Total: number;
            }): ApiPaginationResponse<OrganizationResponse[]> => ({
                Items: responseData.Items,
                Total: responseData.Total,
            }),
        }),

        getOrganizationBySeo: builder.query<OrganizationDetailResponse, string>({
            query: (seo) => ({
                url: `organization/getbyseourl/${seo}`,
                method: 'GET',
            }),
        }),

        getOrganizationById: builder.query<OrganizationDetailResponse, string>({
            query: (id) => ({
                url: `organization/getbyid?id=${id}`,
                method: 'GET',
            }),
        }),

        updateOrganization: builder.mutation<void, UpdateOrganizationRequest>({
            query: (body) => ({
                url: "organization/update",
                method: "PUT",
                body,
            }),
        }),

        updateOrganizationLogo: builder.mutation<void, UpdateOrganizationLogoRequest>({
            query: ({ Id, formData }) => ({
                url: `organization/updatelogo?organizationId=${Id}`,
                method: "PUT",
                body: formData,
            }),
        }),
    }),
});

export const {
    useOrganizationsFullTextSearchQuery,
    useOrganizationsGetByPageNoAuthenQuery,
    useGetOrganizationByIdQuery,
    useGetOrganizationBySeoQuery,
    useUpdateOrganizationMutation,
    useLazyGetOrganizationByIdQuery,
    useLazyOrganizationsNameSearchQuery,
    useLazyGetOrganizationBySeoQuery,
    useUpdateOrganizationLogoMutation
} = organizationApi;