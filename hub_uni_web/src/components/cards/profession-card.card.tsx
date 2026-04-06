import React from "react";
import { ProfessionResponse } from "../../app/models/profession.model";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";

interface Props {
  professions: ProfessionResponse[];
}

export default function ProfesstionSelectActionCard({ professions }: Props) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [selectedOrg, setSelectedOrg] =
    React.useState<ProfessionResponse | null>(null);

  const navigate = useNavigate();

  const handleOpen = (
    event: React.MouseEvent<HTMLElement>,
    org: ProfessionResponse
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
        {professions.map((org) => (
          <Card key={org.Id}>
            <Box
              component="img"
              src={"/default_organization_card.jpg"}
              alt={org.Name}
              loading="lazy"
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
              {selectedOrg.Name}
            </Typography>
          </Box>
        )}
      </Popover>
    </>
  );
}