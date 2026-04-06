import { lazy } from "react";
const ProtectedRoute = lazy(() => import("../components/protected-route"))
const CreateRecruitmentPostPage = lazy(() => import("../pages/admin/create-recruitment-post.page"))
const ManageRecruitmentPostPage = lazy(() => import("../pages/admin/manage-recruitment-post.page"))
const OrganizationInforPage = lazy(() => import("../pages/admin/organization-infor.page"))
const PersonalInforPage = lazy(() => import("../pages/staff/personal-infor.page"))
const StaffDashboardPage = lazy(() => import("../pages/staff/staff-dashboard.page"))

const staffRoutes = [
    {
        index: true,
        element: (
            <ProtectedRoute allowedAccountTypes={["Collaborator"]}>
                <StaffDashboardPage />
            </ProtectedRoute>
        ),
    },
    {
        path: "manage-recruitment-post",
        element: (
            <ProtectedRoute permissionGroup="MANAGE_RECRUITMENT_POST">
                <ManageRecruitmentPostPage />
            </ProtectedRoute>
        ),
    },
    {
        path: "organization-info",
        element: (
            <OrganizationInforPage />
        ),
    },
    {
        path: "personal-information",
        element: (
            <PersonalInforPage />
        ),
    },
    {
        path: "create-recruitment-post",
        element: (
            <ProtectedRoute permissionGroup="CREATE_RECRUITMENT_POST" allowedAccountTypes={["Collaborator"]}>
                <CreateRecruitmentPostPage />
            </ProtectedRoute>
        ),
    },
]

export default staffRoutes