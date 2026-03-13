import { AddBox, CorporateFare, Dashboard, Info, ManageAccounts, ManageSearch, MenuBook, Person } from "@mui/icons-material";
import { createTheme, GlobalStyles, Grid } from "@mui/material";
import { AppProvider, NavigationItem } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import StaffHeader from "../components/headers/staff.header";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";

const NAVIGATION: NavigationItem[] = [
    {
        kind: "header",
        title: "Danh mục",
    },
    {
        segment: "/staff",
        title: "Trang chủ",
        icon: <Dashboard />,
    },
    {
        title: "Quản lý tuyển sinh",
        icon: <ManageSearch />,
        children: [
            {
                segment: "manage-recruitment-post",
                title: "Quản lý chương trình tuyển sinh",
                icon: <MenuBook />,
            },
            {
                segment: "create-recruitment-post",
                title: "Thêm chương trình tuyển sinh",
                icon: <AddBox />,
            },
        ],
    },
    {
        title: "Thông tin chung",
        icon: <Info />,
        children: [
            {
                segment: "personal-information",
                title: "Thông tin cá nhân",
                icon: <Person />,
            },
            {
                segment: "organization-info",
                title: "Thông tin tổ chức",
                icon: <CorporateFare />,
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
        case "/staff":
            return `Quản lý thông tin ${name} | duhochan.hubgroup.vn`;
        default:
            return `Quản lý thông tin ${name} | duhochan.hubgroup.vn`;
    }
};

export default function StaffLayout() {
    const { user } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const schoolName = user?.OrganizationName;
        document.title = getPageTitle(location.pathname, schoolName);
    }, [location.pathname, user]);

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