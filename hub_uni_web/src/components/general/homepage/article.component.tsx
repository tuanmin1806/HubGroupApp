import { lazy } from "react";
import ArrowForward from "@mui/icons-material/ArrowForward";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
const ArticleCard = lazy(() => import("../../cards/article-card.card"));
import { useGetArticlesByPageNoAuthenQuery } from "../../../app/features/article.api";
import { DEFAULT_PAGE, PAGE_SIZE } from "../../../constants/common.constant";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import LoadingOverlay from "../loading-overlay";
import { styled } from "@mui/system";
import { Article } from "@mui/icons-material";
import { Typography } from "@mui/material";

const sectionWrapperSx = {
    width: "100%",
    maxWidth: 1200,
    mx: "auto",
    bgcolor: "#fff",
    borderRadius: 2,
    border: "1px solid #eee",
    boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
    p: { xs: 1, sm: 1.5, md: 2 },
};

const Badge = styled(Box)({
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    background: "linear-gradient(135deg, #faa11b, #f5b95e)",
    padding: "6px 16px",
    borderRadius: "40px",
    boxShadow: "0 4px 15px rgba(250, 161, 27, 0.2)",
});

const ArticleComponent = () => {

    const navigate = useNavigate();
    const [page, setPage] = useState(DEFAULT_PAGE);
    const { data: articleData, isLoading, isError } = useGetArticlesByPageNoAuthenQuery({ page: page, size: PAGE_SIZE, });
    const articles = articleData?.Items || [];
    return (

        <Box sx={sectionWrapperSx}>

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexWrap: "wrap", gap: { xs: 1.5, sm: 2 } }}>
                <Badge sx={{ padding: { xs: "5px 12px", sm: "6px 16px" }, gap: { xs: "6px", sm: "8px" } }}>
                    <Article sx={{ fontSize: { xs: 18, sm: 20 }, color: "#ffffff" }} />
                    <Typography
                        sx={{
                            fontSize: { xs: "0.7rem", sm: "0.75rem" },
                            fontWeight: 700,
                            color: "#ffffff",
                            letterSpacing: { xs: 0.5, sm: 1 },
                            textTransform: "uppercase",
                            lineHeight: 1.3,
                        }}
                    >
                        Bài viết
                    </Typography>
                </Badge>
                <Button
                    variant="outlined"
                    endIcon={<ArrowForward />}
                    onClick={() => navigate("/bai-viet")}
                    size="small"
                    sx={{
                        borderColor: "#ff5722",
                        color: "#ff5722",
                        fontSize: { xs: "0.7rem", sm: "0.75rem" },
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                        "&:hover": {
                            bgcolor: "#ff5722",
                            color: "#fff",
                            borderColor: "#ff5722"
                        },
                    }}
                >
                    Xem tất cả
                </Button>
            </Box>
            <LoadingOverlay open={isLoading} error={isError} empty={articles.length === 0}>
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                        gap: 3,
                    }}
                >
                    {articles.map((article) => (
                        <ArticleCard key={article.Id} article={article} />
                    ))}
                </Box>
            </LoadingOverlay>
        </Box>
    );
}

export default ArticleComponent;