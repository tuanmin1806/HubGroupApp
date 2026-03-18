export interface Country {
    Id: string;
    Name: string;
    CountryCode: string;
    SeoUrl: string;
}

export interface CountryFilterParams {
    page?: number;
    size?: number;
    searchValue?: string;
}