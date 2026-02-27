import CreateRecruitmentPostPage from "../pages/staff/create-recruitment-post.page"
import ManageRecruitmentPostPage from "../pages/staff/manage-recruitment-post.page"
import StaffDashboardPage from "../pages/staff/staff-dashboard.page"

const staffRoutes = [
    {
        index: true,
        element: <StaffDashboardPage />,
    },
    {
        path: "manage-recruitment-post",
        element: <ManageRecruitmentPostPage />,
    },
    {
        path: "create-recruitment-post",
        element: <CreateRecruitmentPostPage />,
    },
]

export default staffRoutes