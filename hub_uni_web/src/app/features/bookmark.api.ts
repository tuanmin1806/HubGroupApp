import { ApiPaginationResponse } from "../models/api.model";
import { BookmarkFilterParams, BookmarkResponse, CreateBookmarkRequest } from "../models/book-mark.model";
import baseApi from "./base.api";
import { TAG_TYPES } from "./tags";

const buildQueryString = (params?: BookmarkFilterParams): string => {
    if (!params) return "";
    return new URLSearchParams(
        Object.entries(params)
            .filter(
                ([_, value]) => value !== undefined && value !== null && value !== ""
            )
            .map(([key, value]) => [key, String(value)])
    ).toString();
};

const bookmarkApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getBookmarkByCustomer: builder.query<ApiPaginationResponse<BookmarkResponse[]>, BookmarkFilterParams>({
            query: (params) => {
                const queryString = buildQueryString(params);
                return {
                    url: `bookmark/getbycustomer?${queryString}`,
                    method: "GET",
                };
            },
            transformResponse: (responseData: {
                Items: BookmarkResponse[];
                Total: number;
            }): ApiPaginationResponse<BookmarkResponse[]> => ({
                Items: responseData.Items,
                Total: responseData.Total,
            }),
            providesTags: [TAG_TYPES.BOOKMARK],
        }),

        createBookmark: builder.mutation<void, CreateBookmarkRequest>({
            query: (body) => ({
                url: "bookmark/add",
                method: "POST",
                body,
            }),
            invalidatesTags: [TAG_TYPES.BOOKMARK],
        }),

        deleteBookmark: builder.mutation<void, string>({
            query: (id) => ({
                url: `bookmark/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [TAG_TYPES.BOOKMARK],
        }),
    }),
});

export const {
    useGetBookmarkByCustomerQuery,
    useCreateBookmarkMutation,
    useDeleteBookmarkMutation,
} = bookmarkApi;