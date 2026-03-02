import { Close, TableBar } from "@mui/icons-material";
import Person3Icon from "@mui/icons-material/Person3";
import MenuIcon from "@mui/icons-material/Menu";
import { AppBar, Box, Container, createTheme, Drawer, IconButton, Link, List, ListItem, ListItemButton, ListItemText, MenuItem, ThemeProvider, Toolbar, Tooltip, Typography, useMediaQuery, Menu, Button, Fade } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../app/store";
import { useSelector } from "react-redux";
import hub_logo from "../../assets/hub_logo.png";

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

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleNavigateArticle = () => {
        navigate("/bai-viet");
    }
    const handleNavigateAboutUs = () => {
        window.open("https://hubgroup.vn/ve-chung-toi", "_blank");
    };

    const handleNavigateContact = () => {
        window.open("https://hubgroup.vn/lien-he", "_blank");
    }

    const handleNavigateImageLibrary = () => {
        window.open("https://hubgroup.vn/thu-vien-anh", "_blank");
    }

    const handleNavigateImageOffice = () => {
        window.open("https://vanphong.hubgroup.vn/", "_blank");
    }
    const handleNavigateLogin = () => {
        navigate("/dang-nhap");
    }

    const handleNavigateSignUp = () => {
        navigate("/dang-ky");
    }

    const handleNavigateOrganization = () => {
        navigate("/tim-kiem-truong");
    }

    const handleNavigateRecruitmentPost = () => {
        navigate("/chuong-trinh-tuyen-sinh");
    }

    const handleClose = () => {
        setAnchorEl(null);
    };
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
                STUDENT
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
                        onClick={handleNavigateOrganization}
                    >
                        <ListItemText
                            primary="Danh sách trường"
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
                        onClick={handleNavigateRecruitmentPost}
                    >
                        <ListItemText
                            primary="Chương trình tuyển sinh"
                        />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <ThemeProvider theme={theme}>
            <AppBar position="fixed" sx={{
                color: '#242424',
                backgroundColor: '#fff'
            }}>
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
                            <MenuIcon fontSize={isMobile ? "medium" : "large"} />
                        </IconButton>

                        {/* Logo */}
                        <Box
                            component="img"
                            src={hub_logo}
                            alt="logo"
                            onClick={() => navigate("/")}
                            sx={{
                                cursor: "pointer",
                                display: { xs: "flex", md: "flex" },
                                mr: { xs: 1, md: 1 },
                                height: { xs: "1.5rem", md: "2rem" },
                                width: "auto",
                                objectFit: "contain",
                            }}
                        />
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
                                onClick={handleNavigateOrganization}
                            >
                                Danh sách trường
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
                                onClick={handleNavigateRecruitmentPost}
                            >
                                Chương trình tuyển sinh
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
                            <div>
                                <Button
                                    id="fade-button"
                                    aria-controls={open ? 'fade-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined}
                                    onClick={handleClick}
                                    sx={{
                                        ml: { xs: 1, md: 3 },
                                        textAlign: "center",
                                        textTransform: "uppercase",
                                        fontWeight: "bold",
                                        fontSize: { xs: "0.75rem", md: "0.875rem" },
                                        color: "inherit",
                                        background: "none",
                                    }}
                                >
                                    Về HUBGROUP
                                </Button>
                                <Menu
                                    id="fade-menu"
                                    slotProps={{
                                        list: {
                                            'aria-labelledby': 'fade-button',
                                        },
                                    }}
                                    slots={{ transition: Fade }}
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                >
                                    <MenuItem onClick={handleNavigateAboutUs}>Giới thiệu</MenuItem>
                                    <MenuItem onClick={handleNavigateContact}>Liên hệ</MenuItem>
                                    <MenuItem onClick={handleNavigateImageLibrary}>Thư viện ảnh</MenuItem>
                                    <MenuItem onClick={handleNavigateImageOffice}>Văn phòng HUBGROUP</MenuItem>
                                </Menu>
                            </div>
                        </Box>

                        {/* Auth Links */}
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: { xs: 0.5, md: 1 },
                            }}
                        >
                            <Person3Icon
                                sx={{
                                    p: 0,
                                    fontSize: { xs: "1.25rem", md: "1.5rem" },
                                }}
                            />
                            <Link
                                sx={{
                                    ml: 1,
                                    textAlign: "center",
                                    fontWeight: "bold",
                                    fontSize: { xs: "0.75rem", md: "1rem" },
                                }}
                                component="button"
                                color="inherit"
                                variant="body1"
                                underline="hover"
                                onClick={() => handleNavigateLogin()}
                            >
                                Đăng nhập
                            </Link>
                            <Typography
                                sx={{
                                    ml: 1,
                                    textAlign: "center",
                                    fontSize: { xs: "0.75rem", md: "1rem" },
                                }}
                            >
                                /
                            </Typography>
                            <Link
                                sx={{
                                    ml: 1,
                                    textAlign: "center",
                                    fontWeight: "bold",
                                    fontSize: { xs: "0.75rem", md: "1rem" },
                                }}
                                component="button"
                                color="inherit"
                                variant="body1"
                                underline="hover"
                                onClick={() => handleNavigateSignUp()}
                            >
                                Đăng ký
                            </Link>
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