import { HomePage } from "../pages/general";
import UnauthorizedPage from "../pages/general/auth-page/unauthorized.page";
import ArticlePage from "../pages/general/article.page";
import OrganizationSearchPage from "../pages/general/search-page/organization-search.page";
import OrganizationDetailPage from "../pages/general/detail-page/organization-detail.page";
import SignOutPage from "../pages/general/auth-page/sign-out.page";
import ArticleDetailPage from "../pages/general/detail-page/article-detail.page";
import RecruitmentPostDetailPage from "../pages/general/detail-page/recruitment-post-detail.page";
import RecruitmentPostSearchPage from "../pages/general/search-page/recruitment-post-search.page";

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
        path: '/chi-tiet-bai-viet',
        element: <ArticleDetailPage />,
    },
    {
        path: '/bai-viet',
        element: <ArticlePage />,
    },
    {
        path: '/tim-kiem-truong',
        element: <OrganizationSearchPage />,
    },
    {
        path: '/thong-tin-truong/:seoUrl',
        element: <OrganizationDetailPage />,
    },
    {
        path: '/chuong-trinh-tuyen-sinh/:seoUrl',
        element: <RecruitmentPostDetailPage />,
    },
    {
        path: "/bai-viet/:seo",
        element: <ArticleDetailPage />,
    },
    {
        path: "/chuong-trinh-tuyen-sinh",
        element: <RecruitmentPostSearchPage />,
    },
];

export default generalRoutes;