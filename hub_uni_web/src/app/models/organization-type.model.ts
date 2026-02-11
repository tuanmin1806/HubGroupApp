export interface OrganizationType {
    Id: string;
    Name: string;
    Description: string;
}

export interface OrganizationTypeFilterParams {
    page?: number;
    size?: number;
    searchValue?: string;
}