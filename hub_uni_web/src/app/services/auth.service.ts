import { AuthInfo } from "../models/auth.model";

export const saveToken = (token: string) => {
    localStorage.setItem('accessToken', token);
}

export const saveUserInfo = (user: AuthInfo) => {
    localStorage.setItem('userInfo', JSON.stringify(user));
}

export const getToken = (): string | null => {
    return localStorage.getItem('accessToken');
}

export const getUserInfo = (): AuthInfo | null => {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
}

export const removeToken = () => {
    localStorage.removeItem('accessToken');
}

export const clearAuth = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userInfo');
};
