import { ApiPaginationResponse } from "../models/api.model";
import { Scholarship } from "../models/organization.model";
import { ScholarshipFilterParams } from "../models/scholarship.model";
import baseApi from "./base.api";

const buildQueryString = (params?: ScholarshipFilterParams): string => {
    if (!params) return "";
    return new URLSearchParams(
        Object.entries(params)
            .filter(
                ([_, value]) => value !== undefined && value !== null && value !== ""
            )
            .map(([key, value]) => [key, String(value)])
    ).toString();
};

const scholarshipApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getRecommendScholarships: builder.query<ApiPaginationResponse<Scholarship[]>, ScholarshipFilterParams>({
            query: (params) => {
                const queryString = buildQueryString(params);
                return {
                    url: `scholarship/recommend?${queryString}`,
                    method: "GET",
                };
            },
            transformResponse: (responseData: {
                Items: Scholarship[];
                Total: number;
            }): ApiPaginationResponse<Scholarship[]> => ({
                Items: responseData.Items,
                Total: responseData.Total,
            }),
        }),
    }),
});

export const {
    useGetRecommendScholarshipsQuery,
    useLazyGetRecommendScholarshipsQuery
} = scholarshipApi;