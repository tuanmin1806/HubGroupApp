import TrendingUp from "@mui/icons-material/TrendingUp";
import Article from "@mui/icons-material/Article";
import People from "@mui/icons-material/People";
import HowToReg from "@mui/icons-material/HowToReg";
import CheckCircle from "@mui/icons-material/CheckCircle";
import Cancel from "@mui/icons-material/Cancel";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import { useGetDashboardQuery } from "../../app/features/dashboard.api";
import { PieChart } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { getUserInfo } from "../../app/services/auth.service";
import labelsVi from "../../i18n/labels.vi";

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: number | undefined;
    color: string;
    bg: string;
    loading: boolean;
}

function StatCard({ icon, label, value, color, bg, loading }: StatCardProps) {
    return (
        <Card
            elevation={0}
            sx={{
                borderRadius: 4,
                border: "1px solid",
                borderColor: "divider",
                height: "100%",
                transition: "box-shadow 0.2s, transform 0.2s",
                "&:hover": {
                    boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
                    transform: "translateY(-2px)",
                },
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="flex-start" gap={2}>
                    <Box
                        sx={{
                            width: 52,
                            height: 52,
                            borderRadius: 3,
                            background: bg,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            color,
                        }}
                    >
                        {icon}
                    </Box>
                    <Box flex={1} minWidth={0}>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            fontWeight={500}
                            noWrap
                            mb={0.5}
                        >
                            {label}
                        </Typography>
                        {loading ? (
                            <Skeleton variant="text" width={60} height={40} />
                        ) : (
                            <Typography variant="h4" fontWeight={700} lineHeight={1.2}>
                                {value ?? 0}
                            </Typography>
                        )}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}

function EmptyChart() {
    return (
        <Box display="flex" alignItems="center" justifyContent="center" height={240}>
            <Typography color="text.secondary" variant="body2">
                {labels.dashboard.noData}
            </Typography>
        </Box>
    );
}

const MAX_TICK = 14;

function truncate(str: string, max = MAX_TICK) { return str.length > max ? str.slice(0, max) + "…" : str; }

const labels = labelsVi;

export default function AdminDashboardPage() {
    const userInfo = getUserInfo();
    const orgId = userInfo?.OrganizationId ?? "";

    const { data, isLoading } = useGetDashboardQuery(orgId, { skip: !orgId });

    const pending =
        (data?.StudentApplyCount ?? 0) -
        (data?.StudentPassCount ?? 0) -
        (data?.StudentFailCount ?? 0);

    const pieData = [
        { id: 0, value: data?.StudentPassCount ?? 0, label: labels.dashboard.pass, color: "#22c55e" },
        { id: 1, value: data?.StudentFailCount ?? 0, label: labels.dashboard.fail, color: "#ef4444" },
        { id: 2, value: pending > 0 ? pending : 0, label: labels.dashboard.pending, color: "#f59e0b" },
    ].filter((d) => d.value > 0);

    const hasPieData = pieData.length > 0;

    const recruitData = (data?.StudentByRecruitPost ?? []).slice(0, 12);
    const fullLabels = recruitData.map((item) => item.RecruitPost);
    const barValues = recruitData.map((item) => item.StudentCount);
    const hasBarData = recruitData.length > 0;

    const passRate = data && data.StudentApplyCount > 0 ? Math.round((data.StudentPassCount / data.StudentApplyCount) * 100) : 0;

    return (
        <Box sx={{ pb: 4 }}>
            <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={1}
                flexWrap="wrap"
                gap={1}
            >
                <Box>
                    <Typography variant="h5" fontWeight={700} mb={0.5}>
                        {labels.dashboard.overview}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {labels.dashboard.overviewDescription}
                    </Typography>
                </Box>
                <Chip
                    icon={<TrendingUp fontSize="small" />}
                    label={`${labels.dashboard.passRate}: ${passRate}%`}
                    color="success"
                    variant="outlined"
                    sx={{ fontWeight: 600, fontSize: 13 }}
                />
            </Box>

            <Grid container spacing={2} mt={1}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <StatCard
                        icon={<Article />}
                        label={labels.dashboard.recruitmentProgram}
                        value={data?.RecruitPostCount}
                        color="#3b82f6"
                        bg="#eff6ff"
                        loading={isLoading}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <StatCard
                        icon={<People />}
                        label={labels.dashboard.staffAccountManagement}
                        value={data?.StaffCount}
                        color="#f59e0b"
                        bg="#fffbeb"
                        loading={isLoading}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <StatCard
                        icon={<HowToReg />}
                        label={labels.dashboard.totalApplications}
                        value={data?.StudentApplyCount}
                        color="#8b5cf6"
                        bg="#f5f3ff"
                        loading={isLoading}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                    <StatCard
                        icon={<CheckCircle />}
                        label={labels.dashboard.totalPass}
                        value={data?.StudentPassCount}
                        color="#22c55e"
                        bg="#f0fdf4"
                        loading={isLoading}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                    <StatCard
                        icon={<Cancel />}
                        label={labels.dashboard.totalFail}
                        value={data?.StudentFailCount}
                        color="#ef4444"
                        bg="#fef2f2"
                        loading={isLoading}
                    />
                </Grid>
            </Grid>

            <Grid container spacing={2} mt={1}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card
                        elevation={0}
                        sx={{
                            borderRadius: 4,
                            border: "1px solid",
                            borderColor: "divider",
                            height: "100%",
                        }}
                    >
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="subtitle1" fontWeight={700} mb={0.5}>
                                {labels.dashboard.passRate}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" mb={1}>
                                {labels.dashboard.passRateDescription}
                            </Typography>

                            {isLoading ? (
                                <Skeleton
                                    variant="circular"
                                    width={180}
                                    height={180}
                                    sx={{ mx: "auto", mt: 2 }}
                                />
                            ) : !hasPieData ? (
                                <EmptyChart />
                            ) : (
                                <PieChart
                                    series={[
                                        {
                                            data: pieData,
                                            innerRadius: 55,
                                            outerRadius: 95,
                                            paddingAngle: 3,
                                            cornerRadius: 4,
                                            highlightScope: { fade: "global", highlight: "item" },
                                            faded: {
                                                innerRadius: 55,
                                                additionalRadius: -4,
                                                color: "gray",
                                            },
                                        },
                                    ]}
                                    height={270}
                                    slotProps={{
                                        legend: {
                                            direction: "vertical",
                                            position: { vertical: "bottom", horizontal: "center" },
                                        },
                                    }}
                                />
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <Card
                        elevation={0}
                        sx={{
                            borderRadius: 4,
                            border: "1px solid",
                            borderColor: "divider",
                            height: "100%",
                        }}
                    >
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="subtitle1" fontWeight={700} mb={0.5}>
                                {labels.dashboard.totalApplicationsByRecruitmentProgram}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" mb={1}>
                                {labels.dashboard.totalApplicationsByRecruitmentProgramDescription}
                            </Typography>

                            {isLoading ? (
                                <Skeleton
                                    variant="rectangular"
                                    width="100%"
                                    height={230}
                                    sx={{ borderRadius: 2 }}
                                />
                            ) : !hasBarData ? (
                                <EmptyChart />
                            ) : (
                                <Box
                                    sx={{
                                        overflowX: "auto",
                                        "&::-webkit-scrollbar": { height: 6 },
                                        "&::-webkit-scrollbar-track": {
                                            borderRadius: 3,
                                            bgcolor: "grey.100",
                                        },
                                        "&::-webkit-scrollbar-thumb": {
                                            borderRadius: 3,
                                            bgcolor: "grey.400",
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{ minWidth: Math.max(recruitData.length * 72, 300) }}
                                    >
                                        <BarChart
                                            xAxis={[
                                                {
                                                    scaleType: "band",
                                                    data: fullLabels,
                                                    valueFormatter: (value, context) => context.location === "tick" ? truncate(value) : value,
                                                    tickLabelStyle: {
                                                        fontSize: 11,
                                                        fontWeight: 500,
                                                    },
                                                },
                                            ]}
                                            yAxis={[
                                                {
                                                    tickMinStep: 1,
                                                    tickLabelStyle: { fontSize: 12 },
                                                },
                                            ]}
                                            series={[
                                                {
                                                    data: barValues,
                                                    label: labels.dashboard.totalApplications,
                                                    color: "#3b82f6",
                                                    highlightScope: {
                                                        fade: "global",
                                                        highlight: "item",
                                                    },
                                                },
                                            ]}
                                            height={270}
                                            borderRadius={6}
                                            margin={{ top: 16, right: 16, left: 36, bottom: 56 }}
                                            hideLegend
                                        />
                                    </Box>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}