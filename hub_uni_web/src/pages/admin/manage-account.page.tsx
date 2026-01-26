import { ChangeCircle, Clear, Edit, Search, Visibility } from "@mui/icons-material";
import { Grid, IconButton, InputBase, Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Chip, Tooltip, TablePagination } from "@mui/material";

export default function ManageAccountPage() {
    return <>
        <Grid container spacing={2}>
            <Grid size="auto">
                
            </Grid>
            <Grid size={6}>
                <Paper sx={{ display: "flex", alignItems: "center" }}>
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Tìm kiếm theo từ khóa"
                    />

                    <IconButton
                        type="button"
                        sx={{ p: "10px" }}
                        aria-label="clear"
                    >
                        <Clear />
                    </IconButton>
                    <IconButton
                        type="button"
                        sx={{ p: "10px" }}
                        aria-label="search"
                    >
                        <Search />
                    </IconButton>
                </Paper>
            </Grid>
            <Grid sx={{ ml: 'auto' }}>

            </Grid>
            <Grid size={12}>
                <TableContainer component={Paper} elevation={1}>
                    <Table
                        sx={{ minWidth: 650 }}
                        size="small"
                        aria-label="customer table"
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Họ</TableCell>
                                <TableCell>Tên</TableCell>
                                <TableCell>Địa chỉ email</TableCell>
                                <TableCell>Số điện thoại</TableCell>
                                <TableCell>Ngày sinh</TableCell>
                                <TableCell>Giới tính</TableCell>
                                <TableCell>Trạng thái</TableCell>
                                <TableCell align="center">
                                    Tiện ích
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow
                                hover
                                sx={{
                                    "&:last-child td, &:last-child th":
                                        { border: 0 },
                                }}
                            >
                                <TableCell
                                    component="th"
                                    scope="row"
                                >
                                    {'Không xác định'}
                                </TableCell>
                                <TableCell>
                                    {'Không xác định'}
                                </TableCell>
                                <TableCell>
                                    {'Không xác định'}
                                </TableCell>
                                <TableCell>{'Không xác định'}</TableCell>
                                <TableCell>
                                    {'Không xác định'}
                                </TableCell>
                                <TableCell>
                                    {'Không xác định'}
                                </TableCell>
                                <TableCell>
                                    { }
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={
                                            "Hoạt động"
                                        }
                                        size="small"
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <Tooltip title="xem chi tiết">
                                        <IconButton
                                            size="small"
                                            color="primary"

                                        >
                                            <Visibility fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Cập nhập">
                                        <IconButton
                                            size="small"
                                            color="primary"

                                        >
                                            <Edit fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Thay đổi trạng thái">
                                        <IconButton
                                            size="small"
                                            color="error"

                                        >
                                            <ChangeCircle fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <TablePagination
                        component="div"
                        count={10}
                        page={10}
                        onPageChange={(event, page) => { }}
                        rowsPerPage={10}
                        onRowsPerPageChange={(event) => { }}
                        labelRowsPerPage="Số hàng:"
                    />
                </TableContainer>
            </Grid>
        </Grid>
    </>
}