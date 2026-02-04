import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { RootState } from "../../../app/store";
import { logout } from "../../../app/features/auth/auth.slice";
import { clearAuth } from "../../../app/services/auth.service";

const SignOutPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoggedIn } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (isLoggedIn) {
            clearAuth();
            dispatch(logout());
        }
        navigate("/");
    }, [dispatch, navigate, isLoggedIn]);

    return null;
};

export default SignOutPage;