import { Search, ChevronLeft, ChevronRight, Category } from "@mui/icons-material";
import ArticleCard from "../../components/cards/article-card.card";
import { useRef, useState } from "react";
import { useGetArticlesByPageNoAuthenQuery } from "../../app/features/article.api";
import { useGetAllCategoryQuery } from "../../app/features/category.api";
import { DEFAULT_PAGE, PAGE_SIZE } from "../../constants/common.constant";
import OrganizationPagination from "../../components/pagination/organization-pagination";
import { Box, IconButton, InputAdornment, Stack, TextField, Typography, Container } from "@mui/material";

const ArticlePage = () => {
    const [page, setPage] = useState(DEFAULT_PAGE);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchValue, setSearchValue] = useState("");

    const categoryListRef = useRef<HTMLDivElement>(null);

    const { data: categories = [] } = useGetAllCategoryQuery();
    const { data: articleData } = useGetArticlesByPageNoAuthenQuery({
        page: page,
        size: PAGE_SIZE,
        searchValue,
    });

    const totalArticlePages = articleData ? Math.ceil(articleData.Total / PAGE_SIZE) : 1;
    const articles = articleData?.Items || [];

    const scrollCategory = (direction: "left" | "right") => {
        if (!categoryListRef.current) return;

        const scrollAmount = 300;
        categoryListRef.current.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth",
        });
    };

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
                        py: 2,
                        background: "linear-gradient(135deg, #e08d73 0%, #f85a29 50%)",
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

                {/* SEARCH + CATEGORY FILTER */}
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={2}
                    mb={3}
                    alignItems={{ xs: "stretch", md: "center" }}
                >
                    {/* SEARCH */}
                    <TextField
                        size="small"
                        placeholder="Tìm kiếm bài viết..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                setPage(1); // reset page
                                setSearchValue(searchQuery.trim());
                            }
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search
                                        sx={{ cursor: "pointer" }}
                                        onClick={() => {
                                            setPage(1);
                                            setSearchValue(searchQuery.trim());
                                        }}
                                    />
                                </InputAdornment>
                            ),
                        }}
                    />

                    {/* CATEGORY FILTER */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            flex: 1,
                            overflow: "hidden",
                        }}
                    >
                        {/* Arrow Left */}
                        <IconButton
                            onClick={() => scrollCategory("left")}
                            sx={{
                                border: "1px solid #ddd",
                                borderRadius: 10,
                                bgcolor: "white",
                            }}
                        >
                            <ChevronLeft />
                        </IconButton>

                        {/* Category list */}
                        <Box
                            ref={categoryListRef}
                            sx={{
                                display: "flex",
                                gap: 1,
                                overflowX: "auto",
                                scrollBehavior: "smooth",
                                "&::-webkit-scrollbar": {
                                    display: "none",
                                },
                                msOverflowStyle: "none",
                                scrollbarWidth: "none",
                                flex: 1,
                            }}
                        >
                            {/* Tất cả option */}
                            <Box
                                sx={{
                                    px: 2,
                                    py: 1,
                                    border: "1px solid #ddd",
                                    borderRadius: 20,
                                    cursor: "pointer",
                                    fontSize: 14,
                                    whiteSpace: "nowrap",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                    flexShrink: 0,
                                    bgcolor: selectedCategory === null ? "#ff5722" : "white",
                                    color: selectedCategory === null ? "white" : "inherit",
                                    borderColor: selectedCategory === null ? "#ff5722" : "#ddd",
                                    transition: "all 0.2s",
                                    "&:hover": {
                                        backgroundColor: "#ff5722",
                                        color: "white",
                                        borderColor: "#ff5722",
                                    },
                                }}
                                onClick={() => setSelectedCategory(null)}
                            >
                                Tất cả
                            </Box>

                            {/* Categories from API */}
                            {categories.map((category) => (
                                <Box
                                    key={category.Id}
                                    sx={{
                                        px: 2,
                                        py: 1,
                                        border: "1px solid #ddd",
                                        borderRadius: 20,
                                        cursor: "pointer",
                                        fontSize: 14,
                                        whiteSpace: "nowrap",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 0.5,
                                        flexShrink: 0,
                                        bgcolor: selectedCategory === category.Id ? "#ff5722" : "white",
                                        color: selectedCategory === category.Id ? "white" : "inherit",
                                        borderColor: selectedCategory === category.Id ? "#ff5722" : "#ddd",
                                        transition: "all 0.2s",
                                        "&:hover": {
                                            backgroundColor: "#ff5722",
                                            color: "white",
                                            borderColor: "#ff5722",
                                        },
                                    }}
                                    onClick={() => setSelectedCategory(category.Id)}
                                >
                                    {category.Name}
                                </Box>
                            ))}
                        </Box>

                        {/* Arrow Right */}
                        <IconButton
                            onClick={() => scrollCategory("right")}
                            sx={{
                                border: "1px solid #ddd",
                                borderRadius: 10,
                                bgcolor: "white",
                            }}
                        >
                            <ChevronRight />
                        </IconButton>
                    </Box>
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