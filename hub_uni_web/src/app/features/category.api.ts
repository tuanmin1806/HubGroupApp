import { CategoryResponse } from "../models/category.model";
import baseApi from "./base.api";

const categoryApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getAllCategory: builder.query<CategoryResponse[], void>({
            query: () => ({
                url: `category/getall`,
                method: 'GET',
            }),
        }),
    }),
});

export const { useGetAllCategoryQuery } = categoryApi;