import { Country } from "../models/country.model";
import baseApi from "./base.api";

const countryApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getAllCountryNoAuthen: builder.query<Country[], void>({
            query: () => ({
                url: `country/getallnoauthen`,
                method: "GET",
            }),
            transformResponse: (response: Country[]): Country[] => {
                return response;
            }
        }),
    }),
});

export const {
    useGetAllCountryNoAuthenQuery
} = countryApi;