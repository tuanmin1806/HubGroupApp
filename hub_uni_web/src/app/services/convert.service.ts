import { AccountStatus, AccountType, EducationStatus, Gender, RoleStatus, StudentStatus, PermissionStatus, PositionStatus, DepartmentStatus, JobExperience, EducationLevel, OrgStatus, RecruitPostStatus } from "../models/enums.model";

export class ConvertService {

    private static STATUS_MAP: Record<StudentStatus, string> = {
        [StudentStatus.Undefined]: 'Chưa xác định',
        [StudentStatus.Studying]: 'Đang học',
        [StudentStatus.Deferred]: 'Bảo lưu',
        [StudentStatus.DroppedOut]: 'Đã bỏ học',
        [StudentStatus.Departed]: 'Đã xuất cảnh',
        [StudentStatus.InterviewFailed]: 'Trượt phỏng vấn',
        [StudentStatus.InterviewPassed]: 'Đỗ phỏng vấn',
        [StudentStatus.WaitingToDepart]: 'Chờ xuất cảnh',
        [StudentStatus.AssignedToJob]: 'Đã gán đơn hàng',
        [StudentStatus.WaitingForInterview]: 'Chờ phỏng vấn',
    };

    private static GENDER_MAP: Record<Gender, string> = {
        [Gender.Undefined]: 'Không yêu cầu',
        [Gender.Male]: 'Nam',
        [Gender.Female]: 'Nữ',
        [Gender.Other]: 'Khác',
    };

    private static EDUCATION_STATUS_MAP: Record<EducationStatus, string> = {
        [EducationStatus.Undefined]: 'Undefined',
        [EducationStatus.EarlySchool]: 'Học sớm',
        [EducationStatus.LateSchool]: 'Học muộn',
        [EducationStatus.RepeatedSchool]: 'Học lại'
    };
    private static REVERSE_EDUCATION_STATUS_MAP: Record<string, EducationStatus> = {
        'Undefined': EducationStatus.Undefined,
        'EarlySchool': EducationStatus.EarlySchool,
        'LateSchool': EducationStatus.LateSchool,
        'RepeatedSchool': EducationStatus.RepeatedSchool
    };

    private static REVERSE_GENDER_MAP: Record<string, Gender> = {
        'Undefined': Gender.Undefined,
        'Male': Gender.Male,
        'Female': Gender.Female,
        'Other': Gender.Other,
    };

    private static EDUCATION_LEVEL_MAP: Record<EducationLevel, string> = {
        [EducationLevel.Undefined]: 'Không yêu cầu',
        [EducationLevel.PrimarySchool]: 'Tiểu học',
        [EducationLevel.MiddleSchool]: 'THCS',
        [EducationLevel.HighSchool]: 'THPT',
        [EducationLevel.VocationalSchool]: 'Trung cấp',
        [EducationLevel.College]: 'Cao đẳng',
        [EducationLevel.University]: 'Đại học',
        [EducationLevel.Postgraduate]: 'Sau đại học',
    };

    private static REVERSE_EDUCATION_LEVEL_MAP: Record<string, EducationLevel> = {
        'Undefined': EducationLevel.Undefined,
        'PrimarySchool': EducationLevel.PrimarySchool,
        'MiddleSchool': EducationLevel.MiddleSchool,
        'HighSchool': EducationLevel.HighSchool,
        'VocationalSchool': EducationLevel.VocationalSchool,
        'College': EducationLevel.College,
        'University': EducationLevel.University,
        'Postgraduate': EducationLevel.Postgraduate
    };

    private static JOB_EXPERIENCE_MAP: Record<JobExperience, string> = {
        [JobExperience.Undefined]: 'Không yêu cầu',
        [JobExperience.LessThan1Year]: '< 1 năm',
        [JobExperience.From1To2Years]: '1-2 năm',
        [JobExperience.From2To3Years]: '2-3 năm',
        [JobExperience.From3To5Years]: '3-5 năm',
        [JobExperience.From5To10Years]: '5-10 năm',
        [JobExperience.Above10Years]: '> 10 năm',
    };

    private static REVERSE_JOB_EXPERIENCE_MAP: Record<string, JobExperience> = {
        'Undefined': JobExperience.Undefined,
        'LessThan1Year': JobExperience.LessThan1Year,
        'From1To2Years': JobExperience.From1To2Years,
        'From2To3Years': JobExperience.From2To3Years,
        'From3To5Years': JobExperience.From3To5Years,
        'From5To10Years': JobExperience.From5To10Years,
        'Above10Years': JobExperience.Above10Years
    };

    private static ACCOUNT_TYPE_MAP: Record<AccountType, string> = {
        [AccountType.Undefined]: 'Không xác định',
        [AccountType.Staff]: 'Nhân viên',
        [AccountType.Manager]: 'Quản lý',
        [AccountType.Admin]: 'Quản trị viên',
        [AccountType.SuperAdmin]: 'SuperAdmin',
        [AccountType.Student]: 'Học sinh'
    };

    private static STUDENT_STATUS_MAP: Record<StudentStatus, string> = {
        [StudentStatus.Undefined]: 'Chưa xác định',
        [StudentStatus.Studying]: 'Đang học',
        [StudentStatus.Deferred]: 'Bảo lưu',
        [StudentStatus.DroppedOut]: 'Đã bỏ học',
        [StudentStatus.Departed]: 'Đã xuất cảnh',
        [StudentStatus.InterviewFailed]: 'Trượt phỏng vấn',
        [StudentStatus.WaitingToDepart]: 'Chờ xuất cảnh',
        [StudentStatus.WaitingForInterview]: 'Chờ phỏng vấn',
        [StudentStatus.AssignedToJob]: 'Đã gán đơn hàng',
        [StudentStatus.InterviewPassed]: 'Đỗ phỏng vấn',
    };

    private static REVERSE_STUDENT_STATUS_MAP: Record<string, StudentStatus> = {
        'Undefined': StudentStatus.Undefined,
        'Studying': StudentStatus.Studying,
        'Deferred': StudentStatus.Deferred,
        'DroppedOut': StudentStatus.DroppedOut,
        'Departed': StudentStatus.Departed,
        'InterviewFailed': StudentStatus.InterviewFailed,
        'WaitingToDepart': StudentStatus.WaitingToDepart,
        'WaitingForInterview': StudentStatus.WaitingForInterview,
        'AssignedToJob': StudentStatus.AssignedToJob,
        'InterviewPassed': StudentStatus.InterviewPassed,
    };


    private static REVERSE_ACCOUNT_TYPE_MAP: Record<string, AccountType> = {
        'Undefined': AccountType.Undefined,
        'Staff': AccountType.Staff,
        'Manager': AccountType.Manager,
        'Admin': AccountType.Admin,
        'SuperAdmin': AccountType.SuperAdmin,
        'Student': AccountType.Student
    };

    private static ACCOUNT_STATUS_MAP: Record<AccountStatus, string> = {
        [AccountStatus.Undefined]: 'Không xác định',
        [AccountStatus.Activated]: 'Đã kích hoạt',
        [AccountStatus.NotActivated]: 'Chưa kích hoạt',
        [AccountStatus.Locked]: 'Đã Khóa',
    };

    private static REVERSE_ACCOUNT_STATUS_MAP: Record<string, AccountStatus> = {
        'Undefined': AccountStatus.Undefined,
        'Activated': AccountStatus.Activated,
        'NotActivated': AccountStatus.NotActivated,
        'Locked': AccountStatus.Locked,
    };

    private static ROLE_STATUS_MAP: Record<RoleStatus, string> = {
        [RoleStatus.Undefined]: 'Không xác định',
        [RoleStatus.Activated]: 'Đã kích hoạt',
        [RoleStatus.Deactivated]: 'Đã hủy kích hoạt',
        [RoleStatus.WaitingApproval]: 'Chờ phê duyệt',
    };

    private static REVERSE_ROLE_STATUS_MAP: Record<string, RoleStatus> = {
        'Undefined': RoleStatus.Undefined,
        'Activated': RoleStatus.Activated,
        'Deactivated': RoleStatus.Deactivated,
        'WaitingApproval': RoleStatus.WaitingApproval,
    };

    private static PERMISSION_STATUS_MAP: Record<PermissionStatus, string> = {
        [PermissionStatus.Undefined]: 'Không xác định',
        [PermissionStatus.Activated]: 'Đã kích hoạt',
        [PermissionStatus.Deactivated]: 'Đã hủy kích hoạt',
        [PermissionStatus.WaitingApproval]: 'Chờ phê duyệt',
    };

    private static REVERSE_PERMISSION_STATUS_MAP: Record<string, PermissionStatus> = {
        'Undefined': PermissionStatus.Undefined,
        'Activated': PermissionStatus.Activated,
        'Deactivated': PermissionStatus.Deactivated,
        'WaitingApproval': PermissionStatus.WaitingApproval,
    };

    private static POSITION_STATUS_MAP: Record<PositionStatus, string> = {
        [PositionStatus.Undefined]: 'Không xác định',
        [PositionStatus.Activated]: 'Đã kích hoạt',
        [PositionStatus.Deactivated]: 'Đã hủy kích hoạt',
        [PositionStatus.WaitingApproval]: 'Chờ phê duyệt',
    };

    private static REVERSE_POSITION_STATUS_MAP: Record<string, PositionStatus> = {
        'Undefined': PositionStatus.Undefined,
        'Activated': PositionStatus.Activated,
        'Deactivated': PositionStatus.Deactivated,
        'WaitingApproval': PositionStatus.WaitingApproval,
    };

    private static DEPARTMENT_STATUS_MAP: Record<DepartmentStatus, string> = {
        [DepartmentStatus.Undefined]: 'Không xác định',
        [DepartmentStatus.Activated]: 'Đã kích hoạt',
        [DepartmentStatus.Deactivated]: 'Đã hủy kích hoạt',
        [DepartmentStatus.WaitingApproval]: 'Chờ phê duyệt',
    };

    private static REVERSE_DEPARTMENT_STATUS_MAP: Record<string, DepartmentStatus> = {
        'Undefined': DepartmentStatus.Undefined,
        'Activated': DepartmentStatus.Activated,
        'Deactivated': DepartmentStatus.Deactivated,
        'WaitingApproval': DepartmentStatus.WaitingApproval,
    };

    private static ORG_STATUS_MAP: Record<OrgStatus, string> = {
        [OrgStatus.Undefined]: 'Không xác định',
        [OrgStatus.Active]: 'Hoạt động',
        [OrgStatus.Inactive]: 'Dừng hoạt động',
        [OrgStatus.Locked]: 'Bị khóa',
    };

    private static REVERSE_ORG_STATUS_MAP: Record<string, OrgStatus> = {
        'Undefined': OrgStatus.Undefined,
        'Active': OrgStatus.Active,
        'Inactive': OrgStatus.Inactive,
        'Locked': OrgStatus.Locked
    };

    private static POST_STATUS_MAP: Record<RecruitPostStatus, string> = {
        [RecruitPostStatus.Undefined]: 'Không xác định',
        [RecruitPostStatus.Active]: 'Hoạt động',
        [RecruitPostStatus.Inactive]: 'Dừng hoạt động',
        [RecruitPostStatus.Draft]: 'Nháp',
    };

    private static REVERSE_POST_STATUS_MAP: Record<string, RecruitPostStatus> = {
        'Undefined': RecruitPostStatus.Undefined,
        'Active': RecruitPostStatus.Active,
        'Inactive': RecruitPostStatus.Inactive,
        'Draft': RecruitPostStatus.Draft
    };

    static convertStatus(status: StudentStatus | null | undefined): string {
        return status !== null && status !== undefined
            ? this.STATUS_MAP[status] || 'Không xác định'
            : 'Không xác định';
    }

    static convertGender(gender: Gender | null | undefined): string {
        return gender !== null && gender !== undefined
            ? this.GENDER_MAP[gender] || 'Không xác định'
            : 'Không xác định';
    }

    static convertGenderFromString(genderString: string | null | undefined | Gender): Gender {
        return genderString !== null && genderString !== undefined
            ? this.REVERSE_GENDER_MAP[genderString] || Gender.Male
            : Gender.Male;
    }

    static convertEducationLevel(educationLevel: EducationLevel | null | undefined): string {
        return educationLevel !== null && educationLevel !== undefined
            ? this.EDUCATION_LEVEL_MAP[educationLevel] || 'Không xác định'
            : 'Không xác định';
    }
    static convertEducationLevelFromString(educationLevelString: string | null | undefined | EducationLevel): EducationLevel {
        return educationLevelString !== null && educationLevelString !== undefined
            ? this.REVERSE_EDUCATION_LEVEL_MAP[educationLevelString] || EducationLevel.Undefined
            : EducationLevel.Undefined;
    }

    static convertJobExperience(jobExperience: JobExperience | null | undefined): string {
        return jobExperience !== null && jobExperience !== undefined
            ? this.JOB_EXPERIENCE_MAP[jobExperience] || 'Không xác định'
            : 'Không xác định';
    }
    static convertJobExperienceFromString(jobExperienceString: string | null | undefined | JobExperience): JobExperience {
        return jobExperienceString !== null && jobExperienceString !== undefined
            ? this.REVERSE_JOB_EXPERIENCE_MAP[jobExperienceString] || JobExperience.Undefined
            : JobExperience.Undefined;
    }

    static convertEducationStatus(educationStatus: EducationStatus | null | undefined): string {
        return educationStatus !== null && educationStatus !== undefined
            ? this.EDUCATION_STATUS_MAP[educationStatus] || 'Không xác định'
            : 'Không xác định';
    }
    static convertEducationStatusFromString(educationStatusString: string | null | undefined | EducationStatus): EducationStatus {
        return educationStatusString !== null && educationStatusString !== undefined
            ? this.REVERSE_EDUCATION_STATUS_MAP[educationStatusString] || EducationStatus.Undefined
            : EducationStatus.Undefined;
    }
    static convertAccountType(accountType: AccountType | null | undefined): string {
        return accountType !== null && accountType !== undefined
            ? this.ACCOUNT_TYPE_MAP[accountType] || 'Không xác định'
            : 'Không xác định';
    }

    static convertAccountTypeFromString(accountTypeString: string | null | undefined | AccountType): AccountType {
        return accountTypeString !== null && accountTypeString !== undefined
            ? this.REVERSE_ACCOUNT_TYPE_MAP[accountTypeString] || AccountType.Undefined
            : AccountType.Undefined;
    }

    static convertStudentStatus(studentStatus: StudentStatus | null | undefined): string {
        return studentStatus !== null && studentStatus !== undefined
            ? this.STUDENT_STATUS_MAP[studentStatus] || 'Không xác định'
            : 'Không xác định';
    }

    static convertStudentStatusFromString(studentStatusString: string | null | undefined | StudentStatus): StudentStatus {
        return studentStatusString !== null && studentStatusString !== undefined
            ? this.REVERSE_STUDENT_STATUS_MAP[studentStatusString] || StudentStatus.Undefined
            : StudentStatus.Undefined;
    }

    static convertAccountStatus(accountStatus: AccountStatus | null | undefined): string {
        return accountStatus !== null && accountStatus !== undefined
            ? this.ACCOUNT_STATUS_MAP[accountStatus] || 'Không xác định'
            : 'Không xác định';
    }

    static convertAccountStatusFromString(accountStatusString: string | null | undefined | AccountStatus): AccountStatus {
        return accountStatusString !== null && accountStatusString !== undefined
            ? this.REVERSE_ACCOUNT_STATUS_MAP[accountStatusString] || AccountStatus.Undefined
            : AccountStatus.Undefined;
    }
    static formatDateToISO(date: Date | null): string | null {
        if (!date) return null;
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    static parseISODate(dateString: string | null): Date | null {
        if (!dateString) return null;
        const datePart = dateString.split("T")[0];
        const [year, month, day] = datePart.split("-").map(Number);
        if (!year || !month || !day) return null;
        return new Date(year, month - 1, day);
    }

    static formatDateToDDMMYYYY(date: Date | null): string | null {
        if (!date) return null;
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
    static formatDateToddMMyyyy(dateStr?: string | null): string {
        if (!dateStr) return "N/A";
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        const yyyy = d.getFullYear();
        return `${dd}-${mm}-${yyyy}`;
    }

    static formatCurrencyVND(amount: number | undefined | null): string {
        if (amount == null || isNaN(amount)) {
            return "0";
        }
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    static convertRoleStatus(status: RoleStatus | null | undefined): string {
        return status !== null && status !== undefined
            ? this.ROLE_STATUS_MAP[status] || 'Không xác định'
            : 'Không xác định';
    }

    static convertRoleStatusFromString(statusString: string | null | undefined | RoleStatus): RoleStatus {
        return statusString !== null && statusString !== undefined
            ? this.REVERSE_ROLE_STATUS_MAP[statusString] || RoleStatus.Undefined
            : RoleStatus.Undefined;
    }

    static convertPermissionStatus(status: PermissionStatus | null | undefined): string {
        return status !== null && status !== undefined
            ? this.PERMISSION_STATUS_MAP[status] || 'Không xác định'
            : 'Không xác định';
    }

    static convertPermissionStatusFromString(statusString: string | null | undefined | PermissionStatus): PermissionStatus {
        return statusString !== null && statusString !== undefined
            ? this.REVERSE_PERMISSION_STATUS_MAP[statusString] || PermissionStatus.Undefined
            : PermissionStatus.Undefined;
    }

    static convertPositionStatus(status: PositionStatus | null | undefined): string {
        return status !== null && status !== undefined
            ? this.POSITION_STATUS_MAP[status] || 'Không xác định'
            : 'Không xác định';
    }


    static convertPositionStatusFromString(statusString: string | null | undefined | PositionStatus): PositionStatus {
        return statusString !== null && statusString !== undefined
            ? this.REVERSE_POSITION_STATUS_MAP[statusString] || PositionStatus.Undefined
            : PositionStatus.Undefined;
    }

    static convertDepartmentStatus(status: DepartmentStatus | null | undefined): string {
        return status !== null && status !== undefined
            ? this.DEPARTMENT_STATUS_MAP[status] || 'Không xác định'
            : 'Không xác định';
    }

    static convertDepartmentStatusFromString(statusString: string | null | undefined | DepartmentStatus): DepartmentStatus {
        return statusString !== null && statusString !== undefined
            ? this.REVERSE_DEPARTMENT_STATUS_MAP[statusString] || DepartmentStatus.Undefined
            : DepartmentStatus.Undefined;
    }

    static convertOrgStatus(orgStatus: OrgStatus | null | undefined): string {
        return orgStatus !== null && orgStatus !== undefined
            ? this.ORG_STATUS_MAP[orgStatus] || 'Không xác định'
            : 'Không xác định';
    }
    static convertOrgStatusFromString(orgStatusString: string | null | undefined | OrgStatus): OrgStatus {
        return orgStatusString !== null && orgStatusString !== undefined
            ? this.REVERSE_ORG_STATUS_MAP[orgStatusString] || OrgStatus.Undefined
            : OrgStatus.Undefined;
    }

    static convertPostStatus(postStatus: RecruitPostStatus | null | undefined): string {
        return postStatus !== null && postStatus !== undefined
            ? this.POST_STATUS_MAP[postStatus] || 'Không xác định'
            : 'Không xác định';
    }
    static convertPostStatusFromString(postStatusString: string | null | undefined | RecruitPostStatus): RecruitPostStatus {
        return postStatusString !== null && postStatusString !== undefined
            ? this.REVERSE_POST_STATUS_MAP[postStatusString] || RecruitPostStatus.Undefined
            : RecruitPostStatus.Undefined;
    }
}