import Email from "@mui/icons-material/Email";
import LocationOn from "@mui/icons-material/LocationOn";
import Phone from "@mui/icons-material/Phone";
import Work from "@mui/icons-material/Work";
import Business from "@mui/icons-material/Business";
import MenuBook from "@mui/icons-material/MenuBook";
import Info from "@mui/icons-material/Info";
import Gavel from "@mui/icons-material/Gavel";
import Security from "@mui/icons-material/Security";
import ContactMail from "@mui/icons-material/ContactMail";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { BACKGROUND_COLOR, TEXT_COLOR } from "../../constants/common.constant";
import labelsVi from "../../i18n/labels.vi";

const labels = labelsVi.footer;

const linkStyle = {
  cursor: "pointer",
  "&:hover .MuiListItemText-primary": {
    textDecoration: "underline",
    opacity: 0.85,
  },
};

export default function Footer() {
  const navigate = useNavigate();

  const handleInternal = (path: string) => navigate(path);
  const handleExternal = (url: string) => window.open(url, "_blank", "noopener noreferrer");

  return (
    <Box sx={{ bgcolor: BACKGROUND_COLOR, color: TEXT_COLOR }}>
      <Box sx={{ maxWidth: 1200, mx: "auto", px: 1, py: 3 }}>
        <Grid container spacing={4}>

          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {labels.connectWithUs}
            </Typography>

            <List dense>
              <ListItem
                disableGutters
                sx={linkStyle}
                component="a"
                href="tel:0865999110"
              >
                <ListItemIcon sx={{ color: "#ff5722" }}>
                  <Phone />
                </ListItemIcon>
                <ListItemText primary="0865 999 110" />
              </ListItem>

              <ListItem
                disableGutters
                sx={linkStyle}
                component="a"
                href="mailto:contact@hubgroup.vn"
              >
                <ListItemIcon sx={{ color: "#ff5722" }}>
                  <Email />
                </ListItemIcon>
                <ListItemText primary="contact@hubgroup.vn" />
              </ListItem>

              <ListItem disableGutters>
                <ListItemIcon sx={{ color: "#ff5722" }}>
                  <LocationOn />
                </ListItemIcon>
                <ListItemText primary={labels.contactAddress} />
              </ListItem>
            </List>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {labels.aboutHubgroup}
            </Typography>

            <List dense>
              <ListItem disableGutters sx={linkStyle} onClick={() => handleExternal("https://hubgroup.vn/ve-chung-toi")}>
                <ListItemIcon sx={{ color: "#ff5722" }}><Info /></ListItemIcon>
                <ListItemText primary={labels.aboutUs} />
              </ListItem>

              <ListItem disableGutters sx={linkStyle} onClick={() => handleExternal("https://hubgroup.vn/dieu-khoan-su-dung")}>
                <ListItemIcon sx={{ color: "#ff5722" }}><Gavel /></ListItemIcon>
                <ListItemText primary={labels.termsOfUse} />
              </ListItem>

              <ListItem disableGutters sx={linkStyle} onClick={() => handleExternal("https://hubgroup.vn/dieu-khoan-su-dung#bao-mat")}>
                <ListItemIcon sx={{ color: "#ff5722" }}><Security /></ListItemIcon>
                <ListItemText primary={labels.privacyPolicy} />
              </ListItem>

              <ListItem disableGutters sx={linkStyle} onClick={() => handleExternal("https://hubgroup.vn/lien-he")}>
                <ListItemIcon sx={{ color: "#ff5722" }}><ContactMail /></ListItemIcon>
                <ListItemText primary={labels.contact} />
              </ListItem>
            </List>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {labels.categories}
            </Typography>

            <List dense>
              <ListItem disableGutters sx={linkStyle} onClick={() => handleInternal("/tim-kiem-truong")}>
                <ListItemIcon sx={{ color: "#ff5722" }}><Business /></ListItemIcon>
                <ListItemText primary={labels.schoolList} />
              </ListItem>

              <ListItem disableGutters sx={linkStyle} onClick={() => handleInternal("/chuong-trinh-tuyen-sinh")}>
                <ListItemIcon sx={{ color: "#ff5722" }}><Work /></ListItemIcon>
                <ListItemText primary={labels.programs} />
              </ListItem>

              <ListItem disableGutters sx={linkStyle} onClick={() => handleInternal("/bai-viet")}>
                <ListItemIcon sx={{ color: "#ff5722" }}><MenuBook /></ListItemIcon>
                <ListItemText primary={labels.articles} />
              </ListItem>
            </List>
          </Grid>

        </Grid>
      </Box>

      <Box
        sx={{
          textAlign: "center",
          py: 2,
          borderTop: "1px solid rgba(255,255,255,0.2)",
          fontSize: 14,
        }}
      >
        {labels.copyright2021By}{" "}
        <Link href="https://hubgroup.vn" target="_blank" rel="noopener noreferrer" underline="hover" color="inherit" sx={{ fontWeight: "bold", "&:hover": { textDecoration: "underline" } }}>
          {labels.hubgroup}
        </Link>
        . {labels.allRightsReserved}
      </Box>
    </Box>
  );
}