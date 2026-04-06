import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import generalRoutes from "./general.route";
import adminRoutes from "./admin.route";
import staffRoutes from "./staff.route";
const AuthLayout = lazy(() => import("../layouts/auth.layout"));
const AdminLayout = lazy(() => import("../layouts/admin.layout"));
const StaffLayout = lazy(() => import("../layouts/staff.layout"));
const RoleBasedLayout = lazy(() => import("../layouts/role-based.layout"));
const UnauthorizedPage = lazy(() => import("../pages/general/auth-page/unauthorized.page"));
const NotFoundPage = lazy(() => import("../pages/general/auth-page/not-found.page"));
const CustomerLogin = lazy(() => import("../pages/general/auth-page/customer-login.page"));
const StudentRegister = lazy(() => import("../pages/general/auth-page/student-register.page"));
const AdminRegister = lazy(() => import("../pages/general/auth-page/admin-register.page"));
const ProtectedRoute = lazy(() => import("../components/protected-route"));

const router = createBrowserRouter(
    [
        {
            path: "/unauthorized",
            element: (
                <UnauthorizedPage />
            ),
        },
        {
            path: "*",
            element: (
                <NotFoundPage />
            ),
        },
        {
            element: <AuthLayout />,
            children: [
                {
                    path: "dang-nhap",
                    element: (
                        <CustomerLogin />
                    ),
                },
                {
                    path: "dang-ky/customer",
                    element: (
                        <StudentRegister />
                    ),
                },
                {
                    path: "dang-ky/admin",
                    element: (
                        <AdminRegister />
                    ),
                },
            ],
        },
        {
            path: "/admin",
            element:
                <ProtectedRoute allowedAccountTypes={["Manager"]}>
                    <AdminLayout />
                </ProtectedRoute>,
            children: [
                ...adminRoutes,
            ],
        },
        {
            path: "/staff",
            element:
                <ProtectedRoute allowedAccountTypes={["Collaborator"]}>
                    <StaffLayout />
                </ProtectedRoute>,
            children: [
                ...staffRoutes,
            ],
        },
        {
            path: "/",
            element: <RoleBasedLayout />,
            children: [
                ...generalRoutes,
            ],
        },
    ],
    {
        future: {
            v7_relativeSplatPath: true,
            v7_startTransition: true,
        },
    }
);
export default router;