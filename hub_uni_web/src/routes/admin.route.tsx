import AdminDashboardPage from "../pages/admin/admin-dashboard.page"
import ManageStaffAccountPage from "../pages/admin/manage-customer.page"
import OrganizationInforPage from "../pages/admin/organization-infor.page"
import CreateRecruitmentPostPage from "../pages/admin/create-recruitment-post.page"
import ManageRecruitmentPostPage from "../pages/admin/manage-recruitment-post.page"
import PersonalInforPage from "../pages/staff/personal-infor.page"

const adminRoutes = [
    {
        index: true,
        element: <AdminDashboardPage />,
    },
    {
        children: [
            {
                path: "manage-recruitment-post",
                element: <ManageRecruitmentPostPage />,
            },
        ],
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
        path: "manage-staff-account",
        element: <ManageStaffAccountPage />,
    },
    {
        path: "create-recruitment-post",
        element: <CreateRecruitmentPostPage />,
    },
]

export default adminRoutes