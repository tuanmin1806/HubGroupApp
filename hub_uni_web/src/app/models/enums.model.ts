export enum EducationStatus {
  Undefined = 0,
  EarlySchool = 1,
  LateSchool = 2,
  RepeatedSchool = 3,
}

export enum AccountStatus {
  Undefined = 0,
  NotActivated = 1,
  Locked = 2,
  Activated = 10,
}

export enum StudentStatus {
  Undefined = 0,
  Studying = 1,
  Deferred = 2,
  DroppedOut = 3,
  Departed = 4,
  InterviewFailed = 5,
  InterviewPassed = 6,
  WaitingToDepart = 7,
  WaitingForInterview = 8,
  AssignedToJob = 9,
}


export enum Gender {
  Undefined = 0,
  Male = 1,
  Female = 2,
  Other = 3,
}

export enum AccountType {
  Undefined = 0,
  Staff = 1,
  Manager = 4,
  Student = 7,
  Admin = 10,
  SuperAdmin = 100
}

export enum DepartmentStatus {
  Undefined = 0,
  Activated = 1,
  Deactivated = 2,
  WaitingApproval = 3,
}
export enum PositionStatus {
  Undefined = 0,
  Activated = 1,
  Deactivated = 2,
  WaitingApproval = 3,
}
export enum RoleStatus {
  Undefined = 0,
  Activated = 1,
  Deactivated = 2,
  WaitingApproval = 3,
}

export enum PermissionStatus {
  Undefined = 0,
  Activated = 1,
  Deactivated = 2,
  WaitingApproval = 3,
}

export enum RolePermissionStatus {
  Undefined = 0,
  Activated = 1,
  Deactivated = 2,
  WaitingApproval = 3,
}

export enum CompanyType {
  Undefined = 0,
}

export enum JobExperience {
  Undefined = 0,
  LessThan1Year = 1,
  From1To2Years = 2,
  From2To3Years = 3,
  From3To5Years = 4,
  From5To10Years = 5,
  Above10Years = 6,
}

export enum EducationLevel {
  Undefined = 0,
  PrimarySchool = 1,
  MiddleSchool = 2,
  HighSchool = 3,
  VocationalSchool = 4,
  College = 5,
  University = 6,
  Postgraduate = 7,
}

export enum OrgStatus {
  Undefined = 0,
  Active = 1,
  Inactive = 2,
  Locked = 3,
}

export enum RecruitPostStatus {
  Undefined = 0,
  Active = 1,
  Inactive = 2,
  Draft = 3
}

export enum ApplicationStatus {
  Undefined = 0,
  Accepted = 1,
  Rejected = 2,
  Pending = 3,
}