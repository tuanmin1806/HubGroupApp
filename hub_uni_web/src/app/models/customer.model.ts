import { Department } from "./department.model";
import { AccountStatus, AccountType, EducationLevel, Gender, JobExperience } from "./enums.model";
import { Position } from "./position.model";
import { RoleResponse } from "./role.model copy";

export interface ProfileInfo {
    DateOfBirth?: string | null;
    Experience?: JobExperience;
    EducationLevel?: EducationLevel;
    GraduationYear?: number;
    Gpa?: number;
    CountrySeoUrl?: string;
    ProvinceSeoUrl?: string;
    CountryId?: string;
    ProvinceId?: string;
    CommuneId?: string;
    Address?: string;
    Gender?: Gender;
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
    OrganizationId?: string;
}

export interface CreateCustomerRequest {
    UserName: string;
    Password: string;
    FullName: string;
    Email: string;
    PhoneNumber: string | null;
    AccountStatus: AccountStatus;
    RoleIds?: string[];
    Gender: Gender;
    ProfileInfo: ProfileInfo;
}

export interface UpdateCustomerRequest {
    Id: string;
    FullName: string;
    Email: string;
    PhoneNumber: string | null;
    UserName?: string;
    AccountType?: AccountType;
    AccountStatus?: AccountStatus;
    RoleIds?: string[];
    ProfileInfo: ProfileInfo;
    AvatarUrl?: string;
    OrganizationId?: string;
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
    searchValue?: string;
}