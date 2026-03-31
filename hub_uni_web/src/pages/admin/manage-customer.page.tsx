import { lazy } from "react";
import Add from "@mui/icons-material/Add";
import Clear from "@mui/icons-material/Clear";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import Search from "@mui/icons-material/Search";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import TablePagination from "@mui/material/TablePagination";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { useState, useCallback } from "react";
import { CustomerResponse, CustomerFilterParams } from "../../app/models/customer.model";
import { useDeleteCustomerMutation, useGetCustomerByOrganizationWithPageQuery } from "../../app/features/customer.api";
import { ConvertService } from "../../app/services/convert.service";
import { getUserInfo } from "../../app/services/auth.service";
import { AccountStatus, AccountType } from "../../app/models/enums.model";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { showSnackbar } from "../../app/features/snackbar/snackbar.slice";
import { isSelf } from "../../utils/auth.utils";
const CreateCustomerAccountDialog = lazy(() => import("../../components/dialogs/admin/create-customer-account.dialog"));
const UpdateCustomerAccountDialog = lazy(() => import("../../components/dialogs/admin/update-customer-account.dialog"));
const ConfirmDialog = lazy(() => import("../../components/dialogs/general/confirm.dialog"));

const getAccountTypeColor = (accountType: AccountType): "default" | "primary" | "secondary" | "success" | "warning" | "error" | "info" => {
    switch (accountType) {
        case AccountType.Manager: return "primary";
        case AccountType.Collaborator: return "success";
        case AccountType.Admin: return "error";
        case AccountType.SuperAdmin: return "error";
        case AccountType.Student: return "info";
        default: return "default";
    }
};

export default function ManageStaffAccountPage() {
    const [inputValue, setInputValue] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [openDialog, setOpenDialog] = useState(false);
    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
    const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
    const dispatch = useDispatch<AppDispatch>();

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteCustomerId, setDeleteCustomerId] = useState<string | null>(null);

    const userInfo = getUserInfo();
    const organizationId = userInfo?.OrganizationId ?? "";

    const queryParams: CustomerFilterParams = {
        page: page + 1,
        size: rowsPerPage,
        organizationId,
        searchValue: searchValue || undefined,
    };

    const { data, isLoading, isError } = useGetCustomerByOrganizationWithPageQuery(queryParams, { skip: !organizationId });
    const [deleteCustomer, { isLoading: isDeleting }] = useDeleteCustomerMutation();

    const handleOpenDelete = useCallback((id: string) => { setDeleteCustomerId(id); setOpenDeleteDialog(true); }, []);
    const handleCloseDelete = useCallback(() => { setOpenDeleteDialog(false); setDeleteCustomerId(null); }, []);

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

    const handleConfirmDelete = useCallback(async () => {
        if (!deleteCustomerId) return;
        try {
            await deleteCustomer(deleteCustomerId).unwrap();
            dispatch(showSnackbar({ message: "Xóa tài khoản thành công!", severity: "success" }));
            handleCloseDelete();
        } catch {
            dispatch(showSnackbar({ message: "Xóa tài khoản thất bại. Vui lòng thử lại!", severity: "error" }));
        }
    }, [deleteCustomerId, deleteCustomer, dispatch, handleCloseDelete]);

    const renderTableContent = () => {
        if (isLoading) { return (<TableRow><TableCell colSpan={8} align="center"><Box sx={{ py: 4 }}><CircularProgress size={32} /></Box></TableCell></TableRow>); }
        if (isError) { return (<TableRow><TableCell colSpan={8} align="center"> <Typography color="error" sx={{ py: 4 }}>Đã xảy ra lỗi khi tải dữ liệu.</Typography></TableCell></TableRow>); }
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
                <TableCell>
                    <Chip
                        label={ConvertService.convertAccountType(ConvertService.convertAccountTypeFromString(staff.AccountType))}
                        size="small"
                        color={getAccountTypeColor(ConvertService.convertAccountTypeFromString(staff.AccountType))}
                        variant="outlined"
                    />
                </TableCell>
                <TableCell>
                    <Chip label={ConvertService.convertAccountStatus(ConvertService.convertAccountStatusFromString(staff.AccountStatus))} size="small" color={ConvertService.convertAccountStatusFromString(staff.AccountStatus) === AccountStatus.Activated ? "success"
                        : ConvertService.convertAccountStatusFromString(staff.AccountStatus) === AccountStatus.NotActivated ? "warning"
                            : ConvertService.convertAccountStatusFromString(staff.AccountStatus) === AccountStatus.Locked ? "error" : "default"}
                        variant="filled"
                    />
                </TableCell>
                <TableCell align="center">
                    {isSelf(staff.Id) ? (
                        <Tooltip title="Không thể tự chỉnh sửa hoặc xóa tài khoản của chính mình">
                            <Typography variant="caption" color="text.disabled">—</Typography>
                        </Tooltip>
                    ) : (
                        <>
                            <Tooltip title="Chỉnh sửa">
                                <IconButton size="small" color="primary" onClick={() => handleOpenUpdate(staff.Id)}>
                                    <Edit fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Xóa">
                                <IconButton
                                    size="small"
                                    color="error"
                                    disabled={isDeleting && deleteCustomerId === staff.Id}
                                    onClick={() => handleOpenDelete(staff.Id)}
                                >
                                    {isDeleting && deleteCustomerId === staff.Id ? <CircularProgress size={16} color="error" /> : <Delete fontSize="small" />}
                                </IconButton>
                            </Tooltip>
                        </>
                    )}
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
                                    <TableCell>Loại tài khoản</TableCell>
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
            <ConfirmDialog
                open={openDeleteDialog}
                onClose={handleCloseDelete}
                onConfirm={handleConfirmDelete}
                title="Xác nhận xóa"
                message="Bạn có chắc chắn muốn xóa tài khoản nhân viên này không? Hành động này không thể hoàn tác."
            />
        </>
    );
}