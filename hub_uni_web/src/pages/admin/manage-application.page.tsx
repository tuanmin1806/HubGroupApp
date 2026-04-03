import { lazy } from "react";
import ChangeCircle from "@mui/icons-material/ChangeCircle";
import Clear from "@mui/icons-material/Clear";
import Delete from "@mui/icons-material/Delete";
import Search from "@mui/icons-material/Search";
import Visibility from "@mui/icons-material/Visibility";
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
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useState, useCallback } from "react";
import { ApplicationFilterParams, ApplicationResponse } from "../../app/models/application.model";
import { useDeleteApplicationMutation, useGetApplicationByOrganizationQuery } from "../../app/features/application.api";
import { ConvertService } from "../../app/services/convert.service";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { showSnackbar } from "../../app/features/snackbar/snackbar.slice";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { Collapse, Divider } from "@mui/material";
import labelsVi from "../../i18n/labels.vi";
const UpdateApplicationDialog = lazy(() => import("../../components/dialogs/admin/application/update-application.dialog"));
const ViewApplicationDialog = lazy(() => import("../../components/dialogs/admin/view-application-detail.dialog"));
const ConfirmDialog = lazy(() => import("../../components/dialogs/general/confirm.dialog"));

const labels = labelsVi.application;

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

const STATUS_STYLE: Record<string, { bgcolor: string; color: string; border: string }> = {
    Accepted: { bgcolor: "#e8f5e9", color: "#2e7d32", border: "#a5d6a7" },
    Rejected: { bgcolor: "#fff3e0", color: "#e65100", border: "#ef9a9a" },
    Pending: { bgcolor: "#fcf0cfff", color: "#c69f28", border: "#f0e427ff" },
    Undefined: { bgcolor: "#f5f5f5", color: "#757575", border: "#e0e0e0" },
};

function ApplicationRow({
    application,
    isDeleting,
    deleteApplicationId,
    onView,
    onUpdate,
    onDelete,
}: any) {
    const [open, setOpen] = useState(false);

    const customer = application.Customer;
    const profile = customer?.ProfileInfo;

    const style = STATUS_STYLE[application.ApplicationStatus] ?? STATUS_STYLE.Undefined;

    return (
        <>
            <TableRow hover>
                <TableCell sx={{ width: 40, pl: 1 }}>
                    <IconButton size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUp fontSize="small" /> : <KeyboardArrowDown fontSize="small" />}
                    </IconButton>
                </TableCell>

                <TableCell>{customer?.FullName ?? "—"}</TableCell>
                <TableCell>
                    {ConvertService.convertGender(ConvertService.convertGenderFromString(profile?.Gender)) ?? "—"}
                </TableCell>
                <TableCell>
                    {ConvertService.formatDateToddMMyyyy(profile?.DateOfBirth) ?? "—"}
                </TableCell>
                <TableCell>{application.RecruitmentPost?.Name ?? "—"}</TableCell>

                <TableCell>
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
                </TableCell>

                <TableCell align="center">
                    <Tooltip title={labels.viewApplicationDetail}>
                        <IconButton size="small" color="info" onClick={() => onView(application.Id)}>
                            <Visibility fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title={labels.updateApplication}>
                        <IconButton size="small" color="warning" onClick={() => onUpdate(application.Id)}>
                            <ChangeCircle fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title={labels.deleteApplication}>
                        <IconButton
                            size="small"
                            color="error"
                            disabled={isDeleting && deleteApplicationId === application.Id}
                            onClick={() => onDelete(application.Id)}
                        >
                            {isDeleting && deleteApplicationId === application.Id ? <CircularProgress size={16} color="error" /> : <Delete fontSize="small" />}
                        </IconButton>
                    </Tooltip>
                </TableCell>
            </TableRow>

            <TableRow>
                <TableCell colSpan={7} sx={{ py: 0 }}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ px: 3, py: 2, bgcolor: "action.hover", borderRadius: 1 }}>
                            <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                                {labels.applicationInfo}
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            <Grid container spacing={2} mb={2}>
                                <DetailField label={labels.fullName}>
                                    <Typography fontWeight={500} fontSize={14}>{customer?.FullName}</Typography>
                                </DetailField>

                                <DetailField label={labels.gender}>
                                    <Typography fontWeight={500} fontSize={14}>
                                        {ConvertService.convertGender(ConvertService.convertGenderFromString(profile?.Gender))}
                                    </Typography>
                                </DetailField>

                                <DetailField label={labels.dateOfBirth}>
                                    <Typography fontWeight={500} fontSize={14}>
                                        {ConvertService.formatDateToddMMyyyy(profile?.DateOfBirth)}
                                    </Typography>
                                </DetailField>

                                <DetailField label={labels.email}>
                                    <Typography fontWeight={500} fontSize={14}>{customer?.Email ?? "—"}</Typography>
                                </DetailField>

                                <DetailField label={labels.phoneNumber}>
                                    <Typography fontWeight={500} fontSize={14}>{customer?.PhoneNumber ?? "—"}</Typography>
                                </DetailField>

                                <DetailField label={labels.recruitmentPost}>
                                    <Typography fontWeight={500} fontSize={14}>
                                        {application.RecruitmentPost?.Name}
                                    </Typography>
                                </DetailField>
                            </Grid>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}

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
            dispatch(showSnackbar({ message: labels.deleteSuccess, severity: "success" }));
            handleCloseDelete();
        } catch {
            dispatch(showSnackbar({ message: labels.deleteFailed, severity: "error" }));
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
                            {labels.loadDataFailed}
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
                            {labels.noData}
                        </Typography>
                    </TableCell>
                </TableRow>
            );
        }

        return data.Items.map((application: ApplicationResponse) => (
            <ApplicationRow
                key={application.Id}
                application={application}
                isDeleting={isDeleting}
                deleteApplicationId={deleteApplicationId}
                onView={handleOpenView}
                onUpdate={handleOpenUpdate}
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
                            placeholder={labels.searchApplication}
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
                                    <TableCell />
                                    <TableCell>{labels.fullName}</TableCell>
                                    <TableCell>{labels.gender}</TableCell>
                                    <TableCell>{labels.dateOfBirth}</TableCell>
                                    <TableCell>{labels.recruitmentPost}</TableCell>
                                    <TableCell>{labels.applicationStatus}</TableCell>
                                    <TableCell align="center">{labels.utility}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>{renderTableContent()}</TableBody>
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
                title={labels.confirmDelete}
                message={labels.confirmDeleteMessage}
            />
        </>
    );
}