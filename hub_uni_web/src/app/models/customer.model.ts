import { Department } from "./department.model";
import { AccountStatus, AccountType, EducationLevel, Gender, JobExperience } from "./enums.model";
import { Position } from "./position.model";
import { RoleResponse } from "./role.model copy";

export interface ProfileInfo {
    DateOfBirth: string;
    Experience: JobExperience;
    EducationLevel: EducationLevel;
    GraduationYear: number;
    Gpa: number;
    Gender: Gender;
    CountryId?: string;
    ProvinceId: string;
    CommuneId: string;
    Address: string;
}

export interface CustomerResponse {
    Id: string;
    AccountCode: string | null;
    UserName: string;
    FullName: string;
    DateOfBirth: string;
    Email: string;
    PhoneNumber: string | null;
    Gender: Gender;
    AccountType: AccountType;
    Address: string;
    ProvinceId: string;
    CommuneId: string;
    AvatarUrl: string | null;
    AvatarFullUrl: string;
    Position: Position;
    Roles: RoleResponse[];
    Departments: Department[];
    AccountStatus: AccountStatus;
    ProfileInfo?: ProfileInfo;
    OrganizationName?: string;
}

export interface CreateCustomerRequest {
    UserName: string;
    Password: string;
    FullName: string;
    Email: string;
    PhoneNumber: string | null;
    Gender: Gender | undefined;
    AccountType: AccountType;
    AccountStatus: AccountStatus;
    RoleIds: string[];
}

export interface UpdateCustomerRequest {
    Id: string;
    FullName: string;
    UserName?: string;
    Email: string;
    PhoneNumber: string | null;
    Gender: Gender;
    AccountType?: AccountType;
    RoleIds?: string[];
    AccountStatus?: AccountStatus;
    ProfileInfo?: ProfileInfo;
}

export interface UpdatePasswordRequest {
    CurrentPassword: string;
    NewPassword: string;
    ConfirmPassword: string;
}

export interface UpdateCustomerAvatarRequest {
    formData: FormData;
}

export interface CustomerFilterParams {
    page?: number;
    size?: number;
    organizationId?: string;
}