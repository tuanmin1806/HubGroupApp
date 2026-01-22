import { Box, Grid } from "@mui/material";
import { Outlet } from "react-router-dom";
import AdminHeader from "../components/headers/admin.header";

const AdminLayout = () => {
    return (
        <>
            <Box>
                <Grid container >
                    <Grid size={12}>
                        <AdminHeader></AdminHeader>
                    </Grid>
                    <Grid size={12} >
                        <Outlet />
                    </Grid>
                </Grid >
            </Box>
        </>
    )
}
export default AdminLayout;