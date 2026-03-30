import { Add, Clear, Delete, Edit, Search, Visibility } from "@mui/icons-material";
import { Grid, IconButton, InputBase, Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Tooltip, TablePagination, Button, CircularProgress, Box, Typography, Chip } from "@mui/material";
import { useState, useCallback } from "react";
import { RecruitmentPostFilterParams, RecruitmentPostResponse } from "../../app/models/recruitment-post.model";
import { PAGE_SIZE } from "../../constants/common.constant";
import { useDeleteRecruitmentPostMutation, useGetRecruitmentPostsByOrganizationQuery } from "../../app/features/recruitment-post.api";
import { ConvertService } from "../../app/services/convert.service";
import { useNavigate } from "react-router-dom";
import UpdateRecruitmentPostDialog from "../../components/dialogs/staff/update-recruitment-post.dialog";
import { formatDate } from "../../utils/date.utils";
import { getUserInfo } from "../../app/services/auth.service";
import ViewRecruitmentPostDialog from "../../components/dialogs/admin/view-recruitment-post-detail.dialog";
import ConfirmDialog from "../../components/dialogs/general/confirm.dialog";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { showSnackbar } from "../../app/features/snackbar/snackbar.slice";
import { useRoutePrefix } from "../../hooks/useRoutePrefix";

const STATUS_STYLE: Record<string, { bgcolor: string; color: string; border: string }> = {
    Active: { bgcolor: "#e8f5e9", color: "#2e7d32", border: "#a5d6a7" },
    Inactive: { bgcolor: "#fff3e0", color: "#e65100", border: "#ffcc80" },
    Closed: { bgcolor: "#fce4ec", color: "#c62828", border: "#ef9a9a" },
    Draft: { bgcolor: "#f5f5f5", color: "#757575", border: "#e0e0e0" },
};

export default function ManageRecruitmentPostPage() {
    const [searchValue, setSearchValue] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [filterParams, setFilterParams] = useState<Omit<RecruitmentPostFilterParams, "page" | "size" | "searchValue">>({});
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(PAGE_SIZE);
    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
    const [openViewDialog, setOpenViewDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deletePostId, setDeletePostId] = useState<string | null>(null);
    const [viewPostId, setViewPostId] = useState<string | null>(null);
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
    const navigate = useNavigate();
    const userInfo = getUserInfo();
    const dispatch = useDispatch<AppDispatch>();
    const organizationId = userInfo?.OrganizationId ?? "";
    const prefix = useRoutePrefix();

    const queryParams: RecruitmentPostFilterParams = { page: page + 1, size: rowsPerPage, searchValue: searchValue || undefined, ...filterParams, organizationId: organizationId };

    const { data, isLoading, isError } = useGetRecruitmentPostsByOrganizationQuery(queryParams);
    const [deleteRecruitmentPost, { isLoading: isDeleting }] = useDeleteRecruitmentPostMutation();

    const handleSearch = useCallback(() => {
        setSearchValue(inputValue.trim());
        setPage(0);
    }, [inputValue]);

    const handleClearSearch = useCallback(() => {
        setInputValue("");
        setSearchValue("");
        setPage(0);
    }, []);

    const handleOpenUpdate = useCallback((id: string) => {
        setSelectedPostId(id);
        setOpenUpdateDialog(true);
    }, []);

    const handleCloseUpdate = useCallback(() => {
        setOpenUpdateDialog(false);
        setSelectedPostId(null);
    }, []);


    const handleOpenView = useCallback((id: string) => { setViewPostId(id); setOpenViewDialog(true); }, []);
    const handleCloseView = useCallback(() => { setOpenViewDialog(false); setViewPostId(null); }, []);

    const handleOpenDelete = useCallback((id: string) => { setDeletePostId(id); setOpenDeleteDialog(true); }, []);
    const handleCloseDelete = useCallback(() => { setOpenDeleteDialog(false); setDeletePostId(null); }, []);

    const handlePageChange = useCallback((_: unknown, newPage: number) => { setPage(newPage); }, []);

    const handleRowsPerPageChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => { setRowsPerPage(parseInt(event.target.value, 10)); setPage(0); }, []);
    const handleConfirmDelete = useCallback(async () => {
        if (!deletePostId) return;
        try {
            await deleteRecruitmentPost(deletePostId).unwrap();
            dispatch(showSnackbar({ message: "Xóa bài tuyển sinh thành công!", severity: "success" }));
            handleCloseDelete();
        } catch {
            dispatch(showSnackbar({ message: "Xóa bài tuyển sinh thất bại. Vui lòng thử lại!", severity: "error" }));
        }
    }, [deletePostId, deleteRecruitmentPost, dispatch, handleCloseDelete]);


    const renderTableContent = () => {
        if (isLoading) { return (<TableRow><TableCell colSpan={8} align="center"> <Box sx={{ py: 4 }}><CircularProgress size={32} /></Box> </TableCell></TableRow>); }
        if (isError) { return (<TableRow> <TableCell colSpan={8} align="center"> <Typography color="error" sx={{ py: 4 }}>Đã xảy ra lỗi khi tải dữ liệu.</Typography></TableCell></TableRow>); }
        if (!data?.Items?.length) { return (<TableRow> <TableCell colSpan={8} align="center"> <Typography sx={{ py: 4 }}>Không có dữ liệu.</Typography> </TableCell> </TableRow>); }
        return data.Items.map((post: RecruitmentPostResponse) => (
            <TableRow
                key={post.Id}
                hover
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
                <TableCell component="th" scope="row">{post.Name}</TableCell>
                <TableCell>{post.Province ?? "—"}</TableCell>
                <TableCell>{post.Quantity}</TableCell>
                <TableCell>{formatDate(post.RecruitmentToDate)}</TableCell>
                <TableCell>
                    {(() => {
                        const style = STATUS_STYLE[post.RecruitPostStatus] ?? STATUS_STYLE.Draft;
                        return (
                            <Chip
                                label={ConvertService.convertPostStatus(ConvertService.convertPostStatusFromString(post.RecruitPostStatus))}
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
                        <IconButton size="small" color="primary" onClick={() => handleOpenView(post.Id)}>
                            <Visibility fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Cập nhật">
                        <IconButton size="small" color="primary" onClick={() => handleOpenUpdate(post.Id)}>
                            <Edit fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <IconButton
                            size="small"
                            color="error"
                            disabled={isDeleting && deletePostId === post.Id}
                            onClick={() => handleOpenDelete(post.Id)}
                        >
                            {isDeleting && deletePostId === post.Id
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
                            placeholder="Tìm kiếm chương trình tuyển sinh"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        />
                        {inputValue && (
                            <IconButton onClick={handleClearSearch} sx={{ p: "10px" }}>
                                <Clear />
                            </IconButton>
                        )}
                        <IconButton onClick={handleSearch} sx={{ p: "10px" }}>
                            <Search />
                        </IconButton>
                    </Paper>
                </Grid>
                <Grid size="auto">
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Add />}
                        onClick={() => navigate(`${prefix}/create-recruitment-post`)}
                    >
                        Thêm
                    </Button>
                </Grid>
                <Grid size={12}>
                    <TableContainer component={Paper} elevation={1}>
                        <Table sx={{ minWidth: 650 }} size="small" aria-label="recruitment post table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Tên chương trình tuyển sinh</TableCell>
                                    <TableCell>Tỉnh/Thành phố</TableCell>
                                    <TableCell>Số lượng</TableCell>
                                    <TableCell>Hạn tuyển</TableCell>
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
            <UpdateRecruitmentPostDialog
                open={openUpdateDialog}
                postId={selectedPostId}
                onClose={handleCloseUpdate}
            />
            <ViewRecruitmentPostDialog
                open={openViewDialog}
                postId={viewPostId}
                onClose={handleCloseView}
            />
            <ConfirmDialog
                open={openDeleteDialog}
                onClose={handleCloseDelete}
                onConfirm={handleConfirmDelete}
                title="Xác nhận xóa"
                message="Bạn có chắc chắn muốn xóa chương trình tuyển sinh này không? Hành động này không thể hoàn tác."
            />
        </>
    );
}