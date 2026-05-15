import { ApiPaginationResponse } from "../models/api.model";
import { LanguageLevel, LanguageLevelFilterParams, } from "../models/language-level.model";
import baseApi from "./base.api";

const buildQueryString = (params?: LanguageLevelFilterParams): string => {
    if (!params) return "";
    return new URLSearchParams(
        Object.entries(params)
            .filter(
                ([_, value]) => value !== undefined && value !== null && value !== ""
            )
            .map(([key, value]) => [key, String(value)])
    ).toString();
};

const languageLevelApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getLanguageLevelsByPage: builder.query<ApiPaginationResponse<LanguageLevel[]>, LanguageLevelFilterParams>({
            query: (params) => {
                const queryString = buildQueryString(params);
                return {
                    url: `languagelevel/getbypagenoauthen?${queryString}`,
                    method: "GET",
                };
            },
            transformResponse: (responseData: {
                Items: LanguageLevel[];
                Total: number;
            }): ApiPaginationResponse<LanguageLevel[]> => ({
                Items: responseData.Items,
                Total: responseData.Total,
            }),
        }),
    }),
});

export const {
    useGetLanguageLevelsByPageQuery,
    useLazyGetLanguageLevelsByPageQuery
} = languageLevelApi;