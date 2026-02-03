import { ProfessionResponse } from "./profession.model";

export interface OrganizationResponse {
    Id: string;
    Name: string;
    ShortName: string;
    OrganizationType: string;
    ProfessionIds: string[];
    MainProfessionId: string;
    ProvinceId: string;
    CommuneId: string;
    LogoUrl: string;
    LogoFullUrl: string;
    TaxCode: string;
    OrganizationTypeId: string;
    Address: string;
    PhoneNumber: string;
    Email: string;
    LegalRepresentative: string;
    WallpaperUrl: string;
    WallpaperFullUrl: string;
    ManagedBy: string;
    Keywords: string;
    Province: string;
    Commune: string;
    MainProfession: ProfessionResponse;
    Professions: ProfessionResponse[];
    WebsiteUrl: string;
    IsTop: boolean;
    InternationalName: string;
    Status: string;
    Summary: string;
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