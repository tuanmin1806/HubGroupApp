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
import { Suspense } from "react";
import Loader from "../components/general/loader";

const generalRoutes = [
    {
        path: '/',
        element: (<Suspense fallback={Loader}><HomePage /></Suspense>),
    },
    {
        path: 'sign-out',
        element: (<Suspense fallback={Loader}><SignOutPage /></Suspense>),
    },
    {
        path: '/chi-tiet-bai-viet',
        element: (<Suspense fallback={Loader}><ArticleDetailPage /></Suspense>),
    },
    {
        path: '/bai-viet',
        element: (<Suspense fallback={Loader}><ArticlePage /></Suspense>),
    },
    {
        path: '/tim-kiem-truong',
        element: (<Suspense fallback={Loader}><OrganizationSearchPage /></Suspense>),
    },
    {
        path: '/thong-tin-truong/:seoUrl',
        element: (<Suspense fallback={Loader}><OrganizationDetailPage /></Suspense>),
    },
    {
        path: '/chuong-trinh-tuyen-sinh/:seoUrl',
        element: (<Suspense fallback={Loader}><RecruitmentPostDetailPage /></Suspense>),
    },
    {
        path: "/bai-viet/:seo",
        element: (<Suspense fallback={Loader}><ArticleDetailPage /></Suspense>),
    },
    {
        path: "/chuong-trinh-tuyen-sinh",
        element: (<Suspense fallback={Loader}><RecruitmentPostSearchPage /></Suspense>),
    },
    {
        path: "thong-tin-tai-khoan",
        element: (<Suspense fallback={Loader}><ProtectedRoute allowedAccountTypes={["Student"]}><AccountInfoPage /></ProtectedRoute></Suspense>),
    },
];

export default generalRoutes;