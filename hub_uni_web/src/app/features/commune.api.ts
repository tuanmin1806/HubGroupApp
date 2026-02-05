import { CommuneResponse } from "../models/commune.model";
import baseApi from "./base.api";

const communeApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getCommunesByProvince: builder.query<CommuneResponse[], string>({
            query: (seo) => ({
                url: `commune/getbyprovinceseo/${seo}`,
                method: "GET",
            }),
            transformResponse: (response: { Total: number; Items: CommuneResponse[] }): CommuneResponse[] => {
                return response.Items || [];
            },
        }),
    }),
});

export const { useGetCommunesByProvinceQuery } = communeApi;