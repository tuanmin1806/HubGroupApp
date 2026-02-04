import { Search } from "@mui/icons-material";
import { Box, Chip, Grid, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import ArticleCard from "../../components/cards/article-card.card";
import { useState } from "react";
import { useGetArticlesByPageNoAuthenQuery } from "../../app/features/article.api";
import { DEFAULT_PAGE, PAGE_SIZE } from "../../constants/common.constant";
import OrganizationPagination from "../../components/pagination/organization-pagination";

const ArticlePage = () => {
    const [page, setPage] = useState(DEFAULT_PAGE);
    const { data: articleData } = useGetArticlesByPageNoAuthenQuery({ page: page, size: PAGE_SIZE, });
    const totalArticlePages = articleData ? Math.ceil(articleData.Total / PAGE_SIZE) : 1;
    const articles = articleData?.Items || [];
    return (
        <Box
            sx={{
                px: { xs: 2, md: 4 },
                py: 4,
                maxWidth: 1200,
                mx: "auto",
            }}
        >
            {/* HEADER */}
            <Box mb={4}>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                    Bài viết & Tin tức
                </Typography>
                <Typography color="text.secondary">
                    Tổng hợp bài viết về tuyển sinh, ngành học và định hướng nghề nghiệp
                </Typography>
            </Box>

            {/* SEARCH + FILTER */}
            <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                mb={4}
                alignItems={{ sm: "center" }}
            >
                <TextField
                    fullWidth
                    placeholder="Tìm kiếm bài viết..."
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                />

                <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Chip label="Tất cả" color="primary" />
                    <Chip label="Tuyển sinh" />
                    <Chip label="Ngành học" />
                    <Chip label="Hướng nghiệp" />
                </Stack>
            </Stack>

            {/* ARTICLE LIST */}
            <Grid spacing={3}>
                    <Grid
                        size={{ xs: 12, sm: 6, md: 4 }}
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        {articles.map((article) => (
                            <ArticleCard key={article.Id} article={article} />
                        ))}
                    </Grid>
                <OrganizationPagination
                    page={page}
                    totalPages={totalArticlePages}
                    onPrev={() => setPage((p) => Math.max(1, p - 1))}
                    onNext={() => setPage((p) => Math.min(totalArticlePages, p + 1))}
                />
            </Grid>
        </Box>
    );
};

export default ArticlePage;