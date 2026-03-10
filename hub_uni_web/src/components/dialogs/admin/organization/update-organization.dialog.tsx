import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, MenuItem, Stack, Switch, FormControlLabel, Paper, Typography, CircularProgress} from "@mui/material";
import { useEffect, useState } from "react";
import { getUserInfo } from "../../../../app/services/auth.service";
import { useLazyGetOrganizationByIdQuery, useUpdateOrganizationMutation } from "../../../../app/features/organization.api";
import RichTextEditorComponent from "../../../editor";

interface Props {
    open: boolean;
    onClose: () => void;
}

export default function UpdateOrganizationDialog({ open, onClose }: Props) {
    const userInfo = getUserInfo();
    const organizationId = userInfo?.OrganizationId ?? "";
    const [loadingData, setLoadingData] = useState(false);

    const [getOrganization] = useLazyGetOrganizationByIdQuery();
    const [updateOrganization, { isLoading }] = useUpdateOrganizationMutation();

    const [form, setForm] = useState<any>({
        Id: "",
        Name: "",
        InternationalName: "",
        TaxCode: "",
        WebsiteUrl: "",
        PhoneNumber: "",
        Email: "",
        ManagedBy: "",
        Address: "",
        DormCost: 0,
        ProvinceId: "",
        CommuneId: "",
        OrganizationTypeId: "",
        OrgStatus: 1,
        IsTop: false,
        Summary: "",
        Description: "",
    });

    const handleChange = (field: string, value: any) => {
        setForm((prev: any) => ({
            ...prev,
            [field]: value,
        }));
    };

    useEffect(() => {
        if (!open) return;

        setLoadingData(true);

        getOrganization(organizationId)
            .unwrap()
            .then((data: any) => {
                setForm((prev: any) => ({
                    ...prev,
                    Id: data.Id,
                    Name: data.Name,
                    InternationalName: data.InternationalName,
                    TaxCode: data.TaxCode,
                    WebsiteUrl: data.WebsiteUrl,
                    PhoneNumber: data.PhoneNumber,
                    Email: data.Email,
                    ManagedBy: data.ManagedBy,
                    Address: data.Address,
                    DormCost: data.DormCost,
                    ProvinceId: data.ProvinceId,
                    CommuneId: data.CommuneId,
                    OrganizationTypeId: data.OrganizationTypeId,
                    OrgStatus: data.OrgStatus,
                    IsTop: data.IsTop,
                    Summary: data.Summary,
                    Description: data.Description,
                    Professions: data.Professions,
                    MainProfession: data.MainProfession,
                    LogoUrl: data.LogoUrl,
                    WallpaperUrl: data.WallpaperUrl,
                    FeaturedImageUrls: data.FeaturedImageUrls,
                    Highlights: data.Highlights
                }));
            })
            .finally(() => {
                setLoadingData(false);
            });

    }, [open]);

    const handleSubmit = async () => {
        await updateOrganization(form).unwrap();
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xl"
            fullWidth
        >
            <DialogTitle>Chỉnh sửa thông tin trường</DialogTitle>

            <DialogContent dividers>
                {loadingData ? (
                    <Stack alignItems="center" justifyContent="center" sx={{ height: 300 }}>
                        <CircularProgress />
                        <Typography sx={{ mt: 2 }}> Đang tải thông tin... </Typography>
                    </Stack>

                ) : (
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                label="Tên trường"
                                fullWidth
                                value={form.Name}
                                onChange={(e) => handleChange("Name", e.target.value)}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                label="Tên quốc tế"
                                fullWidth
                                value={form.InternationalName}
                                onChange={(e) => handleChange("InternationalName", e.target.value)}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                label="Mã số thuế"
                                fullWidth
                                value={form.TaxCode}
                                onChange={(e) => handleChange("TaxCode", e.target.value)}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                label="Website"
                                fullWidth
                                value={form.WebsiteUrl}
                                onChange={(e) => handleChange("WebsiteUrl", e.target.value)}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                label="Email"
                                fullWidth
                                value={form.Email}
                                onChange={(e) => handleChange("Email", e.target.value)}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                label="Số điện thoại"
                                fullWidth
                                value={form.PhoneNumber}
                                onChange={(e) => handleChange("PhoneNumber", e.target.value)}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                label="Địa chỉ"
                                fullWidth
                                value={form.Address}
                                onChange={(e) => handleChange("Address", e.target.value)}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                label="Chi phí ký túc xá"
                                type="number"
                                fullWidth
                                value={form.DormCost}
                                onChange={(e) => handleChange("DormCost", e.target.value)}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                label="Trạng thái"
                                select
                                fullWidth
                                value={form.OrgStatus}
                                onChange={(e) => handleChange("OrgStatus", e.target.value)}
                            >
                                <MenuItem value={0}>Không xác định</MenuItem>
                                <MenuItem value={1}>Hoạt động</MenuItem>
                                <MenuItem value={2}>Dừng hoạt động</MenuItem>
                                <MenuItem value={3}>Bị khóa</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <FormControlLabel
                                control={<Switch checked={form.IsTop} onChange={(e) => handleChange("IsTop", e.target.checked)} />}
                                label="Trường TOP"
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label="Tóm tắt"
                                multiline
                                rows={3}
                                fullWidth
                                value={form.Summary}
                                onChange={(e) => handleChange("Summary", e.target.value)}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Paper sx={{ p: 1 }}>
                                <Typography sx={{ fontWeight: 600, mb: 1 }}> Mô tả trường </Typography>

                                <RichTextEditorComponent
                                    value={form.Description}
                                    onChange={(value: string) => handleChange("Description", value)}
                                />
                            </Paper>
                        </Grid>
                    </Grid>
                )}
            </DialogContent>

            <DialogActions>
                <Stack direction="row" spacing={2}>
                    <Button onClick={onClose}>Hủy</Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        Cập nhật
                    </Button>
                </Stack>
            </DialogActions>
        </Dialog>
    );
}