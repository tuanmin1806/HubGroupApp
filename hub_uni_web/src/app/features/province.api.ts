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
    })
});

export const {
    useGetAllProvinceNoAuthenQuery,
} = provinceApi;