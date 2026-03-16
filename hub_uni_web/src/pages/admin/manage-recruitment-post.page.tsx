import { Add, ChangeCircle, Clear, Edit, Search, Visibility } from "@mui/icons-material";
import { Grid, IconButton, InputBase, Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Tooltip, TablePagination, Button, CircularProgress, Box, Typography } from "@mui/material";
import { useState, useCallback } from "react";
import { RecruitmentPostFilterParams, RecruitmentPostResponse } from "../../app/models/recruitment-post.model";
import { PAGE_SIZE } from "../../constants/common.constant";
import { useGetRecruitmentPostsByCurrentCustomerQuery, useGetRecruitmentPostsByOrganizationQuery } from "../../app/features/recruitment-post.api";
import { ConvertService } from "../../app/services/convert.service";
import { useNavigate } from "react-router-dom";
import UpdateRecruitmentPostDialog from "../../components/dialogs/staff/update-recruitment-post.dialog";
import { formatDate } from "../../utils/date.utils";
import { getUserInfo } from "../../app/services/auth.service";

export default function ManageRecruitmentPostPage() {
    const [searchValue, setSearchValue] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [filterParams, setFilterParams] = useState<Omit<RecruitmentPostFilterParams, "page" | "size" | "searchValue">>({});
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(PAGE_SIZE);
    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
    const navigate = useNavigate();
    const userInfo = getUserInfo();
    const organizationId = userInfo?.OrganizationId ?? "";

    const queryParams: RecruitmentPostFilterParams = { page: page + 1, size: rowsPerPage, searchValue: searchValue || undefined, ...filterParams, organizationId: organizationId };

    const { data, isLoading, isError } = useGetRecruitmentPostsByOrganizationQuery(queryParams);

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
        setSelectedPostId(id);
        setOpenUpdateDialog(true);
    }, []);

    const handleCloseUpdate = useCallback(() => {
        setOpenUpdateDialog(false);
        setSelectedPostId(null);
    }, []);

    const handlePageChange = useCallback((_: unknown, newPage: number) => { setPage(newPage); }, []);

    const handleRowsPerPageChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => { setRowsPerPage(parseInt(event.target.value, 10)); setPage(0); }, []);

    const renderTableContent = () => {
        if (isLoading) { return (<TableRow><TableCell colSpan={8} align="center"> <Box sx={{ py: 4 }}><CircularProgress size={32} /></Box> </TableCell></TableRow>); }
        if (isError) { return (<TableRow> <TableCell colSpan={8} align="center"> <Typography color="error" sx={{ py: 4 }}>Đã xảy ra lỗi khi tải dữ liệu.</Typography></TableCell></TableRow>); }
        if (!data?.Items?.length) {
            return (<TableRow> <TableCell colSpan={8} align="center"> <Typography sx={{ py: 4 }}>Không có dữ liệu.</Typography> </TableCell> </TableRow>
            );
        }
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
                <TableCell>{ConvertService.convertPostStatus(ConvertService.convertPostStatusFromString(post.RecruitPostStatus))}</TableCell>
                <TableCell align="center">
                    <Tooltip title="Xem chi tiết"><IconButton size="small" color="primary"><Visibility fontSize="small" /></IconButton></Tooltip>
                    <Tooltip title="Cập nhật">
                        <IconButton size="small" color="primary" onClick={() => handleOpenUpdate(post.Id)}>
                            <Edit fontSize="small" />
                        </IconButton>
                    </Tooltip>
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
                        onClick={() => navigate("/staff/create-recruitment-post")}
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
        </>
    );
}