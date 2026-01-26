import { Box, Button, Checkbox, Divider, FormControlLabel, Grid, IconButton, InputAdornment, Link, Stack, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SocialAuth from "./social-auth";
import { requiredValidator, validate } from "../../app/services/validation.service";
import { useLoginMutation } from "../../app/features/auth/auth.api";
import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";


const initialState = {
  username: "",
  password: "",
}

const validators = {
  username: [requiredValidator],
  password: [requiredValidator],
};
const LoginForm = () => {
  const [login] = useLoginMutation();
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState(initialState);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange =
    (field: "username" | "password") =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setForm(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({
          ...prev,
          [field]: validate(value, validators[field], form),
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
      const data = await login({
        UserName: form.username,
        Password: form.password,
      }).unwrap();

      switch (data.userResponse.role) {
        case "ADMIN":
          navigate("/admin");
          break;
        case "MANAGER":
          navigate("/manager");
          break;
        case "STAFF":
          navigate("/staff");
          break;
        case "SUPERVISOR":
          navigate("/supervisor");
          break;
        default:
          navigate("/");
      }
    } catch (error: any) {
      if (error?.data?.code === 444) {
        // mở reconfirm password dialog nếu cần
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
            <Typography variant="h4">Log in</Typography>
            <Typography
              variant="subtitle2"
              sx={{
                color: 'text.secondary',
              }}
            >
              Don&apos;t have an account?
              <Link href='/' sx={{ ml: 1 }}>
                Sign up
              </Link>
            </Typography>
          </Stack>
        </Grid>

        <Grid size={12}>
          <SocialAuth />
        </Grid>
        <Grid size={12}>
          <Divider sx={{ color: 'text.secondary' }}>or use email</Divider>
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
                  label="Email"
                  type="email"
                  value={form.username}
                  onChange={handleChange("username")}
                  error={!!errors.username}
                  helperText={errors.username}
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
                  label="Password"
                  value={form.password}
                  onChange={handleChange("password")}
                  error={!!errors.password}
                  helperText={errors.password}
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
                  mb: 6,
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
                  <FormControlLabel
                    control={<Checkbox name="checked" color="primary" size="small" />}
                    label={
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: 'text.secondary',
                        }}
                      >
                        Remember this device
                      </Typography>
                    }
                  />

                  <Link href="#!" variant="subtitle2">
                    Forgot Password?
                  </Link>
                </Stack>
              </Grid>
              <Grid size={12}>
                <Button fullWidth type="submit" disabled={!isFormValid()} size="large" variant="contained">
                  Log in
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
      <Link href="#!" variant="subtitle2">
        Trouble signing in?
      </Link>
    </Stack>
  );
};

export default LoginForm;