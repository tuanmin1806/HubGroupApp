import { createBrowserRouter } from "react-router-dom";
import generalRoutes from "./general.route";
import RoleBasedLayout from "../layouts/role-based.layout";
import AuthLayout from "../layouts/auth.layout";
import Login from "../pages/general/signin.page";
import Signup from "../pages/general/sign-up.page";

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
            path: '/',
            element: (<RoleBasedLayout />),
            children: [
                ...generalRoutes,
            ]
        }
    ],
    {
        future: {
            v7_relativeSplatPath: true,
            v7_startTransition: true,
        },
    }
);
export default router;