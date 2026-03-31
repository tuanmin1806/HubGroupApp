import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import generalRoutes from "./general.route";
import adminRoutes from "./admin.route";
import staffRoutes from "./staff.route";
import Loader from "../components/general/loader";
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
                <Suspense fallback={Loader}>
                    <UnauthorizedPage />
                </Suspense>
            ),
        },
        {
            path: "*",
            element: (
                <Suspense fallback={Loader}>
                    <NotFoundPage />
                </Suspense>
            ),
        },
        {
            element: <AuthLayout />,
            children: [
                {
                    path: "dang-nhap",
                    element: (
                        <Suspense fallback={Loader}>
                            <CustomerLogin />
                        </Suspense>
                    ),
                },
                {
                    path: "dang-ky/customer",
                    element: (
                        <Suspense fallback={Loader}>
                            <StudentRegister />
                        </Suspense>
                    ),
                },
                {
                    path: "dang-ky/admin",
                    element: (
                        <Suspense fallback={Loader}>
                            <AdminRegister />
                        </Suspense>
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