import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CalendarToday from "@mui/icons-material/CalendarToday";
import ShareOutlined from "@mui/icons-material/ShareOutlined";
import BookmarkBorderOutlined from "@mui/icons-material/BookmarkBorderOutlined";

import { ArticleResponse } from "../../app/models/article.model";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utils/date.utils";

interface Props {
  article: ArticleResponse;
}

export default function ArticleCard({ article }: Props) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/bai-viet/${article.SeoUrl}`);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (navigator.share) {
      navigator.share({
        title: article.Title,
        text: article.Summary,
        url: `${window.location.origin}/bai-viet/${article.SeoUrl}`,
      });
    }
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Save article", article.Id);
  };

  const categories = article.Categories ?? [];
  const visibleCats = categories.slice(0, 2);
  const remainingCount = categories.length - visibleCats.length;

  return (
    <Card onClick={handleClick}
      sx={{
        height: "100%", display: "flex", flexDirection: "column", borderRadius: 2, overflow: "hidden",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", cursor: "pointer",
        border: "1px solid", borderColor: "divider", boxShadow: "none",
        "&:hover": { transform: "translateY(-4px)", boxShadow: "0 8px 16px rgba(0,0,0,0.1)", borderColor: "primary.main", "& .card-image": { transform: "scale(1.05)", }, },
      }}
    >
      {/* Image */}
      <Box sx={{ overflow: "hidden", height: 180, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#f5f5f5", }}>
        <CardMedia component="img" image={article.AvatarFullUrl || "/placeholder-image.jpg"} alt={article.Title} className="card-image" loading="lazy" sx={{ width: "100%", height: "100%", objectFit: "contain", transition: "transform 0.3s ease", }} />
      </Box>

      {/* Content */}
      <CardContent sx={{ flexGrow: 1, p: 2, display: "flex", flexDirection: "column", gap: 1, "&:last-child": { pb: 2 }, }}>
        {/* Title */}
        <Typography variant="subtitle1" fontWeight={700} sx={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", fontSize: "0.95rem", lineHeight: 1.4, minHeight: "2.8em", color: "text.primary", }}> {article.Title}
        </Typography>

        {/* Summary */}
        <Typography variant="body2" color="text.secondary" sx={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", fontSize: "0.82rem", lineHeight: 1.55, flex: 1, }}> {article.Summary}
        </Typography>

        {/* Footer */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={0.75} sx={{ pt: 1.25, mt: "auto", borderTop: "1px solid", borderColor: "divider", }}>
          {/* Left */}
          <Stack direction="row" alignItems="center" spacing={0.75} sx={{ flex: 1, minWidth: 0, }}>
            {/* Categories */}
            <Stack direction="row" flexWrap="wrap" gap={0.5}>
              {categories.length === 0 ? null : (
                <>
                  {visibleCats.map((cat) => (
                    <Chip key={cat.Id ?? cat.Name} label={cat.Name} size="small" sx={{ height: 20, fontSize: "0.65rem", fontWeight: 600, bgcolor: "rgba(236,59,5,0.08)", color: "primary.main", border: "1px solid", borderColor: "rgba(236,59,5,0.2)", "& .MuiChip-label": { px: 0.75 }, }} />
                  ))}

                  {remainingCount > 0 && (
                    <Chip label={`+${remainingCount}`} size="small" sx={{ height: 20, fontSize: "0.65rem", fontWeight: 600, bgcolor: "grey.100", color: "text.secondary", "& .MuiChip-label": { px: 0.75 }, }} />
                  )}
                </>
              )}
            </Stack>

            {/* Actions */}
            <Stack direction="row" spacing={0.25}>
              <IconButton size="small" onClick={handleShare} sx={{ width: 26, height: 26, color: "text.secondary", "&:hover": { color: "primary.main", bgcolor: "rgba(236,59,5,0.08)", }, }}>
                <ShareOutlined sx={{ fontSize: 16 }} />
              </IconButton>

              <IconButton size="small" onClick={handleSave} sx={{ width: 26, height: 26, color: "text.secondary", "&:hover": { color: "primary.main", bgcolor: "rgba(236,59,5,0.08)", }, }}>
                <BookmarkBorderOutlined sx={{ fontSize: 16 }} />
              </IconButton>
            </Stack>
          </Stack>

          {/* Date */}
          <Stack direction="row" spacing={0.4} alignItems="center" sx={{ flexShrink: 0 }}>
            <CalendarToday sx={{ fontSize: 13, color: "text.disabled" }} />
            <Typography variant="caption" color="text.disabled" sx={{ fontSize: "0.7rem" }}>
              {formatDate(article.CreatedAt)}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}