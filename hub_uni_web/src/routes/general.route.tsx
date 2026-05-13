import { lazy } from "react";
const ArticlePage = lazy(() => import("../pages/general/article.page"));
const OrganizationSearchPage = lazy(() => import("../pages/general/search-page/organization-search.page"));
const OrganizationDetailPage = lazy(() => import("../pages/general/detail-page/organization-detail.page"));
const SignOutPage = lazy(() => import("../pages/general/auth-page/sign-out.page"));
const ArticleDetailPage = lazy(() => import("../pages/general/detail-page/article-detail.page"));
const RecruitmentPostDetailPage = lazy(() => import("../pages/general/detail-page/recruitment-post-detail.page"));
const RecruitmentPostSearchPage = lazy(() => import("../pages/general/search-page/recruitment-post-search.page"));
const HomePage = lazy(() => import("../pages/general/home.page"));
const AccountInfoPage = lazy(() => import("../pages/student/account-info.page"));

import ProtectedRoute from "../components/protected-route";
import ScholarshipCalculator from "../pages/general/scholarship_calculator.page";

const generalRoutes = [
    {
        path: '/',
        element: (<HomePage />),
    },
    {
        path: 'sign-out',
        element: (<SignOutPage />),
    },
    {
        path: '/chi-tiet-bai-viet',
        element: (<ArticleDetailPage />),
    },
    {
        path: '/bai-viet',
        element: (<ArticlePage />),
    },
    {
        path: '/tim-kiem-truong',
        element: (<OrganizationSearchPage />),
    },
    {
        path: '/thong-tin-truong/:seoUrl',
        element: (<OrganizationDetailPage />),
    },
    {
        path: '/chuong-trinh-tuyen-sinh/:seoUrl',
        element: (<RecruitmentPostDetailPage />),
    },
    {
        path: "/bai-viet/:seo",
        element: (<ArticleDetailPage />),
    },
    {
        path: "/chuong-trinh-tuyen-sinh",
        element: (<RecruitmentPostSearchPage />),
    },
    {
        path: "/cong-cu-tra-cuu-hoc-bong",
        element: (<ScholarshipCalculator />),
    },
    {
        path: "thong-tin-tai-khoan",
        element: (<ProtectedRoute allowedAccountTypes={["Student"]}><AccountInfoPage /></ProtectedRoute>),
    },
];

export default generalRoutes;