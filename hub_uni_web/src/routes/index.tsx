import { createBrowserRouter } from "react-router-dom";
import generalRoutes from "./general.route";
import AuthLayout from "../layouts/auth.layout";
import adminRoutes from "./admin.route";
import staffRoutes from "./staff.route";
import AdminLayout from "../layouts/admin.layout";
import StaffLayout from "../layouts/staff.layout";
import RoleBasedLayout from "../layouts/role-based.layout";
import UnauthorizedPage from "../pages/general/auth-page/unauthorized.page";
import NotFoundPage from "../pages/general/auth-page/not-found.page";
import CustomerLogin from "../pages/general/auth-page/customer-login.page";
import StudentRegister from "../pages/general/auth-page/student-register.page";
import AdminRegister from "../pages/general/auth-page/admin-register.page";
import SelectRegisterType from "../components/auth/select-register.page";

const router = createBrowserRouter(
    [
        {
            path: "/unauthorized",
            element: <UnauthorizedPage />,
        },
        {
            path: "*",
            element: <NotFoundPage />,
        },
        {
            element: <AuthLayout />,
            children: [
                {
                    path: "dang-nhap",
                    element: <CustomerLogin />,
                },
                {
                    path: "dang-ky",
                    element: <SelectRegisterType />,
                },
                {
                    path: "dang-ky/customer",
                    element: <StudentRegister />,
                },
                {
                    path: "dang-ky/admin",
                    element: <AdminRegister />,
                },
            ],
        },
        {
            path: "/admin",
            element: <AdminLayout />,
            children: [
                ...adminRoutes,
            ],
        },
        {
            path: "/staff",
            element: <StaffLayout />,
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