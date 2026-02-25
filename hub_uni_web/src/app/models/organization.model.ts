import { ProfessionResponse } from "./profession.model";

export interface OrganizationDetailResponse {
    Id: string;
    Name: string;
    EnglishName: string;
    ShortName: string;
    InternationalName: string;
    Seo: string;
    SeoUrl: string;
    TaxCode: string;
    OrganizationTypeId: string;
    OrganizationType: string;
    ProfessionIds: string[];
    Professions: ProfessionResponse[];
    MainProfessionId: string;
    MainProfession: ProfessionResponse;
    ProvinceId: string;
    Province: string;
    CommuneId: string;
    Commune: string;
    Address: string;
    PhoneNumber: string;
    Email: string;
    ManagedBy: string;
    LogoUrl: string;
    LogoFullUrl: string;
    WallpaperUrl: string;
    WallpaperFullUrl: string;
    FeaturedImageUrls: string[];
    FeaturedImageFullUrls: string[];
    Keywords: string;
    IsTop: boolean;
    Summary: string;
    WebsiteUrl: string;
    FacebookUrl: string;
    LinkedinUrl: string;
    YoutubeUrl: string;
    GoogleMapUrl: string;
    TwitterUrl: string;
    InstagramUrl: string;
    Highlights: string[];
    Code: string;
    CreatedBy: string;
    CreatedAt: string;
    UpdatedAt: string;
    UpdatedBy: string;
    Status: string;
    Description: string;
}

export interface OrganizationResponse {
    Name: string;
    SeoUrl?: string;
    TaxCode: string;
    Province: string;
    ProvinceSeo: string;
    Commune: string;
    CommuneSeo: string;
    Address: string;
    LogoFullUrl: string;
    MainProfession: ProfessionResponse;
    Professions: ProfessionResponse[];
    OrganizationType: string;
    Summary: string;
    IsTop: boolean;
    Highlights: string[];
}

export interface OrganizationFilterParams {
    page?: number;
    size?: number;
    nameSearch?: string;
    organizationTypeId?: string;
    professionId?: string;
    provinceId?: string;
    communeId?: string;
    taxSearch?: string;
    representativeSearch?: string;
}