import { Province } from "../models/province.model";
import baseApi from "./base.api";

const provinceApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllProvinceNoAuthen: builder.query<Province[], void>({
            query: () => ({
                url: `province/getallnoauthen`,
                method: "GET",
            }),
            transformResponse: (response: Province[]): Province[] => {
                return response;
            }
        }),

        getProvinceByCountry: builder.query<Province[], string>({
            query: (seo) => ({
                url: `province/getbycountryseourl/${seo}`,
                method: "GET",
            }),
            transformResponse: (response: { Total: number; Items: Province[] }): Province[] => {
                return response.Items || [];
            },
        }),
    })
});

export const {
    useGetAllProvinceNoAuthenQuery,
    useGetProvinceByCountryQuery,
} = provinceApi;