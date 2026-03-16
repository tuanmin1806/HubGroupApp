import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import { PermissionGroupKey, PermissionGroups } from "../app/models/permissions-group-key.model";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
    children: React.ReactNode;
    permissionGroup: PermissionGroupKey;
}

export default function ProtectedRoute({ children, permissionGroup }: ProtectedRouteProps) {
    const { user } = useSelector((state: RootState) => state.auth);

    const userPermissions: string[] = user?.PermissionKeys ?? [];

    const requiredPermissions = PermissionGroups[permissionGroup];

    const hasAllPermissions = requiredPermissions.every(p =>
        userPermissions.includes(p)
    );

    if (!user || !hasAllPermissions) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <>{children}</>;
}