import { PermissionKeys } from "../app/models/permissions-key.model"
import ProtectedRoute from "../components/protected-route"
import CreateRecruitmentPostPage from "../pages/staff/create-recruitment-post.page"
import ManageRecruitmentPostPage from "../pages/staff/manage-recruitment-post.page"
import StaffDashboardPage from "../pages/staff/staff-dashboard.page"

const staffRoutes = [
    {
        index: true,
        element: <StaffDashboardPage />,
    },
    {
        element: (
            <ProtectedRoute permissions={[PermissionKeys.RECRUITMENT_POST_GET_BY_CURRENT_CUSTOMER]}
            />
        ),
        children: [
            {
                path: "manage-recruitment-post",
                element: <ManageRecruitmentPostPage />,
            },
        ],
    },
    {
        path: "create-recruitment-post",
        element: <CreateRecruitmentPostPage />,
    },
]

export default staffRoutes