import Business from "@mui/icons-material/Business";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import { useNavigate } from "react-router-dom";
import { BACK_GROUND_BUTTON_COLOR } from "../../constants/common.constant";
import { getUserInfo } from "../../app/services/auth.service";
import LoadingOverlay from "../general/loading-overlay";
import { BookmarkResponse } from "../../app/models/book-mark.model";
import { useGetBookmarkByCustomerQuery } from "../../app/features/bookmark.api";
import { formatDate } from "../../utils/date.utils";

function BookMarkCard({ bookmark }: { bookmark: BookmarkResponse }) {
    const navigate = useNavigate();
    const article = bookmark.Article;

    const displayCategories = article?.Categories?.slice(0, 3) || [];
    const remainingCount = (article?.Categories?.length || 0) - displayCategories.length;

    return (
        <Paper
            elevation={0}
            onClick={() => navigate(`/bai-viet/${article?.SeoUrl}`)}
            sx={{ p: 2, borderRadius: 2, border: "1px solid #e5e7eb", cursor: "pointer", transition: "all 0.2s ease", "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.08)", transform: "translateY(-2px)", borderColor: "#d1d5db", }, }}
        >
            <Stack spacing={1.5}>
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <Box sx={{ width: { xs: 56, sm: 64 }, height: { xs: 56, sm: 64 }, borderRadius: 2, backgroundColor: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden", border: "1px solid #e5e7eb", }}>
                        {article?.AvatarFullUrl ? (
                            <Box component="img" src={article.AvatarFullUrl} alt={article.Title} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                            <Business sx={{ fontSize: 28, color: "#9ca3af" }} />
                        )}
                    </Box>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="subtitle1" fontWeight={700} sx={{ fontSize: { xs: "0.95rem", sm: "1.05rem" }, lineHeight: 1.4, color: "#111827", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", mb: 0.75, }}>
                            {article?.Title ?? "Bài viết"}
                        </Typography>

                        {article?.Summary && (
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: "0.8rem", sm: "0.85rem" }, lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", mb: 1, }}>
                                {article.Summary}
                            </Typography>
                        )}

                        <Stack direction="row" flexWrap="wrap" gap={0.75} alignItems="center">
                            {displayCategories.map((category) => (
                                <Chip key={category.Id} label={category.Name} size="small" onClick={(e) => { e.stopPropagation(); }} sx={{ height: 22, fontSize: "0.7rem", fontWeight: 600, bgcolor: "#f3f4f6", color: "#374151", border: "1px solid #e5e7eb", "&:hover": { bgcolor: "#e5e7eb" } }} />
                            ))}
                            {remainingCount > 0 && (
                                <Tooltip title={<Stack spacing={0.5}>
                                    {article?.Categories?.slice(3).map((cat) => (
                                        <Typography key={cat.Id} sx={{ fontSize: "0.75rem" }}>
                                            {cat.Name}
                                        </Typography>
                                    ))}
                                </Stack>}
                                    arrow
                                >
                                    <Chip label={`+${remainingCount}`} size="small" sx={{ height: 22, fontSize: "0.7rem", fontWeight: 700, bgcolor: "#dbeafe", color: "#1e40af", border: "1px solid #bfdbfe", cursor: "pointer" }} />
                                </Tooltip>
                            )}
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem", ml: displayCategories.length > 0 || remainingCount > 0 ? 0.5 : 0 }}>
                                • Ngày {formatDate(bookmark.CreatedAt)}
                            </Typography>
                        </Stack>
                    </Box>
                </Stack>

                <Stack direction="row" alignItems="center" justifyContent="flex-end" gap={1}>
                    <Button variant="contained" size="small" onClick={(e) => { e.stopPropagation(); window.open(`/bai-viet/${article?.SeoUrl}`, "_blank"); }} sx={{ backgroundColor: BACK_GROUND_BUTTON_COLOR, borderRadius: 1.5, fontSize: "0.75rem", px: 2, height: 32, textTransform: "none", fontWeight: 600, "&:hover": { backgroundColor: "#e05520" } }}>
                        Xem chi tiết
                    </Button>
                </Stack>
            </Stack>
        </Paper>
    );
}

export default function BookMarkPanel() {
    const navigate = useNavigate();
    const userInfo = getUserInfo();
    const { data, isLoading, isError } = useGetBookmarkByCustomerQuery({ customerId: userInfo?.Id ?? "" });

    return (
        <LoadingOverlay
            open={isLoading}
            error={isError}
            empty={!data?.Items?.length}
            emptyVariant="post"
            emptyTitle="Chưa có bài viết nào được lưu"
            emptyDescription="Hãy khám phá các bài viết và lưu lại những nội dung yêu thích!"
            emptyAction={
                <Button variant="contained" disableElevation onClick={() => navigate("/bai-viet")} sx={{ bgcolor: BACK_GROUND_BUTTON_COLOR, borderRadius: 2, textTransform: "none", fontWeight: 600, px: 3, py: 1, "&:hover": { bgcolor: "#e05520" } }}>
                    Khám phá bài viết
                </Button>
            }
        >
            <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                    <Box>
                        <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5, fontSize: { xs: "1.1rem", sm: "1.25rem" }, color: "#111827" }}>
                            Bài viết đã lưu
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: "0.85rem" }}
                        >
                            {data?.Items?.length ?? 0} bài viết
                        </Typography>
                    </Box>
                </Stack>

                <Stack spacing={1.5}>
                    {data?.Items?.map((bookmark: BookmarkResponse) => (
                        <BookMarkCard key={bookmark.Id} bookmark={bookmark} />
                    ))}
                </Stack>
            </Box>
        </LoadingOverlay>
    );
}