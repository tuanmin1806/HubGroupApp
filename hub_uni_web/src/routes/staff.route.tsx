import { PermissionKeys } from "../app/models/permissions-key.model"
import ProtectedRoute from "../components/protected-route"
import CreateRecruitmentPostPage from "../pages/staff/create-recruitment-post.page"
import ManageStaffAccountPage from "../pages/staff/manage-customer.page"
import ManageRecruitmentPostPage from "../pages/staff/manage-recruitment-post.page"
import OrganizationInforPage from "../pages/staff/organization-infor.page"
import PersonalInforPage from "../pages/staff/personal-infor.page"
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

export default staffRoutes