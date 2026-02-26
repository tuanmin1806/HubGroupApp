import type { PositionStatus } from "./enums.model";

export interface Position {
    Name: string;
    Description: string;
    Id: string;
    Code: number;
    CreatedBy: string;
    CreatedAt: string;
    UpdatedAt: string;
    UpdatedBy: string;
    Status: PositionStatus;
}