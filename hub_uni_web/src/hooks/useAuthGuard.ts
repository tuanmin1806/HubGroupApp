import { useLocation, useNavigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth.utils";

export const useAuthGuard = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return () => {
        if (!isAuthenticated()) {
            navigate("/dang-nhap", {
                state: { from: location.pathname + location.search }
            });
            return false;
        }

        return true;
    };
};