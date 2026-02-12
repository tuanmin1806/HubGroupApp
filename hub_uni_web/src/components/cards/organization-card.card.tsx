import * as React from "react";
import {
  Box,
  Card,
  Typography,
  Tooltip,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { OrganizationResponse } from "../../app/models/organization.model";
import { Visibility } from "@mui/icons-material";
import { BACK_GROUND_BUTTON_COLOR } from "../../constants/common.constant";

interface Props {
  organizations: OrganizationResponse[];
}

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
            p: 2,
            borderRadius: 2,
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
            onClick={() => navigate(`/to-chuc/${org.SeoUrl}`)}
          />

          {/* RIGHT: CONTENT */}
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {/* NAME WITH TOOLTIP */}
            <Tooltip
              title={
                <Box sx={{
                  p: 1, width: 350,
                  maxHeight: 450,
                  overflowY: "auto",
                  overflowX: "hidden",
                }}>
                  <Typography fontWeight="bold" gutterBottom>
                    {org.Name}
                  </Typography>

                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {org.Summary}
                  </Typography>

                  <Typography variant="body2">
                    <b>Ngành chính:</b> {org.MainProfession}
                  </Typography>

                  <Typography variant="body2">
                    <b>Mã số thuế:</b> {org.TaxCode}
                  </Typography>

                  <Typography variant="body2" sx={{ mb: 2 }}>
                    <b>Địa chỉ:</b> {org.Address}
                  </Typography>

                  <Button
                    variant="contained"
                    startIcon={<Visibility />}
                    size="small"
                    fullWidth
                    sx={{backgroundColor: '#ff5722'}}
                    onClick={() => navigate(`/to-chuc/${org.SeoUrl}`)}
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
                sx={{ cursor: "pointer", width: "fit-content" }}
              >
                {org.Name}
              </Typography>
            </Tooltip>

            {/* TAX CODE */}
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {org.TaxCode}
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
                {org.MainProfession}
              </Typography>
            </Box>
          </Box>
        </Card>
      ))}
    </Box>
  );
}