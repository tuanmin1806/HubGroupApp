export interface ScholarshipResponse {
    Id: string;
    OrganizationId: string;
    Name: string;
    Gpa: number;
    VisaTypeId: string;
    VisaType?: string;
    LanguageLevelId: string;
    LanguageLevel?: string;
    Percentage: number;
    Description: string;
}

export interface CreateScholarshipRequest {
    OrganizationId: string;
    Name: string;
    Gpa: string | null;
    VisaTypeId: string;
    LanguageLevelId: string;
    Percentage: string | null;
    Description: string;
}

export interface UpdateScholarshipRequest {
    Id: string;
    OrganizationId: string;
    Name: string;
    Gpa: string | null;
    VisaTypeId: string;
    LanguageLevelId: string;
    Percentage: string | null;
    Description: string;
}

export interface ScholarshipFilterParams {
    page?: number;
    size?: number;
    gpa?: number;
    searchValue?: string;
    visaTypeId?: string;
    languageLevelId?: string;
    organizationId?: string;
}