export interface User {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    birthDate: string;
    gender: string;
    role: string;
    status: boolean;
}

export interface UserFilterParam {
    keyword?: string;
    gender?: string;
    role?: string;
    status?: boolean;
    orderBy?: string;
    orderDirection?: string;
    offset?: number;
    size?: number;
}

export interface UserUpdateRequestBody {
    firstName: string;
    lastName: string;
    birthDate: string;
    gender: string;
    phoneNumber: string;
}

export interface UserCreateRequestBody {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    birthDate: string;
    gender: string;
    role: string;
    restaurantId: number | null;
}

export interface UserUpdateRoleRequestBody {
    roleId: number;
    restaurantId: number | null;
}