import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../app/store";

interface ProtectedRouteProps {
    permissions?: string[];
}

const ProtectedRoute = ({ permissions }: ProtectedRouteProps) => {
    const { user, token } = useSelector((state: RootState) => state.auth);

    if (!token) {
        return <Navigate to="/dang-nhap" replace />;
    }

    if (permissions && permissions.length > 0) {
        const userPerms: string[] = user?.PermissionKeys ?? [];
        const hasAccess = permissions.some((p) => userPerms.includes(p));
        if (!hasAccess) {
            return <Navigate to="/unauthorized" replace />;
        }
    }

    return <Outlet />;
};

export default ProtectedRoute;