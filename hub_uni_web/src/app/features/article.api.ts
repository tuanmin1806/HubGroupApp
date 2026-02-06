import { ApiPaginationResponse } from "../models/api.model";
import { ArticleDetailResponse, ArticleFilterParams, ArticleResponse } from "../models/article.model";
import baseApi from "./base.api";

const buildQueryString = (params?: ArticleFilterParams): string => {
    if (!params) return "";
    return new URLSearchParams(
        Object.entries(params)
            .filter(
                ([_, value]) => value !== undefined && value !== null && value !== ""
            )
            .map(([key, value]) => [key, String(value)])
    ).toString();
};

const articleApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getArticlesByPageNoAuthen: builder.query<ApiPaginationResponse<ArticleResponse[]>, ArticleFilterParams>({
            query: (params) => {
                const queryString = buildQueryString(params);
                return {
                    url: `article/getbypagenoauthen?${queryString}`,
                    method: "GET",
                };
            },
            transformResponse: (responseData: {
                Items: ArticleResponse[];
                Total: number;
            }): ApiPaginationResponse<ArticleResponse[]> => ({
                Items: responseData.Items,
                Total: responseData.Total,
            }),
        }),

        getArticleBySeo: builder.query<ArticleDetailResponse, string>({
            query: (seo) => ({
                url: `article/getbyseourl/${seo}`,
                method: 'GET',
            }),
        }),
    }),
});

export const {
    useGetArticlesByPageNoAuthenQuery,
    useGetArticleBySeoQuery
} = articleApi;