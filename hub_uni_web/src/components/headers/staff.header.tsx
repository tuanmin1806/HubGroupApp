import { AccountCircle, Logout, Person3 } from "@mui/icons-material";
import { AppBar, Avatar, Box, Container, Menu, MenuItem, Stack, Toolbar, Tooltip, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../app/store";
import { useSelector } from "react-redux";
import LogoImage from "../../assets/hub_logo.png"
import { ConvertService } from "../../app/services/convert.service";

function StaffHeader() {
    const navigate = useNavigate();
    const { user } = useSelector((state: RootState) => state.auth);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const handleOpenUserMenu = (event) => { setAnchorElUser(event.currentTarget); };
    const handleCloseUserMenu = () => { setAnchorElUser(null); };
    const handleSignOut = async () => { navigate("/sign-out"); };
    const organizationName = user?.OrganizationName || "";

    return (
        <>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar
                    disableGutters
                    sx={{
                        justifyContent: "space-between",
                        px: { xs: 1.5, sm: 2, md: 3 },
                        minHeight: { xs: 56, sm: 64 },
                    }}
                >
                    <Box
                        onClick={() => navigate("/staff")}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                            gap: 1,
                            overflow: "hidden",
                            flex: 1,
                            mr: 1,
                        }}
                    >
                        <img
                            src={LogoImage}
                            alt="logo"
                            style={{ height: 44, objectFit: "contain", flexShrink: 0, marginRight: 10 }}
                        />
                        <Stack spacing={0} sx={{ overflow: "hidden" }}>
                            <Typography
                                variant="h6"
                                noWrap
                                sx={{
                                    fontSize: { xs: "0.85rem", sm: "1rem", md: "1.15rem" },
                                    lineHeight: 1.2,
                                }}
                            >
                                Quản lý bài tuyển sinh
                            </Typography>

                            <Typography
                                variant="subtitle1"
                                noWrap
                                sx={{
                                    fontSize: { xs: "0.7rem", sm: "0.75rem" },
                                    display: { xs: "none", sm: "block" },
                                }}
                            >
                                {organizationName}
                            </Typography>
                        </Stack>
                    </Box>

                    <Box sx={{ flexShrink: 0 }}>
                        <Tooltip title="Cài đặt">
                            <Box
                                onClick={handleOpenUserMenu}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: { xs: 0.75, sm: 1.5 },
                                    cursor: "pointer",
                                    px: { xs: 0.75, sm: 1 },
                                    py: 0.5,
                                    borderRadius: 2,
                                    transition: "all .2s",
                                    "&:hover": { backgroundColor: "#1a9bf1" },
                                }}
                            >
                                <Avatar sx={{ width: { xs: 32, sm: 38 }, height: { xs: 32, sm: 38 } }}>
                                    <Person3 />
                                </Avatar>

                                <Stack
                                    spacing={0}
                                    sx={{ display: { xs: "none", sm: "flex" } }}
                                >
                                    <Typography variant="body1" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                                        {user?.UserName}
                                    </Typography>
                                    <Typography variant="caption">
                                        {ConvertService.convertAccountType(ConvertService.convertAccountTypeFromString(user?.AccountType))}
                                    </Typography>
                                </Stack>
                            </Box>
                        </Tooltip>

                        <Menu
                            sx={{ mt: "45px" }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{ vertical: "top", horizontal: "right" }}
                            keepMounted
                            transformOrigin={{ vertical: "top", horizontal: "right" }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            <MenuItem onClick={handleCloseUserMenu}>
                                <AccountCircle sx={{ mr: 1, fontSize: 20 }} />
                                <Typography>Thông tin tài khoản</Typography>
                            </MenuItem>
                            <MenuItem onClick={handleSignOut}>
                                <Logout sx={{ mr: 1, fontSize: 20, color: "red" }} />
                                <Typography sx={{ color: "red" }}>Đăng xuất</Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>
        </>
    );
}
export default StaffHeader;