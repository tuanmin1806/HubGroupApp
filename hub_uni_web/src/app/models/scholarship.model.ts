export interface ScholarshipResponse {
    Id: string;
    OrganizationId: string;
    Name: string;
    Gpa: number;
    VisaTypeId: string;
    LanguageLevelId: string;
    Percentage: number;
    Description: string;
    Status: string;

}

export interface ScholarshipFilterParams {
    page?: number;
    size?: number;
    gpa?: number;
    visaTypeId?: string;
    languageLevelId?: string;
}