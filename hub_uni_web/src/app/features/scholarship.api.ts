import { ApiPaginationResponse } from "../models/api.model";
import { Scholarship } from "../models/organization.model";
import { CreateScholarshipRequest, ScholarshipFilterParams, ScholarshipResponse, UpdateScholarshipRequest } from "../models/scholarship.model";
import baseApi from "./base.api";
import { TAG_TYPES } from "./tags";

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

        getRecommendScholarships: builder.query<ApiPaginationResponse<ScholarshipResponse[]>, ScholarshipFilterParams>({
            query: (params) => {
                const queryString = buildQueryString(params);
                return {
                    url: `scholarship/recommend?${queryString}`,
                    method: "GET",
                };
            },
            transformResponse: (responseData: {
                Items: ScholarshipResponse[];
                Total: number;
            }): ApiPaginationResponse<ScholarshipResponse[]> => ({
                Items: responseData.Items,
                Total: responseData.Total,
            }),
            providesTags: [TAG_TYPES.SCHOLARSHIP],
        }),

        getScholarshipsByOrganization: builder.query<ApiPaginationResponse<ScholarshipResponse[]>, ScholarshipFilterParams>({
            query: (params) => {
                const queryString = buildQueryString(params);
                return {
                    url: `scholarship/getbyorganization?${queryString}`,
                    method: "GET",
                };
            },
            transformResponse: (responseData: {
                Items: ScholarshipResponse[];
                Total: number;
            }): ApiPaginationResponse<ScholarshipResponse[]> => ({
                Items: responseData.Items,
                Total: responseData.Total,
            }),
            providesTags: [TAG_TYPES.SCHOLARSHIP],
        }),

        getScholarshipById: builder.query<Scholarship, string>({
            query: (id) => ({
                url: `scholarship/getbyid?id=${id}`,
                method: 'GET',
            }),
            providesTags: [TAG_TYPES.SCHOLARSHIP],
        }),

        createScholarship: builder.mutation<void, CreateScholarshipRequest>({
            query: (body) => ({
                url: "scholarship/add",
                method: "POST",
                body,
            }),
            invalidatesTags: [TAG_TYPES.SCHOLARSHIP],
        }),

        updateScholarship: builder.mutation<void, UpdateScholarshipRequest>({
            query: (body) => ({
                url: "scholarship/update",
                method: "PUT",
                body,
            }),
            invalidatesTags: [TAG_TYPES.SCHOLARSHIP],
        }),

        deleteScholarship: builder.mutation<void, string>({
            query: (id) => ({
                url: `scholarship/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [TAG_TYPES.SCHOLARSHIP],
        }),
    }),
});

export const {
    useGetRecommendScholarshipsQuery,
    useLazyGetRecommendScholarshipsQuery,
    useGetScholarshipByIdQuery,
    useLazyGetScholarshipByIdQuery,
    useGetScholarshipsByOrganizationQuery,
    useLazyGetScholarshipsByOrganizationQuery,
    useCreateScholarshipMutation,
    useUpdateScholarshipMutation,
    useDeleteScholarshipMutation,
} = scholarshipApi;