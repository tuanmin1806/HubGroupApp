export interface AuthRegisterRequestBody {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmNewPassword: string;
}

export interface AuthForgotPasswordRequestBody {
    email: string;
}

export interface AuthReconfirmPasswordRequestBody {
    email: string;
}

export interface AuthChangePasswordRequestBody {
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

export interface AuthLoginRequestBody {
    UserName: string;
    Password: string;
}

export interface AuthInfo {
    userId: number,
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    birthDate: string,
    gender: string,
    role: string,
    status: boolean,
}

export interface AuthLoginResponse {
    accessToken: string,
    userResponse: AuthInfo
}