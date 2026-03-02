import { Box, Card, Typography, Tooltip, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { OrganizationResponse } from "../../app/models/organization.model";
import { Visibility } from "@mui/icons-material";

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
      }}
    >
      {organizations.map((org) => (
        <Card
          key={org.SeoUrl}
          sx={{
            display: "flex",
            alignItems: "stretch",
            p: 1,
            border: {xs: org.IsTop ? "0.5px solid #faa11b" : "0.5px solid #e0e0e0"},
            borderRadius: 1,
            "&:hover": {
              transform: "translateY(-2px)",
            },
          }}
        >
          {/* LEFT: IMAGE */}
          <Box
            component="img"
            src={org.LogoFullUrl || "/default_organization_card.jpg"}
            alt={org.Name}
            sx={{
              width: 120,
              height: 120,
              objectFit: "contain",
              mr: 2,
              borderRadius: 1,
              bgcolor: "#fafafa",
              cursor: "pointer",
            }}
            onClick={() => navigate(`/chi-tiet-truong/${org.SeoUrl}`)}
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
                  <Typography fontWeight="bold" gutterBottom> {org.Name} </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}> {org.Summary} </Typography>
                  <Typography variant="body2"> <b>Ngành chính:</b> {org.MainProfession?.Name} </Typography>
                  <Typography variant="body2"> <b>Mã số thuế:</b> {org.TaxCode} </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}> <b>Địa chỉ:</b> {org.Address} </Typography>

                  <Button
                    variant="contained"
                    startIcon={<Visibility />}
                    size="small"
                    fullWidth
                    sx={{ backgroundColor: '#ff5722' }}
                    onClick={() => navigate(`/chi-tiet-truong/${org.SeoUrl}`)}
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
                sx={{
                  cursor: "pointer",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {org.Name}
              </Typography>
            </Tooltip>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}> {org.OrganizationType} </Typography>

            {org.WebsiteUrl && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  mb: 1,
                  minWidth: 0,
                }}
              >

                <Typography
                  component="a"
                  href={org.WebsiteUrl.startsWith("http") ? org.WebsiteUrl : `https://${org.WebsiteUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    textDecoration: "none",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    display: "block",
                    maxWidth: {
                      xs: 180,
                      sm: 160,
                      md: 200,
                    },
                    "&:hover": {
                      color: "#ff5722",
                      textDecoration: "underline",
                    },
                  }}
                >
                  {org.WebsiteUrl}
                </Typography>
              </Box>
            )}

            {/* BOTTOM ROW */}
            <Box
              sx={{
                mt: "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="body2" color="primary"> {org.MainProfession?.Name} </Typography>
            </Box>
          </Box>
        </Card>
      ))}
    </Box>
  );
}