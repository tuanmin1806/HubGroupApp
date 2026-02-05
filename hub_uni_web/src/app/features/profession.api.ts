import { ProfessionResponse } from "../models/profession.model";
import baseApi from "./base.api";

const professionApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllProfessionNoAuthen: builder.query<ProfessionResponse[], void>({
            query: () => ({
                url: `profession/getall`,
                method: "GET",
            }),
            transformResponse: (response: ProfessionResponse[]): ProfessionResponse[] => {
                return response;
            },
        }),
    }),
});

export const {
    useGetAllProfessionNoAuthenQuery,
} = professionApi;