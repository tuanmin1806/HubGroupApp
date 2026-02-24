import { Box, Stack, Typography, TextField, Divider, Button, MenuItem } from "@mui/material";
import { useState } from "react";
import { useRecruiterRegisterMutation } from "../../app/features/auth/auth.api";
import { useGetAllProvinceNoAuthenQuery } from "../../app/features/province.api";
import { useGetAllProfessionNoAuthenQuery } from "../../app/features/profession.api";
import { DEFAULT_PAGE } from "../../constants/common.constant";
import { useGetOrganizationTypesByPageQuery } from "../../app/features/organization-type.api";
import { Province } from "../../app/models/province.model";
import { ProfessionResponse } from "../../app/models/profession.model";

const RecruiterSignupForm = () => {
    const [page, setPage] = useState(DEFAULT_PAGE);
    const [selectedProvinceId, setSelectedProvinceId] = useState<string>("");
    const [selectedProfessionId, setSelectedProfessionId] = useState<string>("");
    const { data: provinces = [] } = useGetAllProvinceNoAuthenQuery();
    const { data: professions = [] } = useGetAllProfessionNoAuthenQuery();
    const [registerRecruiter] = useRecruiterRegisterMutation();
    const [form, setForm] = useState({
        UserName: "",
        Password: "",
        FullName: "",
        Email: "",
        PhoneNumber: "",
        OrganizationName: "",
        TaxCode: "",
        Address: "",
        ProvinceId: "",
        ProfessionId: "",
        OrganizationTypeId: "",
    });
    const handleProvinceSelect = (provinceId: string) => {
        setSelectedProvinceId(provinceId);
        setPage(DEFAULT_PAGE);
    };

    const handleProfessionSelect = (professionId: string) => {
        setSelectedProfessionId(professionId);
        setPage(DEFAULT_PAGE);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        await registerRecruiter({
            CustomerModel: {
                UserName: form.UserName,
                Password: form.Password,
                FullName: form.FullName,
                Email: form.Email,
                PhoneNumber: form.PhoneNumber,
                Gender: "Male",
            },
            OrganizationModel: {
                Name: form.OrganizationName,
                TaxCode: form.TaxCode,
                Address: form.Address,
                PhoneNumber: form.PhoneNumber,
                Email: form.Email,
            },
        });
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
                <Typography variant="h6">Thông tin tài khoản</Typography>
                <TextField label="Tên đăng nhập" value={form.UserName} onChange={(e) => setForm({ ...form, UserName: e.target.value })} fullWidth />
                <TextField label="Mật khẩu" type="password" value={form.Password} onChange={(e) => setForm({ ...form, Password: e.target.value })} fullWidth />
                <TextField label="Họ và tên" value={form.FullName} onChange={(e) => setForm({ ...form, FullName: e.target.value })} fullWidth />
                <TextField label="Email" value={form.Email} onChange={(e) => setForm({ ...form, Email: e.target.value })} fullWidth />

                <Divider />

                <Typography variant="h6">Thông tin tổ chức</Typography>
                <TextField label="Tên trường / tổ chức" value={form.OrganizationName} onChange={(e) => setForm({ ...form, OrganizationName: e.target.value })} fullWidth />
                <TextField label="Mã số thuế" value={form.TaxCode} onChange={(e) => setForm({ ...form, TaxCode: e.target.value })} fullWidth />
                <TextField select label="Tỉnh / Thành phố" value={form.ProvinceId} onChange={(e) => setForm({ ...form, ProvinceId: e.target.value })} fullWidth>
                    {provinces.map((province: Province) => (
                        <MenuItem key={province.Id} value={province.Id}>
                            {province.Name}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField select label="Ngành nghề đào tạo" value={form.ProfessionId} onChange={(e) => setForm({ ...form, ProfessionId: e.target.value })} fullWidth>
                    {professions.map((profession: ProfessionResponse) => (
                        <MenuItem key={profession.Id} value={profession.Id}>
                            {profession.Name}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField label="Địa chỉ chi tiết" value={form.Address} onChange={(e) => setForm({ ...form, Address: e.target.value })} fullWidth />

                <Button type="submit" variant="contained" size="large">
                    Đăng ký Admin Trường
                </Button>
            </Stack>
        </Box>
    );
};

export default RecruiterSignupForm;