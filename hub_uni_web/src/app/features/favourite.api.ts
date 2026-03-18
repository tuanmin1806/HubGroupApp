import { ApiPaginationResponse } from "../models/api.model";
import { ApplicationFilterParams, ApplicationRequest, ApplicationResponse, UpdateApplicationRequest } from "../models/application.model";
import { FavouriteFilterParams, FavouriteRequest, FavouriteResponse, UpdateFavouriteRequest } from "../models/favourite.model";
import baseApi from "./base.api";
import { TAG_TYPES } from "./tags";

const buildQueryString = (params?: FavouriteFilterParams): string => {
    if (!params) return "";
    return new URLSearchParams(
        Object.entries(params)
            .filter(
                ([_, value]) => value !== undefined && value !== null && value !== ""
            )
            .map(([key, value]) => [key, String(value)])
    ).toString();
};

const favouriteApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getFavouriteRecruitPostByCustomer: builder.query<ApiPaginationResponse<FavouriteResponse[]>, FavouriteFilterParams>({
            query: (params) => {
                const queryString = buildQueryString(params);
                return {
                    url: `favourite/getbycustomer?${queryString}`,
                    method: "GET",
                };
            },
            transformResponse: (responseData: {
                Items: FavouriteResponse[];
                Total: number;
            }): ApiPaginationResponse<FavouriteResponse[]> => ({
                Items: responseData.Items,
                Total: responseData.Total,
            }),
            providesTags: [TAG_TYPES.FAVOURITE],
        }),

        createFavourite: builder.mutation<void, FavouriteRequest>({
            query: (body) => ({
                url: "favourite/add",
                method: "POST",
                body,
            }),
            invalidatesTags: [TAG_TYPES.FAVOURITE],
        }),

        updateFavourite: builder.mutation<void, UpdateFavouriteRequest>({
            query: (body) => ({
                url: `favourite/update`,
                method: "PUT",
                body,
            }),
            invalidatesTags: [TAG_TYPES.FAVOURITE],
        }),

        deleteFavourite: builder.mutation<void, string>({
            query: (id) => ({
                url: `favourite/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [TAG_TYPES.FAVOURITE],
        }),
    }),
});

export const {
    useCreateFavouriteMutation,
    useUpdateFavouriteMutation,
    useDeleteFavouriteMutation,
    useGetFavouriteRecruitPostByCustomerQuery
} = favouriteApi;