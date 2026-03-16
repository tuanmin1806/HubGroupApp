import { ApplicationStatus, EducationLevel, Gender, JobExperience } from "./enums.model";
import { RecruitmentPostResponse } from "./recruitment-post.model";

export interface Customer {
    FullName: string;
    AvatarUrl: string;
    AvatarFullUrl: string;
    Email: string;
    PhoneNumber: string;
    ProfileInfo: {
        DateOfBirth: string;
        Gender: Gender;
        Experience: JobExperience;
        EducationLevel: EducationLevel;
        Gpa: string;
    }
}

export interface ApplicationRequest {
    CustomerId: string;
    RecruitmentPostId: string;
}

export interface ApplicationResponse {
    Id: string;
    Customer: Customer;
    RecruitmentPost: RecruitmentPostResponse;
    ApplicationStatus: ApplicationStatus;
    CreatedAt: string;
    UpdatedAt: string;
}

export interface UpdateApplicationRequest {
    ApplicationId: string;
    ApplicationStatus: ApplicationStatus;
}

export interface ApplicationFilterParams {
    customerId?: string;
    searchValue?: string;
    page?: number;
    size?: number;
}