import { createBrowserRouter } from "react-router-dom";
import generalRoutes from "./general.route";
import RoleBasedLayout from "../layouts/role-based.layout";

const router = createBrowserRouter(
    [
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