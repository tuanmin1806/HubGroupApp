import { ApiPaginationResponse } from "../models/api.model";
import { OrganizationTypeFilterParams, OrganizationType } from "../models/organization-type.model";
import baseApi from "./base.api";

const buildQueryString = (params?: OrganizationTypeFilterParams): string => {
    if (!params) return "";
    return new URLSearchParams(
        Object.entries(params)
            .filter(
                ([_, value]) => value !== undefined && value !== null && value !== ""
            )
            .map(([key, value]) => [key, String(value)])
    ).toString();
};

const organizationTypeApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getOrganizationTypesByPage: builder.query<ApiPaginationResponse<OrganizationType[]>, OrganizationTypeFilterParams>({
            query: (params) => {
                const queryString = buildQueryString(params);
                return {
                    url: `organizationtype/getbypagenoauthen?${queryString}`,
                    method: "GET",
                };
            },
            transformResponse: (responseData: {
                Items: OrganizationType[];
                Total: number;
            }): ApiPaginationResponse<OrganizationType[]> => ({
                Items: responseData.Items,
                Total: responseData.Total,
            }),
        }),
    }),
});

export const {
    useGetOrganizationTypesByPageQuery,
} = organizationTypeApi;