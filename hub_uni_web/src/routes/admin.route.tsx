import { lazy } from "react";
import ManageScholarshipPage from "../pages/admin/manage-scholarship.page";
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
            <ProtectedRoute allowedAccountTypes={["Manager"]}>
                <AdminDashboardPage />
            </ProtectedRoute>
        ),
    },
    {
        children: [
            {
                path: "manage-recruitment-post",
                element: (
                    <ProtectedRoute permissionGroup="MANAGE_RECRUITMENT_POST">
                        <ManageRecruitmentPostPage />
                    </ProtectedRoute>
                ),
            },
        ],
    },
    {
        path: "organization-info",
        element: (
            <ProtectedRoute allowedAccountTypes={["Manager"]}>
                <OrganizationInforPage />
            </ProtectedRoute>
        ),
    },
    {
        path: "personal-information",
        element: (
            <ProtectedRoute allowedAccountTypes={["Manager"]}>
                <PersonalInforPage />
            </ProtectedRoute>
        ),
    },
    {
        path: "manage-staff-account",
        element: (
            <ProtectedRoute permissionGroup="MANAGE_STAFF_ACCOUNT" allowedAccountTypes={["Manager"]}>
                <ManageStaffAccountPage />
            </ProtectedRoute>
        ),
    },
    {
        path: "manage-application",
        element: (
            <ProtectedRoute allowedAccountTypes={["Manager"]}>
                <ManageApplicationPage />
            </ProtectedRoute>
        ),
    },
    {
        path: "create-recruitment-post",
        element: (
            <ProtectedRoute permissionGroup="CREATE_RECRUITMENT_POST" allowedAccountTypes={["Manager"]}>
                <CreateRecruitmentPostPage />
            </ProtectedRoute>
        ),
    },
    {
        path: "manage-scholarship",
        element: (
            <ManageScholarshipPage />
        ),
    },
]

export default adminRoutes