import { Person, Phone, Email, Cake, Wc, LocationOn, Badge, Edit, Save, Cancel, Public, Business, Lock, CameraAlt } from "@mui/icons-material";
import { Avatar, Box, Chip, CircularProgress, Divider, Grid, Stack, Typography, TextField, MenuItem, Button, Autocomplete, InputAdornment, Paper, Tooltip } from "@mui/material";
import { useState, useEffect } from "react";
import { useGetCustomerInforQuery, useUpdateCustomerMutation } from "../../app/features/customer.api";
import { useGetAllCountryNoAuthenQuery } from "../../app/features/country.api";
import { useGetProvinceByCountryQuery } from "../../app/features/province.api";
import { useGetCommunesByProvinceQuery } from "../../app/features/commune.api";
import { ConvertService } from "../../app/services/convert.service";
import { getUserInfo } from "../../app/services/auth.service";
import { AccountStatus, EducationLevel, Gender, JobExperience } from "../../app/models/enums.model";
import { CustomerResponse, UpdateCustomerRequest } from "../../app/models/customer.model";
import { Country } from "../../app/models/country.model";
import { Province } from "../../app/models/province.model";
import { CommuneResponse } from "../../app/models/commune.model";
import ConfirmDialog from "../../components/dialogs/general/confirm.dialog";
import ChangePasswordDialog from "../../components/dialogs/admin/change-password.dialog";
import { useNavigate } from "react-router-dom";
import AdminLogoUploadDialog from "../../components/dialogs/admin/admin-logo-upload.dialog";

const GENDER_OPTIONS = [
    { value: Gender.Male, label: "Nam" },
    { value: Gender.Female, label: "Nữ" },
    { value: Gender.Other, label: "Khác" },
];

interface EditableForm {
    AvatarUrl: string;
    UserName: string;
    FullName: string;
    Email: string;
    PhoneNumber: string;
    Gender: Gender;
    DateOfBirth: string | null;
    Experience: JobExperience;
    EducationLevel: EducationLevel;
    GraduationYear: number | "";
    Gpa: number | "";
    CountryId: string;
    ProvinceId: string;
    CommuneId: string;
    Address: string;
    OrganizationId: string;
}

function buildForm(data: CustomerResponse): EditableForm {
    const p = data.ProfileInfo;
    return {
        UserName: data.UserName ?? "",
        FullName: data.FullName ?? "",
        Email: data.Email ?? "",
        PhoneNumber: data.PhoneNumber ?? "",
        Gender: ConvertService.convertGenderFromString(p?.Gender ?? data.Gender),
        DateOfBirth: p?.DateOfBirth?.substring(0, 10) ?? null,
        AvatarUrl: data.AvatarFullUrl ?? "",
        Experience: ConvertService.convertJobExperienceFromString(p?.Experience),
        EducationLevel: ConvertService.convertEducationLevelFromString(p?.EducationLevel),
        GraduationYear: p?.GraduationYear || "",
        Gpa: p?.Gpa || "",
        CountryId: p?.CountryId ?? "",
        ProvinceId: p?.ProvinceId ?? "",
        CommuneId: p?.CommuneId ?? "",
        Address: p?.Address ?? "",
        OrganizationId: data.OrganizationId ?? "",
    };
}

function buildPayload(data: CustomerResponse, form: EditableForm): UpdateCustomerRequest {
    return {
        Id: data.Id,
        UserName: form.UserName,
        FullName: form.FullName,
        Email: form.Email,
        AvatarUrl: form.AvatarUrl,
        PhoneNumber: form.PhoneNumber || null,
        AccountType: data.AccountType,
        AccountStatus: ConvertService.convertAccountStatusFromString(data.AccountStatus),
        RoleIds: data.Roles?.map(r => r.Id) ?? [],
        OrganizationId: form.OrganizationId,
        ProfileInfo: {
            DateOfBirth: form.DateOfBirth || null,
            Gender: form.Gender,
            Experience: form.Experience,
            EducationLevel: form.EducationLevel,
            GraduationYear: Number(form.GraduationYear) || 0,
            Gpa: Number(form.Gpa) || 0,
            CountryId: form.CountryId,
            ProvinceId: form.ProvinceId,
            CommuneId: form.CommuneId,
            Address: form.Address,
        },
    };
}

const BLUE = "#1975d1";
const fieldSx = (editing: boolean) => ({ "& .MuiOutlinedInput-root": { bgcolor: editing ? "white" : "#fafafa", fontSize: "0.875rem" }, "& .MuiInputLabel-root": { fontSize: "0.8rem" }, });
const adornIcon = (Icon: React.ElementType) => (<InputAdornment position="start"><Icon sx={{ fontSize: 16, color: BLUE }} /></InputAdornment>);

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <Typography variant="caption" sx={{
        display: "block", fontWeight: 700, fontSize: "0.68rem",
        letterSpacing: "0.09em", textTransform: "uppercase",
        color: BLUE, mt: 2.5, mb: 1.5,
    }}>
        {children}
    </Typography>
);

export default function PersonalInforPage() {
    const userInfo = getUserInfo();
    const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
    const { data, isLoading, isError } = useGetCustomerInforQuery(userInfo?.Id ?? "");

    if (isLoading) return (<Box display="flex" justifyContent="center" py={8}><CircularProgress sx={{ color: BLUE }} /></Box>);
    if (isError || !data) return (<Box textAlign="center" py={8}><Typography color="error">Không thể tải thông tin người dùng.</Typography></Box>);

    return (
        <Box>
            <Typography variant="h5" fontWeight={700} mb={3}>Thông tin cá nhân</Typography>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 3 }}>
                    <Paper elevation={1} sx={{ p: 3, textAlign: "center", position: { md: "sticky" }, top: { md: 80 } }}>
                           <Box sx={{ position: "relative", display: "inline-block", mb: 2 }}>
                            <Avatar
                                src={data.AvatarFullUrl ?? undefined}
                                sx={{ width: 100, height: 100, fontSize: 36, bgcolor: BLUE }}
                            >
                                {data.FullName?.[0] ?? "?"}
                            </Avatar>
                            <Tooltip title="Cập nhật ảnh đại diện">
                                <Box
                                    onClick={() => setAvatarDialogOpen(true)}
                                    sx={{
                                        position: "absolute",
                                        bottom: 0,
                                        right: 0,
                                        width: 28,
                                        height: 28,
                                        borderRadius: "50%",
                                        bgcolor: "white",
                                        border: "1px solid #e0e0e0",
                                        boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        cursor: "pointer",
                                        transition: "all .15s",
                                        "&:hover": { bgcolor: "#e3f2fd", borderColor: BLUE },
                                    }}
                                >
                                    <CameraAlt sx={{ fontSize: 14, color: BLUE }} />
                                </Box>
                            </Tooltip>
                        </Box>
                        <Typography fontWeight={700} fontSize="0.95rem">{data.FullName}</Typography>
                        <Typography variant="body2" color="text.secondary" mb={2}>@{data.UserName}</Typography>

                        <Divider sx={{ mb: 2 }} />

                        <Stack spacing={1} alignItems="flex-start">
                            <Typography variant="caption" color="text.secondary" fontWeight={600}>Trạng thái</Typography>
                            <Chip
                                size="small"
                                label={ConvertService.convertAccountStatus(ConvertService.convertAccountStatusFromString(data.AccountStatus))}
                                color={ConvertService.convertAccountStatusFromString(data.AccountStatus) === AccountStatus.Activated ? "success" : "default"}
                            />
                        </Stack>

                        {data.AccountType && (
                            <Stack spacing={1} alignItems="flex-start" mt={2}>
                                <Typography variant="caption" color="text.secondary" fontWeight={600}>Vai trò</Typography>
                                <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
                                    <Chip key={data.Id} label={ConvertService.convertAccountType(ConvertService.convertAccountTypeFromString(data.AccountType))} color="primary" size="small" />
                                </Stack>
                            </Stack>
                        )}
                        {data.OrganizationName && (
                            <Stack spacing={1} alignItems="flex-start" mt={2}>
                                <Typography variant="caption" color="text.secondary" fontWeight={600}>Tổ chức</Typography>
                                <Stack direction="row" alignItems="center" spacing={0.5}>
                                    <Business sx={{ fontSize: 14, color: "text.secondary" }} />
                                    <Typography variant="body2">{data.OrganizationName}</Typography>
                                </Stack>
                            </Stack>
                        )}
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 9 }}>
                    <Paper elevation={1} sx={{ p: 3 }}><EditForm data={data} /></Paper>
                </Grid>
            </Grid>
            <AdminLogoUploadDialog
                open={avatarDialogOpen}
                onClose={() => setAvatarDialogOpen(false)}
                currentLogoUrl={data.AvatarFullUrl ?? ""}
            />
        </Box>
    );
}

function EditForm({ data }: { data: CustomerResponse }) {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [changePasswordOpen, setChangePasswordOpen] = useState(false);
    const [form, setForm] = useState<EditableForm>(() => buildForm(data));

    useEffect(() => { setForm(buildForm(data)); }, [data]);

    const { data: countries = [] } = useGetAllCountryNoAuthenQuery();
    const selectedCountry = countries.find(c => c.Id === form.CountryId) ?? null;
    const { data: provinces = [], isFetching: provLoading } = useGetProvinceByCountryQuery(selectedCountry?.SeoUrl ?? "", { skip: !selectedCountry });
    const selectedProvince = provinces.find(p => p.Id === form.ProvinceId) ?? null;
    const { data: communes = [], isFetching: commLoading } = useGetCommunesByProvinceQuery(selectedProvince?.SeoUrl ?? "", { skip: !selectedProvince });
    const selectedCommune = communes.find(c => c.Id === form.CommuneId) ?? null;

    const [updateCustomer, { isLoading: isUpdating }] = useUpdateCustomerMutation();

    const set = (f: keyof EditableForm) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(p => ({ ...p, [f]: e.target.value }));
    const setEnum = (f: keyof EditableForm) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(p => ({ ...p, [f]: Number(e.target.value) }));
    const handleCancel = () => { setIsEditing(false); setForm(buildForm(data)); };

    const handleConfirm = async () => {
        try {
            await updateCustomer(buildPayload(data, form)).unwrap();
            setConfirmOpen(false);
            setIsEditing(false);
        } catch { }
    };

    const handleLogout = () => {
        navigate("/sign-out");
    };

    const editing = isEditing;

    return (
        <Box>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={0.5}>
                <Typography variant="h6" fontWeight={700} fontSize="1rem">Thông tin tài khoản</Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Lock sx={{ fontSize: 15 }} />}
                        onClick={() => setChangePasswordOpen(true)}
                        sx={{
                            textTransform: "none",
                            fontWeight: 600,
                            fontSize: "0.8rem",
                            color: "#64748b",
                            borderColor: "#e2e8f0",
                            borderRadius: 1.5,
                            "&:hover": { borderColor: "#cbd5e1", bgcolor: "#f8fafc" },
                        }}
                    >
                        Đổi mật khẩu
                    </Button>
                    {editing ? (
                        <Stack direction="row" spacing={1}>
                            <Button size="small" startIcon={<Cancel sx={{ fontSize: 16 }} />} onClick={handleCancel} sx={{ textTransform: "none", fontWeight: 600, fontSize: "0.8rem", color: "text.secondary" }}>Hủy</Button>
                            <Button variant="contained" size="small" startIcon={<Save sx={{ fontSize: 16 }} />} onClick={() => setConfirmOpen(true)} sx={{ textTransform: "none", fontWeight: 600, fontSize: "0.8rem", bgcolor: BLUE, "&:hover": { bgcolor: "#1975d1" } }}>Cập nhật</Button>
                        </Stack>
                    ) : (<Button variant="outlined" size="small" startIcon={<Edit sx={{ fontSize: 16 }} />} onClick={() => setIsEditing(true)} sx={{ textTransform: "none", fontWeight: 600, fontSize: "0.8rem", color: BLUE, borderColor: BLUE, "&:hover": { bgcolor: "#f2f4f7ff", borderColor: BLUE } }}>Chỉnh sửa</Button>)}
                </Stack>
            </Stack>
            <Divider sx={{ mb: 1 }} />
            <SectionLabel>Thông tin cơ bản</SectionLabel>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField size="small" fullWidth label="Họ và tên"
                        value={form.FullName} onChange={set("FullName")} disabled={!editing}
                        sx={fieldSx(editing)}
                        InputProps={{ startAdornment: adornIcon(Person) }}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField size="small" fullWidth label="Tên đăng nhập"
                        value={data.UserName} disabled
                        sx={fieldSx(false)}
                        InputProps={{ startAdornment: adornIcon(Badge) }}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField size="small" fullWidth label="Email" type="email"
                        value={form.Email} onChange={set("Email")} disabled={!editing}
                        sx={fieldSx(editing)}
                        InputProps={{ startAdornment: adornIcon(Email) }}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField size="small" fullWidth label="Số điện thoại"
                        value={form.PhoneNumber} onChange={set("PhoneNumber")} disabled={!editing}
                        sx={fieldSx(editing)}
                        InputProps={{ startAdornment: adornIcon(Phone) }}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField size="small" fullWidth label="Ngày sinh" type="date"
                        value={form.DateOfBirth} onChange={set("DateOfBirth")} disabled={!editing}
                        InputLabelProps={{ shrink: true }}
                        sx={fieldSx(editing)}
                        InputProps={{ startAdornment: adornIcon(Cake) }}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField select size="small" fullWidth label="Giới tính"
                        value={form.Gender} onChange={setEnum("Gender")} disabled={!editing}
                        sx={fieldSx(editing)}
                        InputProps={{ startAdornment: adornIcon(Wc) }}
                    >
                        {GENDER_OPTIONS.map(({ value, label }) => (<MenuItem key={value} value={value} sx={{ fontSize: "0.875rem" }}>{label}</MenuItem>))}
                    </TextField>
                </Grid>
            </Grid>
            <SectionLabel>Địa chỉ</SectionLabel>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Autocomplete
                        options={countries} disabled={!editing}
                        getOptionLabel={(o: Country) => o.Name ?? ""}
                        value={selectedCountry}
                        onChange={(_, val: Country | null) => setForm(p => ({ ...p, CountryId: val?.Id ?? "", ProvinceId: "", CommuneId: "" }))}
                        renderInput={(params) => (
                            <TextField {...params} label="Quốc gia" size="small" fullWidth sx={fieldSx(editing)}
                                InputProps={{ ...params.InputProps, startAdornment: (<><InputAdornment position="start" sx={{ ml: 0.5, mr: -0.5 }}><Public sx={{ fontSize: 16, color: BLUE }} /></InputAdornment>{params.InputProps.startAdornment}</>) }}
                            />
                        )}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Autocomplete
                        options={provinces} disabled={!editing}
                        getOptionLabel={(o: Province) => o.Name ?? ""}
                        value={selectedProvince}
                        onChange={(_, val: Province | null) => setForm(p => ({ ...p, ProvinceId: val?.Id ?? "", CommuneId: "" }))}
                        renderInput={(params) => (
                            <TextField {...params} label="Tỉnh / Thành phố" size="small" fullWidth sx={fieldSx(editing)}
                                InputProps={{ ...params.InputProps, startAdornment: (<><InputAdornment position="start" sx={{ ml: 0.5, mr: -0.5 }}><LocationOn sx={{ fontSize: 16, color: BLUE }} /></InputAdornment>{params.InputProps.startAdornment}</>) }}
                            />
                        )}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Autocomplete
                        options={communes} disabled={!editing} loading={commLoading}
                        getOptionLabel={(o: CommuneResponse) => o.Name ?? ""}
                        value={selectedCommune}
                        onChange={(_, val: CommuneResponse | null) => setForm(p => ({ ...p, CommuneId: val?.Id ?? "" }))}
                        renderInput={(params) => (
                            <TextField {...params} label="Quận / Huyện / Xã" size="small" fullWidth sx={fieldSx(editing)}
                                InputProps={{
                                    ...params.InputProps,
                                    startAdornment: (<><InputAdornment position="start" sx={{ ml: 0.5, mr: -0.5 }}><LocationOn sx={{ fontSize: 16, color: BLUE }} /></InputAdornment>{params.InputProps.startAdornment}</>),
                                    endAdornment: (<>{commLoading && <CircularProgress size={14} />}{params.InputProps.endAdornment}</>),
                                }}
                            />
                        )}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField size="small" fullWidth label="Địa chỉ cụ thể"
                        value={form.Address} onChange={set("Address")} disabled={!editing}
                        sx={fieldSx(editing)}
                        InputProps={{ startAdornment: adornIcon(LocationOn) }}
                    />
                </Grid>
            </Grid>

            <ConfirmDialog
                open={confirmOpen}
                onClose={() => !isUpdating && setConfirmOpen(false)}
                onConfirm={handleConfirm}
                title="Xác nhận cập nhật"
                message="Bạn có chắc chắn muốn lưu thay đổi? Thông tin sẽ được cập nhật ngay lập tức."
            />

            <ChangePasswordDialog
                open={changePasswordOpen}
                onClose={() => setChangePasswordOpen(false)}
                onLogout={handleLogout}
            />
        </Box>
    );
}