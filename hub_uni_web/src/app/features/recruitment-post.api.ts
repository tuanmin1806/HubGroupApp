import { ApiPaginationResponse } from "../models/api.model";
import { RecruitmentPostFilterParams, RecruitmentPostResponse } from "../models/recruitment-post.model";
import baseApi from "./base.api";

const buildQueryString = (params?: RecruitmentPostFilterParams): string => {
    if (!params) return "";
    return new URLSearchParams(
        Object.entries(params)
            .filter(
                ([_, value]) => value !== undefined && value !== null && value !== ""
            )
            .map(([key, value]) => [key, String(value)])
    ).toString();
};

const recruitmentPostApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getRecruitmentPostsByPage: builder.query<ApiPaginationResponse<RecruitmentPostResponse[]>, RecruitmentPostFilterParams>({
            query: (params) => {
                const queryString = buildQueryString(params);
                return {
                    url: `recruitmentpost/getbypagenoauthen?${queryString}`,
                    method: "GET",
                };
            },
            transformResponse: (responseData: {
                Items: RecruitmentPostResponse[];
                Total: number;
            }): ApiPaginationResponse<RecruitmentPostResponse[]> => ({
                Items: responseData.Items,
                Total: responseData.Total,
            }),
        }),

        getRecruitmentPostsByOrganizationWithPage: builder.query<ApiPaginationResponse<RecruitmentPostResponse[]>, string>({
            query: (organizationSeo) => ({
                url: `recruitmentpost/getbyorganizationseo/${organizationSeo}`,
                method: "GET",
            }),
            transformResponse: (responseData: {
                Items: RecruitmentPostResponse[];
                Total: number;
            }): ApiPaginationResponse<RecruitmentPostResponse[]> => ({
                Items: responseData.Items,
                Total: responseData.Total,
            }),
        }),

        getRecruitmentPostBySeo: builder.query<RecruitmentPostResponse, string>({
            query: (seo) => ({
                url: `recruitmentpost/getbyseourl/${seo}`,
                method: 'GET',
            }),
        }),
    }),
});

export const {
    useGetRecruitmentPostsByPageQuery,
    useGetRecruitmentPostBySeoQuery,
    useGetRecruitmentPostsByOrganizationWithPageQuery
} = recruitmentPostApi;