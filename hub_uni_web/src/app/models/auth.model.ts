import { Department } from "./department.model";
import { AccountStatus, AccountType, EducationLevel, Gender, JobExperience } from "./enums.model";
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
    Gender: Gender;
    Email: string;
    PhoneNumber: string;
    AccountType: AccountType.Student;
    AccountStatus: AccountStatus.Activated;
    ProfileInfo: {
        DateOfBirth: string;
        Gender: Gender;
        ProvinceId: string;
        CommuneId: string;
        Address: string;
        Experience: JobExperience;
        EducationLevel: EducationLevel;
    };
}

export interface RecruiterRegisterRequestBody {
    CustomerModel: {
        UserName: string;
        Password: string;
        FullName: string;
        Gender: Gender;
        Email: string;
        PhoneNumber: string;
        AccountStatus: AccountStatus.Activated;
    };
    OrganizationModel: {
        Name: string;
        InternationalName: string;
        TaxCode: string;
        Address: string;
        PhoneNumber: string;
        IssueDate: string;
        OrganizationTypeId: string;
        ProfessionIds: string[];
        MainProfessionId: string;
        ProvinceId: string;
        CommuneId: string;
        ManagedBy: string;
        LogoUrl?: string;
        WallpaperUrl?: string;
        Description?: string;
        FacebookUrl?: string;
        LinkedinUrl?: string;
        YoutubeUrl?: string;
        GoogleMapUrl?: string;
        TwitterUrl?: string;
        InstagramUrl?: string;
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