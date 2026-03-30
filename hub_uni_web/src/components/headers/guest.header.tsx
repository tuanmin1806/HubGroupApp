import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import {
    createTheme, ThemeProvider, useMediaQuery, IconButton,
    Drawer, List, ListItem, ListItemText, ListItemButton,
    Menu, Button, MenuItem, Fade, Divider, Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Person, KeyboardArrowDown } from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import hub_logo from "../../assets/hub_logo.png";

const theme = createTheme({
    palette: {
        primary: { main: "#f8f8f8" },
        secondary: { main: "#ffff" },
    },
});

const NAV_LINKS = [
    { label: "Danh sách trường", action: "organization" },
    { label: "Chương trình tuyển sinh", action: "recruitment" },
    { label: "Bài viết", action: "article" },
];

const HUBGROUP_LINKS = [
    { label: "Giới thiệu", url: "https://hubgroup.vn/ve-chung-toi" },
    { label: "Liên hệ", url: "https://hubgroup.vn/lien-he" },
    { label: "Thư viện ảnh", url: "https://hubgroup.vn/thu-vien-anh" },
    { label: "Văn phòng HUBGROUP", url: "https://vanphong.hubgroup.vn/" },
];

function GuestHeader() {
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [openDrawer, setOpenDrawer] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [drawerHubOpen, setDrawerHubOpen] = useState(false);
    const menuOpen = Boolean(anchorEl);

    const handleNavigate = (action: string) => {
        const routes: Record<string, () => void> = {
            organization: () => navigate("/tim-kiem-truong"),
            recruitment: () => navigate("/chuong-trinh-tuyen-sinh"),
            article: () => navigate("/bai-viet"),
        };
        routes[action]?.();
        setOpenDrawer(false);
    };

    // Drawer for mobile
    const DrawerContent = (
        <Box sx={{ width: "80vw", maxWidth: 320 }} role="presentation">
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, py: 1 }}>
                <Box
                    component="img"
                    src={hub_logo}
                    alt="logo"
                    sx={{ height: "1.5rem", width: "auto", objectFit: "contain" }}
                />
                <IconButton onClick={() => setOpenDrawer(false)} size="small">
                    <CloseIcon />
                </IconButton>
            </Box>

            <Divider />

            <List disablePadding>
                {NAV_LINKS.map(({ label, action }) => (
                    <ListItem key={action} disablePadding>
                        <ListItemButton onClick={() => handleNavigate(action)} sx={{ px: 2, py: 1.2 }}>
                            <ListItemText
                                primary={label}
                                slotProps={{ primary: { fontWeight: 600, fontSize: "0.9rem" } }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}

                <ListItem disablePadding>
                    <ListItemButton
                        onClick={() => setDrawerHubOpen(prev => !prev)}
                        sx={{ px: 2, py: 1 }}
                    >
                        <ListItemText
                            primary="Về HUBGROUP"
                            slotProps={{ primary: { fontWeight: 600, fontSize: "0.9rem" } }}
                        />
                        <KeyboardArrowDown
                            sx={{
                                fontSize: 18,
                                transition: "transform 0.2s",
                                transform: drawerHubOpen ? "rotate(180deg)" : "rotate(0deg)",
                            }}
                        />
                    </ListItemButton>
                </ListItem>

                {drawerHubOpen && HUBGROUP_LINKS.map(({ label, url }) => (
                    <ListItem key={url} disablePadding>
                        <ListItemButton
                            onClick={() => { window.open(url, "_blank"); setOpenDrawer(false); }}
                            sx={{ px: 4, py: 1 }}
                        >
                            <ListItemText
                                primary={label}
                                slotProps={{ primary: { fontSize: "0.85rem", color: "text.secondary" } }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}

                <ListItem disablePadding>
                    <ListItemButton
                        onClick={() => { navigate("/dang-nhap"); setOpenDrawer(false); }}
                        sx={{ px: 2, py: 1 }}
                    >
                        <ListItemText
                            primary="Đăng nhập"
                            slotProps={{ primary: { fontWeight: 600, fontSize: "0.9rem" } }}
                        />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <ThemeProvider theme={theme}>
            <AppBar position="fixed" sx={{ color: "#242424", backgroundColor: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters sx={{ minHeight: { xs: 56, md: 64 }, gap: 1 }}>

                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={() => setOpenDrawer(true)}
                            sx={{ display: { xs: "flex", md: "none" } }}
                        >
                            <MenuIcon />
                        </IconButton>

                        <Box
                            component="img"
                            src={hub_logo}
                            alt="logo"
                            onClick={() => navigate("/")}
                            sx={{
                                cursor: "pointer",
                                height: { xs: "1.4rem", md: "1.9rem" },
                                width: "auto",
                                objectFit: "contain",
                                mr: { xs: 0, md: 2 },
                            }}
                        />

                        <Box
                            sx={{
                                flexGrow: 1,
                                display: { xs: "none", md: "flex" },
                                alignItems: "center",
                                gap: 0.5,
                                overflow: "hidden",
                            }}
                        >
                            {NAV_LINKS.map(({ label, action }) => (
                                <Link
                                    key={action}
                                    component="button"
                                    color="inherit"
                                    variant="body2"
                                    underline="hover"
                                    onClick={() => handleNavigate(action)}
                                    sx={{
                                        px: { md: 1, lg: 1.5 },
                                        textTransform: "uppercase",
                                        fontWeight: 700,
                                        fontSize: { md: "0.75rem", lg: "0.875rem" },
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {label}
                                </Link>
                            ))}

                            <div onMouseLeave={() => setAnchorEl(null)}>
                                <Button
                                    onMouseEnter={(e) => setAnchorEl(e.currentTarget)}
                                    endIcon={<KeyboardArrowDown sx={{ fontSize: "1rem !important" }} />}
                                    sx={{
                                        px: { md: 1, lg: 1.5 },
                                        textTransform: "uppercase",
                                        fontWeight: 700,
                                        fontSize: { md: "0.75rem", lg: "0.875rem" },
                                        color: "inherit",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    Về HUBGROUP
                                </Button>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={menuOpen}
                                    onClose={() => setAnchorEl(null)}
                                    slots={{ transition: Fade }}
                                    slotProps={{ list: { onMouseLeave: () => setAnchorEl(null) } }}
                                    disableRestoreFocus
                                    sx={{ pointerEvents: "none" }}
                                    PaperProps={{ sx: { pointerEvents: "auto", mt: 0.5 } }}
                                >
                                    {HUBGROUP_LINKS.map(({ label, url }) => (
                                        <MenuItem
                                            key={url}
                                            onClick={() => { window.open(url, "_blank"); setAnchorEl(null); }}
                                            sx={{ fontSize: "0.875rem" }}
                                        >
                                            {label}
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </div>
                        </Box>

                        <Box sx={{ flexGrow: { xs: 1, md: 0 } }} />

                        <Box
                            sx={{
                                display: { xs: "none", md: "flex" },
                                alignItems: "center",
                                gap: 0.5,
                                flexShrink: 0,
                            }}
                        >
                            <Person sx={{ fontSize: "1.4rem" }} />
                            <Link
                                component="button"
                                color="inherit"
                                variant="body1"
                                underline="hover"
                                onClick={() => navigate("/dang-nhap")}
                                sx={{ fontWeight: 700, fontSize: "0.95rem", whiteSpace: "nowrap" }}
                            >
                                Đăng nhập
                            </Link>
                        </Box>

                        <IconButton
                            sx={{ display: { xs: "flex", md: "none" } }}
                            onClick={() => navigate("/dang-nhap")}
                            color="inherit"
                        >
                            <Person sx={{ fontSize: "1.4rem" }} />
                        </IconButton>

                    </Toolbar>
                </Container>
            </AppBar>

            <Drawer anchor="left" open={openDrawer} onClose={() => setOpenDrawer(false)}>
                {DrawerContent}
            </Drawer>
        </ThemeProvider>
    );
}

export default GuestHeader;