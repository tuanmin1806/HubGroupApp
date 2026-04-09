export interface StudentByRecruitPost {
    RecruitPost: string;
    StudentCount: number;
}

export interface DashboardModel {
    RecruitPostCount: number;
    StaffCount: number;
    StudentApplyCount: number;
    StudentPassCount: number;
    StudentFailCount: number;
    StudentByRecruitPost: StudentByRecruitPost[];
}

export interface ApplicationByMonth {
    ApplicationCount: number;
    Month: number;
}

export interface ClientDashboardModel {
    OrgCount: number;
    StudentCount: number;
    RecruitPostCount: number;
    CountryCount: number;
    ApplicationByMonths: ApplicationByMonth[];
}