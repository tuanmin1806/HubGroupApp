import { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import LinearProgress from "@mui/material/LinearProgress";
import Skeleton from "@mui/material/Skeleton";
import { styled, keyframes } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { LineChart } from "@mui/x-charts/LineChart";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SchoolIcon from "@mui/icons-material/School";
import PeopleIcon from "@mui/icons-material/People";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import hub_logo from "../../../assets/hub_logo.png";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { SelectChangeEvent } from "@mui/material/Select";
import { useGetClientDashboardQuery } from "../../../app/features/dashboard.api";

interface MetricItem {
    icon: React.ReactNode;
    value: string | number;
    label: string;
    trendIcon?: React.ReactNode;
}

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const slideInLeft = keyframes`
  from { opacity: 0; transform: translateX(-30px); }
  to   { opacity: 1; transform: translateX(0); }
`;

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(250, 161, 27, 0.4); }
  50%      { box-shadow: 0 0 0 20px rgba(250, 161, 27, 0); }
`;

const BannerWrapper = styled(Box)(({ theme }) => ({
    background: "linear-gradient(135deg, #fff9f0 0%, #fff5e6 100%)",
    borderRadius: "24px",
    padding: "clamp(16px, 3vw, 28px)",
    marginBottom: "16px",
    position: "relative",
    overflow: "hidden",
    animation: `${fadeInUp} 0.6s ease-out`,
    border: "1px solid rgba(250, 161, 27, 0.2)",
    boxShadow: "0 4px 20px rgba(250, 161, 27, 0.08)",

    [theme.breakpoints.down("sm")]: { borderRadius: "18px" },

    "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        right: 0,
        width: "clamp(160px, 30vw, 300px)",
        height: "clamp(160px, 30vw, 300px)",
        background: "radial-gradient(circle, rgba(250,161,27,0.15) 0%, transparent 70%)",
        borderRadius: "50%",
    },

    "&::after": {
        content: '""',
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "clamp(120px, 20vw, 200px)",
        height: "clamp(120px, 20vw, 200px)",
        background: "radial-gradient(circle, rgba(250,161,27,0.1) 0%, transparent 70%)",
        borderRadius: "50%",
    },
}));

const StyledCard = styled(Card)({
    background: "linear-gradient(135deg, #ffffff 0%, #fef9f0 100%)",
    borderRadius: "18px",
    border: "1px solid rgba(250, 161, 27, 0.15)",
    transition: "all 0.3s ease",
    height: "100%",
    "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: "0 12px 30px rgba(250, 161, 27, 0.15)",
        borderColor: "#faa11b",
    },
});

const MetricPaper = styled(Paper)({
    padding: "20px",
    borderRadius: "18px",
    background: "linear-gradient(135deg, #ffffff 0%, #fef9f0 100%)",
    border: "1px solid rgba(250, 161, 27, 0.15)",
    transition: "all 0.3s ease",
    height: "100%",
    "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: "0 8px 25px rgba(250, 161, 27, 0.12)",
    },
});

const MONTH_LABELS = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];

const MetricCard = ({ icon, value, label, trendIcon }: MetricItem) => (
    <MetricPaper elevation={0}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
            <Avatar sx={{ bgcolor: "rgba(250, 161, 27, 0.1)", color: "#faa11b" }}>
                {icon}
            </Avatar>
            {trendIcon}
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
            {value}
        </Typography>
        <Typography variant="body2" sx={{ color: "#666" }}>
            {label}
        </Typography>
    </MetricPaper>
);

const MetricCardSkeleton = () => (
    <MetricPaper elevation={0}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="circular" width={20} height={20} />
        </Box>
        <Skeleton variant="text" sx={{ fontSize: "2rem", mb: 0.5 }} width="60%" />
        <Skeleton variant="text" width="80%" />
    </MetricPaper>
);

const SuccessBanner = ({ rate }: { rate: number }) => (
    <Box sx={{ textAlign: "center", minWidth: 200 }}>
        <Typography sx={{ color: "#faa11b", fontSize: "2.5rem", fontWeight: 800 }}>
            {rate}%
        </Typography>
        <Typography sx={{ color: "#666", fontSize: "0.85rem", fontWeight: 500 }}>
            Tỷ lệ thành công
        </Typography>
        <LinearProgress
            variant="determinate"
            value={rate}
            sx={{
                height: 6,
                borderRadius: 3,
                mt: 1,
                backgroundColor: "rgba(250, 161, 27, 0.1)",
                "& .MuiLinearProgress-bar": { backgroundColor: "#faa11b" },
            }}
        />
    </Box>
);

const YearSelector = ({ year, onChange }: { year: number; onChange: (y: number) => void }) => {
    const BASE_YEAR = 2026;
    const years = Array.from({ length: 11 }, (_, i) => BASE_YEAR - 5 + i);

    return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
            <Select
                value={year}
                onChange={(e: SelectChangeEvent<number>) => onChange(Number(e.target.value))}
                size="small"
                sx={{
                    borderRadius: "8px",
                    fontWeight: 600,
                    color: "#faa11b",
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(250, 161, 27, 0.4)" },
                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#faa11b" },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#faa11b" },
                    "& .MuiSelect-icon": { color: "#faa11b" },
                }}
            >
                {years.map((y) => (
                    <MenuItem key={y} value={y} sx={{ fontWeight: y === BASE_YEAR ? 700 : 400, color: y === BASE_YEAR ? "#faa11b" : "inherit" }}>
                        {y}
                    </MenuItem>
                ))}
            </Select>
        </Box>
    );
};

const TrendChart = ({ data, isMobile, isLoading, year, onYearChange, }: {
    data: { month: string; count: number }[];
    isMobile: boolean;
    isLoading: boolean;
    year: number;
    onYearChange: (y: number) => void;
}) => (
    <StyledCard elevation={0}>
        <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2, flexWrap: "wrap", gap: 2 }}>
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Xu hướng đăng ký theo tháng
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#666" }}>
                        Số lượng hồ sơ đăng ký du học trong năm
                    </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <TrendingUpIcon sx={{ color: "#4caf50", fontSize: 20 }} />
                        <Typography sx={{ color: "#4caf50", fontWeight: 600, fontSize: "0.9rem" }}>
                            Tăng 32% so với năm trước
                        </Typography>
                    </Box>
                    <YearSelector year={year} onChange={onYearChange} />
                </Box>
            </Box>

            {isLoading ? (<Skeleton variant="rectangular" height={isMobile ? 250 : 350} sx={{ borderRadius: 2 }} />) : (
                <LineChart
                    dataset={data}
                    xAxis={[{ dataKey: "month", scaleType: "point" }]}
                    series={[
                        {
                            dataKey: "count",
                            label: "Số lượng hồ sơ",
                            color: "#faa11b",
                            showMark: true,
                            curve: "linear",
                        },
                    ]}
                    height={isMobile ? 250 : 350}
                    margin={{ left: 50, right: 30, top: 30, bottom: 30 }}
                    sx={{
                        "& .MuiChartsAxis-line": { stroke: "#e0e0e0" },
                        "& .MuiChartsAxis-tickLabel": { fill: "#666" },
                    }}
                />
            )}
        </CardContent>
    </StyledCard>
);


const DashboardComponent = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [selectedYear, setSelectedYear] = useState<number>(2026);

    const { data, isLoading } = useGetClientDashboardQuery(selectedYear);

    const chartData = useMemo(() =>
        (data?.ApplicationByMonths ?? []).map((item) => ({
            month: MONTH_LABELS[item.Month - 1],
            count: item.ApplicationCount,
        })),
        [data]);

    const metrics: MetricItem[] = useMemo(() => [
        {
            icon: <SchoolIcon />,
            value: data ? data.OrgCount : "—",
            label: "Trường học",
            trendIcon: <TrendingUpIcon sx={{ color: "#4caf50", fontSize: 20 }} />,
        },
        {
            icon: <PeopleIcon />,
            value: data ? data.StudentCount : "—",
            label: "Học viên",
            trendIcon: <TrendingUpIcon sx={{ color: "#4caf50", fontSize: 20 }} />,
        },
        {
            icon: <EmojiEventsIcon />,
            value: data ? data.RecruitPostCount : "—",
            label: "Chương trình đào tạo",
            trendIcon: <TrendingUpIcon sx={{ color: "#4caf50", fontSize: 20 }} />,
        },
        {
            icon: <LocationOnIcon />,
            value: data ? `${data.CountryCount}+` : "—",
            label: "Quốc gia & vùng lãnh thổ",
            trendIcon: <TrendingUpIcon sx={{ color: "#4caf50", fontSize: 20 }} />,
        },
    ], [data]);

    return (
        <Box sx={{ width: "100%", maxWidth: 1200, mx: "auto" }}>
            <BannerWrapper>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: {
                            xs: "column",
                            md: "row",
                        },
                        alignItems: {
                            xs: "flex-start",
                            md: "center",
                        },
                        justifyContent: "space-between",
                        gap: {
                            xs: 3,
                            sm: 4,
                            md: 5,
                        },
                        width: "100%",
                        position: "relative",
                        zIndex: 1,
                    }}
                >
                    <Box
                        sx={{
                            flex: 1,
                            minWidth: 0,
                            width: "100%",
                            animation: `${slideInLeft} 0.6s ease-out`,
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: {
                                    xs: 1.5,
                                    sm: 2,
                                },
                                mb: 2,
                                flexWrap: "nowrap",
                            }}
                        >
                            <Box
                                component="img"
                                src={hub_logo}
                                alt="Hub Logo"
                                sx={{
                                    width: {
                                        xs: 48,
                                        sm: 56,
                                        md: 60,
                                    },
                                    height: {
                                        xs: 48,
                                        sm: 56,
                                        md: 60,
                                    },
                                    objectFit: "contain",
                                    borderRadius: "8px",
                                    flexShrink: 0,
                                    animation: `${pulseGlow} 2s infinite`,
                                }}
                            />

                            <Typography
                                sx={{
                                    fontSize: {
                                        xs: "1.25rem",
                                        sm: "1.6rem",
                                        md: "2rem",
                                    },
                                    lineHeight: 1.2,
                                    fontWeight: 800,
                                    wordBreak: "break-word",
                                    background: "linear-gradient(135deg, #1a1a1a, #faa11b)",
                                    backgroundClip: "text",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                }}
                            >
                                Trung tâm Du học Hub
                            </Typography>
                        </Box>

                        <Typography
                            sx={{
                                fontSize: {
                                    xs: "0.9rem",
                                    sm: "1rem",
                                },
                                color: "#666",
                                mb: 2,
                                maxWidth: {
                                    xs: "100%",
                                    md: 520,
                                },
                                lineHeight: 1.7,
                            }}
                        >
                            Đồng hành cùng bạn trên con đường chinh phục tri thức quốc tế
                        </Typography>

                        <Box
                            sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: {
                                    xs: 1.5,
                                    sm: 2,
                                    md: 3,
                                },
                            }}
                        >
                            {[
                                "10+ năm kinh nghiệm",
                                "5000+ học viên thành công",
                            ].map((text) => (
                                <Box
                                    key={text}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                        minWidth: {
                                            xs: "100%",
                                            sm: "auto",
                                        },
                                    }}
                                >
                                    <CheckCircleIcon
                                        sx={{
                                            color: "#faa11b",
                                            fontSize: 20,
                                            flexShrink: 0,
                                        }}
                                    />

                                    <Typography
                                        sx={{
                                            color: "#555",
                                            fontSize: "0.9rem",
                                            lineHeight: 1.4,
                                        }}
                                    >
                                        {text}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            width: {
                                xs: "100%",
                                md: "auto",
                            },
                            display: "flex",
                            justifyContent: {
                                xs: "flex-start",
                                sm: "center",
                                md: "flex-end",
                            },
                            flexShrink: 0,
                        }}
                    >
                        <SuccessBanner rate={98} />
                    </Box>
                </Box>
            </BannerWrapper>

            {/* <Grid container spacing={2} sx={{ mb: 2 }}>
                {isLoading ? Array.from({ length: 4 }).map((_, i) => (
                    <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
                        <MetricCardSkeleton />
                    </Grid>
                )) : metrics.map((metric, index) => (
                    <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
                        <MetricCard {...metric} />
                    </Grid>
                ))}
            </Grid> */}

            {/* <TrendChart data={chartData} isMobile={isMobile} isLoading={isLoading} year={selectedYear} onYearChange={setSelectedYear} /> */}
        </Box>
    );
};

export default DashboardComponent;