import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import InputAdornment from "@mui/material/InputAdornment";
import { useEffect, useState } from "react";
import Close from "@mui/icons-material/Close";
import Add from "@mui/icons-material/Add";
import Delete from "@mui/icons-material/Delete";
import CloudUpload from "@mui/icons-material/CloudUpload";
import { getUserInfo } from "../../../../app/services/auth.service";
import { useLazyGetOrganizationByIdQuery, useUpdateOrganizationMutation } from "../../../../app/features/organization.api";
import { useUploadOneFileMutation, useUploadManyFilesMutation } from "../../../../app/features/mediafile.api";
import RichTextEditorComponent from "../../../editor";
import { OrganizationDetailResponse, Profession } from "../../../../app/models/organization.model";
import { DEFAULT_PAGE } from "../../../../constants/common.constant";
import { useGetProfessionsByPageQuery } from "../../../../app/features/professtion.api";
import { useGetAllProvinceNoAuthenQuery } from "../../../../app/features/province.api";
import { useGetCommunesByProvinceQuery } from "../../../../app/features/commune.api";
import { Province } from "../../../../app/models/province.model";
import { CommuneResponse } from "../../../../app/models/commune.model";
import { OrgStatus } from "../../../../app/models/enums.model";
import { ConvertService } from "../../../../app/services/convert.service";
import { ProfessionResponse } from "../../../../app/models/profession.model";
import { AppDispatch } from "../../../../app/store";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../../../app/features/snackbar/snackbar.slice";
import labelsVi from "../../../../i18n/labels.vi";

const labels = labelsVi.organization;

interface Props {
    open: boolean;
    onClose: () => void;
}

const SectionHeader = ({ title }: { title: string }) => (
    <Grid size={{ xs: 12 }}>
        <Typography variant="caption" fontWeight={700} sx={{ textTransform: "uppercase" }}> {title} </Typography>
    </Grid>
);

const RequiredStar = () => <Box component="span" sx={{ color: "error.main" }}>*</Box>;

function ImageUploadBox({ label, previewUrl, onFileChange, onRemove, required }: {
    label: string;
    previewUrl: string | null;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemove: () => void;
    required?: boolean;
}) {
    return (
        <Box>
            <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 0.5, display: "block", mb: 0.5 }}> {label}{required && <Box component="span" sx={{ color: "error.main", ml: 0.3 }}>*</Box>}</Typography>
            {previewUrl ? (
                <Box sx={{ position: "relative", display: "inline-block" }}>
                    <Box component="img" src={previewUrl} sx={{ width: 96, height: 96, objectFit: "contain", borderRadius: 2, border: "1px solid #e0e0e0", bgcolor: "#fafafa", p: 0.5, display: "block" }} />
                    <IconButton size="small" onClick={onRemove} sx={{ position: "absolute", top: -8, right: -8, bgcolor: "error.main", color: "#fff", width: 20, height: 20, "&:hover": { bgcolor: "error.dark" } }}> <Close sx={{ fontSize: 12 }} /></IconButton>
                </Box>
            ) : (
                <Button component="label" variant="outlined" size="small" startIcon={<CloudUpload />} sx={{ borderStyle: "dashed", borderColor: "#ccc", color: "text.secondary", textTransform: "none", fontSize: 12, py: 1, "&:hover": { borderColor: "#1975d1", color: "#1975d1" } }}> {labels.selectFile} <input type="file" accept="image/*" hidden onChange={onFileChange} /></Button>
            )}
        </Box>
    );
}

const emptyProfession = (): Profession => ({ ProfessionId: "", ProfessionName: "", ProfessionSeoUrl: "", Cost: 0 });

export default function UpdateOrganizationDialog({ open, onClose }: Props) {
    const userInfo = getUserInfo();
    const dispatch = useDispatch<AppDispatch>();
    const organizationId = userInfo?.OrganizationId ?? "";
    const [loadingData, setLoadingData] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedProvinceSeo, setSelectedProvinceSeo] = useState<string>("");

    const [getOrganization] = useLazyGetOrganizationByIdQuery();
    const [updateOrganization] = useUpdateOrganizationMutation();
    const [uploadOneFile] = useUploadOneFileMutation();
    const [uploadManyFiles] = useUploadManyFilesMutation();

    const { data: professionsData } = useGetProfessionsByPageQuery({ page: DEFAULT_PAGE, size: 200 });
    const { data: provinces = [] } = useGetAllProvinceNoAuthenQuery();
    const { data: communes = [] } = useGetCommunesByProvinceQuery(selectedProvinceSeo, { skip: !selectedProvinceSeo, });
    const professionOptions = professionsData?.Items ?? [];

    const [form, setForm] = useState<any>({
        Id: "", Name: "", InternationalName: "", TaxCode: "",
        OrganizationTypeId: "", WebsiteUrl: "", PhoneNumber: "", Email: "",
        ManagedBy: "", Address: "", DormCost: 0, ProvinceId: "", CommuneId: "",
        OrgStatus: OrgStatus.Undefined, IsTop: false, Summary: "", Description: "",
        LogoUrl: "", WallpaperUrl: "",
        FacebookUrl: "", LinkedinUrl: "", YoutubeUrl: "",
        GoogleMapUrl: "", TwitterUrl: "", InstagramUrl: "",
        Highlights: [] as string[],
        FeaturedImageUrls: [] as string[],
        Professions: [] as Profession[],
        MainProfession: emptyProfession(),
    });
    const set = (field: string, value: any) => setForm((prev: any) => ({ ...prev, [field]: value }));

    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [wallpaperPreview, setWallpaperPreview] = useState<string | null>(null);
    const [existingFeaturedFullUrls, setExistingFeaturedFullUrls] = useState<string[]>([]);
    const [existingFeaturedRelUrls, setExistingFeaturedRelUrls] = useState<string[]>([]);
    const [newFeaturedFiles, setNewFeaturedFiles] = useState<{ file: File; preview: string }[]>([]);
    const selectedProvince = provinces.find((p: Province) => p.Id === form.ProvinceId) ?? null;
    const selectedCommune = communes.find((c: CommuneResponse) => c.Id === form.CommuneId) ?? null;

    useEffect(() => {
        if (!open) return;
        setLoadingData(true);
        getOrganization(organizationId).unwrap().then((data: OrganizationDetailResponse) => {
            setForm({
                Id: data.Id ?? "", Name: data.Name ?? "", InternationalName: data.InternationalName ?? "",
                TaxCode: data.TaxCode ?? "", OrganizationTypeId: data.OrganizationTypeId ?? "",
                WebsiteUrl: data.WebsiteUrl ?? "", PhoneNumber: data.PhoneNumber ?? "", Email: data.Email ?? "",
                ManagedBy: data.ManagedBy ?? "", Address: data.Address ?? "", DormCost: data.DormCost ?? 0,
                ProvinceId: data.ProvinceId ?? "", CommuneId: data.CommuneId ?? "",
                OrgStatus: ConvertService.convertOrgStatusFromString(data.OrgStatus) ?? OrgStatus.Undefined, IsTop: data.IsTop ?? false,
                Summary: data.Summary ?? "", Description: data.Description ?? "",
                LogoUrl: data.LogoUrl ?? "", WallpaperUrl: data.WallpaperUrl ?? "",
                FacebookUrl: data.FacebookUrl ?? "", LinkedinUrl: data.LinkedinUrl ?? "",
                YoutubeUrl: data.YoutubeUrl ?? "", GoogleMapUrl: data.GoogleMapUrl ?? "",
                TwitterUrl: data.TwitterUrl ?? "", InstagramUrl: data.InstagramUrl ?? "",
                Highlights: data.Highlights ?? [],
                FeaturedImageUrls: data.FeaturedImageUrls ?? [],
                Professions: data.Professions ?? [],
                MainProfession: data.MainProfession ?? emptyProfession(),
                Currency: data.Currency ?? ""
            });
            if (data.ProvinceId) {
                const matchedProvince = provinces.find((p: Province) => p.Id === data.ProvinceId);
                if (matchedProvince) setSelectedProvinceSeo((matchedProvince as Province).SeoUrl ?? "");
            }
            setLogoPreview(data.LogoFullUrl ?? null);
            setWallpaperPreview(data.WallpaperFullUrl ?? null);
            setExistingFeaturedFullUrls(data.FeaturedImageFullUrls ?? []);
            setExistingFeaturedRelUrls(data.FeaturedImageUrls ?? []);
            setNewFeaturedFiles([]);
        }).catch(() => {
            dispatch(showSnackbar({ message: labels.cannotLoadOrganizationInfo, severity: "error" }));
        }).finally(() => setLoadingData(false));
    }, [open]);

    useEffect(() => {
        if (form.ProvinceId && provinces.length > 0 && !selectedProvinceSeo) {
            const matchedProvince = provinces.find((p: Province) => p.Id === form.ProvinceId);
            if (matchedProvince) setSelectedProvinceSeo((matchedProvince as Province).SeoUrl ?? "");
        }
    }, [provinces, form.ProvinceId]);

    const handleProvinceChange = (_: any, opt: any) => {
        set("ProvinceId", opt?.Id ?? "");
        set("CommuneId", "");
        setSelectedProvinceSeo(opt?.SeoUrl ?? "");
    };

    const handleCommuneChange = (_: any, opt: any) => {
        set("CommuneId", opt?.Id ?? "");
    };

    const validateImage = (file: File) => {
        if (file.size > 5 * 1024 * 1024) { dispatch(showSnackbar({ message: labels.imageSizeExceeded, severity: "error" })); return false; }
        if (!file.type.startsWith("image/")) { dispatch(showSnackbar({ message: labels.invalidImageFile, severity: "error" })); return false; }
        return true;
    };

    const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !validateImage(file)) return;
        try {
            setIsSubmitting(true);
            const res = await uploadOneFile(file).unwrap();
            set("LogoUrl", res.RelativeUrl);
            setLogoPreview(res.FullUrl);
        } catch { dispatch(showSnackbar({ message: labels.uploadFailed, severity: "error" })); }
        finally { setIsSubmitting(false); }
    };

    const handleWallpaperChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !validateImage(file)) return;
        try {
            setIsSubmitting(true);
            const res = await uploadOneFile(file).unwrap();
            set("WallpaperUrl", res.RelativeUrl);
            setWallpaperPreview(res.FullUrl);
        } catch { dispatch(showSnackbar({ message: labels.uploadFailed, severity: "error" })); }
        finally { setIsSubmitting(false); }
    };

    const handleFeaturedImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        const valid: { file: File; preview: string }[] = [];
        for (let i = 0; i < files.length; i++) {
            if (!validateImage(files[i])) continue;
            valid.push({ file: files[i], preview: URL.createObjectURL(files[i]) });
        }
        setNewFeaturedFiles((prev) => [...prev, ...valid]);
        e.target.value = "";
    };

    const removeNewFeatured = (i: number) => { setNewFeaturedFiles((prev) => { URL.revokeObjectURL(prev[i].preview); return prev.filter((_, idx) => idx !== i); }); };
    const removeExistingFeatured = (i: number) => {
        setExistingFeaturedFullUrls((prev) => prev.filter((_, idx) => idx !== i));
        setExistingFeaturedRelUrls((prev) => prev.filter((_, idx) => idx !== i));
    };

    const addHighlight = () => set("Highlights", [...form.Highlights, ""]);
    const updateHighlight = (i: number, val: string) => { const arr = [...form.Highlights]; arr[i] = val; set("Highlights", arr); };
    const removeHighlight = (i: number) => set("Highlights", form.Highlights.filter((_: any, idx: number) => idx !== i));

    const addProfession = () => set("Professions", [...form.Professions, emptyProfession()]);
    const updateProfessionField = (i: number, field: string, val: any) => { const arr = [...form.Professions]; arr[i] = { ...arr[i], [field]: val }; set("Professions", arr); };
    const removeProfession = (i: number) => set("Professions", form.Professions.filter((_: any, idx: number) => idx !== i));

    const updateProfession = (i: number, data: Partial<Profession>) => {
        const arr = [...form.Professions];
        arr[i] = { ...arr[i], ...data };
        set("Professions", arr);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            let newFeaturedUrls: string[] = [];
            if (newFeaturedFiles.length > 0) {
                const fd = new FormData();
                newFeaturedFiles.forEach((f) => fd.append(f.file.name, f.file));
                const results = await uploadManyFiles(fd).unwrap();
                newFeaturedUrls = results.map((r: any) => r.RelativeUrl);
            }
            await updateOrganization({
                ...form,
                FeaturedImageUrls: [...existingFeaturedRelUrls, ...newFeaturedUrls],
                Highlights: form.Highlights.filter((h: string) => h.trim()),
                Professions: form.Professions.filter((p: Profession) => p.ProfessionId),
            }).unwrap();
            dispatch(showSnackbar({ message: labels.updateSuccess, severity: "success" }));
            newFeaturedFiles.forEach((f) => URL.revokeObjectURL(f.preview));
            onClose();
        } catch (err) {
            dispatch(showSnackbar({ message: labels.updateFailed, severity: "error" }));
        } finally {
            setIsSubmitting(false);
        }
    };

    const tf = { size: "small" as const, fullWidth: true, sx: { "& .MuiInputBase-root": { minHeight: 38 }, "& .MuiInputBase-input": { padding: "8px 12px", fontSize: 13 } } };
    const tfMultiline = { size: "small" as const, fullWidth: true, sx: { "& .MuiInputBase-input": { fontSize: 13 } } };

    const findProfOpt = (id: string) => professionOptions.find((p: ProfessionResponse) => p.Id === id) ?? null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth PaperProps={{ sx: { borderRadius: 3, maxHeight: "95vh" } }}>
            <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 1, pt: 2, px: 2 }}>
                <Typography fontWeight={700} fontSize={17}>{labels.editOrganization}</Typography>
                <IconButton size="small" onClick={onClose}><Close fontSize="small" /></IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ px: 2, py: 2 }}>
                {loadingData ? (
                    <Stack alignItems="center" justifyContent="center" sx={{ height: 280 }} spacing={1.5}>
                        <CircularProgress sx={{ color: "#1975d1" }} />
                        <Typography variant="body2" color="text.secondary">{labels.loadingData}</Typography>
                    </Stack>
                ) : (
                    <Grid container spacing={2}>

                        <SectionHeader title={labels.basicInfo} />
                        <Grid size={{ xs: 12, sm: 6 }}> <TextField {...tf} label={<> {labels.name} <RequiredStar /> </>} value={form.Name} onChange={(e) => set("Name", e.target.value)} /> </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}> <TextField {...tf} label={labels.internationalName} value={form.InternationalName} onChange={(e) => set("InternationalName", e.target.value)} /> </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}> <TextField {...tf} label={labels.taxCode} value={form.TaxCode} onChange={(e) => set("TaxCode", e.target.value)} /> </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}> <TextField {...tf} label={labels.managedBy} value={form.ManagedBy} onChange={(e) => set("ManagedBy", e.target.value)} /> </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField {...tf} label={<> {labels.status} <RequiredStar /> </>} select value={form.OrgStatus} onChange={(e) => set("OrgStatus", e.target.value)}>
                                <MenuItem value={OrgStatus.Undefined}>{labels.undefined}</MenuItem>
                                <MenuItem value={OrgStatus.Active}>{labels.active}</MenuItem>
                                <MenuItem value={OrgStatus.Inactive}>{labels.inactive}</MenuItem>
                                <MenuItem value={OrgStatus.Locked}>{labels.locked}</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                {...tf}
                                label={labels.dormCost}
                                type="number"
                                value={form.DormCost}
                                onChange={(e) => set("DormCost", Number(e.target.value))}
                                slotProps={{ input: { endAdornment: <InputAdornment position="end">{form.Currency}</InputAdornment> } }}
                            />
                        </Grid>
                        <SectionHeader title={labels.profession} />

                        <Grid size={{ xs: 12 }}>
                            <Typography variant="body2" fontWeight={600} mb={1.5}> {labels.mainProfession} </Typography>
                            <Grid container spacing={1.5}>
                                <Grid size={{ xs: 12, sm: 8 }}>
                                    <Autocomplete
                                        size="small"
                                        options={professionOptions}
                                        getOptionLabel={(opt: ProfessionResponse) => opt.Name ?? ""}
                                        isOptionEqualToValue={(opt: ProfessionResponse, val: ProfessionResponse) => opt.Id === val?.Id}
                                        value={findProfOpt(form.MainProfession?.ProfessionId ?? "")}
                                        onChange={(_: any, opt: any) => set("MainProfession", {
                                            ...form.MainProfession,
                                            ProfessionId: opt?.Id ?? "",
                                            ProfessionName: opt?.Name ?? "",
                                        })}
                                        renderInput={(params) => <TextField {...params} label={labels.selectMainProfession} />}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <TextField {...tf} label={labels.tuitionFee} type="number"
                                        slotProps={{ input: { endAdornment: <InputAdornment position="end">{form.Currency}</InputAdornment> } }}
                                        value={form.MainProfession?.Cost ?? 0}
                                        onChange={(e) => set("MainProfession", { ...form.MainProfession, Cost: Number(e.target.value) })} />
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                                <Typography variant="body2" fontWeight={600}> {labels.professions} ({form.Professions.length}) </Typography>
                                <Button size="small" startIcon={<Add />} onClick={addProfession} sx={{ color: "#1975d1", textTransform: "none", fontSize: 12 }}> {labels.add} </Button>
                            </Stack>
                            <Stack spacing={1}>
                                {form.Professions.map((p: Profession, i: number) => (
                                    <Box key={i} sx={{ p: 1, borderRadius: 2, border: "0.5px solid #e8e8e8", bgcolor: "#fafafa" }}>
                                        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                                            <Typography variant="caption" color="text.secondary" fontWeight={600}> {labels.major} {i + 1}</Typography>
                                            <IconButton size="small" onClick={() => removeProfession(i)} sx={{ color: "error.main" }}>
                                                <Delete sx={{ fontSize: 16 }} />
                                            </IconButton>
                                        </Stack>
                                        <Grid container spacing={1.5}>
                                            <Grid size={{ xs: 12, sm: 8 }}>
                                                <Autocomplete
                                                    size="small"
                                                    options={professionOptions}
                                                    getOptionLabel={(opt: ProfessionResponse) => opt.Name ?? ""}
                                                    isOptionEqualToValue={(opt: ProfessionResponse, val: ProfessionResponse) => opt.Id === val?.Id}
                                                    value={findProfOpt(p.ProfessionId)}
                                                    onChange={(_: any, opt: any) => {
                                                        updateProfession(i, {
                                                            ProfessionId: opt?.Id ?? "",
                                                            ProfessionName: opt?.Name ?? "",
                                                        });
                                                    }}
                                                    renderInput={(params) => <TextField {...params} label={labels.selectProfession} />}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 4 }}> <TextField {...tf} label={labels.tuitionFee} type="number" value={p.Cost} onChange={(e) => updateProfessionField(i, "Cost", Number(e.target.value))} slotProps={{ input: { endAdornment: <InputAdornment position="end">{form.Currency}</InputAdornment> } }} /></Grid>
                                        </Grid>
                                    </Box>
                                ))}
                            </Stack>
                        </Grid>

                        <SectionHeader title={labels.contactAndAddress} />
                        <Grid size={{ xs: 12, sm: 6 }}> <TextField {...tf} label={labels.email} type="email" value={form.Email} onChange={(e) => set("Email", e.target.value)} /> </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}> <TextField {...tf} label={labels.phoneNumber} value={form.PhoneNumber} onChange={(e) => set("PhoneNumber", e.target.value)} /> </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}> <TextField {...tf} label={labels.website} value={form.WebsiteUrl} onChange={(e) => set("WebsiteUrl", e.target.value)} /> </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}> <Autocomplete size="small" options={provinces} getOptionLabel={(opt: Province) => opt.Name ?? ""} isOptionEqualToValue={(opt: Province, val: Province) => opt.Id === val?.Id} value={selectedProvince} onChange={handleProvinceChange} renderInput={(params) => <TextField {...params} label={<>{labels.province} <RequiredStar /> </>} />} /> </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}> <Autocomplete size="small" options={communes} getOptionLabel={(opt: CommuneResponse) => opt.Name ?? ""} isOptionEqualToValue={(opt: CommuneResponse, val: CommuneResponse) => opt.Id === val?.Id} value={selectedCommune} onChange={handleCommuneChange} disabled={!selectedProvinceSeo} noOptionsText={selectedProvinceSeo ? labels.noData : labels.selectProvinceFirst} renderInput={(params) => <TextField {...params} label={<> {labels.commune} <RequiredStar /> </>} placeholder={!selectedProvinceSeo ? labels.selectProvinceFirst : ""} />} /> </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}> <TextField {...tf} label={<> {labels.address} <RequiredStar /> </>} value={form.Address} onChange={(e) => set("Address", e.target.value)} /> </Grid>

                        <SectionHeader title={labels.socialNetworks} />
                        {[
                            { field: "FacebookUrl", label: labels.facebook },
                            { field: "LinkedinUrl", label: labels.linkedin },
                            { field: "YoutubeUrl", label: labels.youtube },
                            { field: "TwitterUrl", label: labels.twitter },
                            { field: "InstagramUrl", label: labels.instagram },
                            { field: "GoogleMapUrl", label: labels.googleMap },
                        ].map(({ field, label }) => (<Grid key={field} size={{ xs: 12, sm: 6 }}> <TextField {...tf} label={label} value={form[field] ?? ""} onChange={(e) => set(field, e.target.value)} /> </Grid>))}

                        <SectionHeader title={labels.images} />
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <ImageUploadBox label={labels.logo} required previewUrl={logoPreview}
                                onFileChange={handleLogoChange}
                                onRemove={() => { set("LogoUrl", ""); setLogoPreview(null); }} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <ImageUploadBox label={labels.wallpaper} required previewUrl={wallpaperPreview}
                                onFileChange={handleWallpaperChange}
                                onRemove={() => { set("WallpaperUrl", ""); setWallpaperPreview(null); }} />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                                <Typography variant="body2" fontWeight={600}>{labels.featuredImages}</Typography>
                                <Button component="label" size="small" startIcon={<Add />} sx={{ color: "#1975d1", textTransform: "none", fontSize: 12 }}> {labels.add} <input type="file" accept="image/*" multiple hidden onChange={handleFeaturedImagesChange} /> </Button>
                            </Stack>
                            {(existingFeaturedFullUrls.length > 0 || newFeaturedFiles.length > 0) && (
                                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: 1 }}>
                                    {existingFeaturedFullUrls.map((url, i) => (
                                        <Box key={`ex-${i}`} sx={{ position: "relative" }}>
                                            <Box component="img" src={url} sx={{ width: "100%", height: 80, objectFit: "cover", borderRadius: 1.5, display: "block", border: "1px solid #e0e0e0" }} />
                                            <IconButton size="small" onClick={() => removeExistingFeatured(i)} sx={{ position: "absolute", top: -6, right: -6, bgcolor: "error.main", color: "#fff", width: 18, height: 18, "&:hover": { bgcolor: "error.dark" } }}>
                                                <Close sx={{ fontSize: 11 }} />
                                            </IconButton>
                                        </Box>
                                    ))}
                                    {newFeaturedFiles.map((f, i) => (
                                        <Box key={`new-${i}`} sx={{ position: "relative" }}>
                                            <Box component="img" src={f.preview} sx={{ width: "100%", height: 80, objectFit: "cover", borderRadius: 1.5, display: "block", border: "2px solid #1975d1" }} />
                                            <Chip label={labels.new} size="small" sx={{ position: "absolute", bottom: 2, left: 2, height: 16, fontSize: 9, bgcolor: "#1975d1", color: "#fff" }} />
                                            <IconButton size="small" onClick={() => removeNewFeatured(i)} sx={{ position: "absolute", top: -6, right: -6, bgcolor: "error.main", color: "#fff", width: 18, height: 18, "&:hover": { bgcolor: "error.dark" } }}>
                                                <Close sx={{ fontSize: 11 }} />
                                            </IconButton>
                                        </Box>
                                    ))}
                                </Box>
                            )}
                        </Grid>

                        <SectionHeader title={labels.content} />
                        <Grid size={{ xs: 12 }}> <TextField {...tfMultiline} label={labels.summary} multiline rows={2} value={form.Summary} onChange={(e) => set("Summary", e.target.value)} /> </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                                <Typography variant="body2" fontWeight={600}>{labels.highlights}</Typography>
                                <Button size="small" startIcon={<Add />} onClick={addHighlight} sx={{ color: "#1975d1", textTransform: "none", fontSize: 12 }}>{labels.add}</Button>
                            </Stack>
                            <Stack spacing={1}>
                                {form.Highlights.map((h: string, i: number) => (
                                    <Stack key={i} direction="row" spacing={1} alignItems="center">
                                        <TextField {...tf} placeholder={`${labels.highlights} ${i + 1}`} value={h} onChange={(e) => updateHighlight(i, e.target.value)} />
                                        <IconButton size="small" onClick={() => removeHighlight(i)} sx={{ color: "error.main", flexShrink: 0 }}>
                                            <Delete fontSize="small" />
                                        </IconButton>
                                    </Stack>
                                ))}
                            </Stack>
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Paper sx={{ p: 1, borderRadius: 2 }}>
                                <Typography variant="body2" fontWeight={600} mb={1}>{<> {labels.description} <RequiredStar /> </>}</Typography>
                                <RichTextEditorComponent value={form.Description} onChange={(val: string) => set("Description", val)} />
                            </Paper>
                        </Grid>
                    </Grid>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 1, py: 1 }}>
                <Button onClick={onClose} size="small" sx={{ textTransform: "none", color: "text.secondary" }}>{labels.cancel}</Button>
                <Button variant="contained" onClick={handleSubmit} disabled={isSubmitting} size="small"
                    sx={{ textTransform: "none", bgcolor: "#1975d1", "&:hover": { bgcolor: "#1975d1" }, minWidth: 50 }}
                    startIcon={isSubmitting ? <CircularProgress size={14} color="inherit" /> : undefined}> {isSubmitting ? labels.saving : labels.save}
                </Button>
            </DialogActions>
        </Dialog>
    );
}