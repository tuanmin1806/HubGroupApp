import { Box, Button, IconButton, InputAdornment, Link, Stack, TextField, Typography, Paper } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { requiredValidator, validate } from "../../app/services/validation.service";
import { useCustomerLoginMutation } from "../../app/features/auth/auth.api";
import { useState } from "react";
import { Visibility, VisibilityOff, Login } from "@mui/icons-material";
import LogoImage from "../../assets/hub_logo.png";
import SelectRegisterType from "./select-register.page";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { showSnackbar } from "../../app/features/snackbar/snackbar.slice";

const initialState = {
  UserName: "",
  Password: "",
};

const validators = {
  UserName: [requiredValidator],
  Password: [requiredValidator],
};

const CustomerLoginForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [customerLogin] = useCustomerLoginMutation();
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState(initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;

  const handleChange = (field) => (e) => {
    const { value } = e.target;

    setForm((prev) => ({ ...prev, [field]: value }));

    setErrors((prev) => ({ ...prev, [field]: validate(value, validators[field] || [], form), }));
  };

  const isFormValid = () => {
    const allFilled = Object.keys(validators).every((field) => String(form[field]).trim() !== "");

    const noErrors = !Object.values(errors).some(Boolean);

    return allFilled && noErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await customerLogin(form).unwrap();
      dispatch(showSnackbar({ message: "Đăng nhập thành công", severity: "success" }));
      const defaultPage = data?.Roles?.[0]?.DefaultPage;

      if (from) {
        navigate(from, { replace: true });
      } else if (defaultPage) {
        navigate(defaultPage, { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (error) {
      dispatch(showSnackbar({ message: "Không thể đăng nhập, vui lòng kiểm tra lại thông tin hoặc liên hệ với hỗ trợ kỹ thuật!", severity: "error" }));
    }
  };

  return (
    <Paper sx={{ width: "100%", p: { xs: 2, sm: 3 }, }}>
      <Stack spacing={2} alignItems="center">

        {/* LOGO */}
        <Box
          component="img"
          src={LogoImage}
          sx={{
            height: 70,
            objectFit: "contain",
          }}
        />

        {/* TITLE */}
        <Typography variant="h5" fontWeight={700}> Đăng nhập </Typography>

        {/* FORM */}
        <Box component="form" width="100%" onSubmit={handleSubmit}>
          <Stack spacing={2.5}>
            <TextField
              size="small"
              fullWidth
              label="Tên đăng nhập"
              value={form.UserName}
              onChange={handleChange("UserName")}
              error={!!errors.UserName}
              helperText={errors.UserName}
            />

            <TextField
              fullWidth
              size="small"
              label="Mật khẩu"
              value={form.Password}
              onChange={handleChange("Password")}
              error={!!errors.Password}
              helperText={errors.Password}
              type={showPassword ? "text" : "password"}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((v) => !v)}
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            {/* LOGIN BUTTON */}
            <Button
              fullWidth
              type="submit"
              disabled={!isFormValid()}
              size="medium"
              variant="contained"
              startIcon={<Login />}
              sx={{
                fontSize: 15,
                fontWeight: 500,
                borderRadius: 2,
                textTransform: "none",
                backgroundColor: "#faa11b"
              }}
            >
              Đăng nhập
            </Button>

            <Stack alignItems="center"><Link href="#!" underline="hover" variant="body2"> Quên mật khẩu? </Link></Stack>

            {/* REGISTER */}
            <Typography
              variant="body2"
              textAlign="center"
              sx={{ color: "text.secondary", p: 1, cursor: "pointer" }}
            >
              Chưa có tài khoản?
              <Link
                sx={{ ml: 0.5, textDecoration: "none" }}
                onClick={() => setLoginDialogOpen(true)}
              >
                Đăng ký ngay
              </Link>
            </Typography>
          </Stack>
        </Box>
      </Stack>
      <SelectRegisterType open={loginDialogOpen} onClose={() => setLoginDialogOpen(false)} />
    </Paper>
  );
};

export default CustomerLoginForm;