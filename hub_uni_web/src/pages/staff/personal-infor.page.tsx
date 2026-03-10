import { Avatar, Box, Chip, CircularProgress, Divider, Grid, Paper, Stack, Typography } from "@mui/material";
import { useGetCustomerInforQuery } from "../../app/features/customer.api";
import { ConvertService } from "../../app/services/convert.service";
import { getUserInfo } from "../../app/services/auth.service";
import { AccountStatus } from "../../app/models/enums.model";

export default function PersonalInforPage() {
    const userInfo = getUserInfo();
    const id = userInfo?.Id;

    const { data, isLoading, isError } = useGetCustomerInforQuery(id ?? "");

    if (isLoading) { return (<Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>); }

    if (isError || !data) { return (<Box textAlign="center" py={6}><Typography color="error"> Không thể tải thông tin người dùng </Typography></Box>); }

    return (
        <Box>
            <Typography variant="h5" fontWeight={600} mb={3}> Thông tin cá nhân </Typography>

            <Paper elevation={1} sx={{ p: 3 }}>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Stack alignItems="center" spacing={2}>
                            <Avatar
                                src={data.AvatarFullUrl}
                                sx={{
                                    width: 120,
                                    height: 120,
                                    fontSize: 40
                                }}
                            />
                            <Typography fontWeight={600}> {data.FullName} </Typography>
                            <Typography variant="body2" color="text.secondary"> @{data.UserName} </Typography>
                        </Stack>
                    </Grid>

                    {/* Info */}
                    <Grid size={{ xs: 12, md: 9 }}>
                        <Grid container spacing={2}>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant="body2" color="text.secondary"> Email </Typography>
                                <Typography>{data.Email}</Typography>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant="body2" color="text.secondary"> Số điện thoại </Typography>
                                <Typography>{data.PhoneNumber ?? "—"}</Typography>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant="body2" color="text.secondary"> Ngày sinh </Typography>
                                <Typography>{ConvertService.formatDateToddMMyyyy(data.DateOfBirth)}</Typography>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant="body2" color="text.secondary"> Giới tính </Typography>
                                <Typography>{ConvertService.convertGender(ConvertService.convertGenderFromString(data.Gender))}</Typography>
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <Typography variant="body2" color="text.secondary"> Địa chỉ </Typography>
                                <Typography>{data.Address}</Typography>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant="body2" color="text.secondary"> Trạng thái </Typography>
                                <Chip
                                    label={ConvertService.convertAccountStatus(ConvertService.convertAccountStatusFromString(data.AccountStatus))}
                                    color={ConvertService.convertAccountStatusFromString(data.AccountStatus) === AccountStatus.Activated ? "success" : "default"}
                                    size="small"
                                />
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 3 }} />

                        {/* Roles */}
                        <Box mb={2}>
                            <Typography fontWeight={600} mb={1}> Vai trò </Typography>

                            <Stack direction="row" spacing={1} flexWrap="wrap">
                                {data.Roles?.map(role => (
                                    <Chip
                                        key={role.Id}
                                        label={role.Name}
                                        color="primary"
                                        size="small"
                                    />
                                ))}
                            </Stack>
                        </Box>

                        {/* Departments */}
                        <Box>
                            <Typography fontWeight={600} mb={1}> Phòng ban </Typography>

                            <Stack direction="row" spacing={1} flexWrap="wrap">
                                {data.Departments?.map(dep => (
                                    <Chip
                                        key={dep.Id}
                                        label={dep.Name}
                                        variant="outlined"
                                        size="small"
                                    />
                                ))}
                            </Stack>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
}