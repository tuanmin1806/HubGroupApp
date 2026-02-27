import { Add, ChangeCircle, Clear, Edit, Search, Visibility } from "@mui/icons-material";
import { Grid, IconButton, InputBase, Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Chip, Tooltip, TablePagination, Button, CircularProgress, Box, Typography} from "@mui/material";
import AccountFilter from "../../components/filters/account.filter";
import CreateUserDialog from "../../components/dialogs/admin/create-account.dialog";
import { useState, useCallback } from "react";
import { AccountStatus, Gender } from "../../app/models/enums.model";
import { CustomerFilterParams, CustomerResponse } from "../../app/models/customer.model";
import { useGetCustomerByOrganizationWithPageQuery } from "../../app/features/customer.api";
import { PAGE_SIZE } from "../../constants/common.constant";

const ORGANIZATION_ID = "your-organization-id";

const getGenderLabel = (gender: Gender): string => {
    const map: Record<Gender, string> = {
        [Gender.Undefined]: "Không xác định",
        [Gender.Male]: "Nam",
        [Gender.Female]: "Nữ",
        [Gender.Other]: "Khác",
    };
    return map[gender] ?? "Không xác định";
};

const getStatusChip = (status: AccountStatus) => {
    const config: Record<AccountStatus, { label: string; color: "success" | "error" | "default" }> = {
        [AccountStatus.Undefined]: { label: "Không xác định", color: "default" },
        [AccountStatus.Activated]: { label: "Hoạt động", color: "success" },
        [AccountStatus.Locked]: { label: "Bị khóa", color: "error" },
        [AccountStatus.NotActivated]: { label: "Không hoạt động", color: "default" },
    };
    const { label, color } = config[status] ?? { label: "Không xác định", color: "default" };
    return <Chip label={label} size="small" variant="outlined" color={color} />;
};

export default function ManageAccountPage() {
    const [openAddNewUserDialog, setOpenAddNewUserDialog] = useState(false);
    const [keyword, setKeyword] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [filterParams, setFilterParams] = useState<Omit<CustomerFilterParams, "page" | "size" | "organizationId" | "keyword">>({});
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(PAGE_SIZE);

    const queryParams: CustomerFilterParams = {
        organizationId: ORGANIZATION_ID,
        page: page + 1,
        size: rowsPerPage,
        ...filterParams,
    };

    const { data, isLoading, isError } = useGetCustomerByOrganizationWithPageQuery(queryParams);

    const handleSearch = useCallback(() => {
        setKeyword(inputValue);
        setPage(0);
    }, [inputValue]);

    const handleClearSearch = useCallback(() => {
        setInputValue("");
        setKeyword("");
        setPage(0);
    }, []);

    const handlePageChange = useCallback((_: unknown, newPage: number) => {
        setPage(newPage);
    }, []);

    const handleRowsPerPageChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }, []);

    const handleApplyFilter = useCallback((params: typeof filterParams) => {
        setFilterParams(params);
        setPage(0);
    }, []);

    const renderTableContent = () => {
        if (isLoading) {
            return (
                <TableRow>
                    <TableCell colSpan={9} align="center">
                        <Box sx={{ py: 4 }}>
                            <CircularProgress size={32} />
                        </Box>
                    </TableCell>
                </TableRow>
            );
        }

        if (isError) {
            return (
                <TableRow>
                    <TableCell colSpan={9} align="center">
                        <Typography color="error" sx={{ py: 4 }}>
                            Đã xảy ra lỗi khi tải dữ liệu.
                        </Typography>
                    </TableCell>
                </TableRow>
            );
        }

        if (!data?.Items?.length) {
            return (
                <TableRow>
                    <TableCell colSpan={9} align="center">
                        <Typography sx={{ py: 4 }}>Không có dữ liệu.</Typography>
                    </TableCell>
                </TableRow>
            );
        }

        return data.Items.map((customer: CustomerResponse) => (
            <TableRow
                key={customer.Id}
                hover
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
                <TableCell component="th" scope="row">{customer.AccountCode ?? "—"}</TableCell>
                <TableCell>{customer.FullName}</TableCell>
                <TableCell>{customer.UserName}</TableCell>
                <TableCell>{customer.Email}</TableCell>
                <TableCell>{customer.PhoneNumber ?? "—"}</TableCell>
                <TableCell>{customer.DateOfBirth}</TableCell>
                <TableCell>{getGenderLabel(customer.Gender)}</TableCell>
                <TableCell>{getStatusChip(customer.AccountStatus)}</TableCell>
                <TableCell align="center">
                    <Tooltip title="Xem chi tiết">
                        <IconButton size="small" color="primary">
                            <Visibility fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Cập nhật">
                        <IconButton size="small" color="primary">
                            <Edit fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Thay đổi trạng thái">
                        <IconButton size="small" color="error">
                            <ChangeCircle fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </TableCell>
            </TableRow>
        ));
    };

    return (
        <>
            <CreateUserDialog open={openAddNewUserDialog} setOpen={setOpenAddNewUserDialog} />
            <Grid container spacing={2}>
                <Grid size="auto">
                    <AccountFilter onApply={handleApplyFilter} />
                </Grid>

                <Grid size={6}>
                    <Paper sx={{ display: "flex", alignItems: "center" }}>
                        <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            placeholder="Tìm kiếm theo từ khóa"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        />
                        <IconButton onClick={handleClearSearch} sx={{ p: "10px" }} aria-label="clear">
                            <Clear />
                        </IconButton>
                        <IconButton onClick={handleSearch} sx={{ p: "10px" }} aria-label="search">
                            <Search />
                        </IconButton>
                    </Paper>
                </Grid>

                <Grid size="auto">
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Add />}
                        onClick={() => setOpenAddNewUserDialog(true)}
                    >
                        Thêm tài khoản
                    </Button>
                </Grid>

                <Grid size={12}>
                    <TableContainer component={Paper} elevation={1}>
                        <Table sx={{ minWidth: 650 }} size="small" aria-label="customer table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Mã tài khoản</TableCell>
                                    <TableCell>Họ và tên</TableCell>
                                    <TableCell>Tên đăng nhập</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Số điện thoại</TableCell>
                                    <TableCell>Ngày sinh</TableCell>
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
        </>
    );
}