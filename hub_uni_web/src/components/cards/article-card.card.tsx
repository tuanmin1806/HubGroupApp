import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  Stack,
  Box,
} from "@mui/material";
import { CalendarToday, Person } from "@mui/icons-material";
import { ArticleResponse } from "../../app/models/article.model";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utils/date.utils";

interface Props {
  article: ArticleResponse;
}

export default function ArticleCard({ article }: Props) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/bai-viet/${article.Seo}`);
  };

  return (
    <Card
      onClick={handleClick}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 2,
        overflow: "hidden",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "pointer",
        border: "1px solid",
        borderColor: "divider",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
          borderColor: "primary.main",
          "& .card-image": {
            transform: "scale(1.05)",
          }
        }
      }}
    >
      {/* Image */}
      <Box sx={{ overflow: "hidden", height: 180, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CardMedia
          component="img"
          height="180"
          image={article.AvatarFullUrl || "/placeholder-image.jpg"}
          alt={article.Title}
          className="card-image"
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            transition: "transform 0.3s ease",
          }}
        />
      </Box>

      {/* Content */}
      <CardContent
        sx={{
          flexGrow: 1,
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {/* Category Badge */}
        {article.Categories?.[0]?.Name && (
          <Chip
            label={article.Categories[0].Name}
            size="small"
            color="primary"
            sx={{
              height: 22,
              fontSize: "0.7rem",
              fontWeight: 600,
              alignSelf: "flex-start",
            }}
          />
        )}

        {/* Title */}
        <Typography
          variant="subtitle1"
          fontWeight={700}
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontSize: "0.95rem",
            lineHeight: 1.3,
            minHeight: "2.6em",
            color: "text.primary",
          }}
        >
          {article.Title}
        </Typography>

        {/* Summary */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontSize: "0.85rem",
            lineHeight: 1.5,
            flex: 1,
          }}
        >
          {article.Summary}
        </Typography>

        {/* Meta Information */}
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          sx={{
            pt: 1,
            mt: "auto",
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          {/* Author */}
          <Stack
            direction="row"
            spacing={0.5}
            alignItems="center"
            sx={{ flex: 1, minWidth: 0 }}
          >
            <Person sx={{ fontSize: 14, color: "text.secondary" }} />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                fontSize: "0.7rem",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {article.CreatedBy}
            </Typography>
          </Stack>

          {/* Date */}
          <Stack
            direction="row"
            spacing={0.5}
            alignItems="center"
            sx={{ flexShrink: 0 }}
          >
            <CalendarToday sx={{ fontSize: 14, color: "text.secondary" }} />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: "0.7rem" }}
            >
              {formatDate(article.CreatedAt)}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}