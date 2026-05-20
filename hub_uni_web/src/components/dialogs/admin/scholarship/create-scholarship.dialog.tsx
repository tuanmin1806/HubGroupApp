import Close from "@mui/icons-material/Close";
import SchoolOutlined from "@mui/icons-material/SchoolOutlined";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useLazyGetLanguageLevelsByPageQuery } from "../../../../app/features/language-level.api";
import { useCreateScholarshipMutation } from "../../../../app/features/scholarship.api";
import { showSnackbar } from "../../../../app/features/snackbar/snackbar.slice";
import { useLazyGetVisaTypesByPageQuery } from "../../../../app/features/visa-type.api";
import { CreateScholarshipRequest } from "../../../../app/models/scholarship.model";
import { getUserInfo } from "../../../../app/services/auth.service";
import { AppDispatch } from "../../../../app/store";
import { createAsyncLoader } from "../../../../helper/asyncLoaders";
import AsyncAutocomplete, { SelectOption } from "../../../base/AsyncAutocomplete";
import labelsVi from "../../../../i18n/labels.vi";

const RequiredStar = () => <Box component="span" sx={{ color: "error.main" }}>*</Box>;

const labels = labelsVi.scholarship;

interface SectionHeaderProps {
    icon: React.ReactNode;
    title: string;
}

function SectionHeader({ icon, title }: SectionHeaderProps) {
    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2, }} >
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: "8px", bgcolor: "primary.main", color: "white", flexShrink: 0, }} >
                {icon}
            </Box>
            <Typography variant="h6" fontWeight={600} color="text.primary" sx={{ letterSpacing: 0.3 }} >
                {title}
            </Typography>
        </Box>
    );
}

interface CreateScholarshipDialogProps {
    open: boolean;
    onClose: () => void;
}

const defaultForm: CreateScholarshipRequest = {
    OrganizationId: "",
    Name: "",
    Gpa: null,
    VisaTypeId: "",
    LanguageLevelId: "",
    Percentage: null,
    Description: "",
};

interface FormErrors {
    Name?: string;
    Gpa?: string;
    Percentage?: string;
}

export default function CreateScholarshipDialog({ open, onClose }: CreateScholarshipDialogProps) {
    const dispatch = useDispatch<AppDispatch>();
    const userInfo = getUserInfo();
    const organizationId = userInfo?.OrganizationId || "";

    const [form, setForm] = useState<CreateScholarshipRequest>(defaultForm);
    const [errors, setErrors] = useState<FormErrors>({});
    const [selectedVisaType, setSelectedVisaType] = useState<SelectOption | null>(null);
    const [selectedLanguageLevel, setSelectedLanguageLevel] = useState<SelectOption | null>(null);

    const [createScholarship, { isLoading: isCreating }] = useCreateScholarshipMutation();
    const [getLanguageLevels] = useLazyGetLanguageLevelsByPageQuery();
    const [getVisaTypes] = useLazyGetVisaTypesByPageQuery();

    const loadLanguageLevels = createAsyncLoader(getLanguageLevels);
    const loadVisaTypes = createAsyncLoader(getVisaTypes);

    const handleChange = (field: keyof CreateScholarshipRequest, value: unknown) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const handleVisaTypeChange = (option: SelectOption | null) => {
        setSelectedVisaType(option);
        handleChange("VisaTypeId", option?.value || "");
    };

    const handleLanguageLevelChange = (option: SelectOption | null) => {
        setSelectedLanguageLevel(option);
        handleChange("LanguageLevelId", option?.value || "");
    };

    const validate = (): boolean => {
        const newErrors: FormErrors = {};

        if (!form.Name.trim()) newErrors.Name = labels.nameRequired;
        if (form.Gpa !== null && form.Gpa !== "") {
            const gpaNum = parseFloat(form.Gpa);
            if (isNaN(gpaNum) || gpaNum < 0 || gpaNum > 10.0) newErrors.Gpa = labels.gpaInvalid;
        }

        if (form.Percentage !== null && form.Percentage !== "") {
            const percentageNum = parseFloat(form.Percentage);
            if (isNaN(percentageNum) || percentageNum < 0 || percentageNum > 100) newErrors.Percentage = labels.percentageInvalid;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleClose = () => {
        setForm(defaultForm);
        setErrors({});
        setSelectedVisaType(null);
        setSelectedLanguageLevel(null);
        onClose();
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        try {
            await createScholarship({ ...form, OrganizationId: organizationId }).unwrap();
            dispatch(showSnackbar({ message: labels.createSuccess, severity: "success" }));
            handleClose();
        } catch (err) {
            dispatch(showSnackbar({ message: labels.createError, severity: "error" }));
        }
    };

    const isSaveDisabled = (): boolean => !form.Name.trim() || !form.VisaTypeId || !form.LanguageLevelId || !form.Percentage || !form.Gpa || isCreating;

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 1 }} >
                <Typography variant="h6" fontWeight={600}>
                    {labels.createScholarship}
                </Typography>
                <IconButton onClick={handleClose} size="small">
                    <Close />
                </IconButton>
            </DialogTitle>
            <Divider />

            <DialogContent sx={{ p: 1 }} >
                <Paper sx={{ p: 1, borderRadius: 2 }} >
                    <SectionHeader icon={<SchoolOutlined sx={{ fontSize: 18 }} />} title={labels.scholarshipInfo} />
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label={<> {labels.name} <RequiredStar /></>}
                                fullWidth
                                size="small"
                                value={form.Name}
                                onChange={(e) => handleChange("Name", e.target.value)}
                                error={!!errors.Name}
                                helperText={errors.Name}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField label={<> {labels.gpa} <RequiredStar /></>} fullWidth size="small" type="number" inputProps={{ min: 0, max: 4.0, step: 0.01 }} value={form.Gpa ?? ""} onChange={(e) => handleChange("Gpa", e.target.value || null)} error={!!errors.Gpa} helperText={errors.Gpa} />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField label={<> {labels.percentage} <RequiredStar /></>} fullWidth size="small" type="number" inputProps={{ min: 0, max: 100, step: 1 }} value={form.Percentage ?? ""} onChange={(e) => handleChange("Percentage", e.target.value || null)} error={!!errors.Percentage} helperText={errors.Percentage} />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
                                {labels.visaType} <RequiredStar />
                            </Typography>
                            <AsyncAutocomplete
                                label={labels.visaType}
                                loadOptions={loadVisaTypes}
                                value={selectedVisaType}
                                onChange={handleVisaTypeChange}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
                                {labels.languageLevel} <RequiredStar />
                            </Typography>
                            <AsyncAutocomplete
                                label={labels.languageLevel}
                                loadOptions={loadLanguageLevels}
                                value={selectedLanguageLevel}
                                onChange={handleLanguageLevelChange}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <TextField label={labels.description} fullWidth size="small" multiline rows={4} value={form.Description} onChange={(e) => handleChange("Description", e.target.value)} />
                        </Grid>
                    </Grid>
                </Paper>
            </DialogContent>

            <DialogActions sx={{ px: 2, py: 1, gap: 1 }}>
                <Button
                    onClick={handleClose}
                    variant="outlined"
                    color="inherit"
                    disabled={isCreating}
                >
                    {labels.cancel}
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    disabled={isSaveDisabled()}
                    startIcon={isCreating ? <CircularProgress size={16} color="inherit" /> : null}
                >
                    {isCreating ? labels.saving : labels.save}
                </Button>
            </DialogActions>
        </Dialog>
    );
}