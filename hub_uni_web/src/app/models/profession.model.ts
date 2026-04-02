export interface ProfessionResponse {
    Id: string;
    Name: string;
    EnglishName: string;
    Seo: string;
    SigCode: string;
    ProfessionId: string;
    ProfessionName: string;
    ProfessionSeoUrl: string;
    Cost: number;
}

export interface ProfessionFilterParams {
    page?: number;
    size?: number;
    searchValue?: string;
}