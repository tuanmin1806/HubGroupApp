import { PermissionKeys } from "./permissions-key.model";

export const PermissionGroups = {
    MANAGE_RECRUITMENT_POST: [
        PermissionKeys.RECRUITMENT_POST_GET_BY_PAGE,
        PermissionKeys.RECRUITMENT_POST_ADD,
        PermissionKeys.RECRUITMENT_POST_UPDATE,
        PermissionKeys.RECRUITMENT_POST_DELETE,
    ],
    MANAGE_ORGANIZATION: [
        PermissionKeys.ORGANIZATION_UPDATE,
        PermissionKeys.ORGANIZATION_GET_BY_ID
    ],
    CREATE_RECRUITMENT_POST: [
        PermissionKeys.RECRUITMENT_POST_ADD,
    ],
    MANAGE_STAFF_ACCOUNT: [
        PermissionKeys.ACCOUNT_GET_BY_PAGE,
        PermissionKeys.ACCOUNT_ADD,
        PermissionKeys.ACCOUNT_DELETE,
        PermissionKeys.ACCOUNT_UPDATE,
    ],
} as const;

export type PermissionGroupKey = keyof typeof PermissionGroups;