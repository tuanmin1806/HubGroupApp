import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Avatar,
  IconButton,
  Typography,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { ArticleResponse } from "../../app/models/article.model";

interface Props {
  article: ArticleResponse;
}

export default function ArticleCard({ article }: Props) {

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader
        avatar={<Avatar>{article.Title.charAt(0)}</Avatar>}
        action={
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        }
        title={article.Title}
        subheader={article.Categories?.[0]?.Name}
      />

      <CardMedia
        component="img"
        height="180"
        image={article.AvatarFullUrl}
        alt={article.Title}
      />

      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {article.Summary}
        </Typography>
      </CardContent>
    </Card>
  );
}
