import * as React from "react";
import { lazy, useState, useCallback } from "react";
import Add from "@mui/icons-material/Add";
import Clear from "@mui/icons-material/Clear";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import Search from "@mui/icons-material/Search";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUp from "@mui/icons-material/KeyboardArrowUp";
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
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
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

function DetailField({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="caption" color="text.secondary" display="block" mb={0.3}>
                {label}
            </Typography>
            {children}
        </Grid>
    );
}

interface StaffRowProps {
    staff: CustomerResponse;
    isDeleting: boolean;
    deleteCustomerId: string | null;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

function StaffRow({ staff, isDeleting, deleteCustomerId, onEdit, onDelete }: StaffRowProps) {
    const [open, setOpen] = useState(false);

    const accountType = ConvertService.convertAccountTypeFromString(staff.AccountType);
    const accountStatus = ConvertService.convertAccountStatusFromString(staff.AccountStatus);
    const statusColor = accountStatus === AccountStatus.Activated ? "success" : accountStatus === AccountStatus.NotActivated ? "warning" : accountStatus === AccountStatus.Locked ? "error" : "default";

    return (
        <React.Fragment>
            <TableRow hover sx={{ "& > *": { borderBottom: "unset" } }}>
                <TableCell sx={{ width: 40, pl: 1 }}>
                    <IconButton size="small" onClick={() => setOpen(!open)} aria-label="expand row">
                        {open ? <KeyboardArrowUp fontSize="small" /> : <KeyboardArrowDown fontSize="small" />}
                    </IconButton>
                </TableCell>

                <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Avatar src={staff.AvatarFullUrl} alt={staff.FullName} sx={{ width: 34, height: 34, fontSize: 14 }}>
                            {staff.FullName?.charAt(0)}
                        </Avatar>
                        <Box>
                            <Typography variant="body2" fontWeight={600} lineHeight={1.3}>
                                {staff.FullName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                @{staff.UserName}
                            </Typography>
                        </Box>
                    </Box>
                </TableCell>

                <TableCell>{staff.Email ?? "—"}</TableCell>
                <TableCell>{staff.PhoneNumber ?? "—"}</TableCell>

                <TableCell>
                    <Chip
                        label={ConvertService.convertAccountType(accountType)}
                        size="small"
                        color={getAccountTypeColor(accountType)}
                        variant="outlined"
                    />
                </TableCell>

                <TableCell>
                    <Chip
                        label={ConvertService.convertAccountStatus(accountStatus)}
                        size="small"
                        color={statusColor as any}
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
                                <IconButton size="small" color="primary" onClick={() => onEdit(staff.Id)}>
                                    <Edit fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Xóa">
                                <IconButton
                                    size="small"
                                    color="error"
                                    disabled={isDeleting && deleteCustomerId === staff.Id}
                                    onClick={() => onDelete(staff.Id)}
                                >
                                    {isDeleting && deleteCustomerId === staff.Id
                                        ? <CircularProgress size={16} color="error" />
                                        : <Delete fontSize="small" />}
                                </IconButton>
                            </Tooltip>
                        </>
                    )}
                </TableCell>
            </TableRow>

            <TableRow>
                <TableCell colSpan={7} sx={{ py: 0 }}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ px: 3, py: 2, bgcolor: "action.hover", borderRadius: 1 }}>
                            <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                                Thông tin chi tiết
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Grid container spacing={2}>
                                <DetailField label="Họ và tên">
                                    <Typography variant="body2" fontWeight={500}>{staff.FullName ?? "—"}</Typography>
                                </DetailField>
                                <DetailField label="Tên đăng nhập">
                                    <Typography variant="body2" fontWeight={500}>{staff.UserName ?? "—"}</Typography>
                                </DetailField>
                                <DetailField label="Email">
                                    <Typography variant="body2" fontWeight={500}>{staff.Email ?? "—"}</Typography>
                                </DetailField>
                                <DetailField label="Số điện thoại">
                                    <Typography variant="body2" fontWeight={500}>{staff.PhoneNumber ?? "—"}</Typography>
                                </DetailField>
                                <DetailField label="Giới tính">
                                    <Typography variant="body2" fontWeight={500}>
                                        {ConvertService.convertGender(ConvertService.convertGenderFromString(staff.Gender))}
                                    </Typography>
                                </DetailField>
                                <DetailField label="Ngày sinh">
                                    <Typography variant="body2" fontWeight={500}>{staff.DateOfBirth ?? "—"}</Typography>
                                </DetailField>
                                <DetailField label="Loại tài khoản">
                                    <Chip
                                        label={ConvertService.convertAccountType(accountType)}
                                        size="small"
                                        color={getAccountTypeColor(accountType)}
                                        variant="outlined"
                                    />
                                </DetailField>
                                <DetailField label="Trạng thái">
                                    <Chip
                                        label={ConvertService.convertAccountStatus(accountStatus)}
                                        size="small"
                                        color={statusColor as any}
                                        variant="filled"
                                    />
                                </DetailField>
                            </Grid>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

export default function ManageStaffAccountPage() {
    const [inputValue, setInputValue] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [openDialog, setOpenDialog] = useState(false);
    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
    const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteCustomerId, setDeleteCustomerId] = useState<string | null>(null);

    const dispatch = useDispatch<AppDispatch>();
    const userInfo = getUserInfo();
    const organizationId = userInfo?.OrganizationId ?? "";

    const queryParams: CustomerFilterParams = {
        page: page + 1,
        size: rowsPerPage,
        organizationId,
        ...(searchValue ? { searchValue } : {}),
    };

    const { data, isLoading, isError } = useGetCustomerByOrganizationWithPageQuery(queryParams, { skip: !organizationId });
    const [deleteCustomer, { isLoading: isDeleting }] = useDeleteCustomerMutation();

    const handleSearch = useCallback(() => { setSearchValue(inputValue); setPage(0); }, [inputValue]);
    const handleClearSearch = useCallback(() => { setInputValue(""); setSearchValue(""); setPage(0); }, []);
    const handleOpenUpdate = useCallback((id: string) => { setSelectedCustomerId(id); setOpenUpdateDialog(true); }, []);
    const handleOpenDelete = useCallback((id: string) => { setDeleteCustomerId(id); setOpenDeleteDialog(true); }, []);
    const handleCloseDelete = useCallback(() => { setOpenDeleteDialog(false); setDeleteCustomerId(null); }, []);
    const handlePageChange = useCallback((_: unknown, newPage: number) => { setPage(newPage); }, []);
    const handleRowsPerPageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
    }, []);

    const handleConfirmDelete = useCallback(async () => {
        if (!deleteCustomerId) return;
        try {
            await deleteCustomer(deleteCustomerId).unwrap();
            dispatch(showSnackbar({ message: "Xóa tài khoản thành công!", severity: "success" }));
            handleCloseDelete();
            if ((data?.Items?.length ?? 0) === 1 && page > 0) setPage((p) => p - 1);
        } catch {
            dispatch(showSnackbar({ message: "Xóa tài khoản thất bại. Vui lòng thử lại!", severity: "error" }));
        }
    }, [deleteCustomerId, deleteCustomer, dispatch, handleCloseDelete, data?.Items?.length, page]);

    const renderTableContent = () => {
        if (isLoading) {
            return (
                <TableRow>
                    <TableCell colSpan={7} align="center">
                        <Box sx={{ py: 5 }}><CircularProgress size={32} /></Box>
                    </TableCell>
                </TableRow>
            );
        }
        if (isError) {
            return (
                <TableRow>
                    <TableCell colSpan={7} align="center">
                        <Typography color="error" sx={{ py: 4 }}>Đã xảy ra lỗi khi tải dữ liệu.</Typography>
                    </TableCell>
                </TableRow>
            );
        }
        if (!data?.Items?.length) {
            return (
                <TableRow>
                    <TableCell colSpan={7} align="center">
                        <Typography sx={{ py: 4 }} color="text.secondary">Không có dữ liệu.</Typography>
                    </TableCell>
                </TableRow>
            );
        }

        return data.Items.map((staff: CustomerResponse) => (
            <StaffRow
                key={staff.Id}
                staff={staff}
                isDeleting={isDeleting}
                deleteCustomerId={deleteCustomerId}
                onEdit={handleOpenUpdate}
                onDelete={handleOpenDelete}
            />
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
                        {inputValue && (
                            <IconButton onClick={handleClearSearch} sx={{ p: "10px" }} aria-label="clear">
                                <Clear />
                            </IconButton>
                        )}
                        <IconButton onClick={handleSearch} sx={{ p: "10px" }} aria-label="search">
                            <Search />
                        </IconButton>
                    </Paper>
                </Grid>

                <Grid size="auto">
                    <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => setOpenDialog(true)}>
                        Thêm
                    </Button>
                </Grid>

                <Grid size={12}>
                    <TableContainer component={Paper} elevation={1}>
                        <Table sx={{ minWidth: 650 }} size="small" aria-label="staff account collapsible table">
                            <TableHead>
                                <TableRow>
                                    <TableCell />
                                    <TableCell>Nhân viên</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Số điện thoại</TableCell>
                                    <TableCell>Loại tài khoản</TableCell>
                                    <TableCell>Trạng thái</TableCell>
                                    <TableCell align="center">Tiện ích</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {renderTableContent()}
                            </TableBody>
                        </Table>

                        <TablePagination
                            component="div"
                            count={data?.Total ?? 0}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={handleRowsPerPageChange}
                            rowsPerPageOptions={[5, 10, 25, 50]}
                            sx={{ "& .MuiTablePagination-actions button": { color: "inherit" }, "& .MuiSvgIcon-root": { fontSize: 20 } }}
                        />
                    </TableContainer>
                </Grid>
            </Grid>

            <CreateCustomerAccountDialog open={openDialog} onClose={() => setOpenDialog(false)} />

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