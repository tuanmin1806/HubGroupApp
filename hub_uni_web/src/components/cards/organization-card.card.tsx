import * as React from "react";
import {
  Box,
  Card,
  Typography,
  IconButton,
  Popover
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useNavigate } from "react-router-dom";
import { OrganizationResponse } from "../../app/models/organization.model";

interface Props {
  organizations: OrganizationResponse[];
}

export default function OrganizationSelectActionCard({ organizations }: Props) {
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [selectedOrg, setSelectedOrg] =
    React.useState<OrganizationResponse | null>(null);

  const handleOpen = (
    event: React.MouseEvent<HTMLElement>,
    org: OrganizationResponse
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrg(org);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedOrg(null);
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

        {organizations.map((org) => (
          <Card
            key={org.Id}
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
              }}
            />

            {/* RIGHT: CONTENT */}
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
              {/* NAME */}
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                sx={{ cursor: "pointer", width: "fit-content" }}
                onMouseEnter={(e) => handleOpen(e, org)}
                onMouseLeave={handleClose}
              >
                {org.Name}
              </Typography>

              {/* INTERNATIONAL NAME */}
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 1 }}
              >
                {org.InternationalName}
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
                  {org.MainProfession}
                </Typography>

                {/* DETAIL ICON */}
                <IconButton
                  size="small"
                  onClick={() => navigate(`/to-chuc/${org.SeoUrl}`)}
                >
                  <InfoOutlinedIcon />
                </IconButton>
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
        sx={{ pointerEvents: "none" }}
      >
        {selectedOrg && (
          <Box sx={{ p: 2, maxWidth: 320 }}>
            <Typography fontWeight="bold" gutterBottom>
              {selectedOrg.Name}
            </Typography>

            <Typography variant="body2" sx={{ mb: 1 }}>
              {selectedOrg.Summary}
            </Typography>

            <Typography variant="body2">
              <b>Ngành chính:</b> {selectedOrg.MainProfession}
            </Typography>

            <Typography variant="body2">
              <b>Điện thoại:</b> {selectedOrg.PhoneNumber}
            </Typography>

            <Typography variant="body2">
              <b>Địa chỉ:</b> {selectedOrg.Address}
            </Typography>

            <Typography variant="body2">
              <b>Mã số thuế:</b> {selectedOrg.TaxCode}
            </Typography>
          </Box>
        )}
      </Popover>
    </>
  );
}
