import { EducationLevel, Gender, JobExperience, RecruitPostStatus } from "./enums.model";
import { OrganizationResponse } from "./organization.model";
import { ProfessionResponse } from "./profession.model";

export interface Requirement {
    FromAge: number | undefined;
    ToAge: number | undefined;
    Gender: Gender;
    Experience: JobExperience;
    EducationLevel: EducationLevel;
}

export interface RecruitmentPostResponse {
    Id: string;
    RecruitPostStatus: string;
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
    professionId?: string;
    provinceId?: string;
    visaTypeId?: string;
    fromCost?: number;
    toCost?: number;
    searchValue?: string;
}