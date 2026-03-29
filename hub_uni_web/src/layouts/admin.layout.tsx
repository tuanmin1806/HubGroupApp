import { CorporateFare, Dashboard, Hail, Info, ManageAccounts, MenuBook, PermContactCalendar, Person, School } from "@mui/icons-material";
import { createTheme, GlobalStyles, Grid } from "@mui/material";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import AdminHeader from "../components/headers/admin.header";
import { AppProvider, type NavigationItem } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";

const NAVIGATION: NavigationItem[] = [
    {
        kind: "header",
        title: "Danh mục",
    },
    {
        segment: "admin",
        title: "Trang chủ",
        icon: <Dashboard />,
    },
    {
        title: "Quản lý tuyển sinh",
        icon: <School />,
        children: [
            {
                segment: "admin/manage-recruitment-post",
                title: "Quản lý chương trình",
                icon: <MenuBook />,
            },
            {
                segment: "admin/manage-application",
                title: "Quản lý ứng viên",
                icon: <PermContactCalendar fontSize="medium" />,
            },
        ],
    },
    {
        segment: "admin/manage-staff-account",
        title: "Quản lý nhân viên",
        icon: <ManageAccounts />,
    },
    {
        title: "Thông tin chung",
        icon: <Info />,
        children: [
            {
                segment: "admin/organization-info",
                title: "Thông tin trường",
                icon: <CorporateFare />,
            },
            {
                segment: "admin/personal-information",
                title: "Thông tin tài khoản",
                icon: <Person />,
            },
        ],
    },
];

const theme = createTheme({
    palette: {
        mode: "light",
    },
});

const getPageTitle = (pathname: string, schoolName?: string) => {
    const name = schoolName || "trường";
    switch (pathname) {
        case "/admin":
            return `Quản lý thông tin ${name} | duhochan.hubgroup.vn`;
        default:
            return `Quản lý thông tin ${name} | duhochan.hubgroup.vn`;
    }
};

export default function AdminLayout() {
    const { user } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const schoolName = user?.OrganizationName;
        document.title = getPageTitle(location.pathname, schoolName);
    }, [location.pathname, user]);

    const router = {
        pathname: location.pathname,
        searchParams: new URLSearchParams(location.search),
        navigate: (path: string | URL) => { navigate(`/${path}`); },
    };

    return (
        <AppProvider
            navigation={NAVIGATION}
            theme={theme}
            router={router}

        >
            <GlobalStyles
                styles={{
                    'nav .MuiListItemButton-root:has(+ .MuiCollapse-root) .MuiListItemText-primary': {
                        fontSize: '0.9rem',
                    },
                    'nav .MuiCollapse-root .MuiListItemText-primary': {
                        fontSize: '0.9rem',
                    },
                }}
            />
            <DashboardLayout>
                <div style={{ padding: "3px 6px" }}>
                    <AdminHeader />
                    <Grid container spacing={1}>
                        <Grid size={12} sx={{ mt: 1 }}>
                            <Outlet />
                        </Grid>
                    </Grid>
                </div>
            </DashboardLayout>
        </AppProvider>
    );
}