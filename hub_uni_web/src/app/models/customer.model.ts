import { Department } from "./department.model";
import { AccountStatus, AccountType, Gender } from "./enums.model";
import { Position } from "./position.model";
import { RoleResponse } from "./role.model copy";

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
}

export interface CustomerFilterParams {
    page?: number;
    size?: number;
    organizationId?: string;
}