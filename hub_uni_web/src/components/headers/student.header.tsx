import { Close, MenuOutlined, Person3, TableBar } from "@mui/icons-material";
import { AppBar, Box, Container, createTheme, Drawer, IconButton, Link, List, ListItem, ListItemButton, ListItemText, MenuItem, ThemeProvider, Toolbar, Tooltip, Typography, useMediaQuery, Menu } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../app/store";
import { useSelector } from "react-redux";

const theme = createTheme({
    palette: {
        primary: {
            main: "#f36730",
        },
        secondary: {
            main: "#ffff",
        },
    },
});

function StudentHeader() {
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [openDrawer, setOpenDrawer] = useState(false);
    const { user } = useSelector((state: RootState) => state.auth);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [openProfileDialog, setOpenProfileDialog] = React.useState(false);

    const handleSignOut = async () => {
        navigate("/sign-out");
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleNavigateArticle = () => {
        navigate("/danh-sach-bai-viet");
    }

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpenDrawer(newOpen);
    };

    const DrawerList = (
        <Box
            sx={{
                width: { xs: '90vw', md: 400 },
                p: { xs: 1, md: 2 },
                position: 'relative',
            }}
            role="presentation"
        >
            {/* Close Icon for mobile */}
            <IconButton
                onClick={toggleDrawer(false)}
                sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    visibility: { xs: 'visible', md: 'hidden' },
                    zIndex: 1,
                    bgcolor: 'white',
                    boxShadow: 1,
                    '&:hover': {
                        bgcolor: 'grey.100',
                    },
                }}
                aria-label="close drawer"
            >
                <Close />
            </IconButton>

            <Typography
                variant="h6"
                sx={{
                    textAlign: 'center',
                    mt: 2,
                    fontSize: { xs: '1.25rem', md: '1.5rem' },
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    letterSpacing: { xs: '.1rem', md: '.3rem' },
                }}
            >
                GUEST
            </Typography>

            <List>
                <ListItem disablePadding>
                    <ListItemButton
                        onClick={() => {
                            navigate("/");
                            toggleDrawer(false)();
                        }}
                    >
                        <ListItemText
                            primary="Trang Chủ"
                            primaryTypographyProps={{
                                fontSize: { xs: '0.875rem', md: '1rem' },
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                            }}
                        />
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton
                        onClick={() => {
                            navigate("/");
                            toggleDrawer(false)();
                        }}
                    >
                        <ListItemText
                            primary="Trang Chủ"
                            primaryTypographyProps={{
                                fontSize: { xs: '0.875rem', md: '1rem' },
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                            }}
                        />
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton
                        onClick={() => {
                            navigate("/");
                            toggleDrawer(false)();
                        }}
                    >
                        <ListItemText
                            primary="Trang Chủ"
                            primaryTypographyProps={{
                                fontSize: { xs: '0.875rem', md: '1rem' },
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                            }}
                        />
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton
                        onClick={() => {
                            navigate("/");
                            toggleDrawer(false)();
                        }}
                    >
                        <ListItemText
                            primary="Trang Chủ"
                            primaryTypographyProps={{
                                fontSize: { xs: '0.875rem', md: '1rem' },
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                            }}
                        />
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton
                        onClick={() => {
                            navigate("/");
                            toggleDrawer(false)();
                        }}
                    >
                        <ListItemText
                            primary="Trang Chủ"
                            primaryTypographyProps={{
                                fontSize: { xs: '0.875rem', md: '1rem' },
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                            }}
                        />
                    </ListItemButton>
                </ListItem>

            </List>
        </Box>
    );

    return (
        <ThemeProvider theme={theme}>
            <AppBar position="fixed">
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        {/* Hamburger Menu for xs */}
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            onClick={toggleDrawer(true)}
                            sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }}
                        >
                            <MenuOutlined fontSize={isMobile ? "medium" : "large"} />
                        </IconButton>

                        {/* Logo */}
                        <TableBar
                            onClick={() => navigate("/")}
                            sx={{
                                cursor: "pointer",
                                display: { xs: "flex", md: "flex" },
                                mr: { xs: 1, md: 1 },
                                fontSize: { xs: "1.5rem", md: "2rem" },
                            }}
                        />
                        {/* Title */}
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            href="#!"
                            onClick={() => navigate("/")}
                            sx={{
                                mr: 2,
                                display: { xs: "flex", md: "flex" },
                                fontFamily: "monospace",
                                fontWeight: 700,
                                letterSpacing: { xs: ".1rem", md: ".3rem" },
                                color: "inherit",
                                textDecoration: "none",
                                fontSize: { xs: "1rem", md: "1.25rem" },
                            }}
                        >
                            GUEST
                        </Typography>

                        {/* Navigation Links */}
                        <Box
                            sx={{
                                flexGrow: 1,
                                display: { xs: "none", md: "flex" },
                                flexDirection: "row",
                                justifyContent: "flex-start",
                                alignItems: "center",
                                gap: { xs: 1, md: 3 },
                            }}
                        >
                            <Link
                                sx={{
                                    ml: { xs: 1, md: 3 },
                                    textAlign: "center",
                                    textTransform: "uppercase",
                                    fontWeight: "bold",
                                    fontSize: { xs: "0.75rem", md: "0.875rem" },
                                }}
                                component="button"
                                color="inherit"
                                variant="body2"
                                underline="hover"
                                onClick={() => navigate("/")}
                            >
                                Danh sách tổ chức
                            </Link>
                            <Link
                                sx={{
                                    ml: { xs: 1, md: 3 },
                                    textAlign: "center",
                                    textTransform: "uppercase",
                                    fontWeight: "bold",
                                    fontSize: { xs: "0.75rem", md: "0.875rem" },
                                }}
                                component="button"
                                color="inherit"
                                variant="body2"
                                underline="hover"
                                onClick={() => navigate("/")}
                            >
                                Danh sách tổ chức
                            </Link>
                            <Link
                                sx={{
                                    ml: { xs: 1, md: 3 },
                                    textAlign: "center",
                                    textTransform: "uppercase",
                                    fontWeight: "bold",
                                    fontSize: { xs: "0.75rem", md: "0.875rem" },
                                }}
                                component="button"
                                color="inherit"
                                variant="body2"
                                underline="hover"
                                onClick={() => handleNavigateArticle()}
                            >
                                Bài viết
                            </Link>
                        </Box>

                        {/* Auth Links */}
                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="cài đặt">
                                <Box
                                    sx={{ display: "flex" }}
                                    style={{ cursor: "pointer" }}
                                    onClick={handleOpenUserMenu}
                                >
                                    <Person3 sx={{ p: 0, fontSize: { xs: 'medium', md: 'large' } }} />
                                    <Link
                                        sx={{
                                            ml: 1,
                                            textAlign: "center",
                                            fontWeight: "bold",
                                            fontSize: { xs: '0.875rem', md: '1rem' },
                                        }}
                                        component="button"
                                        color="inherit"
                                        variant="body1"
                                        underline="hover"
                                    >
                                        {user?.UserName}{" "}
                                    </Link>
                                </Box>
                            </Tooltip>
                            <Menu
                                sx={{ mt: "45px" }}
                                id="menu-appbar"
                                anchorOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                <MenuItem onClick={handleCloseUserMenu}>
                                    <Typography
                                        sx={{ textAlign: "center" }}
                                        onClick={() =>
                                            setOpenProfileDialog(true)
                                        }
                                    >
                                        Thông tin tài khoản
                                    </Typography>
                                </MenuItem>
                                <MenuItem onClick={handleSignOut}>
                                    <Typography sx={{ textAlign: "center" }}>
                                        Đăng xuất
                                    </Typography>
                                </MenuItem>
                            </Menu>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            {/* Drawer for xs */}
            <Drawer
                anchor="left"
                open={openDrawer}
                onClose={toggleDrawer(false)}
            >
                {DrawerList}
            </Drawer>
        </ThemeProvider>
    );
}

export default StudentHeader;