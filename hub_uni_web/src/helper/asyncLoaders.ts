// src/utils/asyncLoaders.ts
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "../constants/common.constant";

export const createAsyncLoader = (queryFn: any) => {
    return async ({ search = "", page = DEFAULT_PAGE, size = DEFAULT_PAGE_SIZE }: {
        search?: string;
        page?: number;
        size?: number;
    }) => {
        try {
            const response = await queryFn({
                page,
                size,
                search: search.trim()
            }).unwrap();

            return response?.Items?.map((item: any) => ({
                value: item.Id,
                label: item.Name,
            })) || [];
        } catch (error) {
            console.error(error);
            return [];
        }
    };
};