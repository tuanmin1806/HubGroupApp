import { Person3, TableBar } from "@mui/icons-material";
import { AppBar, Box, Container, Link, Menu, MenuItem, Toolbar, Tooltip, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../app/store";
import { useSelector } from "react-redux";

function StaffHeader() {
    const navigate = useNavigate();
    const { user } = useSelector((state: RootState) => state.auth);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleSignOut = async () => {
        navigate("/sign-out");
    };

    return (
        <>
            <AppBar
                position="fixed"
                sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
            >
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <TableBar
                            onClick={() => navigate("/staff")}
                            sx={{
                                cursor: "pointer",
                                display: { xs: "none", md: "flex" },
                                mr: 1,
                            }}
                        />
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            href="/staff"
                            sx={{
                                mr: 2,
                                display: { xs: "none", md: "flex" },
                                fontFamily: "monospace",
                                fontWeight: 700,
                                letterSpacing: ".3rem",
                                color: "inherit",
                                textDecoration: "none",
                            }}
                        >
                            HUBUNI QUẢN LÝ BÀI ĐĂNG
                        </Typography>
                        <Box
                            sx={{
                                flexGrow: 1,
                                display: { xs: "none", md: "flex" },
                            }}
                        ></Box>
                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="cài đặt">
                                <Box
                                    sx={{ display: "flex" }}
                                    style={{ cursor: "pointer" }}
                                    onClick={handleOpenUserMenu}
                                >
                                    <Person3 sx={{ p: 0 }}> </Person3>

                                    <Link
                                        sx={{
                                            ml: 1,
                                            textAlign: "center",
                                            fontWeight: "bold",
                                        }}
                                        component="button"
                                        color="inherit"
                                        variant="body1"
                                        underline="hover"
                                    >
                                        NHÂN VIÊN | {user?.UserName}{" "}
                                    </Link>
                                </Box>
                            </Tooltip>
                            <Menu
                                sx={{ mt: "45px" }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
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
        </>
    );
}
export default StaffHeader;