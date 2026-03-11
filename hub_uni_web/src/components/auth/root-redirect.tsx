import { Navigate } from "react-router-dom";
import { HomePage } from "../../pages/general";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

const RootRedirect = () => {
    const { user, isLoggedIn } = useSelector((state: RootState) => state.auth);

    if (isLoggedIn && user?.Roles?.[0]?.DefaultPage) {
        return <Navigate to={user.Roles[0].DefaultPage} replace />;
    }

    return <HomePage />;
};

export default RootRedirect;