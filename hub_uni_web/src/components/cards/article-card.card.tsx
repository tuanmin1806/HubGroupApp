import * as React from "react";
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Collapse,
  Avatar,
  IconButton,
  Typography,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { styled } from "@mui/material/styles";
import { ArticleResponse } from "../../app/models/article.model";

interface Props {
  article: ArticleResponse;
}

const ExpandMore = styled(
  ({ expand, ...other }: { expand: boolean } & any) => (
    <IconButton {...other} />
  )
)(({ theme, expand }) => ({
  marginLeft: "auto",
  transform: expand ? "rotate(180deg)" : "rotate(0deg)",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function ArticleCard({ article }: Props) {
  const [expanded, setExpanded] = React.useState(false);

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

      <CardActions disableSpacing>
        <IconButton>
          <FavoriteIcon />
        </IconButton>
        <IconButton>
          <ShareIcon />
        </IconButton>

        <ExpandMore
          expand={expanded}
          onClick={() => setExpanded(!expanded)}
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography
            variant="body2"
            dangerouslySetInnerHTML={{ __html: article.Content }}
          />
        </CardContent>
      </Collapse>
    </Card>
  );
}
