import { Department } from "./department.model";
import { Role } from "./role.model";
import { SystemConfig } from "./system-config.model";

export interface AuthRegisterRequestBody {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmNewPassword: string;
}

export interface StudentRegisterRequestBody {
    UserName: string;
    Password: string;
    FullName: string;
    Gender: string;
    Email: string;
    PhoneNumber: string;
    AccountType: "Student";
    AccountStatus: "Activated";
    ProfileInfo: {
        Age: number;
        Gender: string;
        Experience: string;
        EducationLevel: string;
    };
}

export interface RecruiterRegisterRequestBody {
    CustomerModel: {
        UserName: string;
        Password: string;
        FullName: string;
        Gender: string;
        Email: string;
        PhoneNumber: string;
    };
    OrganizationModel: {
        Name: string;
        TaxCode: string;
        Address: string;
        PhoneNumber: string;
        Email: string;
        WebsiteUrl?: string;
        Summary?: string;
    };
}

export interface AuthForgotPasswordRequestBody {
    email: string;
}

export interface AuthReconfirmPasswordRequestBody {
    email: string;
}

export interface AuthChangePasswordRequestBody {
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

export interface AuthLoginRequestBody {
    UserName: string;
    Password: string;
}

export interface AuthInfo {
    Id: string,
    UserName: string,
    Email: string,
    FullName: string,
    DateOfBirth: string,
    PhoneNumber: string,
    Gender: string,
    AccountType: string,
    Address: boolean,
    Roles: Role[],
    Departments: Department[],
    PermissionKeys: string[],
    Token: string,
    SystemConfig: SystemConfig,
}