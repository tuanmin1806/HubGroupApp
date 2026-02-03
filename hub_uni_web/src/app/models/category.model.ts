export interface CategoryResponse {
    Id: string;
    Seo: string;
    Name: string;
    Code: string;
}

export interface CategoryFilterParams {
    page?: number;
    size?: number;
    searchValue?: string;
}