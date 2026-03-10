import {
  Email,
  LocationOn,
  Phone,
  Work,
  Business,
  MenuBook,
  Info,
  Gavel,
  Security,
  ContactMail,
} from "@mui/icons-material";
import {
  Box,
  Grid,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { BACKGROUND_COLOR, TEXT_COLOR } from "../../constants/common.constant";

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
              Kết nối với chúng tôi
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
                <ListItemText primary="Tầng 1, Tòa nhà Pan Horizon, 117 Xuân Thủy, Phường Cầu Giấy, TP. Hà Nội." />
              </ListItem>
            </List>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Về Hubgroup.vn
            </Typography>

            <List dense>
              <ListItem disableGutters sx={linkStyle} onClick={() => handleExternal("https://hubgroup.vn/ve-chung-toi")}>
                <ListItemIcon sx={{ color: "#ff5722" }}><Info /></ListItemIcon>
                <ListItemText primary="Về chúng tôi" />
              </ListItem>

              <ListItem disableGutters sx={linkStyle} onClick={() => handleExternal("https://hubgroup.vn/dieu-khoan-su-dung")}>
                <ListItemIcon sx={{ color: "#ff5722" }}><Gavel /></ListItemIcon>
                <ListItemText primary="Quy chế hoạt động" />
              </ListItem>

              <ListItem disableGutters sx={linkStyle} onClick={() => handleExternal("https://hubgroup.vn/dieu-khoan-su-dung#bao-mat")}>
                <ListItemIcon sx={{ color: "#ff5722" }}><Security /></ListItemIcon>
                <ListItemText primary="Quy định bảo mật" />
              </ListItem>

              <ListItem disableGutters sx={linkStyle} onClick={() => handleExternal("https://hubgroup.vn/lien-he")}>
                <ListItemIcon sx={{ color: "#ff5722" }}><ContactMail /></ListItemIcon>
                <ListItemText primary="Liên hệ" />
              </ListItem>
            </List>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Danh mục
            </Typography>

            <List dense>
              <ListItem disableGutters sx={linkStyle} onClick={() => handleInternal("/tim-kiem-truong")}>
                <ListItemIcon sx={{ color: "#ff5722" }}><Business /></ListItemIcon>
                <ListItemText primary="Danh sách trường" />
              </ListItem>

              <ListItem disableGutters sx={linkStyle} onClick={() => handleInternal("/chuong-trinh-tuyen-sinh")}>
                <ListItemIcon sx={{ color: "#ff5722" }}><Work /></ListItemIcon>
                <ListItemText primary="Chương trình tuyển sinh" />
              </ListItem>

              <ListItem disableGutters sx={linkStyle} onClick={() => handleInternal("/bai-viet")}>
                <ListItemIcon sx={{ color: "#ff5722" }}><MenuBook /></ListItemIcon>
                <ListItemText primary="Bài viết" />
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
        © Copyright 2021 by{" "}
        <Link href="https://hubgroup.vn" target="_blank" rel="noopener noreferrer" underline="hover" color="inherit" sx={{ fontWeight: "bold", "&:hover": { textDecoration: "underline" } }}>
          Hubgroup.vn
        </Link>
        . All rights reserved.
      </Box>
    </Box>
  );
}