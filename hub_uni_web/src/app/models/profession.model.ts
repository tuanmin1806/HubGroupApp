export interface ProfessionResponse {
    Id: string;
    Name: string;
    EnglishName: string;
    Seo: string;
    SigCode: string;
}

export interface ProfessionFilterParams {
    page?: number;
    size?: number;
    searchValue?: string;
}