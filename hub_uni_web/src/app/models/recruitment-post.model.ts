import { EducationLevel, Gender, JobExperience, RecruitPostStatus } from "./enums.model";
import { OrganizationResponse } from "./organization.model";

export interface Requirement {
    FromAge: number | undefined;
    ToAge: number | undefined;
    Gender: Gender;
    Experience: JobExperience;
    EducationLevel: EducationLevel;
    MinimumGpa?: number;
    MaxYearsSinceGrad?: number;
    MaxAbsence?: number;
    VisaTypeId?: string;
    OtherReqs: string[];
}

export interface Profession {
    ProfessionId: string;
    ProfessionName: string;
    ProfessionSeoUrl: string;
    Cost: number;
}

export interface ProfessionDetail {
    Id: string;
    Name: string;
    SeoUrl: string;
}

export interface RecruitmentPostDetailResponse {
    Id: string;
    Code: number;
    RecruitPostStatus: RecruitPostStatus;
    Name: string;
    Seo: string;
    SeoUrl: string;
    OrganizationId: string;
    ProfessionIds: string[];
    Quantity: number;
    Cost: number;
    CostUsd: number;
    MinCost: number;
    MaxCost: number;
    Currency: string;
    Description: string;
    ProvinceId: string;
    Province: string;
    Requirement: Requirement;
    RecruitmentFromDate: string;
    RecruitmentToDate: string;
    IsTop: boolean;
    Highlights: string[];
    Applied: boolean;
    Organization: OrganizationResponse;
    Professions: ProfessionDetail[];
    CreatedBy: string;
    CreatedAt: string;
    UpdatedAt: string;
    UpdatedBy: string;
}

export interface RecruitmentPostResponse {
    Id: string;
    Code: number;
    RecruitPostStatus: RecruitPostStatus;
    Name: string;
    Seo: string;
    SeoUrl: string;
    OrganizationId: string;
    ProfessionIds: string[];
    Quantity: number;
    Cost: number;
    CostUsd: number;
    MinCost: number;
    MaxCost: number;
    Currency: string;
    Description: string;
    ProvinceId: string;
    Province: string;
    Requirement: Requirement;
    RecruitmentFromDate: string;
    RecruitmentToDate: string;
    IsTop: boolean;
    Highlights: string[];
    Applied: boolean;
    Organization: OrganizationResponse;
    Professions: Profession[];
    CreatedBy: string;
    CreatedAt: string;
    UpdatedAt: string;
    UpdatedBy: string;
}

export interface CreateRecruitmentPostRequest {
    RecruitPostStatus: RecruitPostStatus | undefined;
    Name: string;
    ProfessionIds: string[];
    Quantity: number;
    Description: string;
    ProvinceId: string;
    Requirement: Requirement;
    RecruitmentFromDate: string | null;
    RecruitmentToDate: string | null;
    IsTop: boolean;
    Highlights: string[];
}

export interface UpdateRecruitmentPostRequest {
    Id: string;
    RecruitPostStatus: RecruitPostStatus;
    Name: string;
    ProfessionIds: string[];
    Quantity: number;
    Description: string;
    ProvinceId: string;
    Requirement: Requirement;
    RecruitmentFromDate: string | null;
    RecruitmentToDate: string | null;
    IsTop: boolean;
    Highlights: string[];
}

export interface UpdateRecruitmentPostRequest {
    Id: string;
    RecruitPostStatus: RecruitPostStatus;
    Name: string;
    OrganizationId: string;
    ProfessionIds: string[];
    Quantity: number;
    Description: string;
    ProvinceId: string;
    Requirement: Requirement;
    RecruitmentFromDate: string | null;
    RecruitmentToDate: string | null;
    IsTop: boolean;
    Highlights: string[];
}

export interface RecruitmentPostFilterParams {
    page?: number;
    size?: number;
    organizationId?: string;
    professionId?: string;
    provinceId?: string;
    visaTypeId?: string;
    fromCost?: number;
    toCost?: number;
    searchValue?: string;
}