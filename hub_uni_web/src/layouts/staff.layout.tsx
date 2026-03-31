import CorporateFare from "@mui/icons-material/CorporateFare";
import Dashboard from "@mui/icons-material/Dashboard";
import Info from "@mui/icons-material/Info";
import MenuBook from "@mui/icons-material/MenuBook";
import Person from "@mui/icons-material/Person";
import School from "@mui/icons-material/School";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Logout from "@mui/icons-material/Logout";
import Person3 from "@mui/icons-material/Person3";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import { createTheme } from "@mui/material/styles";
import GlobalStyles from "@mui/material/GlobalStyles";
import Grid from "@mui/material/Grid";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AppProvider, type NavigationItem } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import LogoImage from "../assets/hub_logo.png";
import { ConvertService } from "../app/services/convert.service";

const theme = createTheme({ palette: { mode: "light" } });

const GLOBAL_STYLES = {
    ".MuiAppBar-root": {
        backgroundColor: "#1975d1 !important",
        color: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    },
    ".MuiToolbar-root": {
        minHeight: "64px !important",
        paddingLeft: "8px !important",
        paddingRight: "12px !important",
        display: "flex",
        alignItems: "center",
    },
    ".MuiToolbar-root .MuiIconButton-root": {
        marginRight: "25px",
        marginLeft: "8px",
        color: "#fff",
    },
    ".MuiToolbar-root .MuiIconButton-root:hover": {
        backgroundColor: "rgba(255,255,255,0.15)",
    },
} as const;

const NAVIGATION: NavigationItem[] = [
    { kind: "header", title: "Danh mục" },
    { segment: "staff", title: "Trang chủ", icon: <Dashboard /> },
    {
        title: "Quản lý tuyển sinh",
        icon: <School />,
        children: [
            {
                segment: "staff/manage-recruitment-post",
                title: "Quản lý chương trình tuyển sinh",
                icon: <MenuBook />,
            },
        ],
    },
    {
        title: "Thông tin chung",
        icon: <Info />,
        children: [
            {
                segment: "staff/organization-info",
                title: "Thông tin trường",
                icon: <CorporateFare />,
            },
            {
                segment: "staff/personal-information",
                title: "Thông tin tài khoản",
                icon: <Person />,
            },
        ],
    },
];

function buildPageTitle(schoolName?: string): string {
    const name = schoolName || "trường";
    return `Quản lý thông tin ${name} | duhochan.hubgroup.vn`;
}

function CustomToolbarAccount() {
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.auth.user);
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

    const handleOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);
    const handleSignOut = () => navigate("/sign-out");

    const accountTypeLabel = ConvertService.convertAccountType(ConvertService.convertAccountTypeFromString(user?.AccountType));

    return (
        <Box sx={{ flexShrink: 0 }}>
            <Tooltip title="Cài đặt tài khoản">
                <Box
                    onClick={handleOpen}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: { xs: 0.5, sm: 1.2 },
                        cursor: "pointer",
                        px: { xs: 0.5, sm: 1 },
                        py: 0.5,
                        borderRadius: 2,
                        transition: "background-color .25s ease",
                        "&:hover": { backgroundColor: "rgba(255,255,255,0.15)" },
                    }}
                >
                    <Avatar
                        src={user?.AvatarFullUrl ?? undefined}
                        sx={{
                            width: { xs: 34, sm: 38, md: 42 },
                            height: { xs: 34, sm: 38, md: 42 },
                            fontSize: { xs: 14, sm: 16 },
                        }}
                    >
                        {user?.AvatarFullUrl ? null : (user?.FullName?.[0] ?? <Person3 />)}
                    </Avatar>

                    <Stack spacing={0} sx={{ display: { xs: "none", md: "flex" }, maxWidth: 160 }}>
                        <Typography noWrap sx={{ fontWeight: 600, fontSize: "0.9rem", color: "white", lineHeight: 1.2 }}>
                            {user?.FullName}
                        </Typography>
                        <Typography noWrap sx={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.75)" }}>
                            {accountTypeLabel}
                        </Typography>
                    </Stack>
                </Box>
            </Tooltip>

            <Menu
                sx={{ mt: "45px" }}
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={handleClose}>
                    <AccountCircle sx={{ mr: 1 }} />
                    <Typography>Thông tin tài khoản</Typography>
                </MenuItem>
                <MenuItem onClick={handleSignOut}>
                    <Logout sx={{ mr: 1, color: "error.main" }} />
                    <Typography color="error.main">Đăng xuất</Typography>
                </MenuItem>
            </Menu>
        </Box>
    );
}

function CustomAppTitle() {
    const navigate = useNavigate();
    const organizationName = useSelector((state: RootState) => state.auth.user?.OrganizationName);

    return (
        <Box
            onClick={() => navigate("/staff")}
            sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                gap: { xs: 1, md: 1.5 },
                overflow: "hidden",
                flex: 1,
                minWidth: 0,
            }}
        >
            <Box
                component="img"
                src={LogoImage}
                alt="logo"
                sx={{ height: { xs: 32, sm: 38, md: 42 }, objectFit: "contain", flexShrink: 0 }}
            />

            <Stack spacing={0} sx={{ overflow: "hidden", minWidth: 0 }}>
                <Typography
                    noWrap
                    sx={{
                        fontSize: { xs: "0.75rem", sm: "0.9rem", md: "1.05rem" },
                        fontWeight: 600,
                        lineHeight: 1.2,
                        textTransform: "uppercase",
                        color: "white",
                    }}
                >
                    Quản lý thông tin trường
                </Typography>

                {organizationName && (
                    <Typography
                        noWrap
                        sx={{
                            fontSize: { xs: "0.65rem", sm: "0.75rem" },
                            opacity: 0.8,
                            color: "white",
                            display: { xs: "none", sm: "block" },
                        }}
                    >
                        {organizationName}
                    </Typography>
                )}
            </Stack>
        </Box>
    );
}

export default function StaffLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const organizationName = useSelector((state: RootState) => state.auth.user?.OrganizationName);

    useEffect(() => {
        document.title = buildPageTitle(organizationName);
    }, [location.pathname, organizationName]);

    const router = {
        pathname: location.pathname,
        searchParams: new URLSearchParams(location.search),
        navigate: (path: string | URL) => navigate(`/${path}`),
    };

    return (
        <AppProvider navigation={NAVIGATION} theme={theme} router={router}>
            <GlobalStyles styles={GLOBAL_STYLES} />
            <DashboardLayout
                slots={{
                    appTitle: CustomAppTitle,
                    toolbarAccount: CustomToolbarAccount,
                }}
            >
                <Box sx={{ p: { xs: 1, md: 1.5 } }}>
                    <Grid container spacing={1}>
                        <Grid size={12} sx={{ mt: 1 }}>
                            <Outlet />
                        </Grid>
                    </Grid>
                </Box>
            </DashboardLayout>
        </AppProvider>
    );
}