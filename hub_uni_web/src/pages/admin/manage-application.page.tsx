import { ChangeCircle, Clear, Delete, Search, Visibility } from "@mui/icons-material";
import { Grid, IconButton, InputBase, Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Chip, Tooltip, TablePagination, Button, CircularProgress, Box, Typography, Avatar } from "@mui/material";
import { useState, useCallback } from "react";
import { ApplicationFilterParams, ApplicationResponse } from "../../app/models/application.model";
import { useDeleteApplicationMutation, useGetApplicationByOrganizationQuery } from "../../app/features/application.api";
import { ConvertService } from "../../app/services/convert.service";
import UpdateApplicationDialog from "../../components/dialogs/admin/application/update-application.dialog";
import ViewApplicationDialog from "../../components/dialogs/admin/view-application-detail.dialog";
import ConfirmDialog from "../../components/dialogs/general/confirm.dialog";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { showSnackbar } from "../../app/features/snackbar/snackbar.slice";

const STATUS_STYLE: Record<string, { bgcolor: string; color: string; border: string }> = {
    Accepted: { bgcolor: "#e8f5e9", color: "#2e7d32", border: "#a5d6a7" },
    Rejected: { bgcolor: "#fff3e0", color: "#e65100", border: "#ef9a9a" },
    Pending: { bgcolor: "#fcf0cfff", color: "#c69f28", border: "#f0e427ff" },
    Undefined: { bgcolor: "#f5f5f5", color: "#757575", border: "#e0e0e0" },
};

export default function ManageApplicationPage() {
    const [inputValue, setInputValue] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
    const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
    const [openViewDialog, setOpenViewDialog] = useState(false);
    const [viewApplicationId, setViewApplicationId] = useState<string | null>(null);

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteApplicationId, setDeleteApplicationId] = useState<string | null>(null);

    const dispatch = useDispatch<AppDispatch>();

    const queryParams: ApplicationFilterParams = {
        page: page + 1,
        size: rowsPerPage,
        searchValue: searchValue || undefined,
    };
    const handleOpenView = useCallback((id: string) => { setViewApplicationId(id); setOpenViewDialog(true); }, []);
    const handleCloseView = useCallback(() => { setOpenViewDialog(false); setViewApplicationId(null); }, []);

    const { data, isLoading, isError } = useGetApplicationByOrganizationQuery(queryParams);
    const [deleteApplication, { isLoading: isDeleting }] = useDeleteApplicationMutation();

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
        setSelectedApplicationId(id);
        setOpenUpdateDialog(true);
    }, []);

    const handleOpenDelete = useCallback((id: string) => { setDeleteApplicationId(id); setOpenDeleteDialog(true); }, []);
    const handleCloseDelete = useCallback(() => { setOpenDeleteDialog(false); setDeleteApplicationId(null); }, []);

    const handlePageChange = useCallback((_: unknown, newPage: number) => { setPage(newPage); }, []);

    const handleConfirmDelete = useCallback(async () => {
        if (!deleteApplicationId) return;
        try {
            await deleteApplication(deleteApplicationId).unwrap();
            dispatch(showSnackbar({ message: "Xóa đơn ứng tuyển thành công!", severity: "success" }));
            handleCloseDelete();
        } catch {
            dispatch(showSnackbar({ message: "Xóa đơn ứng tuyển thất bại. Vui lòng thử lại!", severity: "error" }));
        }
    }, [deleteApplicationId, deleteApplication, dispatch, handleCloseDelete]);

    const handleRowsPerPageChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }, []);

    const renderTableContent = () => {
        if (isLoading) {
            return (
                <TableRow>
                    <TableCell colSpan={8} align="center">
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
                    <TableCell colSpan={8} align="center">
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
                    <TableCell colSpan={8} align="center">
                        <Typography sx={{ py: 4 }}>
                            Không có dữ liệu.
                        </Typography>
                    </TableCell>
                </TableRow>
            );
        }

        return data.Items.map((application: ApplicationResponse) => (
            <TableRow key={application.Id} hover>
                <TableCell>{application.Customer?.FullName ?? "—"}</TableCell>
                <TableCell>{ConvertService.convertGender(ConvertService.convertGenderFromString(application.Customer?.ProfileInfo?.Gender)) ?? "—"}</TableCell>
                <TableCell>{ConvertService.formatDateToddMMyyyy(application.Customer?.ProfileInfo?.DateOfBirth) ?? "—"}</TableCell>
                <TableCell>{application.RecruitmentPost.Name ?? "—"}</TableCell>
                <TableCell>
                    {(() => {
                        const style = STATUS_STYLE[application.ApplicationStatus] ?? STATUS_STYLE.Undefined;
                        return (
                            <Chip
                                label={ConvertService.convertApplicationStatus(ConvertService.convertApplicationStatusFromString(application.ApplicationStatus))}
                                size="small"
                                sx={{
                                    bgcolor: style.bgcolor,
                                    color: style.color,
                                    fontWeight: 600,
                                    fontSize: 12,
                                    border: `1px solid ${style.border}`,
                                }}
                            />
                        );
                    })()}
                </TableCell>
                <TableCell align="center">
                    <Tooltip title="Xem chi tiết">
                        <IconButton size="small" color="primary" onClick={() => handleOpenView(application.Id)}>
                            <Visibility fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Thay đổi trạng thái">
                        <IconButton size="small" color="warning" onClick={() => handleOpenUpdate(application.Id)}>
                            <ChangeCircle fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <IconButton
                            size="small"
                            color="error"
                            disabled={isDeleting && deleteApplicationId === application.Id}
                            onClick={() => handleOpenDelete(application.Id)}
                        >
                            {isDeleting && deleteApplicationId === application.Id
                                ? <CircularProgress size={16} color="error" />
                                : <Delete fontSize="small" />
                            }
                        </IconButton>
                    </Tooltip>
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
                            placeholder="Tìm kiếm ứng viên"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        />
                        <IconButton onClick={handleClearSearch} sx={{ p: "10px" }} aria-label="clear"><Clear /></IconButton>
                        <IconButton onClick={handleSearch} sx={{ p: "10px" }} aria-label="search"><Search /></IconButton>
                    </Paper>
                </Grid>
                <Grid size={12}>
                    <TableContainer component={Paper} elevation={1}>
                        <Table sx={{ minWidth: 650 }} size="small" aria-label="staff account table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Họ tên</TableCell>
                                    <TableCell>Giới tính</TableCell>
                                    <TableCell>Ngày sinh</TableCell>
                                    <TableCell>Chương trình tuyển sinh</TableCell>
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
            <UpdateApplicationDialog
                open={openUpdateDialog}
                applicationId={selectedApplicationId}
                onClose={() => { setOpenUpdateDialog(false); setSelectedApplicationId(null); }}
            />
            <ViewApplicationDialog
                open={openViewDialog}
                applicationId={viewApplicationId}
                onClose={handleCloseView}
            />

            <ConfirmDialog
                open={openDeleteDialog}
                onClose={handleCloseDelete}
                onConfirm={handleConfirmDelete}
                title="Xác nhận xóa"
                message="Bạn có chắc chắn muốn xóa ứng viên này không? Hành động này không thể hoàn tác."
            />
        </>
    );
}