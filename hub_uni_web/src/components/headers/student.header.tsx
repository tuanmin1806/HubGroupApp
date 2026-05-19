import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import { createTheme, ThemeProvider } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import Menu from "@mui/material/Menu";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Fade from "@mui/material/Fade";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Person3 from "@mui/icons-material/Person3";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import hub_logo from "../../assets/hub_logo.png";
import { RootState } from "../../app/store";

const theme = createTheme({
    palette: {
        primary: { main: "#f36730" },
        secondary: { main: "#ffff" },
    },
});

const NAV_LINKS = [
    { label: "Danh sách trường", action: "organization" },
    { label: "Chương trình tuyển sinh", action: "recruitment" },
    { label: "Bài viết", action: "article" },
    { label: "Tra cứu học bổng", action: "scholarshipCalculator" }

];

const HUBGROUP_LINKS = [
    { label: "Giới thiệu", url: "https://hubgroup.vn/ve-chung-toi" },
    { label: "Liên hệ", url: "https://hubgroup.vn/lien-he" },
    { label: "Thư viện ảnh", url: "https://hubgroup.vn/thu-vien-anh" },
    { label: "Văn phòng HUBGROUP", url: "https://vanphong.hubgroup.vn/" },
];

function StudentHeader() {
    const navigate = useNavigate();
    const { user } = useSelector((state: RootState) => state.auth);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [drawerHubOpen, setDrawerHubOpen] = useState(false);
    const menuOpen = Boolean(anchorEl);

    const handleNavigate = (action: string) => {
        const routes: Record<string, () => void> = {
            organization: () => navigate("/tim-kiem-truong"),
            recruitment: () => navigate("/chuong-trinh-tuyen-sinh"),
            article: () => navigate("/bai-viet"),
            scholarshipCalculator: () => navigate("/tra-cuu-hoc-bong"),
        };
        routes[action]?.();
        setOpenDrawer(false);
    };

    const DrawerContent = (
        <Box sx={{ width: "80vw", maxWidth: 320 }} role="presentation">
            {/* Header Drawer */}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, py: 1.5 }}>
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
                    <ListItemButton onClick={() => setDrawerHubOpen(prev => !prev)} sx={{ px: 2, py: 1 }}>
                        <ListItemText
                            primary="Về HUBGROUP"
                            slotProps={{ primary: { fontWeight: 600, fontSize: "0.9rem" } }}
                        />
                        <KeyboardArrowDown sx={{ fontSize: 18, transition: "transform 0.2s", transform: drawerHubOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
                    </ListItemButton>
                </ListItem>

                {drawerHubOpen && HUBGROUP_LINKS.map(({ label, url }) => (
                    <ListItem key={url} disablePadding>
                        <ListItemButton onClick={() => { window.open(url, "_blank"); setOpenDrawer(false); }} sx={{ px: 4, py: 1 }}>
                            <ListItemText
                                primary={label}
                                slotProps={{ primary: { fontSize: "0.85rem", color: "text.secondary" } }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}

                <ListItem disablePadding>
                    <ListItemButton onClick={() => { navigate("/thong-tin-tai-khoan"); setOpenDrawer(false); }} sx={{ px: 2, py: 1 }}>
                        <Avatar
                            src={user?.AvatarFullUrl ?? undefined}
                            sx={{ width: 28, height: 28, fontSize: 13, mr: 1.5, border: "2px solid #f36730" }}
                        >
                            {user?.AvatarFullUrl ? null : (user?.FullName?.[0] ?? <Person3 sx={{ fontSize: 16 }} />)}
                        </Avatar>
                        <ListItemText
                            primary={user?.FullName ?? "Tài khoản"}
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

                        {/* Hamburger — chỉ mobile */}
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={() => setOpenDrawer(true)}
                            sx={{ display: { xs: "flex", md: "none" } }}
                        >
                            <MenuIcon />
                        </IconButton>

                        {/* Logo */}
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

                        <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, alignItems: "center", gap: 0.5, overflow: "hidden" }}>
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
                                        <MenuItem key={url} onClick={() => { window.open(url, "_blank"); setAnchorEl(null); }} sx={{ fontSize: "0.875rem" }}>
                                            {label}
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </div>
                        </Box>

                        <Box sx={{ flexGrow: { xs: 1, md: 0 } }} />

                        <Tooltip title="Thông tin tài khoản">
                            <Box
                                onClick={() => navigate("/thong-tin-tai-khoan")}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    cursor: "pointer",
                                    flexShrink: 0,
                                    "&:hover": { opacity: 0.85 },
                                }}
                            >
                                <Avatar
                                    src={user?.AvatarFullUrl ?? undefined}
                                    sx={{
                                        width: { xs: 32, md: 36 },
                                        height: { xs: 32, md: 36 },
                                        fontSize: { xs: 14, md: 16 },
                                        border: "2px solid #f36730",
                                        boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                                    }}
                                >
                                    {user?.AvatarFullUrl ? null : (user?.FullName?.[0] ?? <Person3 sx={{ fontSize: 18 }} />)}
                                </Avatar>

                                <Link
                                    component="button"
                                    color="inherit"
                                    variant="body1"
                                    underline="none"
                                    sx={{
                                        display: { xs: "none", md: "block" },
                                        fontWeight: 700,
                                        fontSize: "0.95rem",
                                        whiteSpace: "nowrap",
                                        maxWidth: 160,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}
                                >
                                    {user?.FullName}
                                </Link>
                            </Box>
                        </Tooltip>

                    </Toolbar>
                </Container>
            </AppBar>

            <Drawer anchor="left" open={openDrawer} onClose={() => setOpenDrawer(false)}>
                {DrawerContent}
            </Drawer>
        </ThemeProvider>
    );
}

export default StudentHeader;