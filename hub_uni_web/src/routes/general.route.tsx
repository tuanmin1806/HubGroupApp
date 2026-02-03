import { HomePage } from "../pages/general";
import RecruitmentDetailPage from "../pages/general/detail-page/recruitment-detail.page";
import SignOutPage from "../pages/general/sign-out.page";
import UnauthorizedPage from "../pages/general/unauthorized.page";
import ArticleDetailPage from "../pages/general/article-detail.page";
import ArticlePage from "../pages/general/article.page";
import OrganizationSearchPage from "../pages/general/search-page/organization-search.page";
import OrganizationDetailPage from "../pages/general/detail-page/organization-detail.page";

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
        path: '/tim-kiem-to-chuc',
        element: <OrganizationSearchPage />,
    },
    {
        path: '/to-chuc/:seoUrl',
        element: <OrganizationDetailPage />,
    }
];

export default generalRoutes;