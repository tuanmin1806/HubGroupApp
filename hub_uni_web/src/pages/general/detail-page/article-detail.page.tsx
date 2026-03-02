import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Container,
    Typography,
    Chip,
    Stack,
    Avatar,
    Divider,
    Paper,
    Breadcrumbs,
    Link,
    Skeleton,
    Grid,
} from "@mui/material";
import {
    CalendarToday,
    ArrowBack,
    Share,
    Bookmark,
    NavigateNext,
} from "@mui/icons-material";
import { useGetArticleBySeoQuery } from "../../../app/features/article.api";

const ArticleDetailPage = () => {
    const { seo } = useParams<{ seo: string }>();
    const navigate = useNavigate();
    const { data, isLoading, isError } = useGetArticleBySeoQuery(seo || "");

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const formatDateLong = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    if (isLoading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Skeleton variant="text" width="60%" height={60} />
                <Skeleton variant="rectangular" height={400} sx={{ my: 3, borderRadius: 2 }} />
                <Skeleton variant="text" width="100%" />
                <Skeleton variant="text" width="100%" />
                <Skeleton variant="text" width="80%" />
            </Container>
        );
    }

    if (isError || !data?.MainArticle) {
        return (
            <Container maxWidth="lg" sx={{ py: 8, textAlign: "center" }}>
                <Typography variant="h4" color="error" gutterBottom>
                    Không tìm thấy bài viết
                </Typography>
                <Typography color="text.secondary" mb={3}>
                    Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
                </Typography>
                <Chip
                    icon={<ArrowBack />}
                    label="Quay lại danh sách bài viết"
                    onClick={() => navigate("/bai-viet")}
                    color="primary"
                    sx={{ cursor: "pointer" }}
                />
            </Container>
        );
    }

    const { MainArticle, NewestArticles, SameCategoryArticles } = data;

    return (
        <Box sx={{ backgroundColor: "#f8f9fa", minHeight: "100vh", py: 3 }}>
            <Container maxWidth="lg">
                {/* Breadcrumbs */}
                <Breadcrumbs
                    separator={<NavigateNext fontSize="small" />}
                    sx={{ mb: 3, fontSize: "0.875rem" }}
                >
                    <Link
                        underline="hover"
                        color="inherit"
                        onClick={() => navigate("/")}
                        sx={{ cursor: "pointer", fontSize: "0.875rem" }}
                    >
                        Trang chủ
                    </Link>
                    <Link
                        underline="hover"
                        color="inherit"
                        onClick={() => navigate("/bai-viet")}
                        sx={{ cursor: "pointer", fontSize: "0.875rem" }}
                    >
                        Bài viết
                    </Link>
                    <Typography color="text.primary" noWrap sx={{ maxWidth: 200, fontSize: "0.875rem" }}>
                        {MainArticle.Title}
                    </Typography>
                </Breadcrumbs>

                <Grid container spacing={1}>
                    {/* Main Content */}
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                borderRadius: 2,
                                overflow: "hidden",
                                backgroundColor: "white",
                                border: "1px solid",
                                borderColor: "divider",
                            }}
                        >
                            {/* Header Image */}
                            <Box
                                sx={{
                                    height: { xs: 250, md: 350 },
                                    backgroundColor: "#f5f5f5",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    overflow: "hidden",
                                }}
                            >
                                <Box
                                    component="img"
                                    src={MainArticle.AvatarFullUrl}
                                    alt={MainArticle.Title}
                                    sx={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "contain",
                                    }}
                                />
                            </Box>

                            {/* Article Content */}
                            <Box sx={{ p: { xs: 2.5, md: 4 } }}>
                                {/* Category */}
                                {MainArticle.Categories?.[0] && (
                                    <Chip
                                        label={MainArticle.Categories[0].Name}
                                        color="primary"
                                        size="small"
                                        sx={{ mb: 2, fontWeight: 600, height: 24, fontSize: "0.75rem" }}
                                    />
                                )}

                                {/* Title */}
                                <Typography
                                    variant="h4"
                                    fontWeight={700}
                                    gutterBottom
                                    sx={{
                                        fontSize: { xs: "1.5rem", md: "2rem" },
                                        lineHeight: 1.3,
                                        mb: 2,
                                    }}
                                >
                                    {MainArticle.Title}
                                </Typography>

                                {/* Meta Info */}
                                <Stack
                                    direction="row"
                                    spacing={2}
                                    alignItems="center"
                                    flexWrap="wrap"
                                    sx={{ mb: 3, pb: 2, borderBottom: "1px solid #e0e0e0" }}
                                >
                                    {/* Author */}
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Avatar sx={{ width: 28, height: 28, bgcolor: "primary.main", fontSize: "0.875rem" }}>
                                            {MainArticle.CreatedBy.charAt(0).toUpperCase()}
                                        </Avatar>
                                        <Typography variant="body2" fontWeight={500}>
                                            {MainArticle.CreatedBy}
                                        </Typography>
                                    </Stack>

                                    {/* Divider */}
                                    <Box sx={{ width: 4, height: 4, borderRadius: "50%", bgcolor: "text.secondary" }} />

                                    {/* Date */}
                                    <Stack direction="row" spacing={0.5} alignItems="center">
                                        <CalendarToday sx={{ fontSize: 16, color: "text.secondary" }} />
                                        <Typography variant="body2" color="text.secondary">
                                            {formatDateLong(MainArticle.CreatedAt)}
                                        </Typography>
                                    </Stack>

                                    {/* Action Buttons */}
                                    <Stack direction="row" spacing={1} sx={{ ml: "auto" }}>
                                        <Chip
                                            icon={<Share sx={{ fontSize: 16 }} />}
                                            label="Chia sẻ"
                                            size="small"
                                            variant="outlined"
                                            onClick={() => {
                                                if (navigator.share) {
                                                    navigator.share({
                                                        title: MainArticle.Title,
                                                        text: MainArticle.Summary,
                                                        url: window.location.href,
                                                    });
                                                }
                                            }}
                                            sx={{
                                                cursor: "pointer",
                                                height: 28,
                                                fontSize: "0.75rem",
                                            }}
                                        />
                                        <Chip
                                            icon={<Bookmark sx={{ fontSize: 16 }} />}
                                            label="Lưu"
                                            size="small"
                                            variant="outlined"
                                            sx={{ height: 28, fontSize: "0.75rem" }}
                                        />
                                    </Stack>
                                </Stack>

                                {/* Summary */}
                                <Box
                                    sx={{
                                        mb: 3,
                                        p: 2,
                                        backgroundColor: "#f8f9fa",
                                        borderLeft: "3px solid",
                                        borderColor: "primary.main",
                                        borderRadius: 1,
                                    }}
                                >
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            fontStyle: "italic",
                                            color: "text.secondary",
                                            fontSize: "0.95rem",
                                            lineHeight: 1.6,
                                        }}
                                    >
                                        {MainArticle.Summary}
                                    </Typography>
                                </Box>

                                {/* Main Content HTML */}
                                <Box
                                    sx={{
                                        "& p": {
                                            fontSize: "1rem",
                                            lineHeight: 1.8,
                                            mb: 1.5,
                                            color: "text.primary",
                                        },
                                        "& h1, & h2, & h3, & h4, & h5, & h6": {
                                            fontWeight: 700,
                                            mt: 3,
                                            mb: 1.5,
                                            lineHeight: 1.4,
                                        },
                                        "& h1": { fontSize: "1.75rem" },
                                        "& h2": { fontSize: "1.5rem" },
                                        "& h3": { fontSize: "1.25rem" },
                                        "& ul, & ol": {
                                            pl: 3,
                                            mb: 2,
                                        },
                                        "& li": {
                                            fontSize: "1rem",
                                            lineHeight: 1.8,
                                            mb: 0.5,
                                        },
                                        "& img": {
                                            maxWidth: "100%",
                                            height: "auto",
                                            borderRadius: 1,
                                            my: 2,
                                        },
                                        "& a": {
                                            color: "primary.main",
                                            textDecoration: "none",
                                            "&:hover": {
                                                textDecoration: "underline",
                                            },
                                        },
                                    }}
                                    dangerouslySetInnerHTML={{ __html: MainArticle.Content }}
                                />

                                {/* Keywords */}
                                {MainArticle.Keywords && (
                                    <Box sx={{ mt: 4, pt: 3, borderTop: "1px solid #e0e0e0" }}>
                                        <Typography variant="body2" fontWeight={600} color="text.secondary" gutterBottom>
                                            Từ khóa:
                                        </Typography>
                                        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                                            {MainArticle.Keywords.split(",").map((keyword, index) => (
                                                <Chip
                                                    key={index}
                                                    label={keyword.trim()}
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{ height: 24, fontSize: "0.75rem" }}
                                                />
                                            ))}
                                        </Stack>
                                    </Box>
                                )}

                                {/* Back Button */}
                                <Box sx={{ mt: 4 }}>
                                    <Chip
                                        icon={<ArrowBack sx={{ fontSize: 16 }} />}
                                        label="Quay lại danh sách"
                                        onClick={() => navigate("/bai-viet")}
                                        sx={{
                                            cursor: "pointer",
                                            height: 32,
                                            fontSize: "0.875rem",
                                        }}
                                    />
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Sidebar */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Stack spacing={1}>
                            {/* Newest Articles */}
                            {NewestArticles && NewestArticles.length > 0 && (
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 2.5,
                                        borderRadius: 2,
                                        border: "1px solid",
                                        borderColor: "divider",
                                    }}
                                >
                                    <Typography variant="h6" fontWeight={700} gutterBottom sx={{ fontSize: "1.1rem" }}>
                                        Bài viết mới nhất
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    <Stack spacing={2}>
                                        {NewestArticles.slice(0, 5).map((article) => (
                                            <Box
                                                key={article.Id}
                                                onClick={() => {
                                                    navigate(`/bai-viet/${article.Seo}`);
                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                }}
                                                sx={{
                                                    cursor: "pointer",
                                                    transition: "all 0.2s ease",
                                                    "&:hover": {
                                                        "& .article-title": {
                                                            color: "primary.main",
                                                        },
                                                        "& img": {
                                                            transform: "scale(1.05)",
                                                        },
                                                    },
                                                }}
                                            >
                                                <Stack direction="row" spacing={1.5}>
                                                    <Box
                                                        sx={{
                                                            width: 70,
                                                            height: 70,
                                                            borderRadius: 1.5,
                                                            overflow: "hidden",
                                                            flexShrink: 0,
                                                            backgroundColor: "#f5f5f5",
                                                        }}
                                                    >
                                                        <Box
                                                            component="img"
                                                            src={article.AvatarFullUrl}
                                                            alt={article.Title}
                                                            sx={{
                                                                width: "100%",
                                                                height: "100%",
                                                                objectFit: "cover",
                                                                transition: "transform 0.3s",
                                                            }}
                                                        />
                                                    </Box>
                                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                                        <Typography
                                                            className="article-title"
                                                            variant="body2"
                                                            fontWeight={600}
                                                            sx={{
                                                                display: "-webkit-box",
                                                                WebkitLineClamp: 2,
                                                                WebkitBoxOrient: "vertical",
                                                                overflow: "hidden",
                                                                mb: 0.5,
                                                                fontSize: "0.875rem",
                                                                lineHeight: 1.4,
                                                                transition: "color 0.2s ease",
                                                            }}
                                                        >
                                                            {article.Title}
                                                        </Typography>
                                                        <Stack direction="row" spacing={0.5} alignItems="center">
                                                            <CalendarToday sx={{ fontSize: 12, color: "text.secondary" }} />
                                                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem" }}>
                                                                {formatDate(article.CreatedAt)}
                                                            </Typography>
                                                        </Stack>
                                                    </Box>
                                                </Stack>
                                            </Box>
                                        ))}
                                    </Stack>
                                </Paper>
                            )}

                            {/* Same Category Articles */}
                            {SameCategoryArticles && SameCategoryArticles.length > 0 && (
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 2.5,
                                        borderRadius: 2,
                                        border: "1px solid",
                                        borderColor: "divider",
                                    }}
                                >
                                    <Typography variant="h6" fontWeight={700} gutterBottom sx={{ fontSize: "1.1rem" }}>
                                        Bài viết cùng danh mục
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    <Stack spacing={2}>
                                        {SameCategoryArticles.slice(0, 5).map((article) => (
                                            <Box
                                                key={article.Id}
                                                onClick={() => {
                                                    navigate(`/bai-viet/${article.Seo}`);
                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                }}
                                                sx={{
                                                    cursor: "pointer",
                                                    transition: "all 0.2s ease",
                                                    "&:hover": {
                                                        "& .article-title": {
                                                            color: "primary.main",
                                                        },
                                                        "& img": {
                                                            transform: "scale(1.05)",
                                                        },
                                                    },
                                                }}
                                            >
                                                <Stack direction="row" spacing={1.5}>
                                                    <Box
                                                        sx={{
                                                            width: 70,
                                                            height: 70,
                                                            borderRadius: 1.5,
                                                            overflow: "hidden",
                                                            flexShrink: 0,
                                                            backgroundColor: "#f5f5f5",
                                                        }}
                                                    >
                                                        <Box
                                                            component="img"
                                                            src={article.AvatarFullUrl}
                                                            alt={article.Title}
                                                            sx={{
                                                                width: "100%",
                                                                height: "100%",
                                                                objectFit: "cover",
                                                                transition: "transform 0.3s",
                                                            }}
                                                        />
                                                    </Box>
                                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                                        <Typography
                                                            className="article-title"
                                                            variant="body2"
                                                            fontWeight={600}
                                                            sx={{
                                                                display: "-webkit-box",
                                                                WebkitLineClamp: 2,
                                                                WebkitBoxOrient: "vertical",
                                                                overflow: "hidden",
                                                                mb: 0.5,
                                                                fontSize: "0.875rem",
                                                                lineHeight: 1.4,
                                                                transition: "color 0.2s ease",
                                                            }}
                                                        >
                                                            {article.Title}
                                                        </Typography>
                                                        <Stack direction="row" spacing={0.5} alignItems="center">
                                                            <CalendarToday sx={{ fontSize: 12, color: "text.secondary" }} />
                                                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem" }}>
                                                                {formatDate(article.CreatedAt)}
                                                            </Typography>
                                                        </Stack>
                                                    </Box>
                                                </Stack>
                                            </Box>
                                        ))}
                                    </Stack>
                                </Paper>
                            )}
                        </Stack>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default ArticleDetailPage;