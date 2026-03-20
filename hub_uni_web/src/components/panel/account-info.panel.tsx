import { Person, Phone, Email, Cake, Wc, LocationOn, Badge, Edit, Save, Cancel, School, WorkHistory, TrendingUp, CalendarMonth, Public } from "@mui/icons-material";
import { Box, Stack, Typography, Divider, Grid, TextField, MenuItem, Button, CircularProgress, Autocomplete, InputAdornment, } from "@mui/material";
import { useState, useEffect } from "react";
import { AccountResponse } from "../../app/models/account.model";
import { useUpdateCustomerMutation } from "../../app/features/customer.api";
import { useGetAllProvinceNoAuthenQuery, useGetProvinceByCountryQuery } from "../../app/features/province.api";
import { useGetCommunesByProvinceQuery } from "../../app/features/commune.api";
import { getUserInfo } from "../../app/services/auth.service";
import { Province } from "../../app/models/province.model";
import { CommuneResponse } from "../../app/models/commune.model";
import { CustomerResponse } from "../../app/models/customer.model";
import { EducationLevel, Gender, JobExperience } from "../../app/models/enums.model";
import ConfirmDialog from "../dialogs/general/confirm.dialog";
import { ConvertService } from "../../app/services/convert.service";
import { useGetAllCountryNoAuthenQuery } from "../../app/features/country.api";
import { Country } from "../../app/models/country.model";

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
    { value: Gender.Undefined, label: "Không yêu cầu" },
    { value: Gender.Male, label: "Nam" },
    { value: Gender.Female, label: "Nữ" },
    { value: Gender.Other, label: "Khác" },
];

const EXPERIENCE_OPTIONS: { value: JobExperience; label: string }[] = [
    { value: JobExperience.Undefined, label: "Không yêu cầu" },
    { value: JobExperience.LessThan1Year, label: "< 1 năm" },
    { value: JobExperience.From1To2Years, label: "1-2 năm" },
    { value: JobExperience.From2To3Years, label: "2-3 năm" },
    { value: JobExperience.From3To5Years, label: "3-5 năm" },
    { value: JobExperience.From5To10Years, label: "5-10 năm" },
    { value: JobExperience.Above10Years, label: "> 10 năm" },
];

const EDUCATION_OPTIONS: { value: EducationLevel; label: string }[] = [
    { value: EducationLevel.Undefined, label: "Không yêu cầu" },
    { value: EducationLevel.PrimarySchool, label: "Tiểu học" },
    { value: EducationLevel.MiddleSchool, label: "THCS" },
    { value: EducationLevel.HighSchool, label: "THPT" },
    { value: EducationLevel.VocationalSchool, label: "Trung cấp" },
    { value: EducationLevel.College, label: "Cao đẳng" },
    { value: EducationLevel.University, label: "Đại học" },
    { value: EducationLevel.Postgraduate, label: "Sau đại học" },
];

interface EditableForm {
    UserName: string;
    FullName: string;
    Gender: Gender;
    AvatarUrl: string;
    Email: string;
    PhoneNumber: string;
    DateOfBirth: string;
    Experience: JobExperience;
    EducationLevel: EducationLevel;
    GraduationYear: number | "";
    Gpa: number | "";
    CountryId: string;
    ProvinceId: string;
    CommuneId: string;
    Address: string;
}

function buildForm(account: CustomerResponse): EditableForm {
    const p = account.ProfileInfo;

    return {
        UserName: account.UserName ?? "",
        FullName: account.FullName ?? "",
        Gender: ConvertService.convertGenderFromString(p?.Gender ?? account.Gender),
        Email: account.Email ?? "",
        AvatarUrl: account.AvatarUrl ?? "",
        PhoneNumber: account.PhoneNumber ?? "",
        DateOfBirth: p?.DateOfBirth?.substring(0, 10) ?? "",
        Experience: ConvertService.convertJobExperienceFromString(p?.Experience),
        EducationLevel: ConvertService.convertEducationLevelFromString(p?.EducationLevel),
        GraduationYear: p?.GraduationYear || "",
        Gpa: p?.Gpa || "",
        CountryId: p?.CountryId ?? "",
        ProvinceId: p?.ProvinceId ?? "",
        CommuneId: p?.CommuneId ?? "",
        Address: p?.Address ?? "",
    };
}

function buildUpdatePayload(account: CustomerResponse, form: EditableForm) {
    return {
        Id: account.Id,
        UserName: form.UserName,
        FullName: form.FullName,
        AvatarUrl: account.AvatarUrl,
        Gender: form.Gender,
        Email: form.Email,
        PhoneNumber: form.PhoneNumber,
        AccountType: account.AccountType,
        AccountStatus: account.AccountStatus,
        RoleIds: account.Roles?.map(r => r.Id) ?? [],

        ProfileInfo: {
            DateOfBirth: form.DateOfBirth,
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

export default function AccountInfoPanel({ account }: { account: AccountResponse }) {
    const userInfo = getUserInfo();
    const [isEditing, setIsEditing] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [form, setForm] = useState<EditableForm>(() => buildForm(account));

    useEffect(() => { setForm(buildForm(account)); }, [account]);

    const { data: countries = [] } = useGetAllCountryNoAuthenQuery();
    const selectedCountry = countries.find(c => c.Id === form.CountryId);
    const { data: provinces = [], isFetching: provincesLoading } = useGetProvinceByCountryQuery(selectedCountry?.SeoUrl ?? "", { skip: !selectedCountry });
    const selectedProvince = provinces.find(p => p.Id === form.ProvinceId);
    const { data: communes = [], isFetching: communesLoading } = useGetCommunesByProvinceQuery(selectedProvince?.SeoUrl ?? "", { skip: !selectedProvince });
    const [updateCustomer, { isLoading: isUpdating }] = useUpdateCustomerMutation();
    const selectedCommune = communes.find(c => c.Id === form.CommuneId) ?? null;
    const set = (field: keyof EditableForm) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(prev => ({ ...prev, [field]: e.target.value }));
    const setEnum = <K extends keyof EditableForm>(field: K) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(prev => ({ ...prev, [field]: Number(e.target.value) }));
    const handleCancel = () => { setIsEditing(false); setForm(buildForm(account)); };

    const handleConfirm = async () => {
        try {
            await updateCustomer(buildUpdatePayload(account, form)).unwrap();
            setConfirmOpen(false);
            setIsEditing(false);
        } catch (err) { }
    };

    return (
        <Box>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.5 }}>
                <Typography variant="h6" fontWeight={700} sx={{ fontSize: "1rem" }}>Thông tin tài khoản</Typography>
                {isEditing ? (
                    <Stack direction="row" spacing={1}>
                        <Button size="small" startIcon={<Cancel sx={{ fontSize: 16 }} />} onClick={handleCancel} sx={{ textTransform: "none", fontWeight: 600, fontSize: "0.8rem", color: "text.secondary" }}>Hủy</Button>
                        <Button variant="contained" size="small" startIcon={<Save sx={{ fontSize: 16 }} />} onClick={() => setConfirmOpen(true)} sx={{ textTransform: "none", fontWeight: 600, fontSize: "0.8rem", bgcolor: "#f36730", "&:hover": { bgcolor: "#e05520" }, }}>Cập nhật</Button>
                    </Stack>
                ) : (<Button variant="outlined" size="small" startIcon={<Edit sx={{ fontSize: 16 }} />} onClick={() => setIsEditing(true)} sx={{ textTransform: "none", fontWeight: 600, fontSize: "0.8rem", color: "#f36730", borderColor: "#f36730", "&:hover": { bgcolor: "#fff3e0", borderColor: "#f36730" }, }}>Chỉnh sửa</Button>)}
            </Stack>

            <Divider sx={{ mb: 1 }} />

            <Typography variant="caption" sx={{ display: "block", fontWeight: 700, fontSize: "0.68rem", letterSpacing: "0.09em", textTransform: "uppercase", color: "#f36730", mt: 2.5, mb: 1.5, }}>Thông tin cơ bản</Typography>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        size="small" fullWidth label="Họ và tên"
                        value={form.FullName} onChange={set("FullName")}
                        disabled={!isEditing}
                        sx={{ "& .MuiOutlinedInput-root": { bgcolor: isEditing ? "white" : "#fafafa", fontSize: "0.875rem" }, "& .MuiInputLabel-root": { fontSize: "0.8rem" }, }}
                        InputProps={{ startAdornment: (<InputAdornment position="start"><Person sx={{ fontSize: 16, color: "#f36730" }} /></InputAdornment>), }}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        size="small" fullWidth label="Tên đăng nhập"
                        value={form.UserName}
                        disabled={true}
                        sx={{ "& .MuiOutlinedInput-root": { bgcolor: isEditing ? "white" : "#fafafa", fontSize: "0.875rem" }, "& .MuiInputLabel-root": { fontSize: "0.8rem" }, }}
                        InputProps={{ startAdornment: (<InputAdornment position="start"><Badge sx={{ fontSize: 16, color: "#f36730" }} /></InputAdornment>), }}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        size="small" fullWidth label="Email" type="email"
                        value={form.Email} onChange={set("Email")}
                        disabled={!isEditing}
                        sx={{ "& .MuiOutlinedInput-root": { bgcolor: isEditing ? "white" : "#fafafa", fontSize: "0.875rem" }, "& .MuiInputLabel-root": { fontSize: "0.8rem" }, }}
                        InputProps={{ startAdornment: (<InputAdornment position="start"><Email sx={{ fontSize: 16, color: "#f36730" }} /></InputAdornment>), }}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        size="small" fullWidth label="Số điện thoại"
                        value={form.PhoneNumber} onChange={set("PhoneNumber")}
                        disabled={!isEditing}
                        sx={{ "& .MuiOutlinedInput-root": { bgcolor: isEditing ? "white" : "#fafafa", fontSize: "0.875rem" }, "& .MuiInputLabel-root": { fontSize: "0.8rem" }, }}
                        InputProps={{ startAdornment: (<InputAdornment position="start"><Phone sx={{ fontSize: 16, color: "#f36730" }} /></InputAdornment>), }}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        size="small" fullWidth label="Ngày sinh" type="date"
                        value={form.DateOfBirth} onChange={set("DateOfBirth")}
                        disabled={!isEditing}
                        InputLabelProps={{ shrink: true }}
                        sx={{ "& .MuiOutlinedInput-root": { bgcolor: isEditing ? "white" : "#fafafa", fontSize: "0.875rem" }, "& .MuiInputLabel-root": { fontSize: "0.8rem" }, }}
                        InputProps={{ startAdornment: (<InputAdornment position="start"><Cake sx={{ fontSize: 16, color: "#f36730" }} /></InputAdornment>), }}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        select size="small" fullWidth label="Giới tính"
                        value={form.Gender} onChange={setEnum("Gender")}
                        disabled={!isEditing}
                        sx={{ "& .MuiOutlinedInput-root": { bgcolor: isEditing ? "white" : "#fafafa", fontSize: "0.875rem" }, "& .MuiInputLabel-root": { fontSize: "0.8rem" }, }}
                        InputProps={{ startAdornment: (<InputAdornment position="start"><Wc sx={{ fontSize: 16, color: "#f36730" }} /></InputAdornment>), }}
                    >
                        {GENDER_OPTIONS.map(({ value, label }) => (<MenuItem key={value} value={value} sx={{ fontSize: "0.875rem" }}>{label}</MenuItem>))}
                    </TextField>
                </Grid>
            </Grid>

            <Typography variant="caption" sx={{ display: "block", fontWeight: 700, fontSize: "0.68rem", letterSpacing: "0.09em", textTransform: "uppercase", color: "#f36730", mt: 2.5, mb: 1.5, }}>Học vấn & Kinh nghiệm</Typography>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        select size="small" fullWidth label="Trình độ học vấn"
                        value={form.EducationLevel} onChange={setEnum("EducationLevel")}
                        disabled={!isEditing}
                        sx={{ "& .MuiOutlinedInput-root": { bgcolor: isEditing ? "white" : "#fafafa", fontSize: "0.875rem" }, "& .MuiInputLabel-root": { fontSize: "0.8rem" }, }}
                        InputProps={{ startAdornment: (<InputAdornment position="start"><School sx={{ fontSize: 16, color: "#f36730" }} /></InputAdornment>), }}
                    >
                        {EDUCATION_OPTIONS.map(({ value, label }) => (<MenuItem key={value} value={value} sx={{ fontSize: "0.875rem" }}>{label}</MenuItem>))}
                    </TextField>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        select size="small" fullWidth label="Kinh nghiệm"
                        value={form.Experience} onChange={setEnum("Experience")}
                        disabled={!isEditing}
                        sx={{ "& .MuiOutlinedInput-root": { bgcolor: isEditing ? "white" : "#fafafa", fontSize: "0.875rem" }, "& .MuiInputLabel-root": { fontSize: "0.8rem" }, }}
                        InputProps={{ startAdornment: (<InputAdornment position="start"><WorkHistory sx={{ fontSize: 16, color: "#f36730" }} /></InputAdornment>), }}
                    >
                        {EXPERIENCE_OPTIONS.map(({ value, label }) => (<MenuItem key={value} value={value} sx={{ fontSize: "0.875rem" }}>{label}</MenuItem>))}
                    </TextField>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        size="small" fullWidth label="Năm tốt nghiệp"
                        value={form.GraduationYear} onChange={set("GraduationYear")}
                        disabled={!isEditing}
                        sx={{ "& .MuiOutlinedInput-root": { bgcolor: isEditing ? "white" : "#fafafa", fontSize: "0.875rem" }, "& .MuiInputLabel-root": { fontSize: "0.8rem" }, }}
                        InputProps={{ startAdornment: (<InputAdornment position="start"><CalendarMonth sx={{ fontSize: 16, color: "#f36730" }} /></InputAdornment>), }}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        size="small" fullWidth label="GPA" type="number"
                        value={form.Gpa} onChange={set("Gpa")}
                        disabled={!isEditing}
                        inputProps={{ min: 0, max: 4, step: 0.01 }}
                        sx={{ "& .MuiOutlinedInput-root": { bgcolor: isEditing ? "white" : "#fafafa", fontSize: "0.875rem" }, "& .MuiInputLabel-root": { fontSize: "0.8rem" }, }}
                        InputProps={{ startAdornment: (<InputAdornment position="start"><TrendingUp sx={{ fontSize: 16, color: "#f36730" }} /></InputAdornment>), }}
                    />
                </Grid>
            </Grid>

            <Typography variant="caption" sx={{ display: "block", fontWeight: 700, fontSize: "0.68rem", letterSpacing: "0.09em", textTransform: "uppercase", color: "#f36730", mt: 2.5, mb: 1.5, }}>Địa chỉ</Typography>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Autocomplete
                        options={countries}
                        disabled={!isEditing}
                        getOptionLabel={(o: Country) => o.Name ?? ""}
                        value={selectedCountry ?? null}
                        onChange={(_, val: Country | null) => setForm(prev => ({ ...prev, CountryId: val?.Id ?? "", ProvinceId: "", CommuneId: "" }))}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Quốc gia"
                                size="small"
                                fullWidth
                                sx={{ "& .MuiOutlinedInput-root": { bgcolor: isEditing ? "white" : "#fafafa", fontSize: "0.875rem" }, "& .MuiInputLabel-root": { fontSize: "0.8rem" }, }}
                                InputProps={{ ...params.InputProps, startAdornment: (<><InputAdornment position="start" sx={{ ml: 0.5, mr: -0.5 }}> <Public sx={{ fontSize: 16, color: "#f36730" }} /> </InputAdornment>{params.InputProps.startAdornment}</>), }}
                            />
                        )}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Autocomplete
                        options={provinces}
                        disabled={!isEditing}
                        loading={provincesLoading}
                        getOptionLabel={(o: Province) => o.Name ?? ""}
                        value={selectedProvince ?? null}
                        isOptionEqualToValue={(option, value) => option.Id === value.Id}
                        onChange={(_, val: Province | null) => setForm(prev => ({ ...prev, ProvinceId: val?.Id ?? "", CommuneId: "" }))}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Tỉnh / Thành phố"
                                size="small"
                                sx={{ "& .MuiOutlinedInput-root": { bgcolor: isEditing ? "white" : "#fafafa", fontSize: "0.875rem" }, "& .MuiInputLabel-root": { fontSize: "0.8rem" } }}
                                InputProps={{ ...params.InputProps, startAdornment: (<><InputAdornment position="start" sx={{ ml: 0.5, mr: -0.5 }}> <LocationOn sx={{ fontSize: 16, color: "#f36730" }} /> </InputAdornment>{params.InputProps.startAdornment}</>), }}
                            />
                        )}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Autocomplete
                        options={communes}
                        disabled={!isEditing}
                        loading={communesLoading}
                        getOptionLabel={(o: CommuneResponse) => o.Name ?? ""}
                        isOptionEqualToValue={(option, value) => option.Id === value.Id}
                        value={selectedCommune}
                        onChange={(_, val: CommuneResponse | null) => setForm(prev => ({ ...prev, CommuneId: val?.Id ?? "" }))}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Quận / Huyện / Xã"
                                size="small"
                                sx={{ "& .MuiOutlinedInput-root": { bgcolor: isEditing ? "white" : "#fafafa", fontSize: "0.875rem" }, "& .MuiInputLabel-root": { fontSize: "0.8rem" } }}
                                InputProps={{ ...params.InputProps, startAdornment: (<><InputAdornment position="start" sx={{ ml: 0.5, mr: -0.5 }}> <LocationOn sx={{ fontSize: 16, color: "#f36730" }} /> </InputAdornment>{params.InputProps.startAdornment}</>), endAdornment: (<> {communesLoading && <CircularProgress color="inherit" size={14} />}{params.InputProps.endAdornment}</>), }}
                            />
                        )}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        size="small" fullWidth label="Địa chỉ cụ thể"
                        value={form.Address} onChange={set("Address")}
                        disabled={!isEditing}
                        sx={{ "& .MuiOutlinedInput-root": { bgcolor: isEditing ? "white" : "#fafafa", fontSize: "0.875rem" }, "& .MuiInputLabel-root": { fontSize: "0.8rem" }, }}
                        InputProps={{ startAdornment: (<InputAdornment position="start"><LocationOn sx={{ fontSize: 16, color: "#f36730" }} /></InputAdornment>), }}
                    />
                </Grid>
            </Grid>

            <ConfirmDialog
                open={confirmOpen}
                onClose={() => !isUpdating && setConfirmOpen(false)}
                onConfirm={handleConfirm}
                title="Xác nhận cập nhật"
                message="Bạn có chắc chắn muốn lưu thay đổi không? Thông tin sẽ được cập nhật ngay lập tức."
            />
        </Box>
    );
}