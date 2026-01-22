import { AssignmentTurnedInTwoTone, Email, LocationOn, Phone, ShoppingBasket } from "@mui/icons-material";
import { Box, Grid, List, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box sx={{ bgcolor: "#ec5324", color: "#fff", mt: 6 }}>
      <Box sx={{ maxWidth: 1200, mx: "auto", px: 2, py: 4 }}>
        <Grid container spacing={4}>
          <Grid>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <AssignmentTurnedInTwoTone sx={{ mr: 1 }} />
              <Typography variant="h6" fontWeight="bold">
                HUB UNI
              </Typography>
            </Box>

            <Typography variant="body2" color="#fff">
              Nền tảng tra cứu thông tin tuyển sinh đại học nhanh chóng,
              chính xác và đáng tin cậy trên toàn quốc.
            </Typography>
          </Grid>

          {/* CONTACT */}
          <Grid>
            <Typography variant="h6" gutterBottom>
              Liên hệ
            </Typography>

            <List dense>
              <ListItem disableGutters>
                <ListItemIcon sx={{ color: "#fff" }}>
                  <LocationOn />
                </ListItemIcon>
                <ListItemText primary="TP. Hồ Chí Minh, Việt Nam" />
              </ListItem>

              <ListItem disableGutters>
                <ListItemIcon sx={{ color: "#fff" }}>
                  <Phone />
                </ListItemIcon>
                <ListItemText primary="0123 456 789" />
              </ListItem>

              <ListItem disableGutters>
                <ListItemIcon sx={{ color: "#fff" }}>
                  <Email />
                </ListItemIcon>
                <ListItemText primary="support@hubuni.vn" />
              </ListItem>
            </List>
          </Grid>

          {/* SERVICES */}
          <Grid>
            <Typography variant="h6" gutterBottom>
              Dịch vụ
            </Typography>

            <List dense>
              <ListItem disableGutters>
                <ListItemIcon sx={{ color: "#fff" }}>
                  <ShoppingBasket />
                </ListItemIcon>
                <ListItemText primary="Tra cứu ngành học" />
              </ListItem>

              <ListItem disableGutters>
                <ListItemIcon sx={{ color: "#fff" }}>
                  <ShoppingBasket />
                </ListItemIcon>
                <ListItemText primary="So sánh trường" />
              </ListItem>

              <ListItem disableGutters>
                <ListItemIcon sx={{ color: "#fff" }}>
                  <ShoppingBasket />
                </ListItemIcon>
                <ListItemText primary="Tư vấn tuyển sinh" />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Box>

      <Box
        sx={{
          textAlign: "center",
          py: 2,
          borderTop: "1px solid #fff",
          fontSize: 14,
        }}
      >
        © {new Date().getFullYear()} HUB UNI. All rights reserved.
      </Box>
    </Box>
  );
}
