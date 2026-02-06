import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Person3Icon from "@mui/icons-material/Person3";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider, useMediaQuery, IconButton, Drawer, List, ListItem, ListItemText, ListItemButton } from "@mui/material";
import Link from "@mui/material/Link";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TableBar } from "@mui/icons-material";

const theme = createTheme({
    palette: {
        primary: {
            main: "#f8f8f8",
        },
        secondary: {
            main: "#ffff",
        },
    },
});

function GuestHeader() {
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [openDrawer, setOpenDrawer] = useState(false);

    const handleNavigateLogin = () => {
        navigate("/dang-nhap");
    }

    const handleNavigateSignUp = () => {
        navigate("/dang-ky");
    }

    const handleNavigateArticle = () => {
        navigate("/danh-sach-bai-viet");
    }

    const handleNavigateOrganization = () => {
        navigate("/tim-kiem-to-chuc");
    }

    const handleNavigateRecruitmentPost = () => {
        navigate("/tin-tuyen-sinh");
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
                <CloseIcon />
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
                        onClick={handleNavigateOrganization}
                    >
                        <ListItemText
                            primary="Tổ chức"
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
                            primary="Tin tuyển sinh"
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
                                onClick={handleNavigateOrganization}
                            >
                                Tổ chức
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
                                Tin tuyển sinh
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

export default GuestHeader;