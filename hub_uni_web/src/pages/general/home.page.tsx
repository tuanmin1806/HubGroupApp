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

    const handleSearch = (query: string, provinceId: string) => {
        const params = new URLSearchParams();

        if (query.trim()) {
            params.append('search', query.trim());
        }

        if (provinceId) {
            params.append('provinceId', provinceId);
        }

        if (params.toString()) {
            navigate(`/tim-kiem-to-chuc?${params.toString()}`);
        }
    };

    useEffect(() => {
        document.title = "Trang Chủ | HUB UNI";
    }, [navigate]);

    return (
        <>
            <ThemeProvider theme={theme}>
                <Grid
                    container
                    direction="column"
                    alignItems="center"
                    sx={{
                        bgcolor: BACKGROUND_COLOR,
                        py: 3
                    }}
                >
                    <Box sx={{
                        color: TEXT_COLOR,
                        fontSize: 28,
                        fontWeight: 'bold',
                        mb: 2
                    }}
                    >
                        Tra cứu thông tin tuyển sinh đại học nhanh chóng và chính xác
                    </Box>

                    <Box sx={{
                        width: "100%",
                        maxWidth: 1200,
                    }}
                    >
                        <Box>
                            <SearchBar onSearch={handleSearch} />
                        </Box>

                        <Box sx={{
                            mt: 2
                        }}
                        >
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