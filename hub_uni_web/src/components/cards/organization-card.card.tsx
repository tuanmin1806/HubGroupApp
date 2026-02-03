import * as React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Popover,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { OrganizationResponse } from "../../app/models/organization.model";

interface Props {
  organizations: OrganizationResponse[];
}

export default function OrganizationSelectActionCard({ organizations }: Props) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [selectedOrg, setSelectedOrg] =
    React.useState<OrganizationResponse | null>(null);

  const navigate = useNavigate();

  const handleOpen = (
    event: React.MouseEvent<HTMLElement>,
    org: OrganizationResponse
  ) => {
    const cardElement = event.currentTarget.closest(".MuiCard-root");
    setAnchorEl(cardElement as HTMLElement);
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
          width: "100%",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 2,
        }}
      >
        {organizations.map((org) => (
          <Card key={org.Id}>
            <Box
              component="img"
              src={org.LogoFullUrl || "/default_organization_card.jpg"}
              alt={org.Name}
              sx={{
                width: "100%",
                height: 140,
                objectFit: "contain",
              }}
            />

            <CardContent>
              <Typography
                variant="h6"
                sx={{ cursor: "pointer" }}
                onClick={() => navigate(`/to-chuc/${org.Id}`)}
              >
                {org.Name}
              </Typography>

              <Typography variant="caption" color="text.secondary">
                {org.Province}
              </Typography>

              <Box mt={2}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={(e) => handleOpen(e, org)}
                >
                  Xem chi tiết
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        {selectedOrg && (
          <Box sx={{ p: 2, maxWidth: 260 }}>
            <Typography variant="subtitle1" gutterBottom>
              {selectedOrg.Name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {selectedOrg.Summary}
            </Typography>
          </Box>
        )}
      </Popover>
    </>
  );
}
