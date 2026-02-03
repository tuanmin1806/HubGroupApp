export interface ApiPaginationResponse<T> {
    Total: number;
    Items: T;
}

export interface ApiResponse<T> {
    Data: T;
}