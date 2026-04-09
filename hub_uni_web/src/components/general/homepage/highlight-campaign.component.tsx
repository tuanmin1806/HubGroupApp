import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { styled, keyframes } from "@mui/material/styles";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import StarIcon from "@mui/icons-material/Star";
import SchoolIcon from "@mui/icons-material/School";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import WorkIcon from "@mui/icons-material/Work";
import PublicIcon from "@mui/icons-material/Public";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import LanguageIcon from "@mui/icons-material/Language";
import { useNavigate } from "react-router-dom";
import { useOrganizationsGetTopQuery } from "../../../app/features/organization.api";

const currentYear = new Date().getFullYear();

interface CampaignKeyword {
    text: string;
    icon: React.ReactNode;
}

const CAMPAIGN_KEYWORDS: CampaignKeyword[] = [
    { text: `Trường Đại học Tốt nhất Hàn Quốc ${currentYear}`, icon: <EmojiEventsIcon sx={{ fontSize: 16 }} /> },
    { text: `Chương trình Tuyển sinh HOT ${currentYear}`, icon: <StarIcon sx={{ fontSize: 16 }} /> },
    { text: `Học bổng Toàn phần Hàn Quốc ${currentYear}`, icon: <SchoolIcon sx={{ fontSize: 16 }} /> },
    { text: `Top 10 Ngành Nghề HOT nhất ${currentYear}`, icon: <LocalFireDepartmentIcon sx={{ fontSize: 16 }} /> },
    { text: `Du học Hàn Quốc Chi phí Thấp ${currentYear}`, icon: <FlightTakeoffIcon sx={{ fontSize: 16 }} /> },
    { text: `Đại học Seoul Tuyển sinh Quốc tế ${currentYear}`, icon: <AccountBalanceIcon sx={{ fontSize: 16 }} /> },
    { text: "Cơ hội Việc làm sau Tốt nghiệp 98%", icon: <WorkIcon sx={{ fontSize: 16 }} /> },
    { text: "15+ Quốc gia Đối tác Hàng đầu", icon: <PublicIcon sx={{ fontSize: 16 }} /> },
    { text: `Chương trình Tiếng Hàn Cấp tốc ${currentYear}`, icon: <MenuBookIcon sx={{ fontSize: 16 }} /> },
    { text: "Trung tâm Du học Uy tín số 1 Việt Nam", icon: <WorkspacePremiumIcon sx={{ fontSize: 16 }} /> },
    { text: "Tư vấn Miễn phí – Hỗ trợ 24/7", icon: <SupportAgentIcon sx={{ fontSize: 16 }} /> },
    { text: "5.000+ Học viên Thành công Toàn cầu", icon: <LanguageIcon sx={{ fontSize: 16 }} /> },
];

const marquee = keyframes` 0%   { transform: translateX(0); }  100% { transform: translateX(-50%); }`;
const shimmer = keyframes` 0%   { background-position: -200% center; } 100% { background-position: 200% center; }`;

const BannerRoot = styled(Box)({
    width: "100%",
    overflow: "hidden",
    background: "linear-gradient(90deg, #fff8ee 0%, #fff3e0 50%, #fff8ee 100%)",
    borderTop: "1.5px solid rgba(250,161,27,0.25)",
    borderBottom: "1.5px solid rgba(250,161,27,0.25)",
    display: "flex",
    alignItems: "center",
    height: 40,
    position: "relative",
    userSelect: "none",
    borderRadius: "5px",
    "&::before, &::after": {
        content: '""',
        position: "absolute",
        top: 0,
        bottom: 0,
        width: 80,
        zIndex: 2,
        pointerEvents: "none",
    },
    "&::before": {
        left: 0,
        background: "linear-gradient(to right, #fff8ee 0%, transparent 100%)",
    },
    "&::after": {
        right: 0,
        background: "linear-gradient(to left, #fff8ee 0%, transparent 100%)",
    },
});

const Track = styled(Box)({
    display: "flex",
    alignItems: "center",
    whiteSpace: "nowrap",
    animation: `${marquee} 38s linear infinite`,
    willChange: "transform",
});

const Keyword = styled(Typography)({
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontSize: "0.8rem",
    fontWeight: 700,
    color: "#b36a00",
    padding: "0 24px",
    letterSpacing: 0.2,
    cursor: "default",
    transition: "color 0.2s",
    "&:hover": {
        background: "linear-gradient(90deg, #faa11b, #f5c842, #faa11b)",
        backgroundSize: "200% auto",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        animation: `${shimmer} 1.2s linear infinite`,
    },
});

const Label = styled(Box)({
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 3,
    display: "flex",
    alignItems: "center",
    borderRadius: "5px",
    gap: 3,
    padding: "0 7px 0 7px",
    background: "#f25129",
    boxShadow: "4px 0 8px rgba(255, 102, 97, 0.3)",
    flexShrink: 0,
});

const CampaignHighlight = () => {
    const navigate = useNavigate();
    const { data, isLoading } = useOrganizationsGetTopQuery({ page: 1, size: 10 });
    const organizations = data?.Items || [];
    const items = [...organizations, ...organizations];
    return (
        <Box sx={{ width: "100%", maxWidth: 1200, mx: "auto", my: 1, position: "relative" }}>
            <BannerRoot>
                <Label>
                    <WhatshotIcon sx={{ fontSize: 15, color: "#fff" }} />
                    <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, color: "#fff", letterSpacing: 0.8, whiteSpace: "nowrap" }}>
                        HOT
                    </Typography>
                </Label>
                {organizations.length > 0 && (
                    <Box sx={{ overflow: "hidden", width: "100%" }}>
                        <Track>
                            {isLoading ? Array.from({ length: 6 }).map((_, i) => (
                                <Keyword key={i}>Đang tải...</Keyword>
                            ))
                                : items.map((org, i) => (
                                    <Box key={org.Id + i} sx={{ display: "inline-flex", alignItems: "center" }}>
                                        <Keyword
                                            sx={{
                                                display: "inline-flex",
                                                cursor: "pointer",
                                            }}
                                            onClick={() =>
                                                navigate(`/thong-tin-truong/${org.SeoUrl}`)
                                            }
                                        >
                                            <SchoolIcon sx={{ fontSize: 16 }} />
                                            {org.Name}
                                        </Keyword>
                                    </Box>
                                ))}
                        </Track>
                    </Box>
                )}
            </BannerRoot>
        </Box>
    );
};

export default CampaignHighlight;