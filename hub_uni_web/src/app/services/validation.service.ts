export type Validator = (value: string | number, form?: any) => string;

export const requiredValidator: Validator = (value) =>
    String(value ?? "").trim() ? "" : "Không được để trống.";

export const minLengthValidator = (minLength: number): Validator => (value) =>
    String(value ?? "").length >= minLength ? "" : `Phải có ít nhất ${minLength} ký tự.`;

export const maxLengthValidator = (maxLength: number): Validator => (value) =>
    String(value ?? "").length <= maxLength ? "" : `Không được vượt quá ${maxLength} ký tự.`;

export const minValueValidator = (minValue: number): Validator => (value) =>
    Number(value ?? 0) >= minValue ? "" : `Phải lớn hơn hoặc bằng ${minValue}.`;

export const maxValueValidator = (maxValue: number): Validator => (value) =>
    Number(value ?? 0) <= maxValue ? "" : `Không được vượt quá ${maxValue}.`;

export const emailValidator: Validator = (value) =>
    /\S+@\S+\.\S+/.test(String(value ?? "")) ? "" : "Email không hợp lệ.";

export const passwordValidator: Validator = (value) => {
    const strValue = String(value ?? "");

    if (!strValue) return "Mật khẩu không được để trống.";
    if (strValue.length < 8) return "Mật khẩu phải có ít nhất 8 ký tự.";
    if (strValue.length > 32) return "Mật khẩu không được vượt quá 32 ký tự.";

    if (!/[A-Z]/.test(strValue)) return "Mật khẩu phải có ít nhất 1 chữ cái in hoa.";
    if (!/[a-z]/.test(strValue)) return "Mật khẩu phải có ít nhất 1 chữ cái thường.";
    if (!/[0-9]/.test(strValue)) return "Mật khẩu phải có ít nhất 1 chữ số.";

    return "";
};

export const phoneValidator: Validator = (value) => {
    const strValue = String(value ?? "");

    if (!strValue) return "Số điện thoại không được để trống.";

    const vietnamPhoneRegex = /^(0|\+84)(\s?)?(3[2-9]|5[689]|7[0-46-9]|8[0-689]|9[0-46-9]|190|191)\d{7}$/;

    if (!vietnamPhoneRegex.test(strValue)) {
        return "Vui lòng nhập số điện thoại Việt Nam.";
    }

    return "";
};

export const passwordMatchValidator: Validator = (value, form) =>
    String(value ?? "") === String(form?.password ?? "") ? "" : "Mật khẩu không khớp.";

export const validate = (value: string | number, validators: Validator[], form?: any): string => {
    for (const validator of validators) {
        const error = validator(value, form);
        if (error) return error;
    }
    return "";
};