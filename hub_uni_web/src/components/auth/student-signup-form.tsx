import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useStudentRegisterMutation } from "../../app/features/auth/auth.api";
import { useState } from "react";

const initialState = {
    UserName: "",
    Password: "",
    FullName: "",
    Gender: "Male",
    Email: "",
    PhoneNumber: "",
    Age: 18,
    Experience: "LessThan1Year",
    EducationLevel: "HighSchool",
};

const StudentSignupForm = () => {
    const [registerStudent] = useStudentRegisterMutation();
    const [form, setForm] = useState(initialState);

    const handleSubmit = async (e) => {
        e.preventDefault();

        await registerStudent({
            UserName: form.UserName,
            Password: form.Password,
            FullName: form.FullName,
            Gender: form.Gender,
            Email: form.Email,
            PhoneNumber: form.PhoneNumber,
            AccountType: "Student",
            AccountStatus: "Activated",
            ProfileInfo: {
                Age: form.Age,
                Gender: form.Gender,
                Experience: form.Experience,
                EducationLevel: form.EducationLevel,
            },
        });
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
                <Typography variant="h6">Thông tin đăng nhập</Typography>
                <TextField label="Tên đăng nhập" value={form.UserName} onChange={(e) => setForm({...form, UserName: e.target.value})} fullWidth />
                <TextField label="Mật khẩu" type="password" value={form.Password} onChange={(e) => setForm({...form, Password: e.target.value})} fullWidth />
                <TextField label="Họ và tên" value={form.FullName} onChange={(e) => setForm({...form, FullName: e.target.value})} fullWidth />
                <TextField label="Email" value={form.Email} onChange={(e) => setForm({...form, Email: e.target.value})} fullWidth />
                <TextField label="Số điện thoại" value={form.PhoneNumber} onChange={(e) => setForm({...form, PhoneNumber: e.target.value})} fullWidth />
                <TextField label="Tuổi" type="number" value={form.Age} onChange={(e) => setForm({...form, Age: parseInt(e.target.value) || 0})} fullWidth />
                <Button type="submit" variant="contained" size="large">
                    Đăng ký học sinh
                </Button>
            </Stack>
        </Box>
    );
};

export default StudentSignupForm;