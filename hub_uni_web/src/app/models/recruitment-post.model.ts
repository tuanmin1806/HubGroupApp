import { OrganizationResponse } from "./organization.model";
import { ProfessionResponse } from "./profession.model";

export interface Requirement {
    FromAge: number;
    ToAge: number;
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
    Description: string;
    ProvinceId: string;
    Currency: string;
    Requirement: Requirement;
    RecruitmentToDate: string;
    IsTop: boolean;
    Organization: OrganizationResponse;
    Province: string;
    Professions: ProfessionResponse[];
    SeoUrl: string;
}

export interface RecruitmentPostFilterParams {
    page?: number;
    size?: number;
    professionId?: string;
    provinceId?: string;
    searchValue?: string;
}