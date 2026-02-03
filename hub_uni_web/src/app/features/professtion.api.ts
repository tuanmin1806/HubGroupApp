import { ApiPaginationResponse } from "../models/api.model";
import { ProfessionFilterParams, ProfessionResponse } from "../models/profession.model";
import baseApi from "./base.api";

const buildQueryString = (params?: ProfessionFilterParams): string => {
    if (!params) return "";
    return new URLSearchParams(
        Object.entries(params)
            .filter(
                ([_, value]) => value !== undefined && value !== null && value !== ""
            )
            .map(([key, value]) => [key, String(value)])
    ).toString();
};

const professionApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getProfessionsByPage: builder.query<ApiPaginationResponse<ProfessionResponse[]>, ProfessionFilterParams>({
            query: (params) => {
                const queryString = buildQueryString(params);
                return {
                    url: `profession/getbypagenoauthen?${queryString}`,
                    method: "GET",
                };
            },
            transformResponse: (responseData: {
                Items: ProfessionResponse[];
                Total: number;
            }): ApiPaginationResponse<ProfessionResponse[]> => ({
                Items: responseData.Items,
                Total: responseData.Total,
            }),
        }),
    }),
});

export const {
    useGetProfessionsByPageQuery,
} = professionApi;