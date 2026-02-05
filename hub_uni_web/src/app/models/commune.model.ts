export interface CommuneResponse {
    Id: string;
    Name: string;
    ProvinceName: string;
    Seo: string;
    SeoUrl: string;
    Code: string;
    ProvinceId: string;
    CreatedBy?: string;
    CreatedAt?: string;
    UpdatedAt?: string;
    UpdatedBy?: string;
    Status?: string;
}

export interface CommuneFilterParams {
    page?: number;
    size?: number;
    provinceId?: string;
    searchValue?: string | undefined;
}