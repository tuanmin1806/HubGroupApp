import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "../constants/common.constant";

export const createAsyncLoader = (queryFn: any) => {
    return async ({
        searchValue = "",
        page = DEFAULT_PAGE,
        size = DEFAULT_PAGE_SIZE,
    }: {
        searchValue?: string;
        page?: number;
        size?: number;
    }): Promise<{ value: string; label: string }[]> => {
        try {
            const response = await queryFn({ page, size, searchValue: searchValue.trim() }).unwrap();
            return response?.Items?.map((item: any) => ({
                value: item.Id,
                label: item.Name ?? "",
            })) ?? [];
        } catch (error) {
            return [];
        }
    };
};