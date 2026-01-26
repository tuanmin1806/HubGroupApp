export interface ApiResponse<T> {
    code: number;
    message: string;
    data: T;
}

export interface ApiPaginationResponse<T> {
    content: T;
    currentPage: number;
    totalPages: number;
    totalElement: number;
}