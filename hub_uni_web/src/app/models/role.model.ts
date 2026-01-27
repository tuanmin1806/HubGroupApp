import { RoleStatus } from "./enums.model";

export interface Role {
  Name: string;
  Description: string;
  DefaultPage: string;
  Id: string;
  Code: number;
  CreatedBy: string;
  CreatedAt: string;
  UpdatedAt: string;
  UpdatedBy: string;
  Status: RoleStatus;
}