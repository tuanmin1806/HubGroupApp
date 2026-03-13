import { ApiPaginationResponse } from "../models/api.model";
import { ProfessionFilterParams, ProfessionResponse } from "../models/profession.model";
import { VisaTypeFilterParams, VisaTypeResponse } from "../models/visa-type.model";
import baseApi from "./base.api";

const buildQueryString = (params?: VisaTypeFilterParams): string => {
    if (!params) return "";
    return new URLSearchParams(
        Object.entries(params)
            .filter(
                ([_, value]) => value !== undefined && value !== null && value !== ""
            )
            .map(([key, value]) => [key, String(value)])
    ).toString();
};

const visaTypeApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getVisaTypesByPage: builder.query<ApiPaginationResponse<VisaTypeResponse[]>, VisaTypeFilterParams>({
            query: (params) => {
                const queryString = buildQueryString(params);
                return {
                    url: `visatype/getbypagenoauthen?${queryString}`,
                    method: "GET",
                };
            },
            transformResponse: (responseData: {
                Items: VisaTypeResponse[];
                Total: number;
            }): ApiPaginationResponse<VisaTypeResponse[]> => ({
                Items: responseData.Items,
                Total: responseData.Total,
            }),
        }),
        getAllVisaTypes: builder.query<VisaTypeResponse[], void>({
            query: () => ({
                url: `visatype/getall`,
                method: "GET",
            }),
            transformResponse: (response: VisaTypeResponse[]): VisaTypeResponse[] => {
                return response;
            },
        }),
    }),
});

export const {
    useGetVisaTypesByPageQuery,
    useGetAllVisaTypesQuery
} = visaTypeApi;