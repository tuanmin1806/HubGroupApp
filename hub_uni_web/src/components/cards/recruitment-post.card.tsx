import * as React from "react";
import {
  Box,
  Card,
  Typography,
  Button,
  Tooltip
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { RecruitmentPostResponse } from "../../app/models/recruitment-post.model";
import DefaultImage from "../../assets/default_organization_card.jpg"
import { Send, Visibility } from "@mui/icons-material";
import { BACK_GROUND_BUTTON_COLOR } from "../../constants/common.constant";

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
              src={rcp.Organization.LogoFullUrl}
              alt={rcp.Name}
              sx={{
                width: 120,
                height: 120,
                objectFit: "cover",
                mr: 2,
                borderRadius: 1,
                bgcolor: "#fafafa",
                cursor: "pointer"
              }}
              onClick={() => navigate(`/tin-tuyen-sinh/${rcp.SeoUrl}`)}
            />

            {/* RIGHT: CONTENT */}
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <Tooltip
                title={
                  <Box sx={{
                    p: 1, width: 350,
                    maxHeight: 450,
                    overflowY: "auto",
                    overflowX: "hidden",
                  }}>
                    <Typography fontWeight="bold" gutterBottom>
                      {rcp.Name}
                    </Typography>
                    <Typography variant="body2">
                      <b>Tổ chức:</b> {rcp.Organization.Name}
                    </Typography>

                    <Typography variant="body2">
                      <b>Số lượng tuyển:</b> {rcp.Quantity}
                    </Typography>

                    <Typography variant="body2" sx={{ mb: 2 }}>
                      <b>Địa chỉ:</b> {rcp.Province}
                    </Typography>

                    <Typography variant="body2" sx={{ mb: 2 }}>
                      <b>Hạn:</b> {rcp.RecruitmentToDate}
                    </Typography>
                    <Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>
                      <Button
                        variant="contained"
                        startIcon={<Visibility />}
                        size="small"
                        fullWidth
                        sx={{backgroundColor: '#ff5722'}}
                        onClick={() => navigate(`/tin-tuyen-sinh/${rcp.SeoUrl}`)}
                      >
                        Xem chi tiết
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={<Send />}
                        size="small"
                        fullWidth
                        sx={{backgroundColor: '#ff5722'}}
                        onClick={() => navigate(`/tin-tuyen-sinh/${rcp.SeoUrl}`)}
                      >
                        Ứng tuyển ngay
                      </Button>
                    </Box>
                  </Box>
                }
                arrow
                placement="bottom-start"
                enterDelay={300}
                leaveDelay={200}
                slotProps={{
                  popper: {
                    modifiers: [
                      {
                        name: "offset",
                        options: {
                          offset: [0, 8],
                        },
                      },
                    ],
                  },
                  tooltip: {
                    sx: {
                      bgcolor: "background.paper",
                      color: "text.primary",
                      boxShadow: 3,
                      border: "1px solid",
                      borderColor: "divider",
                      maxWidth: "none",
                    },
                  },
                }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  sx={{ cursor: "pointer", width: "fit-content" }}
                >
                  {rcp.Name}
                </Typography>
              </Tooltip>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                <b>Số lượng tuyển: </b>{rcp.Quantity}
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
                <Typography variant="body2" color="primary">
                  {rcp.RecruitmentToDate}
                </Typography>
              </Box>
            </Box>
          </Card>
        ))}
      </Box>
    </>
  );
}
