import { OrganizationResponse } from "./organization.model";
import { ProfessionResponse } from "./profession.model";

export interface Requirement {
    FromAge: number | undefined;
    ToAge: number | undefined;
    Gender: string;
    Experience: string;
    EducationLevel: string;
}

export interface RecruitmentPostResponse {
    Id: string;
    Status: string;
    Name: string;
    OrganizationId: string;
    ProfessionIds: string[];
    Quantity: number;
    Cost: number;
    CostUsd: number;
    Description: string;
    ProvinceId: string;
    Currency: string;
    Requirement: Requirement;
    RecruitmentFromDate: string; 
    RecruitmentToDate: string;
    IsTop: boolean;
    Organization: OrganizationResponse;
    Province: string;
    Professions: ProfessionResponse[];
    SeoUrl: string;
    MinCost: number;
    MaxCost: number;
    Highlights?: string[];
}

export interface CreateRecruitmentPostRequest {
    Status: string;
    Name: string;
    ProfessionIds: string[];
    Quantity: number;
    Description: string;
    ProvinceId: string;
    Currency: string;
    Requirement: Requirement;
    RecruitmentToDate: string;
    IsTop: boolean;
    Highlights: string[];
}

export interface RecruitmentPostFilterParams {
    page?: number;
    size?: number;
    professionId?: string;
    provinceId?: string;
    fromCost?: number;
    toCost?: number;
    searchValue?: string;
}