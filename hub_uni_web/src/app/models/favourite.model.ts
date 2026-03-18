import { Customer } from "./application.model";
import { RecruitmentPostDetailResponse, RecruitmentPostResponse } from "./recruitment-post.model";

export interface FavouriteRequest {
    CustomerId: string;
    RecruitPostId: string;
}

export interface FavouriteResponse {
    Id: string;
    Customer: Customer;
    RecruitmentPost: RecruitmentPostDetailResponse;
    CreatedAt: string;
    UpdatedAt: string;
}

export interface UpdateFavouriteRequest {
    FavouriteId: string;
}

export interface FavouriteFilterParams {
    customerId?: string;
    searchValue?: string;
    page?: number;
    size?: number;
}