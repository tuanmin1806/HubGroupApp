import { OrgStatus } from "./enums.model";

export interface Profession {
    ProfessionId: string;
    ProfessionName?: string;
    ProfessionSeoUrl?: string;
    Cost: number;
}

export interface Scholarship {
    Id?: string;
    Name: string;
    Gpa: string;
    VisaTypeId: string;
    VisaType?: string;
    LanguageLevelId: string;
    LanguageLevel?: string;
    Percentage: string;
    Description: string;
    OrganizationEnglishName?: string;
    OrganizationName?: string;
    OrganizationLogoUrl?: string;
    OrganizationCode?: string;
    OrganizationSeoUrl?: string;
    OrganizationId?: string;
}

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
    Professions: Profession[];
    MainProfessionId: string;
    MainProfession: Profession;
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
    OrgStatus: OrgStatus;
    Description: string;
    Currency: string;
    DormCost: number;
    FollowId: string;
    Followed: boolean;
    FollowCount: number;
}

export interface OrganizationResponse {
    Id: string;
    Name: string;
    InternationalName: string;
    SeoUrl: string;
    Code: string;
    TaxCode: string;
    Province: string;
    ProvinceSeo: string;
    Commune: string;
    CommuneSeo: string;
    Address: string;
    LogoFullUrl: string;
    MainProfession: Profession;
    Professions: Profession[];
    OrganizationType: string;
    Summary: string;
    IsTop: boolean;
    Highlights: string[];
    WebsiteUrl: string;
    DormCost: number;
}

export interface UpdateOrganizationRequest {
    Id: string;
    OrgStatus: OrgStatus;
    Name: string;
    TaxCode: string;
    OrganizationTypeId: string;
    Professions: Profession[];
    MainProfession: Profession;
    DormCost: number;
    ProvinceId: string;
    CommuneId: string;
    Address: string;
    WebsiteUrl: string;
    PhoneNumber: string;
    Email: string;
    ManagedBy: string;
    LogoUrl: string;
    WallpaperUrl: string;
    IsTop: boolean;
    InternationalName: string;
    Summary: string;
    FacebookUrl?: string;
    LinkedinUrl?: string;
    YoutubeUrl?: string;
    GoogleMapUrl?: string;
    TwitterUrl?: string;
    InstagramUrl?: string;
    Highlights?: string[];
    FeaturedImageUrls?: string[];
    Description: string;
}

export interface UpdateOrganizationLogoRequest {
    Id: string;
    formData: FormData;
}

export interface OrganizationFilterParams {
    page?: number;
    size?: number;
    searchValue?: string;
    organizationTypeId?: string;
    professionId?: string;
    provinceId?: string;
    communeId?: string;
    taxSearch?: string;
    representativeSearch?: string;
}