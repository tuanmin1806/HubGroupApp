import * as React from "react";
import { lazy, useState, useCallback } from "react";
import Add from "@mui/icons-material/Add";
import Clear from "@mui/icons-material/Clear";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import Search from "@mui/icons-material/Search";
import Visibility from "@mui/icons-material/Visibility";
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
import Tooltip from "@mui/material/Tooltip";
import TablePagination from "@mui/material/TablePagination";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import { RecruitmentPostFilterParams, RecruitmentPostResponse } from "../../app/models/recruitment-post.model";
import { useDeleteRecruitmentPostMutation, useGetRecruitmentPostsByOrganizationQuery } from "../../app/features/recruitment-post.api";
import { ConvertService } from "../../app/services/convert.service";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utils/date.utils";
import { getUserInfo } from "../../app/services/auth.service";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { showSnackbar } from "../../app/features/snackbar/snackbar.slice";
import { useRoutePrefix } from "../../hooks/useRoutePrefix";
import { EducationLevel, Gender, JobExperience, RecruitPostStatus } from "../../app/models/enums.model";
import { formatCurrency } from "../../utils/recruitment-post.utils";
import labelsVi from "../../i18n/labels.vi";

const UpdateRecruitmentPostDialog = lazy(() => import("../../components/dialogs/staff/update-recruitment-post.dialog"));
const ViewRecruitmentPostDialog = lazy(() => import("../../components/dialogs/admin/view-recruitment-post-detail.dialog"));
const ConfirmDialog = lazy(() => import("../../components/dialogs/general/confirm.dialog"));

const STATUS_STYLE: Record<string, { bgcolor: string; color: string; border: string }> = {
    Active: { bgcolor: "#e8f5e9", color: "#2e7d32", border: "#a5d6a7" },
    Inactive: { bgcolor: "#fff3e0", color: "#e65100", border: "#ffcc80" },
    Closed: { bgcolor: "#fce4ec", color: "#c62828", border: "#ef9a9a" },
    Draft: { bgcolor: "#f5f5f5", color: "#757575", border: "#e0e0e0" },
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

function StatusChip({ status }: { status: RecruitPostStatus }) {
    const style = STATUS_STYLE[status] ?? STATUS_STYLE.Draft;
    return (
        <Chip
            label={ConvertService.convertPostStatus(ConvertService.convertPostStatusFromString(status))}
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
}

interface PostRowProps {
    post: RecruitmentPostResponse;
    isDeleting: boolean;
    deletePostId: string | null;
    onView: (id: string) => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

const labels = labelsVi.recruitmentPost;

function PostRow({ post, isDeleting, deletePostId, onView, onEdit, onDelete }: PostRowProps) {
    const [open, setOpen] = useState(false);
    const req = post.Requirement;

    return (
        <React.Fragment>
            <TableRow>
                <TableCell sx={{ width: 40, pl: 1 }}>
                    <IconButton size="small" onClick={() => setOpen(!open)} aria-label="expand row">
                        {open ? <KeyboardArrowUp fontSize="small" /> : <KeyboardArrowDown fontSize="small" />}
                    </IconButton>
                </TableCell>

                <TableCell>
                    <Box display="flex" alignItems="center" gap={0.5}>
                        <Typography variant="body2" fontWeight={600}>
                            {post.Name}
                        </Typography>
                    </Box>
                </TableCell>

                <TableCell>{post.Province ?? "—"}</TableCell>
                <TableCell>{post.Quantity.toLocaleString("vi-VN")}</TableCell>
                <TableCell>{formatDate(post.RecruitmentToDate)}</TableCell>

                <TableCell>
                    <StatusChip status={post.RecruitPostStatus} />
                </TableCell>

                <TableCell align="center">
                    <Tooltip title={labels.view}>
                        <IconButton size="small" color="info" onClick={() => onView(post.Id)}>
                            <Visibility fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={labels.update}>
                        <IconButton size="small" color="primary" onClick={() => onEdit(post.Id)}>
                            <Edit fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={labels.delete}>
                        <IconButton
                            size="small"
                            color="error"
                            disabled={isDeleting && deletePostId === post.Id}
                            onClick={() => onDelete(post.Id)}
                        >
                            {isDeleting && deletePostId === post.Id ? <CircularProgress size={16} color="error" /> : <Delete fontSize="small" />}
                        </IconButton>
                    </Tooltip>
                </TableCell>
            </TableRow>

            <TableRow>
                <TableCell colSpan={7} sx={{ py: 0 }}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ px: 3, py: 2, bgcolor: "action.hover", borderRadius: 1 }}>
                            <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                                {labels.recruitmentBasicInfo}
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Grid container spacing={2} mb={2}>
                                <DetailField label={labels.recruitmentPeriod}>
                                    <Typography variant="body2" fontWeight={500}>
                                        {formatDate(post.RecruitmentFromDate)} — {formatDate(post.RecruitmentToDate)}
                                    </Typography>
                                </DetailField>
                                <DetailField label={labels.province}>
                                    <Typography variant="body2" fontWeight={500}>{post.Province ?? "—"}</Typography>
                                </DetailField>
                                <DetailField label={labels.quantity}>
                                    <Typography variant="body2" fontWeight={500}>{post.Quantity}</Typography>
                                </DetailField>
                                <DetailField label={labels.cost}>
                                    <Typography variant="body2" fontWeight={500}>{post.MinCost === post.MaxCost ? formatCurrency(post.MinCost) : `${formatCurrency(post.MinCost)} – ${formatCurrency(post.MaxCost)} ${post.Currency}`}</Typography>
                                </DetailField>
                                <DetailField label={labels.status}>
                                    <StatusChip status={post.RecruitPostStatus} />
                                </DetailField>
                                <DetailField label={labels.updatedAt}>
                                    <Typography variant="body2" fontWeight={500}>{formatDate(post.UpdatedAt) ?? "—"}</Typography>
                                </DetailField>
                            </Grid>
                            {post.Professions?.length > 0 && (
                                <>
                                    <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                                        {labels.profession}
                                    </Typography>
                                    <Divider sx={{ mb: 1.5 }} />
                                    <Stack direction="row" flexWrap="wrap" gap={1} mb={2}>
                                        {post.Professions.map((p) => (
                                            <Chip
                                                key={p.Id}
                                                label={p.Name}
                                                size="small"
                                                variant="outlined"
                                                color="primary"
                                            />
                                        ))}
                                    </Stack>
                                </>
                            )}

                            {req && (
                                <>
                                    <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                                        {labels.recruitmentRequirements}
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    <Grid container spacing={2} mb={2}>
                                        {(req.FromAge || req.ToAge) && (
                                            <DetailField label={labels.ageRange}>
                                                <Typography variant="body2" fontWeight={500}>
                                                    {req.FromAge} – {req.ToAge} {labels.age}
                                                </Typography>
                                            </DetailField>
                                        )}
                                        {req.Gender && ConvertService.convertGenderFromString(req.Gender) !== Gender.Undefined && (
                                            <DetailField label={labels.gender}>
                                                <Typography variant="body2" fontWeight={500}>
                                                    {ConvertService.convertGender(ConvertService.convertGenderFromString(req.Gender))}
                                                </Typography>
                                            </DetailField>
                                        )}
                                        {req.EducationLevel && ConvertService.convertEducationLevelFromString(req.EducationLevel) !== EducationLevel.Undefined && (
                                            <DetailField label={labels.educationLevel}>
                                                <Typography variant="body2" fontWeight={500}>
                                                    {ConvertService.convertEducationLevel(ConvertService.convertEducationLevelFromString(req.EducationLevel)) ?? req.EducationLevel}
                                                </Typography>
                                            </DetailField>
                                        )}
                                        {req.Experience && ConvertService.convertJobExperienceFromString(req.Experience) !== JobExperience.Undefined && (
                                            <DetailField label={labels.experience}>
                                                <Typography variant="body2" fontWeight={500}>
                                                    {ConvertService.convertJobExperience(ConvertService.convertJobExperienceFromString(req.Experience)) ?? req.Experience}
                                                </Typography>
                                            </DetailField>
                                        )}
                                        {req.MinimumGpa != null && req.MinimumGpa > 0 && (
                                            <DetailField label={labels.minimumGpa}>
                                                <Typography variant="body2" fontWeight={500}>{req.MinimumGpa}</Typography>
                                            </DetailField>
                                        )}
                                        {req.MaxYearsSinceGrad != null && req.MaxYearsSinceGrad > 0 && (
                                            <DetailField label={labels.maxYearsSinceGrad}>
                                                <Typography variant="body2" fontWeight={500}>{req.MaxYearsSinceGrad} {labels.year}</Typography>
                                            </DetailField>
                                        )}
                                        {req.MaxAbsence != null && req.MaxAbsence > 0 && (
                                            <DetailField label={labels.maxAbsence}>
                                                <Typography variant="body2" fontWeight={500}>{req.MaxAbsence} {labels.absence}</Typography>
                                            </DetailField>
                                        )}
                                    </Grid>
                                    {req.OtherReqs?.length > 0 && (
                                        <Box mb={2}>
                                            <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
                                                {labels.otherReqs}
                                            </Typography>
                                            <Stack spacing={0.5}>
                                                {req.OtherReqs.map((r, i) => (
                                                    <Typography key={i} variant="body2" sx={{ pl: 1, borderLeft: "2px solid", borderColor: "primary.main" }}>
                                                        {r}
                                                    </Typography>
                                                ))}
                                            </Stack>
                                        </Box>
                                    )}
                                </>
                            )}

                            {post.Highlights?.length > 0 && (
                                <>
                                    <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                                        {labels.highlights}
                                    </Typography>
                                    <Divider sx={{ mb: 1.5 }} />
                                    <Stack spacing={0.5}>
                                        {post.Highlights.map((h, i) => (
                                            <Typography key={i} variant="body2" sx={{ pl: 1, borderLeft: "2px solid", borderColor: "success.main" }}>
                                                {h}
                                            </Typography>
                                        ))}
                                    </Stack>
                                </>
                            )}

                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

export default function ManageRecruitmentPostPage() {
    const [searchValue, setSearchValue] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [filterParams] = useState<Omit<RecruitmentPostFilterParams, "page" | "size" | "searchValue">>({});
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
    const [openViewDialog, setOpenViewDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deletePostId, setDeletePostId] = useState<string | null>(null);
    const [viewPostId, setViewPostId] = useState<string | null>(null);
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const userInfo = getUserInfo();
    const organizationId = userInfo?.OrganizationId ?? "";
    const prefix = useRoutePrefix();

    const queryParams: RecruitmentPostFilterParams = {
        page: page + 1,
        size: rowsPerPage,
        ...(searchValue ? { searchValue } : {}),
        ...filterParams,
        organizationId,
    };

    const { data, isLoading, isError } = useGetRecruitmentPostsByOrganizationQuery(queryParams);
    const [deleteRecruitmentPost, { isLoading: isDeleting }] = useDeleteRecruitmentPostMutation();

    const handleSearch = useCallback(() => { setSearchValue(inputValue); setPage(0); }, [inputValue]);
    const handleClearSearch = useCallback(() => { setInputValue(""); setSearchValue(""); setPage(0); }, []);
    const handleOpenUpdate = useCallback((id: string) => { setSelectedPostId(id); setOpenUpdateDialog(true); }, []);
    const handleCloseUpdate = useCallback(() => { setOpenUpdateDialog(false); setSelectedPostId(null); }, []);
    const handleOpenView = useCallback((id: string) => { setViewPostId(id); setOpenViewDialog(true); }, []);
    const handleCloseView = useCallback(() => { setOpenViewDialog(false); setViewPostId(null); }, []);
    const handleOpenDelete = useCallback((id: string) => { setDeletePostId(id); setOpenDeleteDialog(true); }, []);
    const handleCloseDelete = useCallback(() => { setOpenDeleteDialog(false); setDeletePostId(null); }, []);
    const handlePageChange = useCallback((_: unknown, newPage: number) => { setPage(newPage); }, []);
    const handleRowsPerPageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
    }, []);

    const handleConfirmDelete = useCallback(async () => {
        if (!deletePostId) return;
        try {
            await deleteRecruitmentPost(deletePostId).unwrap();
            dispatch(showSnackbar({ message: labels.deleteSuccess, severity: "success" }));
            handleCloseDelete();
            if ((data?.Items?.length ?? 0) === 1 && page > 0) setPage((p) => p - 1);
        } catch {
            dispatch(showSnackbar({ message: labels.deleteFailed, severity: "error" }));
        }
    }, [deletePostId, deleteRecruitmentPost, dispatch, handleCloseDelete, data?.Items?.length, page]);

    const renderTableContent = () => {
        if (isLoading) {
            return (
                <TableRow>
                    <TableCell colSpan={7} align="center">
                        <Box sx={{ py: 4 }}><CircularProgress size={32} /></Box>
                    </TableCell>
                </TableRow>
            );
        }
        if (isError) {
            return (
                <TableRow>
                    <TableCell colSpan={7} align="center">
                        <Typography color="error" sx={{ py: 4 }}>{labels.loadDataFailed}</Typography>
                    </TableCell>
                </TableRow>
            );
        }
        if (!data?.Items?.length) {
            return (
                <TableRow>
                    <TableCell colSpan={7} align="center">
                        <Typography sx={{ py: 4 }} color="text.secondary">{labels.noData}</Typography>
                    </TableCell>
                </TableRow>
            );
        }

        return data.Items.map((post: RecruitmentPostResponse) => (
            <PostRow
                key={post.Id}
                post={post}
                isDeleting={isDeleting}
                deletePostId={deletePostId}
                onView={handleOpenView}
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
                            placeholder={labels.searchRecruitmentPost}
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
                        {labels.add}
                    </Button>
                </Grid>

                <Grid size={12}>
                    <TableContainer component={Paper} elevation={1}>
                        <Table sx={{ minWidth: 650 }} size="small" aria-label="recruitment post collapsible table">
                            <TableHead>
                                <TableRow>
                                    <TableCell />
                                    <TableCell>{labels.recruitmentProgramName}</TableCell>
                                    <TableCell>{labels.province}</TableCell>
                                    <TableCell>{labels.quantity}</TableCell>
                                    <TableCell>{labels.recruitmentToDate}</TableCell>
                                    <TableCell>{labels.status}</TableCell>
                                    <TableCell align="center">{labels.utility}</TableCell>
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

            <UpdateRecruitmentPostDialog open={openUpdateDialog} postId={selectedPostId} onClose={handleCloseUpdate} />
            <ViewRecruitmentPostDialog open={openViewDialog} postId={viewPostId} onClose={handleCloseView} />
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