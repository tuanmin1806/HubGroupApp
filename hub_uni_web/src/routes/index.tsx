import { createBrowserRouter } from "react-router-dom";
import generalRoutes from "./general.route";
import AuthLayout from "../layouts/auth.layout";
import Login from "../pages/general/signin.page";
import Signup from "../pages/general/sign-up.page";
import adminRoutes from "./admin.route";
import staffRoutes from "./staff.route";
import AdminLayout from "../layouts/admin.layout";
import StaffLayout from "../layouts/staff.layout";
import RoleBasedLayout from "../layouts/role-based.layout";

const router = createBrowserRouter(
    [
        {
            element: <AuthLayout />,
            children: [
                {
                    path: 'dang-nhap',
                    element: <Login />,
                },
                {
                    path: 'dang-ky',
                    element: <Signup />,
                }
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