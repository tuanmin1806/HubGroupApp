import { getUserInfo } from "../app/services/auth.service";

export const isAuthenticated = (): boolean => {
    const user = getUserInfo();

    return !!user;
};