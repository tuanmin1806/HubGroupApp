import { lazy } from "react";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import { useEffect, useRef, useState } from "react";
import { useGetArticlesByPageNoAuthenQuery } from "../../app/features/article.api";
import { useGetAllCategoryQuery } from "../../app/features/category.api";
import { DEFAULT_PAGE, PAGE_SIZE } from "../../constants/common.constant";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
const ArticleCard = lazy(() => import("../../components/cards/article-card.card"));
const OrganizationPagination = lazy(() => import("../../components/pagination/organization-pagination"));

const ArticlePage = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(DEFAULT_PAGE);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchValue, setSearchValue] = useState("");

    const categoryListRef = useRef<HTMLDivElement>(null);

    const { data: categories = [] } = useGetAllCategoryQuery();
    const { data: articleData } = useGetArticlesByPageNoAuthenQuery({ page: page, size: PAGE_SIZE, searchValue, });

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

    useEffect(() => {
        document.title = "Cẩm nang du học Hàn Quốc | duhochan.hubgroup.vn";
    }, [navigate]);

    return (
        <Box sx={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>

            <Grid
                container
                direction="column"
                alignItems="center"
                sx={{
                    background: `linear-gradient(180deg, rgba(247, 148, 0, 0.95) 0%, rgba(252, 167, 40, 0.85) 40%, rgb(255, 183, 116) 100%)`,
                    py: { xs: 3, md: 5 },
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <Box sx={{ position: "absolute", top: "-100%", left: "-25%", width: "55%", height: "350%", background: "rgba(255, 0, 0, 0.06)", transform: "rotate(-45deg)", pointerEvents: "none" }} />
                <Box sx={{ position: "absolute", top: "-100%", left: "-10%", width: "30%", height: "350%", background: "rgba(245, 120, 120, 0.1)", transform: "rotate(-45deg)", pointerEvents: "none" }} />
                <Box sx={{ position: "absolute", top: "-100%", left: "5%", width: "15%", height: "350%", background: "rgba(255,255,255,0.13)", transform: "rotate(-45deg)", pointerEvents: "none" }} />

                <Box sx={{ position: "absolute", top: "-100%", right: "-25%", width: "55%", height: "350%", background: "rgba(243,69,69,0.06)", transform: "rotate(-45deg)", pointerEvents: "none" }} />
                <Box sx={{ position: "absolute", top: "-100%", right: "-10%", width: "30%", height: "350%", background: "rgba(2245, 120, 120, 0.1)", transform: "rotate(-45deg)", pointerEvents: "none" }} />
                <Box sx={{ position: "absolute", top: "-100%", right: "5%", width: "15%", height: "350%", background: "rgba(255,255,255,0.13)", transform: "rotate(-45deg)", pointerEvents: "none" }} />

                <Box sx={{ position: "relative", zIndex: 1, textAlign: "center", px: 2 }}>
                    <Typography
                        variant="h4"
                        fontWeight={700}
                        gutterBottom
                        sx={{
                            color: "white",
                            fontSize: { xs: "1.5rem", md: "2rem" },
                            textShadow: "0 1px 4px rgba(0,0,0,0.15)",
                        }}
                    >
                        Bài viết & Tin tức
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            color: "white",
                            opacity: 0.95,
                            fontSize: { xs: "0.875rem", md: "1rem" },
                            maxWidth: 600,
                            mx: "auto",
                        }}
                    >
                        Tổng hợp bài viết về tuyển sinh, ngành học và định hướng nghề nghiệp
                    </Typography>
                </Box>
            </Grid>

            <Container maxWidth="lg" sx={{ py: 3 }}>

                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={2}
                    mb={3}
                    alignItems={{ xs: "stretch", md: "center" }}
                >
                    <TextField
                        size="small"
                        placeholder="Tìm kiếm bài viết..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                setPage(1);
                                setSearchValue(searchQuery.trim());
                            }
                        }}
                    />

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1, overflow: "hidden" }}>
                        <IconButton
                            onClick={() => scrollCategory("left")}
                            sx={{ border: "1px solid #ddd", borderRadius: 10, bgcolor: "white" }}
                        >
                            <ChevronLeft />
                        </IconButton>

                        <Box
                            ref={categoryListRef}
                            sx={{
                                display: "flex",
                                gap: 1,
                                overflowX: "auto",
                                scrollBehavior: "smooth",
                                "&::-webkit-scrollbar": { display: "none" },
                                msOverflowStyle: "none",
                                scrollbarWidth: "none",
                                flex: 1,
                            }}
                        >
                            <Box
                                onClick={() => setSelectedCategory(null)}
                                sx={{
                                    px: 2, py: 1,
                                    border: "1px solid",
                                    borderRadius: 20,
                                    cursor: "pointer",
                                    fontSize: 14,
                                    whiteSpace: "nowrap",
                                    display: "flex",
                                    alignItems: "center",
                                    flexShrink: 0,
                                    bgcolor: selectedCategory === null ? "#faa11b" : "white",
                                    color: selectedCategory === null ? "white" : "inherit",
                                    borderColor: selectedCategory === null ? "#faa11b" : "#ddd",
                                    transition: "all 0.2s",
                                    "&:hover": { bgcolor: "#faa11b", color: "white", borderColor: "#faa11b" },
                                }}
                            >
                                Tất cả
                            </Box>

                            {categories.map((category) => (
                                <Box
                                    key={category.Id}
                                    onClick={() => setSelectedCategory(category.Id)}
                                    sx={{
                                        px: 2, py: 1,
                                        border: "1px solid",
                                        borderRadius: 20,
                                        cursor: "pointer",
                                        fontSize: 14,
                                        whiteSpace: "nowrap",
                                        display: "flex",
                                        alignItems: "center",
                                        flexShrink: 0,
                                        bgcolor: selectedCategory === category.Id ? "#faa11b" : "white",
                                        color: selectedCategory === category.Id ? "white" : "inherit",
                                        borderColor: selectedCategory === category.Id ? "#faa11b" : "#ddd",
                                        transition: "all 0.2s",
                                        "&:hover": { bgcolor: "#faa11b", color: "white", borderColor: "#faa11b" },
                                    }}
                                >
                                    {category.Name}
                                </Box>
                            ))}
                        </Box>

                        <IconButton
                            onClick={() => scrollCategory("right")}
                            sx={{ border: "1px solid #ddd", borderRadius: 10, bgcolor: "white" }}
                        >
                            <ChevronRight />
                        </IconButton>
                    </Box>
                </Stack>

                <Box mb={2.5}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.875rem" }}>
                        Tìm thấy <strong>{articleData?.Total || 0}</strong> bài viết
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
                        gap: 1,
                        mb: 4,
                    }}
                >
                    {articles.map((article) => (
                        <ArticleCard key={article.Id} article={article} />
                    ))}
                </Box>

                {articles.length === 0 && (
                    <Box sx={{ textAlign: "center", py: 8, backgroundColor: "white", borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
                        <Typography variant="h6" color="text.secondary" gutterBottom>Không tìm thấy bài viết</Typography>
                        <Typography variant="body2" color="text.secondary">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc danh mục</Typography>
                    </Box>
                )}

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