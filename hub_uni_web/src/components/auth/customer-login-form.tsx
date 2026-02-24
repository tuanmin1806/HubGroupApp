import { Box, Button, Checkbox, Divider, FormControlLabel, Grid, IconButton, InputAdornment, Link, Stack, TextField, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { requiredValidator, validate } from "../../app/services/validation.service";
import { useCustomerLoginMutation, useLoginMutation } from "../../app/features/auth/auth.api";
import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";


const initialState = {
  UserName: "",
  Password: "",
}

const validators = {
  UserName: [requiredValidator],
  Password: [requiredValidator],
};
const CustomerLoginForm = () => {
  const [customerLogin] = useCustomerLoginMutation();
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState(initialState);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;

  const handleChange = (field) => (e) => {
    const { value } = e.target;
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({
      ...prev,
      [field]: validate(value, validators[field] || [], form),
    }));
  };


  const isFormValid = () => {
    const allFilled = Object.keys(validators).every(
      field => String(form[field as keyof typeof form]).trim() !== ""
    );
    const noErrors = !Object.values(errors).some(Boolean);
    return allFilled && noErrors;
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const data = await customerLogin(form).unwrap();

      const defaultPage = data?.Roles?.[0]?.DefaultPage;

      if (from) {
        navigate(from, { replace: true });
      } else if (defaultPage) {
        navigate(defaultPage, { replace: true });
      } else {
        navigate("/", { replace: true });
      }

    } catch (error: any) {
      if (error?.data?.code === 444) {
        console.log("Need reconfirm password");
      }
    }
  };

  return (
    <Stack
      direction="column"
      sx={{
        height: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        pt: { md: 10 },
        pb: 10,
      }}
    >
      <div />

      <Grid
        container
        sx={{
          maxWidth: '35rem',
          rowGap: 4,
          p: { xs: 3, sm: 5 },
          mb: 5,
        }}
      >
        <Grid size={12}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            sx={{
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'flex-end' },
            }}
          >
            <Typography variant="h4">Đăng nhập</Typography>
            <Typography
              variant="subtitle2"
              sx={{
                color: 'text.secondary',
              }}
            >
              Chưa có tài khoản?
              <Link href='/' sx={{ ml: 1 }}>
                Đăng ký
              </Link>
            </Typography>
          </Stack>
        </Grid>

        <Grid size={12}>
          <Box component="form" noValidate onSubmit={handleSubmit}>
            <Grid container>
              <Grid
                sx={{
                  mb: 3,
                }}
                size={12}
              >
                <TextField
                  fullWidth
                  label="Tên đăng nhập"
                  type="text"
                  value={form.UserName}
                  onChange={handleChange("UserName")}
                  error={!!errors.UserName}
                  helperText={errors.UserName}
                />

              </Grid>
              <Grid
                sx={{
                  mb: 2.5,
                }}
                size={12}
              >
                <TextField
                  fullWidth
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
                            onClick={() => setShowPassword(v => !v)}
                            onMouseDown={e => e.preventDefault()}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />

              </Grid>
              <Grid
                sx={{
                  mb: 3,
                }}
                size={12}
              >
                <Stack
                  spacing={1}
                  sx={{
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Link href="#!" variant="subtitle2">
                    Quên mật khẩu?
                  </Link>
                </Stack>
              </Grid>
              <Grid size={12}>
                <Button fullWidth type="submit" disabled={!isFormValid()} size="large" variant="contained">
                  Đăng nhập
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default CustomerLoginForm;