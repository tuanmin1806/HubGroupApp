import { Dashboard, FactCheck, HourglassTop, ManageSearch, MenuBook, RamenDining, TableRestaurant } from "@mui/icons-material";
import { createTheme, Grid } from "@mui/material";
import { AppProvider, NavigationItem } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import StaffHeader from "../components/headers/staff.header";

const NAVIGATION: NavigationItem[] = [
    {
        kind: "header",
        title: "Tiện ích chính",
    },
    {
        segment: "staff",
        title: "Trang chủ",
        icon: <Dashboard />,
    },
    {
        segment: "staff/manage-order",
        title: "Quản lý bài đăng",
        icon: <RamenDining />,
        children: [
            {
                segment: "in-progress",
                title: "Quản lý bài đăng",
                icon: <MenuBook />,
            },
            {
                segment: "history",
                title: "Quản lý bài đăng",
                icon: <ManageSearch />,
            },
        ],
    },
    {
        segment: "staff/manage-reservation",
        title: "Quản lý bài đăng",
        icon: <TableRestaurant />,
        children: [
            {
                segment: "pending",
                title: "Quản lý bài đăng",
                icon: <HourglassTop />,
            },
            {
                segment: "completed",
                title: "Quản lý bài đăng",
                icon: <FactCheck />,
            },
        ],
    },

];

const theme = createTheme({
    palette: {
        mode: "light",
    },
});

const getPageTitle = (pathname) => {
    switch (pathname) {
        case "/staff":
            return "Trang chủ | Nhân viên";
        default:
            return "Staff | HUB UNI";
    }
};

export default function StaffLayout() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        document.title = getPageTitle(location.pathname);
    }, [location.pathname]);

    const handleNavigation = (path) => {
        navigate(path);
    };

    const router = {
        pathname: location.pathname,
        searchParams: new URLSearchParams(location.search),
        navigate: handleNavigation,
    };

    return (
        <AppProvider
            navigation={NAVIGATION}
            theme={theme}
            router={router}
        >
            <DashboardLayout>
                <div style={{ padding: "8px 16px" }}>
                    <StaffHeader />
                    <Grid container spacing={1}>
                        <Grid size={12} sx={{ mt: 2 }}>
                            <Outlet />
                        </Grid>
                    </Grid>
                </div>
            </DashboardLayout>
        </AppProvider>
    );
}