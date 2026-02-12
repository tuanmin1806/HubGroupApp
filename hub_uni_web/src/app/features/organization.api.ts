import { ApiPaginationResponse } from "../models/api.model";
import { OrganizationDetailResponse, OrganizationFilterParams, OrganizationResponse } from "../models/organization.model";
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

        getOrganizationBySeo: builder.query<OrganizationDetailResponse, string>({
            query: (seo) => ({
                url: `organization/getbyseourl/${seo}`,
                method: 'GET',
            }),
        }),
    }),
});

export const {
    useOrganizationsFullTextSearchQuery,
    useOrganizationsGetByPageNoAuthenQuery,
    useGetOrganizationBySeoQuery
} = organizationApi;