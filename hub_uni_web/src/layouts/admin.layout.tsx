import { Dashboard, People } from "@mui/icons-material";
import { createTheme, Grid } from "@mui/material";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import AdminHeader from "../components/headers/admin.header";
import { AppProvider, type NavigationItem } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";

const NAVIGATION: NavigationItem[] = [
    {
        kind: "header",
        title: "Tiện ích chính",
    },
    {
        kind: "page",
        segment: "admin",
        title: "Trang chủ",
        icon: <Dashboard />,
    },
    {
        kind: "page",
        segment: "admin",
        title: "Quản lý tài khoản",
        children: [
            {
                kind: "page",
                segment: "manage-staff-accounts",
                title: "Tài khoản nhân viên",
                icon: <People />,
            },
            {
                kind: "page",
                segment: "manage-customer-accounts",
                title: "Tài khoản khách hàng",
                icon: <People />,
            },
        ],
    },
];

const theme = createTheme({
    palette: {
        mode: "light",
    },
});

const getPageTitle = (pathname?: string) => {
    switch (pathname) {
        case "/admin":
            return "Trang chủ";
        default:
            return "Admin";
    }
};

export default function AdminLayout() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        document.title = getPageTitle(location.pathname);
    }, [location.pathname]);

    const handleNavigation = (path: string | URL) => {
        if (typeof path === "string") {
            navigate(path);
        } else {
            navigate(path.pathname + path.search);
        }
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
                    <AdminHeader />
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