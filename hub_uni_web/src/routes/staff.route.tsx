import ProtectedRoute from "../components/protected-route"
import CreateRecruitmentPostPage from "../pages/admin/create-recruitment-post.page"
import ManageRecruitmentPostPage from "../pages/admin/manage-recruitment-post.page"
import OrganizationInforPage from "../pages/admin/organization-infor.page"
import PersonalInforPage from "../pages/staff/personal-infor.page"
import StaffDashboardPage from "../pages/staff/staff-dashboard.page"

const staffRoutes = [
    {
        index: true,
        element: <StaffDashboardPage />,
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
        element: <OrganizationInforPage />,
    },
    {
        path: "personal-information",
        element: <PersonalInforPage />,
    },
    {
        path: "create-recruitment-post",
        element: <CreateRecruitmentPostPage />,
    },
]

export default staffRoutes