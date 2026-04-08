import { useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import LinearProgress from "@mui/material/LinearProgress";
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
import { Grid } from "@mui/material";

interface DashboardData {
    totalSchools: number;
    totalPrograms: number;
    activeStudents: number;
    successRate: number;
    monthlyApplications: { month: string; count: number }[];
    completionRate: number;
}

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
    padding: "32px",
    marginBottom: "32px",
    position: "relative",
    overflow: "hidden",
    animation: `${fadeInUp} 0.6s ease-out`,
    border: "1px solid rgba(250, 161, 27, 0.2)",
    boxShadow: "0 4px 20px rgba(250, 161, 27, 0.08)",

    "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        right: 0,
        width: "300px",
        height: "300px",
        background: "radial-gradient(circle, rgba(250,161,27,0.15) 0%, transparent 70%)",
        borderRadius: "50%",
    },
    "&::after": {
        content: '""',
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "200px",
        height: "200px",
        background: "radial-gradient(circle, rgba(250,161,27,0.1) 0%, transparent 70%)",
        borderRadius: "50%",
    },
}));

const StyledCard = styled(Card)({
    background: "linear-gradient(135deg, #ffffff 0%, #fef9f0 100%)",
    borderRadius: "20px",
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
    borderRadius: "20px",
    background: "linear-gradient(135deg, #ffffff 0%, #fef9f0 100%)",
    border: "1px solid rgba(250, 161, 27, 0.15)",
    transition: "all 0.3s ease",
    height: "100%",

    "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: "0 8px 25px rgba(250, 161, 27, 0.12)",
    },
});

const formatNumber = (num: number): string => {
    return new Intl.NumberFormat("vi-VN").format(num);
};

const MetricCard = ({ icon, value, label, trendIcon }: MetricItem) => (
    <MetricPaper elevation={0}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
            <Avatar sx={{ bgcolor: "rgba(250, 161, 27, 0.1)", color: "#faa11b" }}>
                {icon}
            </Avatar>
            {trendIcon && trendIcon}
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
            {value}
        </Typography>
        <Typography variant="body2" sx={{ color: "#666" }}>
            {label}
        </Typography>
    </MetricPaper>
);

const SuccessBanner = () => (
    <Box sx={{ textAlign: "center", minWidth: 200 }}>
        <Typography sx={{ color: "#faa11b", fontSize: "2.5rem", fontWeight: 800 }}>
            98%
        </Typography>
        <Typography sx={{ color: "#666", fontSize: "0.85rem", fontWeight: 500 }}>
            Tỷ lệ thành công
        </Typography>
        <LinearProgress
            variant="determinate"
            value={87}
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

const TrendChart = ({ data, isMobile }: { data: DashboardData["monthlyApplications"]; isMobile: boolean }) => (
    <StyledCard elevation={0}>
        <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3, flexWrap: "wrap", gap: 2 }}>
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Xu hướng đăng ký theo tháng
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#666" }}>
                        Số lượng hồ sơ đăng ký du học trong năm
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <TrendingUpIcon sx={{ color: "#4caf50", fontSize: 20 }} />
                    <Typography sx={{ color: "#4caf50", fontWeight: 600, fontSize: "0.9rem" }}>
                        Tăng 32% so với năm trước
                    </Typography>
                </Box>
            </Box>

            <LineChart
                dataset={data}
                xAxis={[{ dataKey: "month", scaleType: "point" }]}
                series={[
                    {
                        dataKey: "count",
                        label: "Số lượng hồ sơ",
                        color: "#faa11b",
                        showMark: true,
                        curve: "natural",
                    },
                ]}
                height={isMobile ? 250 : 350}
                margin={{ left: 50, right: 30, top: 30, bottom: 30 }}
                sx={{
                    "& .MuiChartsAxis-line": { stroke: "#e0e0e0" },
                    "& .MuiChartsAxis-tickLabel": { fill: "#666" },
                }}
            />
        </CardContent>
    </StyledCard>
);

const DashboardComponent = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const dashboardData: DashboardData = useMemo(() => ({
        totalSchools: 156,
        totalPrograms: 342,
        activeStudents: 2840,
        successRate: 87,
        monthlyApplications: [
            { month: "Thg 1", count: 245 }, { month: "Thg 2", count: 278 },
            { month: "Thg 3", count: 312 }, { month: "Thg 4", count: 298 },
            { month: "Thg 5", count: 356 }, { month: "Thg 6", count: 389 },
            { month: "Thg 7", count: 423 }, { month: "Thg 8", count: 445 },
            { month: "Thg 9", count: 467 }, { month: "Thg 10", count: 489 },
            { month: "Thg 11", count: 512 }, { month: "Thg 12", count: 534 },
        ],
        completionRate: 78,
    }), []);

    const metrics: MetricItem[] = useMemo(() => [
        {
            icon: <SchoolIcon />,
            value: formatNumber(dashboardData.totalSchools),
            label: "Trường đối tác",
            trendIcon: <TrendingUpIcon sx={{ color: "#4caf50", fontSize: 20 }} />,
        },
        {
            icon: <PeopleIcon />,
            value: formatNumber(dashboardData.activeStudents),
            label: "Học viên đang theo học",
            trendIcon: <TrendingUpIcon sx={{ color: "#4caf50", fontSize: 20 }} />,
        },
        {
            icon: <EmojiEventsIcon />,
            value: formatNumber(dashboardData.totalPrograms),
            label: "Chương trình đào tạo",
            trendIcon: <TrendingUpIcon sx={{ color: "#4caf50", fontSize: 20 }} />,
        },
        {
            icon: <LocationOnIcon />,
            value: "15+",
            label: "Quốc gia & vùng lãnh thổ",
            trendIcon: <TrendingUpIcon sx={{ color: "#4caf50", fontSize: 20 }} />,
        },
    ], [dashboardData]);

    return (
        <Box sx={{ width: "100%", maxWidth: 1200, mx: "auto", px: { xs: 2, sm: 3, md: 4 }, py: { xs: 4, sm: 5, md: 6 } }}>
            {/* Banner chính */}
            <BannerWrapper>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 3 }}>
                    <Box sx={{ flex: 1, animation: `${slideInLeft} 0.6s ease-out` }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                            <Box
                                component="img"
                                src={hub_logo}
                                alt="Hub Logo"
                                sx={{
                                    width: 60,
                                    height: 60,
                                    objectFit: "contain",
                                    borderRadius: "5px",
                                    animation: `${pulseGlow} 2s infinite`,
                                }}
                            />
                            <Typography
                                sx={{
                                    fontSize: { xs: "1.5rem", sm: "1.8rem", md: "2rem" },
                                    fontWeight: 800,
                                    background: "linear-gradient(135deg, #1a1a1a, #faa11b)",
                                    backgroundClip: "text",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                }}
                            >
                                Trung tâm Du học HUB
                            </Typography>
                        </Box>

                        <Typography sx={{ fontSize: { xs: "0.9rem", sm: "1rem" }, color: "#666", mb: 2, maxWidth: 500 }}>
                            Đồng hành cùng bạn trên con đường chinh phục tri thức quốc tế
                        </Typography>

                        <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <CheckCircleIcon sx={{ color: "#faa11b", fontSize: 20 }} />
                                <Typography sx={{ color: "#555", fontSize: "0.85rem" }}>10+ năm kinh nghiệm</Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <CheckCircleIcon sx={{ color: "#faa11b", fontSize: 20 }} />
                                <Typography sx={{ color: "#555", fontSize: "0.85rem" }}>5000+ học viên thành công</Typography>
                            </Box>
                        </Box>
                    </Box>

                    <SuccessBanner />
                </Box>
            </BannerWrapper>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                {metrics.map((metric, index) => (
                    <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
                        <MetricCard {...metric} />
                    </Grid>
                ))}
            </Grid>

            <TrendChart data={dashboardData.monthlyApplications} isMobile={isMobile} />
        </Box>
    );
};

export default DashboardComponent;