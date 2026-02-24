import { ApplicationRequest } from "../models/application.model";
import baseApi from "./base.api";

const applicationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        createApplication: builder.mutation<void, ApplicationRequest>({
            query: (body) => ({
                url: "application/add",
                method: "POST",
                body,
            }),
        }),
    }),
});

export const {
    useCreateApplicationMutation,
} = applicationApi;