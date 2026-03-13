import { Add, ChangeCircle, Clear, Edit, Search, Visibility } from "@mui/icons-material";
import { Grid, IconButton, InputBase, Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Chip, Tooltip, TablePagination, Button, CircularProgress, Box, Typography, Avatar } from "@mui/material";
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { CustomerResponse, CustomerFilterParams } from "../../app/models/customer.model";
import { useGetCustomerByOrganizationWithPageQuery } from "../../app/features/customer.api";
import { ConvertService } from "../../app/services/convert.service";
import { getUserInfo } from "../../app/services/auth.service";
import { AccountStatus } from "../../app/models/enums.model";
import CreateCustomerAccountDialog from "../../components/dialogs/staff/create-customer-account.dialog";
import UpdateCustomerAccountDialog from "../../components/dialogs/staff/update-customer-account.dialog";

export default function ManageStaffAccountPage() {
    const [inputValue, setInputValue] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [openDialog, setOpenDialog] = useState(false);
    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
    const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
    const navigate = useNavigate();

    const userInfo = getUserInfo();
    const organizationId = userInfo?.OrganizationId ?? "";

    const queryParams: CustomerFilterParams = {
        page: page + 1,
        size: rowsPerPage,
        organizationId,
    };

    const { data, isLoading, isError } = useGetCustomerByOrganizationWithPageQuery(queryParams, { skip: !organizationId });

    const handleSearch = useCallback(() => {
        setSearchValue(inputValue);
        setPage(0);
    }, [inputValue]);

    const handleClearSearch = useCallback(() => {
        setInputValue("");
        setSearchValue("");
        setPage(0);
    }, []);

    const handleOpenUpdate = useCallback((id: string) => {
        setSelectedCustomerId(id);
        setOpenUpdateDialog(true);
    }, []);

    const handlePageChange = useCallback((_: unknown, newPage: number) => { setPage(newPage); }, []);

    const handleRowsPerPageChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }, []);

    const renderTableContent = () => {
        if (isLoading) { return (<TableRow> <TableCell colSpan={8} align="center"><Box sx={{ py: 4 }}><CircularProgress size={32} /></Box> </TableCell></TableRow>); }
        if (isError) { return (<TableRow> <TableCell colSpan={8} align="center"> <Typography color="error" sx={{ py: 4 }}>Đã xảy ra lỗi khi tải dữ liệu.</Typography></TableCell></TableRow>); }
        if (!data?.Items?.length) { return (<TableRow><TableCell colSpan={8} align="center"><Typography sx={{ py: 4 }}>Không có dữ liệu.</Typography></TableCell></TableRow>); }

        return data.Items.map((staff: CustomerResponse) => (
            <TableRow
                key={staff.Id}
                hover
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
                <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Avatar
                            src={staff.AvatarFullUrl}
                            alt={staff.FullName}
                            sx={{ width: 32, height: 32, fontSize: 14 }}
                        >
                            {staff.FullName?.charAt(0)}
                        </Avatar>
                        <Box>
                            <Typography variant="body2" fontWeight={500}>{staff.FullName}</Typography>
                            <Typography variant="caption" color="text.secondary">{staff.UserName}</Typography>
                        </Box>
                    </Box>
                </TableCell>
                <TableCell>{staff.Email ?? "—"}</TableCell>
                <TableCell>{staff.PhoneNumber ?? "—"}</TableCell>
                <TableCell>{ConvertService.convertGender(ConvertService.convertGenderFromString(staff.Gender))}</TableCell>
                <TableCell><Chip label={ConvertService.convertAccountStatus(ConvertService.convertAccountStatusFromString(staff.AccountStatus))} size="small" color={ConvertService.convertAccountStatusFromString(staff.AccountStatus) === AccountStatus.Activated ? "success" : staff.AccountStatus === AccountStatus.Locked ? "error" : "default"} variant="outlined" />
                </TableCell>
                <TableCell align="center">
                    <Tooltip title="Xem chi tiết"><IconButton size="small" color="primary"><Visibility fontSize="small" /></IconButton></Tooltip>
                    <Tooltip title="Chỉnh sửa"><IconButton size="small" color="primary" onClick={() => handleOpenUpdate(staff.Id)}><Edit fontSize="small" /></IconButton></Tooltip>
                    <Tooltip title="Thay đổi trạng thái"><IconButton size="small" color="error"><ChangeCircle fontSize="small" /></IconButton></Tooltip>
                </TableCell>
            </TableRow>
        ));
    };

    return (
        <>
            <Grid container spacing={2}>
                <Grid size={6}>
                    <Paper sx={{ display: "flex", alignItems: "center" }}>
                        <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            placeholder="Tìm kiếm nhân viên"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        />
                        <IconButton onClick={handleClearSearch} sx={{ p: "10px" }} aria-label="clear"><Clear /></IconButton>
                        <IconButton onClick={handleSearch} sx={{ p: "10px" }} aria-label="search"><Search /></IconButton>
                    </Paper>
                </Grid>
                <Grid size="auto">
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Add />}
                        onClick={() => setOpenDialog(true)}
                    >
                        Thêm nhân viên
                    </Button>
                </Grid>
                <Grid size={12}>
                    <TableContainer component={Paper} elevation={1}>
                        <Table sx={{ minWidth: 650 }} size="small" aria-label="staff account table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Nhân viên</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Số điện thoại</TableCell>
                                    <TableCell>Giới tính</TableCell>
                                    <TableCell>Trạng thái</TableCell>
                                    <TableCell align="center">Tiện ích</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>{renderTableContent()}</TableBody>
                        </Table>
                        <TablePagination
                            component="div"
                            count={data?.Total ?? 0}
                            page={page}
                            onPageChange={handlePageChange}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={handleRowsPerPageChange}
                            rowsPerPageOptions={[5, 10, 25, 50]}
                            labelRowsPerPage="Số hàng:"
                        />
                    </TableContainer>
                </Grid>
            </Grid>
            <CreateCustomerAccountDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
            />
            <UpdateCustomerAccountDialog
                open={openUpdateDialog}
                customerId={selectedCustomerId}
                onClose={() => { setOpenUpdateDialog(false); setSelectedCustomerId(null); }}
            />
        </>
    );
}