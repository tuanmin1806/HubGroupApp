import { useState } from "react";
import Close from "@mui/icons-material/Close";
import Warning from "@mui/icons-material/Warning";
import CheckCircle from "@mui/icons-material/CheckCircle";
import Business from "@mui/icons-material/Business";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { useCreateApplicationMutation } from "../../../app/features/application.api";
import { getUserInfo } from "../../../app/services/auth.service";
import { showSnackbar } from "../../../app/features/snackbar/snackbar.slice";
import { AppDispatch } from "../../../app/store";
import { useDispatch } from "react-redux";
import labelsVi from "../../../i18n/labels.vi";
import { Requirement } from "../../../app/models/recruitment-post.model";
import { ConvertService } from "../../../app/services/convert.service";
import { Cake, Wc, Work, School, AccessTime, RunningWithErrors, Flight } from "@mui/icons-material";

const labels = labelsVi.applyConfirm;

interface ApplyConfirmDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    organizationName: string;
    organizationLogo?: string;
    jobTitle: string;
    recruitmentPostId: string;
    requirement?: Requirement
}

const ApplyConfirmDialog = ({
    open,
    onClose,
    onSuccess,
    organizationName,
    organizationLogo,
    jobTitle,
    recruitmentPostId,
    requirement
}: ApplyConfirmDialogProps) => {
    const [agreed, setAgreed] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const [createApplication, { isLoading }] = useCreateApplicationMutation();

    const handleClose = () => {
        if (isLoading) return;
        setAgreed(false);
        setErrorMsg(null);
        onClose();
    };

    const handleConfirm = async () => {
        if (!agreed || isLoading) return;

        const userInfo = getUserInfo();
        if (!userInfo?.Id) {
            setErrorMsg(labels.errorMsg);
            return;
        }

        try {
            setErrorMsg(null);
            await createApplication({
                CustomerId: userInfo.Id,
                RecruitmentPostId: recruitmentPostId,
            }).unwrap();
            dispatch(showSnackbar({ message: labels.applySuccess, severity: "success" }));
            handleClose();
            onSuccess?.();
        } catch (err: any) {
            dispatch(showSnackbar({ message: labels.applyFailed, severity: "error" }));
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
        >
            {/* Header */}
            <DialogTitle
                sx={{
                    background: "linear-gradient(135deg, #fc7248 0%, #ff9800 100%)",
                    color: "white",
                    py: 2,
                    px: 2,
                    position: "relative",
                }}
            >
                <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar
                        src={organizationLogo || undefined}
                        sx={{
                            width: 72,
                            height: 72,
                            bgcolor: "rgba(255,255,255,0.25)",
                            border: "2px solid rgba(255,255,255,0.5)",
                            fontSize: "1.25rem",
                            fontWeight: 700,
                        }}
                    >
                        {!organizationLogo && <Business sx={{ fontSize: 26 }} />}
                    </Avatar>
                    <Box flex={1}>
                        <Typography
                            variant="caption"
                            sx={{
                                color: "rgba(255,255,255,0.85)",
                                fontWeight: 500,
                                letterSpacing: 0.5,
                                textTransform: "uppercase",
                                fontSize: "0.7rem",
                            }}
                        >
                            {labels.title}
                        </Typography>
                        <Typography
                            variant="h6"
                            fontWeight={700}
                            sx={{
                                lineHeight: 1.3,
                                fontSize: { xs: "1rem", sm: "1.15rem" },
                            }}
                        >
                            {jobTitle}
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                color: "rgba(255,255,255,0.8)",
                                mt: 0.25,
                                fontSize: "0.8rem",
                                display: "-webkit-box",
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                            }}
                        >
                            {organizationName}
                        </Typography>
                    </Box>
                    <IconButton
                        onClick={handleClose}
                        size="small"
                        disabled={isLoading}
                        sx={{
                            color: "white",
                            bgcolor: "rgba(255,255,255,0.15)", "&:hover": { bgcolor: "rgba(255,255,255,0.25)" },
                            alignSelf: "flex-start",
                        }}
                    >
                        <Close fontSize="medium" />
                    </IconButton>
                </Stack>
            </DialogTitle>

            <DialogContent sx={{ p: 2, paddingTop: "18px !important" }}>
                <Stack spacing={1}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            bgcolor: "#fff8f0",
                            border: "1px solid #ffe0b2",
                            borderLeft: "4px solid #ff9800",
                            borderRadius: 2,
                        }}
                    >
                        <Stack direction="row" spacing={1.5} alignItems="flex-start">
                            <Warning
                                sx={{
                                    color: "#ff9800",
                                    fontSize: 22,
                                    mt: 0.2,
                                    flexShrink: 0,
                                }}
                            />
                            <Box>
                                <Typography
                                    variant="subtitle2"
                                    fontWeight={700}
                                    color="#e65100"
                                    gutterBottom
                                    sx={{ fontSize: "0.85rem" }}
                                >
                                    {labels.importantNote}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ lineHeight: 1.7, fontSize: "0.82rem" }}
                                >
                                    {labels.importantNoteContent}{" "}
                                    <Link
                                        href="mailto:contact@hubgroup.vn"
                                        sx={{
                                            color: "#ff5722",
                                            fontWeight: 600,
                                            textDecorationColor: "#ff5722",
                                        }}
                                    >
                                        {labels.contactEmail}
                                    </Link>{" "}
                                    {labels.importantNoteContent2}
                                </Typography>
                            </Box>
                        </Stack>
                    </Paper>

                    {requirement && (
                        <Box
                            sx={{
                                borderRadius: 2,
                                border: "1px solid #e3f2fd",
                                overflow: "hidden",
                            }}
                        >
                            <Box
                                sx={{
                                    px: 2,
                                    py: 1,
                                    background: 'linear-gradient(135deg, #1565c0 0%, #1e88e5 60%, #42a5f5 100%)',
                                }}
                            >
                                <Typography
                                    variant="subtitle2"
                                    fontWeight={700}
                                    color="white"
                                    sx={{ fontSize: "0.85rem" }}
                                >
                                    {labels.requirement}
                                </Typography>
                            </Box>

                            <Box sx={{ p: 1.5 }}>
                                <Stack spacing={1}>
                                    {(requirement.FromAge != null || requirement.ToAge != null) && (
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Box sx={{
                                                width: 28, height: 28, borderRadius: 1,
                                                bgcolor: "#fff3e0", display: "flex",
                                                alignItems: "center", justifyContent: "center"
                                            }}>
                                                <Cake sx={{ fontSize: 16, color: "#ff5722" }} />
                                            </Box>
                                            <Typography variant="body2">
                                                {labels.age}:{" "}
                                                <b>
                                                    {requirement.FromAge != null ? `Từ ${requirement.FromAge}` : ""}
                                                    {requirement.FromAge != null && requirement.ToAge != null ? " " : ""}
                                                    {requirement.ToAge != null ? `đến ${requirement.ToAge}` : ""}
                                                    {(requirement.FromAge != null || requirement.ToAge != null) && " tuổi"}
                                                </b>
                                            </Typography>
                                        </Stack>
                                    )}

                                    {requirement.Gender && (
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Box sx={{
                                                width: 28, height: 28, borderRadius: 1,
                                                bgcolor: "#e3f2fd", display: "flex",
                                                alignItems: "center", justifyContent: "center"
                                            }}>
                                                <Wc sx={{ fontSize: 16, color: "#1976d2" }} />
                                            </Box>
                                            <Typography variant="body2">
                                                {labels.gender}:{" "}
                                                <b>
                                                    {ConvertService.convertGender(
                                                        ConvertService.convertGenderFromString(requirement.Gender)
                                                    )}
                                                </b>
                                            </Typography>
                                        </Stack>
                                    )}

                                    {requirement.Experience && (
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Box sx={{
                                                width: 28, height: 28, borderRadius: 1,
                                                bgcolor: "#e8f5e9", display: "flex",
                                                alignItems: "center", justifyContent: "center"
                                            }}>
                                                <Work sx={{ fontSize: 16, color: "#388e3c" }} />
                                            </Box>
                                            <Typography variant="body2">
                                                {labels.experience}:{" "}
                                                <b>
                                                    {ConvertService.convertJobExperience(
                                                        ConvertService.convertJobExperienceFromString(requirement.Experience)
                                                    )}
                                                </b>
                                            </Typography>
                                        </Stack>
                                    )}

                                    {requirement.EducationLevel && (
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Box sx={{
                                                width: 28, height: 28, borderRadius: 1,
                                                bgcolor: "#f3e5f5", display: "flex",
                                                alignItems: "center", justifyContent: "center"
                                            }}>
                                                <School sx={{ fontSize: 16, color: "#7b1fa2" }} />
                                            </Box>
                                            <Typography variant="body2">
                                                {labels.educationLevel}:{" "}
                                                <b>
                                                    {ConvertService.convertEducationLevel(
                                                        ConvertService.convertEducationLevelFromString(requirement.EducationLevel)
                                                    )}
                                                </b>
                                            </Typography>
                                        </Stack>
                                    )}

                                    {requirement.MinimumGpa != null && (
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Box sx={{
                                                width: 28, height: 28, borderRadius: 1,
                                                bgcolor: "#fff8e1", display: "flex",
                                                alignItems: "center", justifyContent: "center"
                                            }}>
                                                <Typography sx={{ fontSize: 12, fontWeight: 800, color: "#f57c00" }}>
                                                    {labels.gpa}
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2">
                                                {labels.minimumGpa}: <b>{requirement.MinimumGpa}</b>
                                            </Typography>
                                        </Stack>
                                    )}

                                    {requirement.MaxYearsSinceGrad != null && (
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Box sx={{
                                                width: 28, height: 28, borderRadius: 1,
                                                bgcolor: "#e1f5fe", display: "flex",
                                                alignItems: "center", justifyContent: "center"
                                            }}>
                                                <AccessTime sx={{ fontSize: 16, color: "#0288d1" }} />
                                            </Box>
                                            <Typography variant="body2">
                                                {labels.maxYearsSinceGrad}: <b>{requirement.MaxYearsSinceGrad} năm</b>
                                            </Typography>
                                        </Stack>
                                    )}

                                    {requirement.MaxAbsence != null && (
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Box sx={{
                                                width: 28, height: 28, borderRadius: 1,
                                                bgcolor: "#ffebee", display: "flex",
                                                alignItems: "center", justifyContent: "center"
                                            }}>
                                                <RunningWithErrors sx={{ fontSize: 16, color: "#c62828" }} />
                                            </Box>
                                            <Typography variant="body2">
                                                {labels.maxAbsence}: <b>{requirement.MaxAbsence} buổi</b>
                                            </Typography>
                                        </Stack>
                                    )}

                                    {requirement.VisaType && (
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Box sx={{
                                                width: 28, height: 28, borderRadius: 1,
                                                bgcolor: "#fce4ec", display: "flex",
                                                alignItems: "center", justifyContent: "center"
                                            }}>
                                                <Flight sx={{ fontSize: 16, color: "#d81b60" }} />
                                            </Box>
                                            <Typography variant="body2">
                                                {labels.visaType}: <b>{requirement.VisaType}</b>
                                            </Typography>
                                        </Stack>
                                    )}
                                </Stack>
                            </Box>
                        </Box>
                    )}

                    <Divider />

                    <Box>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={agreed}
                                    onChange={(e) => setAgreed(e.target.checked)}
                                    disabled={isLoading}
                                    sx={{ color: "#ff5722", "&.Mui-checked": { color: "#ff5722" } }}
                                />
                            }
                            label={
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ fontSize: "0.85rem" }}
                                >
                                    {labels.agreement}{" "}
                                    <Link
                                        href="https://hubgroup.vn/dieu-khoan-su-dung"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        sx={{
                                            color: "#ff5722",
                                            fontWeight: 600,
                                            textDecorationColor: "#ff5722",
                                        }}
                                    >
                                        {labels.termsOfUse}
                                    </Link>{" "}
                                    {labels.ofHubGroup}
                                </Typography>
                            }
                            sx={{ alignItems: "center" }}
                        />
                    </Box>

                    {errorMsg && (
                        <Alert severity="error" sx={{ borderRadius: 2 }}>
                            {errorMsg}
                        </Alert>
                    )}
                </Stack>
            </DialogContent>

            <DialogActions sx={{ px: 2, pb: 2, pt: 0, gap: 1.5 }}>
                <Button
                    variant="outlined"
                    onClick={handleClose}
                    disabled={isLoading}
                    fullWidth
                    sx={{
                        borderColor: "#e0e0e0",
                        color: "text.secondary",
                        fontWeight: 600,
                        py: 0.75,
                        borderRadius: 2,
                        "&:hover": {
                            borderColor: "#bdbdbd",
                            bgcolor: "#f5f5f5",
                        },
                    }}
                >
                    {labels.cancel}
                </Button>
                <Button
                    variant="contained"
                    onClick={handleConfirm}
                    disabled={!agreed || isLoading}
                    fullWidth
                    startIcon={isLoading ? (<CircularProgress size={18} sx={{ color: "white" }} />) : agreed ? (<CheckCircle />) : undefined}
                    sx={{
                        fontWeight: 700,
                        py: 0.75,
                        borderRadius: 2,
                        fontSize: "0.95rem",
                        background: agreed && !isLoading ? "linear-gradient(135deg, #fc7248 0%, #ff9800 100%)" : undefined,
                        boxShadow: agreed && !isLoading ? "0 4px 15px rgba(252,114,72,0.4)" : "none",
                        transition: "all 0.3s ease",
                        "&:hover": {
                            background: agreed && !isLoading ? "linear-gradient(135deg, #e64a19 0%, #f57c00 100%)" : undefined,
                            boxShadow: agreed && !isLoading ? "0 6px 20px rgba(252,114,72,0.5)" : "none",
                        },
                        "&.Mui-disabled": {
                            background: "#e0e0e0",
                            color: "#9e9e9e",
                        },
                    }}
                >
                    {isLoading ? labels.applying : labels.confirmApply}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ApplyConfirmDialog;