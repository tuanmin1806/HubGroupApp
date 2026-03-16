import { Person3 } from "@mui/icons-material";
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

    return (
        <>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, }}>
                <Toolbar disableGutters sx={{ justifyContent: "space-between", px: 3 }}>
                    <Box
                        onClick={() => navigate("/staff")}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                            gap: 1.5
                        }}
                    >
                        <img
                            src={LogoImage}
                            alt="logo"
                            style={{ height: 36, objectFit: "contain" }}
                        />

                        <Typography
                            variant="h6"
                            sx={{ fontWeight: 700, letterSpacing: 1 }}
                        >
                            Quản lý bài tuyển sinh
                        </Typography>
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="cài đặt">
                            <Box
                                onClick={handleOpenUserMenu}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1.5,
                                    cursor: "pointer",
                                    px: 1,
                                    py: 0.5,
                                    borderRadius: 2,
                                    transition: "all .2s",
                                    "&:hover": {
                                        backgroundColor: "#1a9bf1"
                                    }
                                }}
                            >

                                <Avatar sx={{ width: 38, height: 38 }}> {<Person3 />} </Avatar>

                                <Stack spacing={0}>
                                    <Typography variant="body1" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                                        {user?.UserName}
                                    </Typography>

                                    <Typography variant="caption"> {ConvertService.convertAccountType(ConvertService.convertAccountTypeFromString(user?.AccountType))} </Typography>
                                </Stack>

                            </Box>
                        </Tooltip>
                        <Menu
                            sx={{ mt: "45px" }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{ vertical: "top", horizontal: "right", }}
                            keepMounted
                            transformOrigin={{ vertical: "top", horizontal: "right", }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            <MenuItem onClick={handleCloseUserMenu}><Typography sx={{ textAlign: "center" }}> Thông tin tài khoản </Typography></MenuItem>
                            <MenuItem onClick={handleSignOut}><Typography sx={{ textAlign: "center" }}> Đăng xuất </Typography></MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>
        </>
    );
}
export default StaffHeader;