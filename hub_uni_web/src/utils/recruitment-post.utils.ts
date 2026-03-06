import { formatDate } from "./date.utils";

export const getRecruitmentStatus = (date?: string | null) => {
    if (!date) return { label: "Gửi lý lịch", color: "text.secondary" };

    const parsed = new Date(date);

    if (isNaN(parsed.getTime()) || parsed.getFullYear() === 1) {
        return { label: "Gửi lý lịch", color: "text.secondary" };
    }

    const now = new Date();
    now.setHours(0, 0, 0, 0);
    parsed.setHours(0, 0, 0, 0);

    if (parsed < now) {
        return {
            label: `${formatDate(date)}`,
            color: "error.main",
        };
    }

    return {
        label: `${formatDate(date)}`,
        color: "success.main",
    };
};

export const formatCurrency = (value?: number) => {
    if (value === undefined || value === null) return "";
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export const normalizeUrl = (url: string) => {
    if (!url) return '';
    return url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
};

export const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>, setValue: (val: string | number) => void) => {
    let priceText = e.target.value;

    const isNegative = priceText.indexOf("-") === 0;

    priceText = priceText.substr(Number(isNegative)).replace(/\D/g, "");

    setValue(`${isNegative ? "-" : ""}${priceText}`);
};

export const formatNumberDisplay = (value: string | number) => {
    if (value === "-") return "-";
    return Number(value).toLocaleString("en-US") || "";
};

export const parseNumberInput = (value: string) => {
    return value.replace(/\D/g, "");
};