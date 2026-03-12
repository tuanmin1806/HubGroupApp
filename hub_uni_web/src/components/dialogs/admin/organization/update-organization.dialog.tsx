import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, MenuItem, Stack, Switch, FormControlLabel, Paper, Typography, CircularProgress, Divider, IconButton, Box, Chip, Autocomplete } from "@mui/material";
import { useEffect, useState } from "react";
import { Close, Add, Delete, CloudUpload } from "@mui/icons-material";
import { getUserInfo } from "../../../../app/services/auth.service";
import { useLazyGetOrganizationByIdQuery, useUpdateOrganizationMutation } from "../../../../app/features/organization.api";
import { useUploadOneFileMutation, useUploadManyFilesMutation } from "../../../../app/features/mediafile.api";
import RichTextEditorComponent from "../../../editor";
import { Profession } from "../../../../app/models/organization.model";
import { DEFAULT_PAGE } from "../../../../constants/common.constant";
import { useGetProfessionsByPageQuery } from "../../../../app/features/professtion.api";

interface Props {
    open: boolean;
    onClose: () => void;
}

const SectionHeader = ({ title }: { title: string }) => (
    <Grid size={{ xs: 12 }}>
        <Typography variant="caption" fontWeight={700} color="#faa11b" sx={{ textTransform: "uppercase", letterSpacing: 0.8 }}> {title} </Typography>
    </Grid>
);

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
                <Button component="label" variant="outlined" size="small" startIcon={<CloudUpload />} sx={{ borderStyle: "dashed", borderColor: "#ccc", color: "text.secondary", textTransform: "none", fontSize: 12, py: 1, "&:hover": { borderColor: "#faa11b", color: "#faa11b" } }}> Chọn ảnh <input type="file" accept="image/*" hidden onChange={onFileChange} /></Button>
            )}
        </Box>
    );
}

const emptyProfession = (): Profession => ({ ProfessionId: "", ProfessionName: "", ProfessionSeoUrl: "", Cost: 0 });

export default function UpdateOrganizationDialog({ open, onClose }: Props) {
    const userInfo = getUserInfo();
    const organizationId = userInfo?.OrganizationId ?? "";
    const [loadingData, setLoadingData] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [getOrganization] = useLazyGetOrganizationByIdQuery();
    const [updateOrganization] = useUpdateOrganizationMutation();
    const [uploadOneFile] = useUploadOneFileMutation();
    const [uploadManyFiles] = useUploadManyFilesMutation();

    const { data: professionsData } = useGetProfessionsByPageQuery({ page: DEFAULT_PAGE, size: 200 });
    const professionOptions = professionsData?.Items ?? [];

    const [form, setForm] = useState<any>({
        Id: "", Name: "", InternationalName: "", TaxCode: "",
        OrganizationTypeId: "", WebsiteUrl: "", PhoneNumber: "", Email: "",
        ManagedBy: "", Address: "", DormCost: 0, ProvinceId: "", CommuneId: "",
        OrgStatus: 1, IsTop: false, Summary: "", Description: "",
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

    useEffect(() => {
        if (!open) return;
        setLoadingData(true);
        getOrganization(organizationId).unwrap().then((data: any) => {
            setForm({
                Id: data.Id ?? "", Name: data.Name ?? "", InternationalName: data.InternationalName ?? "",
                TaxCode: data.TaxCode ?? "", OrganizationTypeId: data.OrganizationTypeId ?? "",
                WebsiteUrl: data.WebsiteUrl ?? "", PhoneNumber: data.PhoneNumber ?? "", Email: data.Email ?? "",
                ManagedBy: data.ManagedBy ?? "", Address: data.Address ?? "", DormCost: data.DormCost ?? 0,
                ProvinceId: data.ProvinceId ?? "", CommuneId: data.CommuneId ?? "",
                OrgStatus: data.OrgStatus ?? 1, IsTop: data.IsTop ?? false,
                Summary: data.Summary ?? "", Description: data.Description ?? "",
                LogoUrl: data.LogoUrl ?? "", WallpaperUrl: data.WallpaperUrl ?? "",
                FacebookUrl: data.FacebookUrl ?? "", LinkedinUrl: data.LinkedinUrl ?? "",
                YoutubeUrl: data.YoutubeUrl ?? "", GoogleMapUrl: data.GoogleMapUrl ?? "",
                TwitterUrl: data.TwitterUrl ?? "", InstagramUrl: data.InstagramUrl ?? "",
                Highlights: data.Highlights ?? [],
                FeaturedImageUrls: data.FeaturedImageUrls ?? [],
                Professions: data.Professions ?? [],
                MainProfession: data.MainProfession ?? emptyProfession(),
            });
            setLogoPreview(data.LogoFullUrl ?? null);
            setWallpaperPreview(data.WallpaperFullUrl ?? null);
            setExistingFeaturedFullUrls(data.FeaturedImageFullUrls ?? []);
            setExistingFeaturedRelUrls(data.FeaturedImageUrls ?? []);
            setNewFeaturedFiles([]);
        }).catch(() => {
            console.log("Không thể tải thông tin tổ chức");
        }).finally(() => setLoadingData(false));
    }, [open]);

    const validateImage = (file: File) => {
        if (file.size > 5 * 1024 * 1024) { console.log("Kích thước ảnh không được vượt quá 5MB"); return false; }
        if (!file.type.startsWith("image/")) { console.log("Vui lòng chọn file ảnh hợp lệ"); return false; }
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
        } catch { console.log("Tải ảnh thất bại"); }
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
        } catch { console.log("Tải ảnh thất bại"); }
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
            console.log("Cập nhật thành công");
            newFeaturedFiles.forEach((f) => URL.revokeObjectURL(f.preview));
            onClose();
        } catch (err) {
            console.log("Organization", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const tf = { size: "small" as const, fullWidth: true };

    const findProfOpt = (id: string) => professionOptions.find((p: any) => p.Id === id) ?? null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth PaperProps={{ sx: { borderRadius: 3, maxHeight: "95vh" } }}>
            <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 1, pt: 2, px: 3 }}>
                <Typography fontWeight={700} fontSize={17}>Chỉnh sửa thông tin trường</Typography>
                <IconButton size="small" onClick={onClose}><Close fontSize="small" /></IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ px: 3, py: 2 }}>
                {loadingData ? (
                    <Stack alignItems="center" justifyContent="center" sx={{ height: 280 }} spacing={1.5}>
                        <CircularProgress sx={{ color: "#faa11b" }} />
                        <Typography variant="body2" color="text.secondary">Đang tải thông tin...</Typography>
                    </Stack>
                ) : (
                    <Grid container spacing={2}>

                        <SectionHeader title="Thông tin cơ bản" />
                        <Grid size={{ xs: 12, sm: 6 }}> <TextField {...tf} label="Tên trường" value={form.Name} onChange={(e) => set("Name", e.target.value)} /> </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}> <TextField {...tf} label="Tên quốc tế" value={form.InternationalName} onChange={(e) => set("InternationalName", e.target.value)} /> </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}> <TextField {...tf} label="Mã số thuế" value={form.TaxCode} onChange={(e) => set("TaxCode", e.target.value)} /> </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}> <TextField {...tf} label="Quản lý bởi" value={form.ManagedBy} onChange={(e) => set("ManagedBy", e.target.value)} /> </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <TextField {...tf} label="Trạng thái" select value={form.OrgStatus} onChange={(e) => set("OrgStatus", e.target.value)}>
                                <MenuItem value={0}>Không xác định</MenuItem>
                                <MenuItem value={1}>Hoạt động</MenuItem>
                                <MenuItem value={2}>Dừng hoạt động</MenuItem>
                                <MenuItem value={3}>Bị khóa</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}> <TextField {...tf} label="Chi phí KTX" type="number" value={form.DormCost} onChange={(e) => set("DormCost", Number(e.target.value))} /> </Grid>
                        <Grid size={{ xs: 12, sm: 4 }} sx={{ display: "flex", alignItems: "center" }}>
                            <FormControlLabel
                                control={<Switch checked={form.IsTop} onChange={(e) => set("IsTop", e.target.checked)} sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: "#faa11b" }, "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: "#faa11b" } }} />}
                                label={<Typography variant="body2">Trường TOP</Typography>}
                            />
                        </Grid>

                        <SectionHeader title="Liên hệ & địa chỉ" />
                        <Grid size={{ xs: 12, sm: 6 }}> <TextField {...tf} label="Email" type="email" value={form.Email} onChange={(e) => set("Email", e.target.value)} /> </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}> <TextField {...tf} label="Số điện thoại" value={form.PhoneNumber} onChange={(e) => set("PhoneNumber", e.target.value)} /> </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}> <TextField {...tf} label="Website" value={form.WebsiteUrl} onChange={(e) => set("WebsiteUrl", e.target.value)} /> </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}> <TextField {...tf} label="Địa chỉ" value={form.Address} onChange={(e) => set("Address", e.target.value)} /> </Grid>

                        <SectionHeader title="Mạng xã hội" />
                        {[
                            { field: "FacebookUrl", label: "Facebook" },
                            { field: "LinkedinUrl", label: "LinkedIn" },
                            { field: "YoutubeUrl", label: "YouTube" },
                            { field: "TwitterUrl", label: "Twitter" },
                            { field: "InstagramUrl", label: "Instagram" },
                            { field: "GoogleMapUrl", label: "Google Maps" },
                        ].map(({ field, label }) => (<Grid key={field} size={{ xs: 12, sm: 6 }}> <TextField {...tf} label={label} value={form[field] ?? ""} onChange={(e) => set(field, e.target.value)} /> </Grid>))}

                        <SectionHeader title="Hình ảnh & Media" />
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <ImageUploadBox label="Logo" required previewUrl={logoPreview}
                                onFileChange={handleLogoChange}
                                onRemove={() => { set("LogoUrl", ""); setLogoPreview(null); }} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <ImageUploadBox label="Ảnh bìa" required previewUrl={wallpaperPreview}
                                onFileChange={handleWallpaperChange}
                                onRemove={() => { set("WallpaperUrl", ""); setWallpaperPreview(null); }} />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                                <Typography variant="body2" fontWeight={600}>Ảnh nổi bật</Typography>
                                <Button component="label" size="small" startIcon={<Add />} sx={{ color: "#faa11b", textTransform: "none", fontSize: 12 }}> Thêm ảnh <input type="file" accept="image/*" multiple hidden onChange={handleFeaturedImagesChange} /> </Button>
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
                                            <Box component="img" src={f.preview} sx={{ width: "100%", height: 80, objectFit: "cover", borderRadius: 1.5, display: "block", border: "2px solid #faa11b" }} />
                                            <Chip label="Mới" size="small" sx={{ position: "absolute", bottom: 2, left: 2, height: 16, fontSize: 9, bgcolor: "#faa11b", color: "#fff" }} />
                                            <IconButton size="small" onClick={() => removeNewFeatured(i)} sx={{ position: "absolute", top: -6, right: -6, bgcolor: "error.main", color: "#fff", width: 18, height: 18, "&:hover": { bgcolor: "error.dark" } }}>
                                                <Close sx={{ fontSize: 11 }} />
                                            </IconButton>
                                        </Box>
                                    ))}
                                </Box>
                            )}
                        </Grid>

                        <SectionHeader title="Nội dung" />
                        <Grid size={{ xs: 12 }}> <TextField {...tf} label="Tóm tắt" multiline rows={2} value={form.Summary} onChange={(e) => set("Summary", e.target.value)} /> </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                                <Typography variant="body2" fontWeight={600}>Điểm nổi bật</Typography>
                                <Button size="small" startIcon={<Add />} onClick={addHighlight} sx={{ color: "#faa11b", textTransform: "none", fontSize: 12 }}>Thêm</Button>
                            </Stack>
                            <Stack spacing={1}>
                                {form.Highlights.map((h: string, i: number) => (
                                    <Stack key={i} direction="row" spacing={1} alignItems="center">
                                        <TextField {...tf} placeholder={`Điểm nổi bật ${i + 1}`} value={h} onChange={(e) => updateHighlight(i, e.target.value)} />
                                        <IconButton size="small" onClick={() => removeHighlight(i)} sx={{ color: "error.main", flexShrink: 0 }}>
                                            <Delete fontSize="small" />
                                        </IconButton>
                                    </Stack>
                                ))}
                            </Stack>
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
                                <Typography variant="body2" fontWeight={600} mb={1}>Mô tả chi tiết</Typography>
                                <RichTextEditorComponent value={form.Description} onChange={(val: string) => set("Description", val)} />
                            </Paper>
                        </Grid>

                        <SectionHeader title="Ngành đào tạo" />

                        <Grid size={{ xs: 12 }}>
                            <Typography variant="body2" fontWeight={600} mb={1}> Ngành chính <Chip label="Chính" size="small" sx={{ ml: 1, bgcolor: "rgba(250,161,27,0.1)", color: "#faa11b", fontSize: 10, height: 18 }} /> </Typography>
                            <Grid container spacing={1.5}>
                                <Grid size={{ xs: 12, sm: 8 }}>
                                    <Autocomplete
                                        size="small"
                                        options={professionOptions}
                                        getOptionLabel={(opt: any) => opt.Name ?? ""}
                                        isOptionEqualToValue={(opt: any, val: any) => opt.Id === val?.Id}
                                        value={findProfOpt(form.MainProfession?.ProfessionId ?? "")}
                                        onChange={(_: any, opt: any) => set("MainProfession", {
                                            ...form.MainProfession,
                                            ProfessionId: opt?.Id ?? "",
                                            ProfessionName: opt?.Name ?? "",
                                        })}
                                        renderInput={(params) => <TextField {...params} label="Chọn ngành chính" />}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <TextField {...tf} label="Học phí" type="number"
                                        value={form.MainProfession?.Cost ?? 0}
                                        onChange={(e) => set("MainProfession", { ...form.MainProfession, Cost: Number(e.target.value) })} />
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                                <Typography variant="body2" fontWeight={600}> Danh sách ngành ({form.Professions.length}) </Typography>
                                <Button size="small" startIcon={<Add />} onClick={addProfession} sx={{ color: "#faa11b", textTransform: "none", fontSize: 12 }}> Thêm ngành </Button>
                            </Stack>
                            <Stack spacing={1.5}>
                                {form.Professions.map((p: Profession, i: number) => (
                                    <Box key={i} sx={{ p: 1.5, borderRadius: 2, border: "1px solid #e8e8e8", bgcolor: "#fafafa" }}>
                                        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                                            <Typography variant="caption" color="text.secondary" fontWeight={600}>Ngành #{i + 1}</Typography>
                                            <IconButton size="small" onClick={() => removeProfession(i)} sx={{ color: "error.main" }}>
                                                <Delete sx={{ fontSize: 16 }} />
                                            </IconButton>
                                        </Stack>
                                        <Grid container spacing={1.5}>
                                            <Grid size={{ xs: 12, sm: 8 }}>
                                                <Autocomplete
                                                    size="small"
                                                    options={professionOptions}
                                                    getOptionLabel={(opt: any) => opt.Name ?? ""}
                                                    isOptionEqualToValue={(opt: any, val: any) => opt.Id === val?.Id}
                                                    value={findProfOpt(p.ProfessionId)}
                                                    onChange={(_: any, opt: any) => {
                                                        updateProfession(i, {
                                                            ProfessionId: opt?.Id ?? "",
                                                            ProfessionName: opt?.Name ?? "",
                                                        });
                                                    }}
                                                    renderInput={(params) => <TextField {...params} label="Chọn ngành" />}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 4 }}> <TextField {...tf} label="Học phí" type="number" value={p.Cost} onChange={(e) => updateProfessionField(i, "Cost", Number(e.target.value))} /> </Grid>
                                        </Grid>
                                    </Box>
                                ))}
                            </Stack>
                        </Grid>
                    </Grid>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 1.5, gap: 1 }}>
                <Button onClick={onClose} size="small" sx={{ textTransform: "none", color: "text.secondary" }}>Hủy</Button>
                <Button variant="contained" onClick={handleSubmit} disabled={isSubmitting} size="small"
                    sx={{ textTransform: "none", bgcolor: "#faa11b", "&:hover": { bgcolor: "#e28e13" }, minWidth: 110 }}
                    startIcon={isSubmitting ? <CircularProgress size={14} color="inherit" /> : undefined}>
                    {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}