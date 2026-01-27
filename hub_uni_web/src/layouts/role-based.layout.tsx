import { useSelector } from "react-redux";
import GuestLayout from "./guest.layout";
import { RootState } from "../app/store";
import StudentLayout from "./student.layout";
const RoleBasedLayout = () => {
    const { isLoggedIn } = useSelector((state: RootState) => state.auth);

    return isLoggedIn ? <StudentLayout /> : <GuestLayout />;
};

export default RoleBasedLayout;