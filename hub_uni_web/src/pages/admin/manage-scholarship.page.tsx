import { lazy } from "react";
import ChangeCircle from "@mui/icons-material/ChangeCircle";
import Clear from "@mui/icons-material/Clear";
import ExpandIcon from '@mui/icons-material/Expand';
import Search from "@mui/icons-material/Search";
import Add from "@mui/icons-material/Add";
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
import Tooltip from "@mui/material/Tooltip";
import TablePagination from "@mui/material/TablePagination";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useState, useCallback, useEffect } from "react";
import { ScholarshipFilterParams, ScholarshipResponse } from "../../app/models/scholarship.model";
import { useDeleteScholarshipMutation, useLazyGetRecommendScholarshipsQuery, useLazyGetScholarshipsByOrganizationQuery } from "../../app/features/scholarship.api";
import { Delete, KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { Collapse, Divider } from "@mui/material";
import { getUserInfo } from "../../app/services/auth.service";
import ConfirmDialog from "../../components/dialogs/general/student-confirm.dialog";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { showSnackbar } from "../../app/features/snackbar/snackbar.slice";
import labelsVi from "../../i18n/labels.vi";
const UpdateScholarshipDialog = lazy(() => import("../../components/dialogs/admin/scholarship/update-scholarship.dialog"));
const CreateScholarshipDialog = lazy(() => import("../../components/dialogs/admin/scholarship/create-scholarship.dialog"));

const labels = labelsVi.scholarship

function DetailField({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="caption" color="text.secondary" display="block" mb={0.3}>
                {label}
            </Typography>
            {children}
        </Grid>
    );
}

interface ScholarshipRowProps {
    scholarship: ScholarshipResponse;
    onUpdate: (id: string) => void;
    isDeleting: boolean;
    deleteScholarshipId: string | null;
    onDelete: (id: string) => void;
}

function ScholarshipRow({ scholarship, onUpdate, isDeleting, deleteScholarshipId, onDelete, }: ScholarshipRowProps) {
    const [open, setOpen] = useState(false);
    return (
        <>
            <TableRow sx={{ "&:hover": { backgroundColor: "#f5faff", transition: "0.2s", }, "&:nth-of-type(even)": { backgroundColor: "#fafafa", }, }}>
                <TableCell align="center" sx={{ width: 40 }}>
                    <IconButton size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUp fontSize="small" /> : <KeyboardArrowDown fontSize="small" />}
                    </IconButton>
                </TableCell>

                <TableCell>{scholarship.Name ?? "—"}</TableCell>
                <TableCell align="center">{scholarship.Gpa ?? "—"}</TableCell>
                <TableCell align="center">{scholarship.Percentage ? `${scholarship.Percentage}%` : "—"}</TableCell>

                <TableCell align="center">
                    <Tooltip title={labels.updateScholarship}>
                        <IconButton size="small" color="warning" onClick={() => onUpdate(scholarship.Id)}>
                            <ChangeCircle fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={labels.deleteScholarship}>
                        <IconButton
                            size="small"
                            color="error"
                            disabled={isDeleting && deleteScholarshipId === scholarship.Id}
                            onClick={() => onDelete(scholarship.Id)}
                        >
                            {isDeleting && deleteScholarshipId === scholarship.Id ? <CircularProgress size={16} color="error" /> : <Delete fontSize="small" />}
                        </IconButton>
                    </Tooltip>
                </TableCell>
            </TableRow>

            <TableRow>
                <TableCell colSpan={6} sx={{ p: 0, borderBottom: "none", }}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ px: 3, py: 2, borderRadius: 1, background: "linear-gradient(180deg, #f3f7fcff 0%, #ffffff 100%)", border: "1px solid #e3f2fd", boxShadow: "0 2px 8px rgba(25, 117, 209, 0.08)", transition: "all 0.25s ease", }}>
                            <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                                {labels.scholarshipInfo}
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            <Grid container spacing={2} mb={2}>
                                <DetailField label={labels.name}>
                                    <Typography fontWeight={500} fontSize={14}>{scholarship.Name}</Typography>
                                </DetailField>

                                <DetailField label={labels.gpa}>
                                    <Typography fontWeight={500} fontSize={14}>
                                        {scholarship.Gpa ?? "—"}
                                    </Typography>
                                </DetailField>

                                <DetailField label={labels.percentage}>
                                    <Typography fontWeight={500} fontSize={14}>
                                        {scholarship.Percentage ? `${scholarship.Percentage}%` : "—"}
                                    </Typography>
                                </DetailField>

                                <DetailField label={labels.visaType}>
                                    <Typography fontWeight={500} fontSize={14}>{scholarship.VisaType ?? "—"}</Typography>
                                </DetailField>

                                <DetailField label={labels.languageLevel}>
                                    <Typography fontWeight={500} fontSize={14}>{scholarship.LanguageLevel ?? "—"}</Typography>
                                </DetailField>

                                <Grid size={{ xs: 12 }}>
                                    <Typography variant="caption" color="text.secondary" display="block" mb={0.3}>
                                        {labels.description}
                                    </Typography>
                                    <Typography fontWeight={500} fontSize={14}>
                                        {scholarship.Description ?? "—"}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}

export default function ManageScholarshipPage() {
    const [inputValue, setInputValue] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [selectedScholarshipId, setSelectedScholarshipId] = useState<string | null>(null);
    const [deleteScholarshipId, setDeleteScholarshipId] = useState<string | null>(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const userInfo = getUserInfo();
    const dispatch = useDispatch<AppDispatch>();
    const organizationId = userInfo?.OrganizationId || "";

    const [deleteScholarship, { isLoading: isDeleting }] = useDeleteScholarshipMutation();
    const [fetchScholarships, { data, isLoading, isError }] = useLazyGetScholarshipsByOrganizationQuery();

    const queryParams: ScholarshipFilterParams = {
        page: page + 1,
        size: rowsPerPage,
        organizationId,
        searchValue: searchValue,
    };

    useEffect(() => { if (organizationId) { fetchScholarships(queryParams); } }, [page, rowsPerPage, searchValue, organizationId]);

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
        setSelectedScholarshipId(id);
        setOpenUpdateDialog(true);
    }, []);

    const handleDelete = useCallback((id: string) => {
        setDeleteScholarshipId(id);
        setOpenDeleteDialog(true);
    }, []);

    const handleCloseDelete = useCallback(() => { setOpenDeleteDialog(false); setDeleteScholarshipId(null); }, []);

    const handleConfirmDelete = useCallback(async () => {
        if (!deleteScholarshipId) return;
        try {
            await deleteScholarship(deleteScholarshipId).unwrap();
            dispatch(showSnackbar({ message: labels.deleteSuccess, severity: "success" }));
            handleCloseDelete();
            if ((data?.Items?.length ?? 0) === 1 && page > 0) setPage((p) => p - 1);
        } catch {
            dispatch(showSnackbar({ message: labels.deleteFailed, severity: "error" }));
        }
    }, [deleteScholarshipId, deleteScholarship, dispatch, handleCloseDelete, data?.Items?.length, page]);

    const handlePageChange = useCallback((_: unknown, newPage: number) => {
        setPage(newPage);
    }, []);

    const handleRowsPerPageChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }, []);

    const renderTableContent = () => {
        if (isLoading) {
            return (
                <TableRow>
                    <TableCell colSpan={6} align="center">
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
                    <TableCell colSpan={6} align="center">
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
                    <TableCell colSpan={6} align="center">
                        <Typography sx={{ py: 4 }}>
                            {labels.noData}
                        </Typography>
                    </TableCell>
                </TableRow>
            );
        }

        return data.Items.map((scholarship: ScholarshipResponse) => (
            <ScholarshipRow
                key={scholarship.Id}
                scholarship={scholarship}
                onUpdate={handleOpenUpdate}
                isDeleting={isDeleting}
                deleteScholarshipId={selectedScholarshipId}
                onDelete={handleDelete}
            />
        ));
    };

    return (
        <>
            <Grid container spacing={2} alignItems="center" justifyContent="start">
                <Grid size={{ xs: 12, sm: 8, md: 9, lg: 8 }}>
                    <Paper sx={{ display: "flex", alignItems: "center", px: 1, borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.05)", border: "1px solid #e0e0e0", }}>
                        <InputBase sx={{ ml: 1, flex: 1 }} placeholder={labels.searchScholarship} value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} />
                        <IconButton onClick={handleClearSearch} sx={{ p: "10px" }} aria-label="clear">
                            <Clear />
                        </IconButton>
                        <IconButton onClick={handleSearch} sx={{ p: "10px" }} aria-label="search">
                            <Search />
                        </IconButton>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, sm: 4, md: 3, lg: "auto" }} sx={{ display: "flex", justifyContent: { xs: "stretch", sm: "flex-end" } }}>
                    <Button variant="contained" sx={{ borderRadius: 2, textTransform: "none", backgroundColor: "#1975d1", px: 2, py: 1, whiteSpace: "nowrap", }} startIcon={<Add />} onClick={() => setOpenCreateDialog(true)}>
                        {labels.addIcon}
                    </Button>
                </Grid>

                <Grid size={12}>
                    <TableContainer component={Paper} sx={{ borderRadius: 1, boxShadow: "0 4px 20px rgba(0,0,0,0.05)", overflow: "hidden", overflowX: "auto", }}>
                        <Table sx={{ minWidth: 650 }} size="small" aria-label="scholarship collapsible table">
                            <TableHead>
                                <TableRow sx={{ background: "linear-gradient(90deg, #3f88d1ff, #3f88d1ff)", "& th": { color: "#fff", fontWeight: 500, fontSize: 15, borderBottom: "none", }, }}>
                                    <TableCell align="center"> <ExpandIcon fontSize="small" /> </TableCell>
                                    <TableCell>{labels.name}</TableCell>
                                    <TableCell align="center">{labels.gpa}</TableCell>
                                    <TableCell align="center">{labels.percentage}</TableCell>
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
                            labelRowsPerPage={labels.rowsPerPage}
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={handleRowsPerPageChange}
                            rowsPerPageOptions={[5, 10, 25, 50]}
                            sx={{ "& .MuiTablePagination-actions button": { color: "inherit" }, "& .MuiSvgIcon-root": { fontSize: 20 } }}
                        />
                    </TableContainer>
                </Grid>
            </Grid>

            <UpdateScholarshipDialog
                open={openUpdateDialog}
                scholarshipId={selectedScholarshipId}
                onClose={() => {
                    setOpenUpdateDialog(false);
                    setSelectedScholarshipId(null);
                }}
            />
            <CreateScholarshipDialog
                open={openCreateDialog}
                onClose={() => { setOpenCreateDialog(false); }}
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