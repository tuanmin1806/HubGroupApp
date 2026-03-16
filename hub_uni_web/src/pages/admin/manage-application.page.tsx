import { ChangeCircle, Clear, Edit, Search, Visibility } from "@mui/icons-material";
import { Grid, IconButton, InputBase, Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Chip, Tooltip, TablePagination, Button, CircularProgress, Box, Typography, Avatar } from "@mui/material";
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ApplicationFilterParams, ApplicationResponse } from "../../app/models/application.model";
import { useGetApplicationByOrganizationQuery } from "../../app/features/application.api";
import { ConvertService } from "../../app/services/convert.service";
import UpdateApplicationDialog from "../../components/dialogs/admin/application/update-application.dialog";

export default function ManageApplicationPage() {
    const [inputValue, setInputValue] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [openDialog, setOpenDialog] = useState(false);
    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
    const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
    const navigate = useNavigate();

    const queryParams: ApplicationFilterParams = {
        page: page + 1,
        size: rowsPerPage,
    };

    const { data, isLoading, isError } = useGetApplicationByOrganizationQuery(queryParams);

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

    const handlePageChange = useCallback((_: unknown, newPage: number) => { setPage(newPage); }, []);

    const handleRowsPerPageChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }, []);

    const renderTableContent = () => {
        if (isLoading) {
            return (
                <TableRow>
                    <TableCell colSpan={4} align="center">
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
                    <TableCell colSpan={4} align="center">
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
                    <TableCell colSpan={4} align="center">
                        <Typography sx={{ py: 4 }}>
                            Không có dữ liệu.
                        </Typography>
                    </TableCell>
                </TableRow>
            );
        }

        return data.Items.map((application: ApplicationResponse) => (
            <TableRow key={application.Id} hover>
                <TableCell>{application.Customer.FullName ?? "—"}</TableCell>
                <TableCell>{ConvertService.convertGender(ConvertService.convertGenderFromString(application.Customer.ProfileInfo.Gender)) ?? "—"}</TableCell>
                <TableCell>{application.Customer.ProfileInfo.DateOfBirth ?? "—"}</TableCell>
                <TableCell>{application.RecruitmentPost.Name ?? "—"}</TableCell>
                <TableCell>{ConvertService.convertApplicationStatus(ConvertService.convertApplicationStatusFromString(application.ApplicationStatus)) ?? "—"}</TableCell>
                <TableCell align="center">
                    <Tooltip title="Xem chi tiết">
                        <IconButton size="small" color="primary">
                            <Visibility fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Chỉnh sửa">
                        <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleOpenUpdate(application.Id)}
                        >
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
        </>
    );
}