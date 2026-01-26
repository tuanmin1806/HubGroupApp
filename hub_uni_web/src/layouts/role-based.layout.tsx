import { useSelector } from "react-redux";
import AdminLayout from "./admin.layout";
import { getToken } from "../app/services/auth.service";
import GuestLayout from "./guest.layout";
import { roles } from "../constants/role.constant";

const RoleBasedLayout = () => {
    const { user, isLoggedIn } = useSelector((state) => state.auth);
    return (
        <>
            {!isLoggedIn && !getToken() && <GuestLayout></GuestLayout>}

            {isLoggedIn && user?.role === roles.ADMIN && (
                <AdminLayout></AdminLayout>
            )}
        </>
    );
};
export default RoleBasedLayout;