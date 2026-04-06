import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import { useNavigate } from "react-router-dom";
import { OrganizationResponse } from "../../app/models/organization.model";
import Language from "@mui/icons-material/Language";
import LocationOn from "@mui/icons-material/LocationOn";
import Visibility from "@mui/icons-material/Visibility";
import defaultImage from "../../assets/default_organization_card.jpg"

interface Props { organizations: OrganizationResponse[]; }

export default function OrganizationSelectActionCard({ organizations }: Props) {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
        },
        gap: 2,
        alignItems: "stretch",
      }}
    >
      {organizations.map((org) => (
        <Card
          key={org.SeoUrl}
          sx={{
            display: "flex",
            flexDirection: "row",
            p: 1.25,
            border: org.IsTop ? "0.5px solid #faa11b" : "0.5px solid #dbd8d8",
            borderRadius: 1,
            transition: "transform 0.2s, box-shadow 0.2s",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: 3,
            },
          }}
        >
          <Box
            sx={{
              flexShrink: 0,
              width: { xs: 80, sm: 96 },
              height: { xs: 80, sm: 96 },
              alignSelf: "flex-start",
              mr: 1.5,
            }}
          >
            <Box
              component="img"
              src={org.LogoFullUrl || defaultImage}
              alt={org.Name}
              loading="lazy"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                borderRadius: 1,
                bgcolor: "#fafafa",
                border: "1px solid #f0f0f0",
                cursor: "pointer",
                display: "block",
              }}
              onClick={() => navigate(`/thong-tin-truong/${org.SeoUrl}`)}
            />
          </Box>

          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              minWidth: 0,
              gap: 0.4,
            }}
          >
            <Tooltip
              title={
                <Box sx={{ p: 1, width: 320, maxHeight: 420, overflowY: "auto" }}>
                  <Typography fontWeight="bold" gutterBottom>{org.Name}</Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>{org.Summary}</Typography>
                  <Typography variant="body2"><b>Ngành chính:</b> {org.MainProfession?.ProfessionName || "—"}</Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}><b>Tỉnh/Thành Phố:</b> {org.Province}</Typography>
                  <Button
                    variant="contained"
                    startIcon={<Visibility />}
                    size="small"
                    fullWidth
                    sx={{ backgroundColor: "#ff5722" }}
                    onClick={() => navigate(`/thong-tin-truong/${org.SeoUrl}`)}
                  >
                    Xem chi tiết
                  </Button>
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
                  whiteSpace: "nowrap",
                  lineHeight: 1.4,
                }}
              >
                {org.Name}
              </Typography>
            </Tooltip>

            {org.OrganizationType && (
              <Box sx={{ height: 22, display: "flex", alignItems: "center" }}>
                <Chip
                  label={org.OrganizationType}
                  size="small"
                  variant="outlined"
                  sx={{
                    fontSize: "0.62rem",
                    height: 18,
                    borderColor: "#ec3b05",
                    color: "#ec3b05",
                    fontWeight: 600,
                    maxWidth: "100%",
                    "& .MuiChip-label": {
                      px: 0.75,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    },
                  }}
                />
              </Box>
            )}

            {org.Province && org.Commune && (
              <Box sx={{ height: 20, display: "flex", alignItems: "center", minWidth: 0 }}>
                <LocationOn sx={{ fontSize: 12, color: "text.disabled", mr: 0.4, flexShrink: 0 }} />
                <Typography variant="caption" color="text.secondary" noWrap>
                  {[org.Province, org.Commune].filter(Boolean).join(", ") || "—"}
                </Typography>
              </Box>
            )}

            {org.WebsiteUrl && (
              <Box sx={{ height: 20, display: "flex", alignItems: "center", minWidth: 0 }}>
                <Language sx={{ fontSize: 12, color: "text.disabled", mr: 0.4, flexShrink: 0 }} />
                {org.WebsiteUrl ? (
                  <Typography
                    component="a"
                    href={org.WebsiteUrl.startsWith("http") ? org.WebsiteUrl : `https://${org.WebsiteUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="caption"
                    noWrap
                    sx={{
                      color: "text.secondary",
                      textDecoration: "none",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      display: "block",
                      "&:hover": { color: "#ff5722", textDecoration: "underline" },
                    }}
                  >
                    {org.WebsiteUrl.replace(/^https?:\/\//, "")}
                  </Typography>
                ) : (
                  <Typography variant="caption" color="text.disabled"></Typography>
                )}
              </Box>
            )}
          </Box>
        </Card>
      ))}
    </Box>
  );
}