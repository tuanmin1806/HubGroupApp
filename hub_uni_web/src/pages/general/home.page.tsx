import { Box, createTheme, Grid, ThemeProvider } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../components/searchs/search-bar.search";
import SearchTabs from "../../components/searchs/search-tab.search";
import SelectActionCard from "../../components/cards/select-action-card.card";
import ArticleCard from "../../components/cards/article-card.card";
import ProfessionCard from "../../components/cards/profession-card.card";

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
                        bgcolor: '#ee6a28',
                        py: 3
                    }}
                >
                    <Box sx={{
                        color: 'white',
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
                            <SearchBar />
                        </Box>

                        <Box sx={{
                            mt: 2
                        }}
                        >
                            <SearchTabs />
                        </Box>
                    </Box>
                </Grid>

                <Grid
                    container
                    direction="column"
                    alignItems="center"
                    sx={{
                        py: 3
                    }}
                >
                    <Box sx={{
                        color: '#ff5722',
                        fontSize: 28,
                        fontWeight: 'bold',
                        mb: 2,
                    }}
                    >
                        Tin tuyển sinh mới nhất
                    </Box>
                    <Box sx={{ width: '100%', maxWidth: 1200 }}>
                        <SelectActionCard />
                    </Box>
                </Grid>

                <Grid
                    container
                    direction="column"
                    alignItems="center"
                    sx={{
                        py: 3
                    }}
                >
                    <Box sx={{
                        color: '#ff5722',
                        fontSize: 28,
                        fontWeight: 'bold',
                        mb: 2,
                    }}
                    >
                        TOP ngành tuyển sinh
                    </Box>
                    <Box sx={{ width: '100%', maxWidth: 1200 }}>
                        <SelectActionCard />
                    </Box>
                </Grid>

                <Grid
                    container
                    direction="column"
                    alignItems="center"
                    sx={{
                        py: 3
                    }}
                >
                    <Box sx={{
                        color: '#ff5722',
                        fontSize: 28,
                        fontWeight: 'bold',
                        mb: 2,
                    }}
                    >
                        Ngành nghề nổi bật
                    </Box>
                    <Box sx={{ width: '100%', maxWidth: 1200 }}>
                        <ProfessionCard />
                    </Box>
                </Grid>

                <Grid
                    container
                    direction="column"
                    alignItems="center"
                    sx={{
                        py: 3
                    }}
                >
                    <Box sx={{
                        color: '#ff5722',
                        fontSize: 28,
                        fontWeight: 'bold',
                        mb: 2,
                    }}
                    >
                        Bài viết
                    </Box>
                    <Box sx={{ width: '100%', maxWidth: 1200 }}>
                        <ArticleCard />
                    </Box>
                </Grid>

            </ThemeProvider>
        </>
    );
};

export default HomePage;