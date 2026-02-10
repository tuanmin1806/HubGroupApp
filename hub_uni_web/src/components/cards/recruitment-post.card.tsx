import * as React from "react";
import {
  Box,
  Card,
  Typography,
  IconButton,
  Popover,
  Button,
  Stack
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { RecruitmentPostResponse } from "../../app/models/recruitment-post.model";
import DefaultImage from "../../assets/default_organization_card.jpg"
import { BookmarkBorder, Send } from "@mui/icons-material";

interface Props {
  recruitmentPosts: RecruitmentPostResponse[];
}

export default function RecruitmentPostSelectActionCard({ recruitmentPosts }: Props) {
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [selectedOrg, setSelectedOrg] =
    React.useState<RecruitmentPostResponse | null>(null);

  const handleOpen = (
    event: React.MouseEvent<HTMLElement>,
    org: RecruitmentPostResponse
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrg(org);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedOrg(null);
  };

  const handleGoDetail = (seoUrl: string) => {
    navigate(`/tin-tuyen-sinh/${seoUrl}`);
    handleClose();
  };

  return (
    <>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: 2,
        }}
      >

        {recruitmentPosts.map((rcp) => (
          <Card
            key={rcp.Id}
            sx={{
              display: "flex",
              alignItems: "stretch",
              p: 2,
              borderRadius: 2,
            }}
          >
            {/* LEFT: IMAGE */}
            <Box
              component="img"
              src={DefaultImage}
              alt={rcp.Name}
              sx={{
                width: 120,
                height: 120,
                objectFit: "contain",
                mr: 2,
                borderRadius: 1,
                bgcolor: "#fafafa",
                cursor: "pointer"
              }}
              onClick={() => navigate(`/tin-tuyen-sinh/${rcp.SeoUrl}`)}
            />

            {/* RIGHT: CONTENT */}
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
              {/* NAME */}
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                sx={{ cursor: "pointer", width: "fit-content" }}
                onMouseEnter={(e) => handleOpen(e, rcp)}
                onMouseLeave={handleClose}
                onClick={() => navigate(`/tin-tuyen-sinh/${rcp.SeoUrl}`)}
              >
                {rcp.Name}
              </Typography>

              {/* INTERNATIONAL NAME */}
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 1 }}
              >
                {rcp.RecruitmentToDate}
              </Typography>

              {/* BOTTOM ROW */}
              <Box
                sx={{
                  mt: "auto",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                {/* MAIN PROFESSION */}
                <Typography variant="body2" color="primary">
                  {rcp.Organization.Name}
                </Typography>
              </Box>
            </Box>
          </Card>
        ))}
      </Box>

      {/* POPOVER */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        disableRestoreFocus
        sx={{ pointerEvents: "none"}}
      >
        {selectedOrg && (
          <Box sx={{ p: 2, maxWidth: 320 }}>
            <Typography fontWeight="bold" gutterBottom>
              {selectedOrg.Name}
            </Typography>

            <Typography variant="body2" sx={{ mb: 1 }}>
              {selectedOrg.Name}
            </Typography>

            <Typography variant="body2">
              <b>Tổ chức:</b> {selectedOrg.Organization.Name}
            </Typography>

            <Typography variant="body2">
              <b>Số lượng tuyển:</b> {selectedOrg.Quantity}
            </Typography>

            <Typography variant="body2">
              <b>Địa chỉ:</b> {selectedOrg.Province}
            </Typography>

            <Typography variant="body2">
              <b>Tuyển đến ngày:</b> {selectedOrg.RecruitmentToDate}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <Button
                fullWidth
                variant="contained"
                size="small"
                startIcon={<Send />}
                sx={{
                  bgcolor: "#ff5722",
                  fontWeight: 600,
                  "&:hover": { bgcolor: "#e64a19" }
                }}
                onClick={() => handleGoDetail(selectedOrg.SeoUrl)}
              >
                Ứng tuyển
              </Button>

              <Button
                fullWidth
                variant="outlined"
                size="small"
                startIcon={<BookmarkBorder />}
                sx={{
                  borderColor: "#ff5722",
                  color: "#ff5722",
                  fontWeight: 600,
                  "&:hover": {
                    bgcolor: "#ff5722",
                    color: "#fff"
                  }
                }}
                onClick={() => handleGoDetail(selectedOrg.SeoUrl)}
              >
                Yêu thích
              </Button>
            </Stack>
          </Box>

        )}
      </Popover>
    </>
  );
}
