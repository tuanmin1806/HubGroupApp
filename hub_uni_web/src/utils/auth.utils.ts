import { AccountType } from "../app/models/enums.model";
import { getUserInfo } from "../app/services/auth.service";
import { ConvertService } from "../app/services/convert.service";

export const isAuthenticated = (): boolean => {
    const user = getUserInfo();

    return !!user;
};

export const getAccountType = (): AccountType => {
    const user = getUserInfo();
    return ConvertService.convertAccountTypeFromString(user?.AccountType);
};

export const hasAccountType = (...types: AccountType[]): boolean => {
    return types.includes(getAccountType());
};

export const getCurrentUserId = (): string => {
    return getUserInfo()?.Id ?? "";
};

export const isSelf = (id: string): boolean => {
    return !!id && id === getCurrentUserId();
};