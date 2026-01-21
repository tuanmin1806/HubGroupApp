import { HomePage } from "../pages/general";
import SignOutPage from "../pages/general/sign-out.page";
import UnauthorizedPage from "../pages/general/unauthorized.page";


const generalRoutes = [
    {
        path: 'unauthorized',
        element: <UnauthorizedPage />,
    },
    {
        path: '/',
        element: <HomePage />,
    },
    {
        path: 'sign-out',
        element: <SignOutPage />
    }
];

export default generalRoutes;