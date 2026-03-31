import { Box, Card, Typography, Button, Tooltip, Stack, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { RecruitmentPostDetailResponse } from "../../app/models/recruitment-post.model";
import { Send, Visibility, PeopleAlt, CalendarToday, LocationOn, AccessTime } from "@mui/icons-material";
import { formatDate } from "../../utils/date.utils";
import { getRecruitmentStatus } from "../../utils/recruitment-post.utils";

interface Props { recruitmentPosts: RecruitmentPostDetailResponse[]; }

export default function RecruitmentPostSelectActionCard({ recruitmentPosts }: Props) {
  const navigate = useNavigate();

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
              p: 1,
              borderRadius: 2,
              position: "relative",
              border: rcp.IsTop ? "0.5px solid #faa11b" : "0.5px solid #dbd8d8",
            }}
          >
            {/* IsTop badge */}
            {rcp.IsTop && (
              <Box
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  bgcolor: "#f3522a",
                  color: "#fafafa",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  px: 0.5,
                  py: 0.15,
                  borderRadius: 1,

                  animation: 'hotShake 1.8s ease-in-out infinite, hotPulse 1.8s ease-in-out infinite',

                  '@keyframes hotShake': {
                    '0%': { transform: 'rotate(0deg) scale(1)' },
                    '10%': { transform: 'rotate(-12deg) scale(1.15)' },
                    '20%': { transform: 'rotate(12deg) scale(1.15)' },
                    '30%': { transform: 'rotate(-10deg) scale(1.12)' },
                    '40%': { transform: 'rotate(10deg) scale(1.12)' },
                    '50%': { transform: 'rotate(-6deg) scale(1.08)' },
                    '60%': { transform: 'rotate(6deg) scale(1.08)' },
                    '70%': { transform: 'rotate(-3deg) scale(1.03)' },
                    '80%': { transform: 'rotate(3deg) scale(1.03)' },
                    '100%': { transform: 'rotate(0deg) scale(1)' },
                  },

                  '@keyframes hotPulse': {
                    '0%, 100%': { bgcolor: '#f3522a' },
                    '25%': { bgcolor: '#ff6b47' },
                    '50%': { bgcolor: '#f3522a' },
                    '75%': { bgcolor: '#ff6b47' },
                  },
                }}
              >
                HOT
              </Box>
            )}

            {/* LEFT: IMAGE */}
            <Box
              component="img"
              src={rcp.Organization.LogoFullUrl}
              alt={rcp.Name}
              loading="lazy"
              sx={{
                width: 120,
                height: 120,
                objectFit: "cover",
                mr: 2,
                borderRadius: 1,
                bgcolor: "#fafafa",
                cursor: "pointer",
                flexShrink: 0,
              }}
              onClick={() => navigate(`/chuong-trinh-tuyen-sinh/${rcp.SeoUrl}`)}
            />

            {/* RIGHT: CONTENT */}
            <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 0.5 }}>

              {/* Title tooltip */}
              <Tooltip
                title={
                  <Box sx={{ p: 1, width: 350, maxHeight: 450, overflowY: "auto", overflowX: "hidden" }}>
                    <Typography fontWeight="bold" gutterBottom> {rcp.Name}</Typography>
                    <Chip label={rcp.Organization.Name} size="small" variant="outlined" sx={{ height: "auto", fontSize: "0.8rem", borderColor: "#f3522a", color: "#f3522a", "& .MuiChip-label": { px: 0.7, whiteSpace: "normal" }, }} />

                    <Stack direction="row" spacing={0.5} alignItems="center" mt={0.5}>
                      <PeopleAlt sx={{ fontSize: 14, color: "#faa11b" }} />
                      <Typography variant="body2">{rcp.Quantity} chỉ tiêu</Typography>
                    </Stack>

                    <Stack direction="row" spacing={0.5} alignItems="center" mt={0.5}>
                      <LocationOn sx={{ fontSize: 14, color: "#faa11b" }} />
                      <Typography variant="body2">{rcp.Province}</Typography>
                    </Stack>

                    <Stack direction="row" spacing={0.5} alignItems="center" mt={0.5} mb={2}>
                      <AccessTime sx={{ fontSize: 13, color: getRecruitmentStatus(rcp.RecruitmentToDate).color }} />
                      <Typography variant="body2" sx={{ color: getRecruitmentStatus(rcp.RecruitmentToDate).color }}>{formatDate(rcp.RecruitmentToDate)}</Typography>
                    </Stack>

                    <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
                      <Button
                        variant="contained"
                        startIcon={<Visibility />}
                        size="small"
                        fullWidth
                        sx={{ backgroundColor: "#ff5722" }}
                        onClick={() => navigate(`/chuong-trinh-tuyen-sinh/${rcp.SeoUrl}`)}
                      >
                        Xem chi tiết
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={<Send />}
                        size="small"
                        fullWidth
                        sx={{ backgroundColor: "#ff5722" }}
                        onClick={() => navigate(`/chuong-trinh-tuyen-sinh/${rcp.SeoUrl}`)}
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
                    modifiers: [{ name: "offset", options: { offset: [0, 8] } }],
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
                  sx={{
                    cursor: "pointer",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    pr: rcp.IsTop ? 6 : 0,
                  }}
                >
                  {rcp.Name}
                </Typography>
              </Tooltip>

              <Stack direction="row" spacing={0.5} alignItems="center">
                <PeopleAlt sx={{ fontSize: 14, color: "#faa11b" }} />
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.8rem" }}>{rcp.Quantity} chỉ tiêu </Typography>
              </Stack>

              <Box sx={{ mt: "auto" }}>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <AccessTime sx={{ fontSize: 13, color: getRecruitmentStatus(rcp.RecruitmentToDate).color }} />
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "0.8rem",
                      fontWeight: 500,
                      color: getRecruitmentStatus(rcp.RecruitmentToDate).color,
                    }}
                  >
                    {getRecruitmentStatus(rcp.RecruitmentToDate).label}
                  </Typography>
                </Stack>
              </Box>
            </Box>
          </Card>
        ))}
      </Box>
    </>
  );
}