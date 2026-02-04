import { Box, createTheme, Grid, ThemeProvider } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../components/searchs/search-bar.search";
import SearchTabs from "../../components/searchs/search-tab.search";
import ArticleCard from "../../components/cards/article-card.card";
import ProfessionCard from "../../components/cards/profession-card.card";
import { useOrganizationsFullTextSearchQuery } from "../../app/features/organization.api";
import OrganizationSelectActionCard from "../../components/cards/organization-card.card";
import { DEFAULT_PAGE, PAGE_SIZE } from "../../constants/common.constant";
import OrganizationPagination from "../../components/pagination/organization-pagination";
import { useGetArticlesByPageNoAuthenQuery } from "../../app/features/article.api";
import { useGetProfessionsByPageQuery } from "../../app/features/professtion.api";
import RecruitmentPostSelectActionCard from "../../components/cards/recruitment-post.card";
import { useGetRecruitmentPostsByPageQuery } from "../../app/features/recruitment-post.api";

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
    const [page, setPage] = useState(DEFAULT_PAGE);

    const handleNavigate = (path: string) => {
        navigate(path);
    }

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

    const { data: organizationData } = useOrganizationsFullTextSearchQuery({ page: page, size: PAGE_SIZE, });
    const { data: articleData } = useGetArticlesByPageNoAuthenQuery({ page: page, size: PAGE_SIZE, });
    const { data: professtionData } = useGetProfessionsByPageQuery({ page: page, size: PAGE_SIZE, });
    const { data: recruitmentPostData } = useGetRecruitmentPostsByPageQuery({ page: page, size: PAGE_SIZE, });

    const totalOrganizationPages = organizationData ? Math.ceil(organizationData.Total / PAGE_SIZE) : 1;
    const totalArticlePages = articleData ? Math.ceil(articleData.Total / PAGE_SIZE) : 1;
    const totalProfessionPages = professtionData ? Math.ceil(professtionData.Total / PAGE_SIZE) : 1;
    const totalRecruitmentPostPages = recruitmentPostData ? Math.ceil(recruitmentPostData.Total / PAGE_SIZE) : 1;

    const organizationts = organizationData?.Items || [];
    const articles = articleData?.Items || [];
    const professtions = professtionData?.Items || [];
    const recruitmentPosts = recruitmentPostData?.Items || [];

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


                <Grid
                    container
                    direction="column"
                    alignItems="center"
                    sx={{
                        py: 3
                    }}
                >
                    <Box sx={{
                        width: "100%",
                        maxWidth: 1200,
                        color: "#ff5722",
                        fontSize: 28,
                        fontWeight: "bold",
                        mb: 2,
                        textAlign: "left",
                    }}
                    >
                        Tin tuyển sinh
                    </Box>
                    <Box
                        sx={{ width: '100%', maxWidth: 1200 }}>
                        <RecruitmentPostSelectActionCard recruitmentPosts={recruitmentPosts} />
                        <OrganizationPagination
                            page={page}
                            totalPages={totalRecruitmentPostPages}
                            onPrev={() => setPage((p) => p - 1)}
                            onNext={() => setPage((p) => p + 1)}
                        />
                    </Box>
                </Grid>

                <Grid
                    container
                    direction="column"
                    alignItems="center"
                    sx={{ py: 3 }}
                >
                    {/* Title */}
                    <Box
                        sx={{
                            width: "100%",
                            maxWidth: 1200,
                            color: "#ff5722",
                            fontSize: 28,
                            fontWeight: "bold",
                            mb: 2,
                            textAlign: "left",
                        }}
                    >
                        Tổ chức
                    </Box>

                    {/* Content */}
                    <Box
                        sx={{
                            width: "100%",
                            maxWidth: 1200,
                        }}
                    >
                        <OrganizationSelectActionCard organizations={organizationts} />
                        <OrganizationPagination
                            page={page}
                            totalPages={totalOrganizationPages}
                            onPrev={() => setPage((p) => p - 1)}
                            onNext={() => setPage((p) => p + 1)}
                        />
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
                        width: "100%",
                        maxWidth: 1200,
                        color: "#ff5722",
                        fontSize: 28,
                        fontWeight: "bold",
                        mb: 2,
                        textAlign: "left",
                    }}
                    >
                        Ngành nghề nổi bật
                    </Box>
                    <Box
                        onClick={() => handleNavigate('/chi-tiet-tuyen-sinh')}
                        sx={{ width: '100%', maxWidth: 1200 }}>
                        <ProfessionCard professions={professtions} />
                        <OrganizationPagination
                            page={page}
                            totalPages={totalProfessionPages}
                            onPrev={() => setPage((p) => p - 1)}
                            onNext={() => setPage((p) => p + 1)}
                        />
                    </Box>
                </Grid>

                <Grid container direction="column" alignItems="center" sx={{ py: 3 }}>
                    <Box
                        sx={{
                            width: "100%",
                            maxWidth: 1200,
                            color: "#ff5722",
                            fontSize: 28,
                            fontWeight: "bold",
                            mb: 2,
                            textAlign: "left",
                        }}
                    >
                        Bài viết
                    </Box>

                    <Box
                        sx={{
                            width: "100%",
                            maxWidth: 1200,
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                            gap: 3,
                        }}
                    >
                        {articles.map((article) => (
                            <ArticleCard key={article.Id} article={article} />
                        ))}
                    </Box>

                    <OrganizationPagination
                        page={page}
                        totalPages={totalArticlePages}
                        onPrev={() => setPage((p) => Math.max(1, p - 1))}
                        onNext={() => setPage((p) => Math.min(totalArticlePages, p + 1))}
                    />
                </Grid>
            </ThemeProvider>
        </>
    );
};

export default HomePage;