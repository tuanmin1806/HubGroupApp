import { lazy, Suspense } from "react";
import Loader from "../components/general/loader";
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
            <Suspense fallback={Loader}>
                <ProtectedRoute allowedAccountTypes={["Collaborator"]}>
                    <StaffDashboardPage />
                </ProtectedRoute>
            </Suspense>
        ),
    },
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
    {
        path: "organization-info",
        element: (
            <Suspense fallback={Loader}>
                <OrganizationInforPage />
            </Suspense>
        ),
    },
    {
        path: "personal-information",
        element: (
            <Suspense fallback={Loader}>
                <PersonalInforPage />
            </Suspense>
        ),
    },
    {
        path: "create-recruitment-post",
        element: (
            <Suspense fallback={Loader}>
                <ProtectedRoute permissionGroup="CREATE_RECRUITMENT_POST" allowedAccountTypes={["Collaborator"]}>
                    <CreateRecruitmentPostPage />
                </ProtectedRoute>
            </Suspense>
        ),
    },
]

export default staffRoutes