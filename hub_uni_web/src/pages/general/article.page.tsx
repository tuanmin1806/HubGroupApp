import { Search } from "@mui/icons-material";
import ArticleCard from "../../components/cards/article-card.card";
import { useState } from "react";
import { useGetArticlesByPageNoAuthenQuery } from "../../app/features/article.api";
import { DEFAULT_PAGE, PAGE_SIZE } from "../../constants/common.constant";
import OrganizationPagination from "../../components/pagination/organization-pagination";
import { Box, Chip, InputAdornment, Stack, TextField, Typography, Container } from "@mui/material";

const ArticlePage = () => {
    const [page, setPage] = useState(DEFAULT_PAGE);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Tất cả");

    const { data: articleData } = useGetArticlesByPageNoAuthenQuery({
        page: page,
        size: PAGE_SIZE,
    });

    const totalArticlePages = articleData ? Math.ceil(articleData.Total / PAGE_SIZE) : 1;
    const articles = articleData?.Items || [];

    const categories = ["Tất cả", "Tuyển sinh", "Ngành học", "Hướng nghiệp"];

    return (
        <Box
            sx={{
                backgroundColor: "#f8f9fa",
                minHeight: "100vh",
                py: 3,
            }}
        >
            <Container maxWidth="lg">
                {/* HEADER */}
                <Box
                    mb={4}
                    sx={{
                        textAlign: "center",
                        py: 3,
                        background: "linear-gradient(135deg, #ff5722 0%, #ff5722 100%)",
                        borderRadius: 2,
                        color: "white",
                    }}
                >
                    <Typography
                        variant="h4"
                        fontWeight={700}
                        gutterBottom
                        sx={{ fontSize: { xs: "1.75rem", md: "2rem" } }}
                    >
                        Bài viết & Tin tức
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            opacity: 0.95,
                            fontSize: { xs: "0.9rem", md: "1rem" }
                        }}
                    >
                        Tổng hợp bài viết về tuyển sinh, ngành học và định hướng nghề nghiệp
                    </Typography>
                </Box>

                {/* SEARCH + FILTER */}
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={2}
                    mb={3}
                    alignItems={{ md: "center" }}
                    justifyContent="space-between"
                >
                    <TextField
                        size="small"
                        sx={{
                            flex: 1,
                            maxWidth: { md: 450 },
                            backgroundColor: "white",
                            borderRadius: 2,
                            "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                            }
                        }}
                        placeholder="Tìm kiếm bài viết..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search sx={{ fontSize: 20 }} />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                        {categories.map((category) => (
                            <Chip
                                key={category}
                                label={category}
                                size="small"
                                color={selectedCategory === category ? "primary" : "default"}
                                onClick={() => setSelectedCategory(category)}
                                sx={{
                                    fontWeight: selectedCategory === category ? 600 : 500,
                                    fontSize: "0.8rem",
                                    height: 28,
                                    transition: "all 0.2s ease",
                                    "&:hover": {
                                        transform: "translateY(-1px)",
                                        boxShadow: 1,
                                    }
                                }}
                            />
                        ))}
                    </Stack>
                </Stack>

                {/* ARTICLE COUNT */}
                <Box mb={2.5}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.875rem" }}>
                        Tìm thấy <strong>{articleData?.Total || 0}</strong> bài viết
                    </Typography>
                </Box>

                {/* ARTICLE LIST */}
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "repeat(2, 1fr)",
                            md: "repeat(3, 1fr)",
                        },
                        gap: 2.5,
                        mb: 4,
                    }}
                >
                    {articles.map((article) => (
                        <ArticleCard key={article.Id} article={article} />
                    ))}
                </Box>

                {/* EMPTY STATE */}
                {articles.length === 0 && (
                    <Box
                        sx={{
                            textAlign: "center",
                            py: 8,
                            backgroundColor: "white",
                            borderRadius: 2,
                            border: "1px solid",
                            borderColor: "divider",
                        }}
                    >
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            Không tìm thấy bài viết
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc danh mục
                        </Typography>
                    </Box>
                )}

                {/* PAGINATION */}
                {articles.length > 0 && (
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                        <OrganizationPagination
                            page={page}
                            totalPages={totalArticlePages}
                            onPrev={() => setPage((p) => Math.max(1, p - 1))}
                            onNext={() => setPage((p) => Math.min(totalArticlePages, p + 1))}
                        />
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export default ArticlePage;