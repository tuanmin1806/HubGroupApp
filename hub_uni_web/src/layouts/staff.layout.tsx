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
        segment: "/staff",
        title: "Trang chủ",
        icon: <Dashboard />,
    },
    {
        title: "Quản lý bài đăng",
        icon: <RamenDining />,
        children: [
            {
                segment: "manage-recruitment-post",
                title: "Danh sách bài đăng",
                icon: <MenuBook />,
            },
            {
                segment: "create-recruitment-post",
                title: "Tạo bài đăng mới",
                icon: <ManageSearch />,
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
            return "Nền tảng tra cứu thông tin du học Hàn Quốc số 1 Việt Nam | duhochan.hubgroup.vn";
    }
};

export default function StaffLayout() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        document.title = getPageTitle(location.pathname);
    }, [location.pathname]);

    const handleNavigation = (path) => {
        navigate(`/staff/${path}`);
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