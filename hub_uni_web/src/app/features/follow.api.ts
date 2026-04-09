import { ApiPaginationResponse } from "../models/api.model";
import { CreateFollowRequest, FollowFilterParams, FollowResponse } from "../models/follow.model";
import baseApi from "./base.api";
import { TAG_TYPES } from "./tags";

const buildQueryString = (params?: FollowFilterParams): string => {
    if (!params) return "";
    return new URLSearchParams(
        Object.entries(params)
            .filter(
                ([_, value]) => value !== undefined && value !== null && value !== ""
            )
            .map(([key, value]) => [key, String(value)])
    ).toString();
};

const followApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getFollowByOrganization: builder.query<ApiPaginationResponse<FollowResponse[]>, FollowFilterParams>({
            query: (params) => {
                const queryString = buildQueryString(params);
                return {
                    url: `follow/getfollowers?${queryString}`,
                    method: "GET",
                };
            },
            transformResponse: (responseData: {
                Items: FollowResponse[];
                Total: number;
            }): ApiPaginationResponse<FollowResponse[]> => ({
                Items: responseData.Items,
                Total: responseData.Total,
            }),
            providesTags: [TAG_TYPES.FOLLOW],
        }),

        getFollowByCustomer: builder.query<ApiPaginationResponse<FollowResponse[]>, FollowFilterParams>({
            query: (params) => {
                const queryString = buildQueryString(params);
                return {
                    url: `follow/getbycustomer?${queryString}`,
                    method: "GET",
                };
            },
            transformResponse: (responseData: {
                Items: FollowResponse[];
                Total: number;
            }): ApiPaginationResponse<FollowResponse[]> => ({
                Items: responseData.Items,
                Total: responseData.Total,
            }),
            providesTags: [TAG_TYPES.FOLLOW],
        }),

        createFollow: builder.mutation<void, CreateFollowRequest>({
            query: (body) => ({
                url: "follow/add",
                method: "POST",
                body,
            }),
            invalidatesTags: [TAG_TYPES.FOLLOW],
        }),

        deleteFollow: builder.mutation<void, string>({
            query: (id) => ({
                url: `follow/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [TAG_TYPES.FOLLOW],
        }),
    }),
});

export const {
    useGetFollowByOrganizationQuery,
    useGetFollowByCustomerQuery,
    useCreateFollowMutation,
    useDeleteFollowMutation,
} = followApi;