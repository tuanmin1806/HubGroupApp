import { lazy } from "react";
import { createTheme, ThemeProvider } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
const RecruitmentPostComponent = lazy(() => import("../../components/general/homepage/recruitment-post.component"));
const OrganizationComponent = lazy(() => import("../../components/general/homepage/organization.component"));
const ArticleComponent = lazy(() => import("../../components/general/homepage/article.component"));
const ProfessionComponent = lazy(() => import("../../components/general/homepage/profession.component"));
const SearchBar = lazy(() => import("../../components/searchs/search-bar.search"));
const SearchTabs = lazy(() => import("../../components/searchs/search-tab.search"));
const CampaignHighlight = lazy(() => import("../../components/general/homepage/highlight-campaign.component"));
const OrganizationTypeComponent = lazy(() => import("../../components/general/homepage/organization-type.component"));
const DashboardComponent = lazy(() => import("../../components/general/homepage/dashboard.component"));
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const theme = createTheme({
    palette: {
        primary: { main: "#007FFF", dark: "#0066CC" },
    },
    typography: {
        fontFamily: ["-apple-system", "BlinkMacSystemFont", '"Segoe UI"', "Roboto", '"Helvetica Neue"', "Arial", "sans-serif"].join(","),
    },
});

const STRIPES = [
    { side: "left", right: undefined, left: "-25%", width: "55%", bg: "rgba(248,59,59,0.06)" },
    { side: "left", right: undefined, left: "-10%", width: "30%", bg: "rgba(255,255,255,0.10)" },
    { side: "left", right: undefined, left: "5%", width: "15%", bg: "rgba(255,255,255,0.13)" },
    { side: "right", left: undefined, right: "-25%", width: "55%", bg: "rgba(243,69,69,0.06)" },
    { side: "right", left: undefined, right: "-10%", width: "30%", bg: "rgba(255,255,255,0.10)" },
    { side: "right", left: undefined, right: "5%", width: "15%", bg: "rgba(255,255,255,0.13)" },
];

const HomePage = () => {
    const navigate = useNavigate();

    const handleSearch = (query: string, provinceSeo: string) => {
        const params = new URLSearchParams();
        if (query.trim()) params.append("search", query.trim());
        if (provinceSeo) params.append("provinceSeo", provinceSeo);
        if (params.toString()) navigate(`/tim-kiem-truong?${params.toString()}`);
    };

    useEffect(() => {
        document.title = "Nền tảng tra cứu thông tin du học Hàn Quốc số 1 Việt Nam | duhochan.hubgroup.vn";
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <Box
                sx={{
                    background: "linear-gradient(180deg, rgba(247,148,0,0.95) 0%, rgba(252,167,40,0.85) 40%, rgb(255,183,116) 100%)",
                    py: { xs: 0.5, sm: 0.5, md: 0.5 },
                    px: { xs: 0.5, sm: 0.5, md: 0.5 },
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {STRIPES.map((s, i) => (
                    <Box key={i} sx={{
                        position: "absolute",
                        top: "-100%",
                        left: s.left,
                        right: s.right,
                        width: s.width,
                        height: "350%",
                        background: s.bg,
                        transform: "rotate(-45deg)",
                        pointerEvents: "none",
                    }} />
                ))}

                <Container maxWidth="lg" disableGutters sx={{ position: "relative", zIndex: 1 }}>
                    <Typography
                        sx={{
                            color: "white",
                            fontWeight: 700,
                            textAlign: "center",
                            mb: { xs: 2, sm: 2.5, md: 3 },
                            fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem", lg: "1.75rem" },
                            lineHeight: 1.4,
                            px: { xs: 0, sm: 1, md: 2 },
                            textShadow: "0 1px 4px rgba(0,0,0,0.15)",
                        }}
                    >
                        Tra cứu thông tin chương trình tuyển sinh du học Hàn Quốc nhanh chóng và chính xác
                    </Typography>

                    <Box sx={{ width: "100%", mb: { xs: 1, sm: 1.5 } }}>
                        <SearchBar onSearch={handleSearch} />
                    </Box>

                    <Box>
                        <SearchTabs />
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="xl">
                <Box>
                    <CampaignHighlight />
                </Box>
                <Box sx={{ mb: { xs: 2, sm: 3 } }}>
                    <OrganizationTypeComponent />
                </Box>
                <Box sx={{ mb: { xs: 2, sm: 3 } }}>
                    <RecruitmentPostComponent />
                </Box>
                <Box sx={{ mb: { xs: 2, sm: 3 } }}>
                    <ProfessionComponent />
                </Box>
                <Box sx={{ mb: { xs: 2, sm: 3 } }}>
                    <OrganizationComponent />
                </Box>
                <Box sx={{ mb: { xs: 2, sm: 3 } }}>
                    <DashboardComponent />
                </Box>
                <Box sx={{ mb: { xs: 2, sm: 3 } }}>
                    <ArticleComponent />
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default HomePage;