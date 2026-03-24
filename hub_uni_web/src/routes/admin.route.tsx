import AdminDashboardPage from "../pages/admin/admin-dashboard.page"
import ManageStaffAccountPage from "../pages/admin/manage-customer.page"
import OrganizationInforPage from "../pages/admin/organization-infor.page"
import CreateRecruitmentPostPage from "../pages/admin/create-recruitment-post.page"
import ManageRecruitmentPostPage from "../pages/admin/manage-recruitment-post.page"
import PersonalInforPage from "../pages/staff/personal-infor.page"
import ProtectedRoute from "../components/protected-route"
import ManageApplicationPage from "../pages/admin/manage-application.page"

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
]

export default adminRoutes