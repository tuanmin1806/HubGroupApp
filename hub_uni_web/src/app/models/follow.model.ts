export interface CreateFollowRequest {
    CustomerId: string;
    OrgId: string;
}

export interface FollowResponse {
    Id: string;
    CustomerId: string;
    OrgId: string;
    CreatedAt: string;
    UpdatedAt: string;
    CreatedBy: string;
    UpdatedBy: string;
}

export interface FollowFilterParams {
    customerId?: string;
    orgId?: string;
    page?: number;
    size?: number;
}