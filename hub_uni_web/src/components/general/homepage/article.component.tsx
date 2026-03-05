import { ArrowForward } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import ArticleCard from "../../cards/article-card.card";
import { useGetArticlesByPageNoAuthenQuery } from "../../../app/features/article.api";
import { DEFAULT_PAGE, PAGE_SIZE } from "../../../constants/common.constant";
import { useNavigate } from "react-router-dom";
import { useState } from "react";


const sectionWrapperSx = {
    width: "100%",
    maxWidth: 1200,
    mx: "auto",
    bgcolor: "#fff",
    borderRadius: 2,
    border: "1px solid #eee",
    boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
    p: { xs: 2, md: 2 },
};

const ArticleComponent = () => {

    const navigate = useNavigate();
    const [page, setPage] = useState(DEFAULT_PAGE);
    const { data: articleData } = useGetArticlesByPageNoAuthenQuery({ page: page, size: PAGE_SIZE, });
    const articles = articleData?.Items || [];
    return (
        <Box sx={sectionWrapperSx}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                }}
            >
                <Box sx={{ color: "#ff5722", fontSize: 18, fontWeight: 700, textTransform: "uppercase" }}>
                    Bài viết
                </Box>

                <Button
                    sx={{
                        borderColor: "#ff5722",
                        color: "#ff5722",
                        "&:hover": {
                            bgcolor: "#ff5722",
                            color: "#fff",
                        },
                    }}
                    variant="outlined"
                    endIcon={<ArrowForward />}
                    onClick={() => navigate("/danh-sach-bai-viet")}
                >
                    Xem tất cả
                </Button>
            </Box>

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
        </Box>
    );
}

export default ArticleComponent;