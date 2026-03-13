import { ApiPaginationResponse } from "../models/api.model";
import { CreateRecruitmentPostRequest, RecruitmentPostFilterParams, RecruitmentPostResponse, UpdateRecruitmentPostRequest } from "../models/recruitment-post.model";
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

        getRecruitmentPostsByCurrentCustomer: builder.query<ApiPaginationResponse<RecruitmentPostResponse[]>, RecruitmentPostFilterParams>({
            query: (params) => {
                const queryString = buildQueryString(params);
                return {
                    url: `recruitmentpost/getbycurrentcustomer?${queryString}`,
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

        getRecruitmentPostById: builder.query<RecruitmentPostResponse, string>({
            query: (id) => ({
                url: `recruitmentpost/getbyid?id=${id}`,
                method: 'GET',
            }),
        }),

        createRecruitmentPost: builder.mutation<void, CreateRecruitmentPostRequest>({
            query: (body) => ({
                url: "recruitmentpost/customadd",
                method: "POST",
                body,
            }),
        }),

        updateRecruitmentPost: builder.mutation<void, UpdateRecruitmentPostRequest>({
            query: (body) => ({
                url: "recruitmentpost/update",
                method: "PUT",
                body,
            })
        }),
    }),
});

export const {
    useGetRecruitmentPostsByPageQuery,
    useGetRecruitmentPostBySeoQuery,
    useGetRecruitmentPostsByCurrentCustomerQuery,
    useCreateRecruitmentPostMutation,
    useGetRecruitmentPostsByOrganizationWithPageQuery,
    useGetRecruitmentPostByIdQuery,
    useUpdateRecruitmentPostMutation,
    useLazyGetRecruitmentPostByIdQuery
} = recruitmentPostApi;