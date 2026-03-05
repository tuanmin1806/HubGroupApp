export interface VisaTypeResponse {
    Id: string;
    Name: string;
    Status: string;
    SigCode: string;
    Description: string;
}

export interface VisaTypeFilterParams {
    page?: number;
    size?: number;
    searchValue?: string;
}