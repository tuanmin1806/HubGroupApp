import { lazy, Suspense } from "react";
import Loader from "../components/general/loader";
const AdminDashboardPage = lazy(() => import("../pages/admin/admin-dashboard.page"))
const ManageStaffAccountPage = lazy(() => import("../pages/admin/manage-customer.page"))
const OrganizationInforPage = lazy(() => import("../pages/admin/organization-infor.page"))
const CreateRecruitmentPostPage = lazy(() => import("../pages/admin/create-recruitment-post.page"))
const ManageRecruitmentPostPage = lazy(() => import("../pages/admin/manage-recruitment-post.page"))
const PersonalInforPage = lazy(() => import("../pages/staff/personal-infor.page"))
const ProtectedRoute = lazy(() => import("../components/protected-route"))
const ManageApplicationPage = lazy(() => import("../pages/admin/manage-application.page"))

const adminRoutes = [
    {
        index: true,
        element: (
            <Suspense fallback={Loader}>
                <ProtectedRoute allowedAccountTypes={["Manager"]}>
                    <AdminDashboardPage />
                </ProtectedRoute>
            </Suspense>
        ),
    },
    {
        children: [
            {
                path: "manage-recruitment-post",
                element: (
                    <Suspense fallback={Loader}>
                        <ProtectedRoute permissionGroup="MANAGE_RECRUITMENT_POST">
                            <ManageRecruitmentPostPage />
                        </ProtectedRoute>
                    </Suspense>
                ),
            },
        ],
    },
    {
        path: "organization-info",
        element: (
            <Suspense fallback={Loader}>
                <ProtectedRoute allowedAccountTypes={["Manager"]}>
                    <OrganizationInforPage />
                </ProtectedRoute>
            </Suspense>
        ),
    },
    {
        path: "personal-information",
        element: (
            <Suspense fallback={Loader}>
                <ProtectedRoute allowedAccountTypes={["Manager"]}>
                    <PersonalInforPage />
                </ProtectedRoute>
            </Suspense>
        ),
    },
    {
        path: "manage-staff-account",
        element: (
            <Suspense fallback={Loader}>
                <ProtectedRoute permissionGroup="MANAGE_STAFF_ACCOUNT" allowedAccountTypes={["Manager"]}>
                    <ManageStaffAccountPage />
                </ProtectedRoute>
            </Suspense>
        ),
    },
    {
        path: "manage-application",
        element: (
            <Suspense fallback={Loader}>
                <ProtectedRoute allowedAccountTypes={["Manager"]}>
                    <ManageApplicationPage />
                </ProtectedRoute>
            </Suspense>
        ),
    },
    {
        path: "create-recruitment-post",
        element: (
            <Suspense fallback={Loader}>
                <ProtectedRoute permissionGroup="CREATE_RECRUITMENT_POST" allowedAccountTypes={["Manager"]}>
                    <CreateRecruitmentPostPage />
                </ProtectedRoute>
            </Suspense>
        ),
    },
]

export default adminRoutes