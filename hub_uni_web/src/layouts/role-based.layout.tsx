import { lazy } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
const GuestLayout = lazy(() => import("./guest.layout"));
const StudentLayout = lazy(() => import("./student.layout"));
const RoleBasedLayout = () => {
    const { isLoggedIn } = useSelector((state: RootState) => state.auth);

    return isLoggedIn ? <StudentLayout /> : <GuestLayout />;
};

export default RoleBasedLayout;