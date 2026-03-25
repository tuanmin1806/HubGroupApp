import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import { PermissionGroupKey, PermissionGroups } from "../app/models/permissions-group-key.model";
import { Navigate } from "react-router-dom";
import { AccountTypeKey } from "../constants/account-type.constant";

interface ProtectedRouteProps {
    children: React.ReactNode;
    permissionGroup?: PermissionGroupKey;
    allowedAccountTypes?: AccountTypeKey[];
}

export default function ProtectedRoute({ children, permissionGroup, allowedAccountTypes }: ProtectedRouteProps) {
    const { user } = useSelector((state: RootState) => state.auth);

    if (!user) {
        return <Navigate to="/unauthorized" replace />;
    }

    if (allowedAccountTypes && allowedAccountTypes.length > 0) {
        const hasValidAccountType = allowedAccountTypes.includes(user.AccountType as AccountTypeKey);
        if (!hasValidAccountType) return <Navigate to="/sign-out" replace />;
    }

    if (permissionGroup) {
        const userPermissions: string[] = user?.PermissionKeys ?? [];
        const requiredPermissions = PermissionGroups[permissionGroup];
        const hasAllPermissions = requiredPermissions.every(p => userPermissions.includes(p));
        if (!hasAllPermissions) return <Navigate to="/unauthorized" replace />;
    }

    return <>{children}</>;
}