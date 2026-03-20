import type { Department } from "./department.model";
import type { AccountStatus, AccountType, Gender } from "./enums.model";
import type { Position } from "./position.model";
import { RoleResponse } from "./role.model copy";

export interface AccountResponse {
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
}

export interface UpdateAccountRequest {
    Id: string;
    AccountCode: string;
    FullName: string;
    DateOfBirth: string;
    Email: string;
    PhoneNumber: string | null;
    Gender: Gender;
    AccountType: AccountType;
    Address: string | null;
    ProvinceId: string;
    CommuneId: string;
    PositionId: string;
    RoleIds: string[];
    DepartmentIds: string[];
    AccountStatus: AccountStatus;
}

export interface AddAccountRequest {
    UserName: string;
    Password: string;
    FullName: string;
    Email: string;
    DateOfBirth: string;
    PhoneNumber: string | null;
    Gender: Gender | undefined;
    AccountType: AccountType;
    AccountStatus: AccountStatus;
    Address: string | null;
    ProvinceId: string;
    CommuneId: string;
    PositionId: string;
    DepartmentIds: string[];
    RoleIds: string[];
}

export interface ResetPasswordRequest {
    AccountId: string;
    NewPassword: string;
}

export interface AccountFilterParams {
    page?: number;
    size?: number;
    accountType?: AccountType;
    accountStatus?: AccountStatus;
    departmentId?: string;
    positionId?: string;
    roleId?: string;
    searchValue?: string;
}