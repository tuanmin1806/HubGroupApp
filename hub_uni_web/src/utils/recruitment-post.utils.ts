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