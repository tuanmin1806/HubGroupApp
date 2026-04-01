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