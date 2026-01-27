import { DepartmentStatus } from "./enums.model";

export interface Department {
  Name: string;
  Description: string;
  Id: string;
  Code: number;
  CreatedBy: string | null;
  CreatedAt: string;
  UpdatedAt: string;
  UpdatedBy: string | null;
  Status: DepartmentStatus;
}