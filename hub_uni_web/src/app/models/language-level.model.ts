export interface LanguageLevel {
    Id: string;
    Name: string;
    Description: string;
}

export interface LanguageLevelFilterParams {
    page?: number;
    size?: number;
    searchValue?: string;
}