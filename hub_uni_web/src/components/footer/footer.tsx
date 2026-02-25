import {
  Email,
  LocationOn,
  Phone,
  Work,
  Public,
  Business,
  MenuBook,
  Info,
  Gavel,
  Image,
  Security,
  ContactMail,
  Map
} from "@mui/icons-material";
import {
  Box,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography
} from "@mui/material";
import { BACKGROUND_COLOR, TEXT_COLOR } from "../../constants/common.constant";

export default function Footer() {
  return (
    <Box sx={{ bgcolor: BACKGROUND_COLOR, color: TEXT_COLOR }}>
      <Box sx={{ maxWidth: 1200, mx: "auto", px: 1, py: 3 }}>
        <Grid container spacing={4}>

          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              HUBGROUP.VN
            </Typography>

            <List dense>
              <ListItem disableGutters>
                <ListItemIcon sx={{ color: "#ff5722" }}>
                  <Phone />
                </ListItemIcon>
                <ListItemText primary="0865 999 110" />
              </ListItem>

              <ListItem disableGutters>
                <ListItemIcon sx={{ color: "#ff5722" }}>
                  <Email />
                </ListItemIcon>
                <ListItemText primary="contact@hubgroup.vn" />
              </ListItem>

              <ListItem disableGutters>
                <ListItemIcon sx={{ color: "#ff5722" }}>
                  <LocationOn />
                </ListItemIcon>
                <ListItemText primary="Tầng 1, Tòa nhà Pan Horizon, 117 Xuân Thủy, Phường Cầu Giấy, TP. Hà Nội." />
              </ListItem>
            </List>
          </Grid>

          {/* CỘT 2 - VỀ HUBGROUP */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Về Hubgroup.vn
            </Typography>

            <List dense>
              <ListItem disableGutters>
                <ListItemIcon sx={{ color: "#ff5722" }}>
                  <Info />
                </ListItemIcon>
                <ListItemText primary="Về chúng tôi" />
              </ListItem>

              <ListItem disableGutters>
                <ListItemIcon sx={{ color: "#ff5722" }}>
                  <Gavel />
                </ListItemIcon>
                <ListItemText primary="Quy chế hoạt động" />
              </ListItem>

              <ListItem disableGutters>
                <ListItemIcon sx={{ color: "#ff5722" }}>
                  <Security />
                </ListItemIcon>
                <ListItemText primary="Quy định bảo mật" />
              </ListItem>

              <ListItem disableGutters>
                <ListItemIcon sx={{ color: "#ff5722" }}>
                  <ContactMail />
                </ListItemIcon>
                <ListItemText primary="Liên hệ" />
              </ListItem>

              <ListItem disableGutters>
                <ListItemIcon sx={{ color: "#ff5722" }}>
                  <Map />
                </ListItemIcon>
                <ListItemText primary="Sơ đồ trang web" />
              </ListItem>
            </List>
          </Grid>

          {/* CỘT 3 - DANH MỤC */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Danh mục
            </Typography>

            <List dense>

              <ListItem disableGutters>
                <ListItemIcon sx={{ color: "#ff5722" }}>
                  <Business />
                </ListItemIcon>
                <ListItemText primary="Tổ chức" />
              </ListItem>

              <ListItem disableGutters>
                <ListItemIcon sx={{ color: "#ff5722" }}>
                  <Work />
                </ListItemIcon>
                <ListItemText primary="Ngành nghề" />
              </ListItem>

              <ListItem disableGutters>
                <ListItemIcon sx={{ color: "#ff5722" }}>
                  <MenuBook />
                </ListItemIcon>
                <ListItemText primary="Tin tuyển sinh" />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Box>

      {/* COPYRIGHT */}
      <Box
        sx={{
          textAlign: "center",
          py: 2,
          borderTop: "1px solid rgba(255,255,255,0.2)",
          fontSize: 14,
        }}
      >
        © Copyright 2021 by Hubgroup.vn. All rights reserved.
      </Box>
    </Box>
  );
}