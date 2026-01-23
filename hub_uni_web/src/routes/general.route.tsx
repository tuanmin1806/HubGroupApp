import { HomePage } from "../pages/general";
import RecruitmentDetailPage from "../pages/general/recruitment-detail.page";
import SignOutPage from "../pages/general/sign-out.page";
import UnauthorizedPage from "../pages/general/unauthorized.page";
import ArticleDetailPage from "../pages/general/article-detail.page";
import ArticlePage from "../pages/general/article.page";
import ManageAccountPage from "../pages/admin/manage-account.page";


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
    },
    {
        path: '/chi-tiet-tuyen-sinh',
        element: <RecruitmentDetailPage />,
    },
    {
        path: '/chi-tiet-bai-viet',
        element: <ArticleDetailPage />,
    },
    {
        path: '/danh-sach-bai-viet',
        element: <ArticlePage />,
    },
    {
        path: '/quan-ly-tai-khoan',
        element: <ManageAccountPage />,
    }
];

export default generalRoutes;