import { Box, createTheme, ThemeProvider } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../components/searchs/search-bar.search";
import SearchTabs from "../../components/searchs/search-tab.search";
import { BACKGROUND_COLOR, TEXT_COLOR } from "../../constants/common.constant";
import Grid from "@mui/material/Grid";
import RecruitmentPostComponent from "../../components/general/homepage/recruitment-post.component";
import OrganizationComponent from "../../components/general/homepage/organization.component";
import ArticleComponent from "../../components/general/homepage/article.component";

const theme = createTheme({
    palette: {
        primary: {
            main: "#007FFF",
            dark: "#0066CC",
        },
    },
    typography: {
        fontFamily: [
            "-apple-system",
            "BlinkMacSystemFont",
            '"Segoe UI"',
            "Roboto",
            '"Helvetica Neue"',
            "Arial",
            "sans-serif",
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(","),
    },
});

const HomePage = () => {
    const navigate = useNavigate();

    const handleSearch = (query: string, provinceSeo: string) => {
        const params = new URLSearchParams();
        if (query.trim()) params.append('search', query.trim());
        if (provinceSeo) params.append('provinceSeo', provinceSeo);
        if (params.toString()) navigate(`/tim-kiem-truong?${params.toString()}`);
    };

    useEffect(() => {
        document.title = "Nền tảng tra cứu thông tin du học Hàn Quốc số 1 Việt Nam | duhochan.hubgroup.vn";
    }, [navigate]);

    return (
        <>
            <ThemeProvider theme={theme}>
                <Grid
                    container
                    direction="column"
                    alignItems="center"
                    sx={{
                        background: `linear-gradient(180deg, rgba(247, 148, 0, 0.95) 0%, rgba(252, 167, 40, 0.85) 40%, rgb(255, 183, 116) 100%)`,
                        py: 3,
                        position: "relative",
                        overflow: "hidden",
                    }}
                >
                    <Box sx={{
                        position: "absolute",
                        top: "-100%", left: "-25%",
                        width: "55%", height: "350%",
                        background: "rgba(248, 59, 59, 0.06)",
                        transform: "rotate(-45deg)",
                        pointerEvents: "none",
                    }} />
                    <Box sx={{
                        position: "absolute",
                        top: "-100%", left: "-10%",
                        width: "30%", height: "350%",
                        background: "rgba(255,255,255,0.10)",
                        transform: "rotate(-45deg)",
                        pointerEvents: "none",
                    }} />
                    <Box sx={{
                        position: "absolute",
                        top: "-100%", left: "5%",
                        width: "15%", height: "350%",
                        background: "rgba(255,255,255,0.13)",
                        transform: "rotate(-45deg)",
                        pointerEvents: "none",
                    }} />
                   
                    <Box sx={{
                        position: "absolute",
                        top: "-100%", right: "-25%",
                        width: "55%", height: "350%",
                        background: "rgba(243, 69, 69, 0.06)",
                        transform: "rotate(-45deg)",
                        pointerEvents: "none",
                    }} />
                    <Box sx={{
                        position: "absolute",
                        top: "-100%", right: "-10%",
                        width: "30%", height: "350%",
                        background: "rgba(255,255,255,0.10)",
                        transform: "rotate(-45deg)",
                        pointerEvents: "none",
                    }} />
                    <Box sx={{
                        position: "absolute",
                        top: "-100%", right: "5%",
                        width: "15%", height: "350%",
                        background: "rgba(255,255,255,0.13)",
                        transform: "rotate(-45deg)",
                        pointerEvents: "none",
                    }} />

                    {/* Nội dung */}
                    <Box sx={{
                        position: "relative", zIndex: 1,
                        color: 'white', fontSize: 28, fontWeight: 'bold', mb: 2
                    }}>
                        Tra cứu thông chương trình tuyển sinh du học Hàn Quốc nhanh chóng và chính xác
                    </Box>

                    <Box sx={{
                        position: "relative", zIndex: 1,
                        width: "100%", maxWidth: 1200,
                    }}>
                        <Box>
                            <SearchBar onSearch={handleSearch} />
                        </Box>
                        <Box sx={{ mt: 1.5 }}>
                            <SearchTabs />
                        </Box>
                    </Box>
                </Grid>

                <Grid container justifyContent="center" sx={{ py: 2 }}>
                    <RecruitmentPostComponent />
                </Grid>

                <Grid container justifyContent="center" sx={{ py: 2 }}>
                    <OrganizationComponent />
                </Grid>

                <Grid container justifyContent="center" sx={{ py: 2 }}>
                    <ArticleComponent />
                </Grid>
            </ThemeProvider>
        </>
    );
};

export default HomePage;