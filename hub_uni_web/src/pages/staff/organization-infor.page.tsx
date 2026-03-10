import { Box, Container, Typography, Stack, Grid, Chip, CircularProgress, Divider, Button } from "@mui/material";
import { getUserInfo } from "../../app/services/auth.service";
import { useGetOrganizationByIdQuery } from "../../app/features/organization.api";
import { Edit } from "@mui/icons-material";
import { useState } from "react";
import UpdateOrganizationDialog from "../../components/dialogs/admin/organization/update-organization.dialog";

export default function OrganizationInforPage() {
    const userInfo = getUserInfo();
    const organizationId = userInfo?.OrganizationId ?? "";
    const [open, setOpen] = useState(false);

    const { data, isLoading } = useGetOrganizationByIdQuery(organizationId, { skip: !organizationId, });

    if (isLoading) { return (<Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}><CircularProgress /></Box>); }

    if (!data) return null;

    return (
        <Box sx={{ bgcolor: "#f7f8fa", pb: 6 }}>
            {/* Banner */}
            <Box
                sx={{
                    width: "100%",
                    height: { xs: 220, md: 350 },
                    backgroundImage: `url(${data.WallpaperFullUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    position: "relative",
                }}
            >
                <Box sx={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", }} />

                <Container
                    sx={{
                        position: "relative",
                        zIndex: 2,
                        height: "100%",
                        display: "flex",
                        alignItems: "flex-end",
                        pb: 4,
                    }}
                >
                    <Stack direction="row" spacing={3} alignItems="center">
                        <Box
                            component="img"
                            src={data.LogoFullUrl}
                            sx={{
                                width: { xs: 70, md: 100 },
                                height: { xs: 70, md: 100 },
                                borderRadius: 3,
                                bgcolor: "#fff",
                                p: 1,
                            }}
                        />

                        <Box>
                            <Typography
                                variant="h4"
                                sx={{
                                    color: "#fff",
                                    fontWeight: 700,
                                    fontSize: { xs: 22, md: 32 },
                                }}
                            >
                                {data.Name}
                            </Typography>

                            <Typography color="rgba(255,255,255,0.8)"> {data.InternationalName} </Typography>
                        </Box>
                    </Stack>
                </Container>
            </Box>

            <Container sx={{ mt: 4 }}>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Stack spacing={2}>
                            <Box
                                sx={{
                                    bgcolor: "#fff",
                                    p: 2,
                                    borderRadius: 3,
                                    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                                }}
                            >
                                <Typography variant="h6" fontWeight={700} mb={2}> Giới thiệu </Typography>

                                <Typography color="text.secondary"> {data.Summary} </Typography>
                            </Box>

                            {/* Description */}
                            <Box
                                sx={{
                                    bgcolor: "#fff",
                                    p: 2,
                                    borderRadius: 3,
                                    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                                }}
                            >
                                <Typography variant="h6" fontWeight={700} mb={2}> Thông tin chi tiết </Typography>

                                <Box
                                    sx={{ "& img": { maxWidth: "100%" }, }}
                                    dangerouslySetInnerHTML={{
                                        __html: data.Description,
                                    }}
                                />
                            </Box>

                            {/* Gallery */}
                            <Box
                                sx={{
                                    bgcolor: "#fff",
                                    p: 2,
                                    borderRadius: 3,
                                    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                                }}
                            >
                                <Typography variant="h6" fontWeight={700} mb={2}> Hình ảnh </Typography>

                                <Grid container spacing={2}>
                                    {data.FeaturedImageFullUrls?.map((img, index) => (
                                        <Grid key={index} size={{ xs: 6, md: 4 }}>
                                            <Box
                                                component="img"
                                                src={img}
                                                sx={{
                                                    width: "100%",
                                                    height: 160,
                                                    objectFit: "cover",
                                                    borderRadius: 2,
                                                }}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        </Stack>
                    </Grid>

                    {/* RIGHT SIDEBAR */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Stack spacing={2}>
                            {/* Info */}
                            <Box
                                sx={{
                                    bgcolor: "#fff",
                                    p: 2,
                                    borderRadius: 3,
                                    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                                }}
                            >
                                <Typography fontWeight={700} mb={2}> Thông tin tổ chức </Typography>

                                <Stack spacing={1.5}>
                                    <Typography> <b>Địa chỉ:</b> {data.Address} </Typography>

                                    <Typography> <b>Tỉnh:</b> {data.Province} </Typography>

                                    <Typography> <b>Email:</b> {data.Email} </Typography>

                                    <Typography> <b>Website:</b> {data.WebsiteUrl} </Typography>

                                    <Typography> <b>Quản lý bởi:</b> {data.ManagedBy} </Typography>
                                </Stack>
                            </Box>

                            {/* Main Profession */}
                            {data.MainProfession && (
                                <Box
                                    sx={{
                                        bgcolor: "#fff",
                                        p: 2,
                                        borderRadius: 3,
                                        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                                    }}
                                >
                                    <Typography fontWeight={700} mb={2}> Ngành chính </Typography>

                                    <Chip
                                        label={`${data.MainProfession.ProfessionName} - ${data.MainProfession.Cost?.toLocaleString()} ${data.Currency}`}
                                        color="primary"
                                    />
                                </Box>
                            )}

                            {/* Professions */}
                            <Box
                                sx={{
                                    bgcolor: "#fff",
                                    p: 2,
                                    borderRadius: 3,
                                    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                                }}
                            >
                                <Typography fontWeight={700} mb={2}> Ngành đào tạo </Typography>

                                <Stack spacing={1}>
                                    {data.Professions?.map((p) => (
                                        <Box key={p.ProfessionId}>
                                            <Typography> {p.ProfessionName} </Typography>

                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                            >
                                                {p.Cost?.toLocaleString()} {data.Currency}
                                            </Typography>

                                            <Divider sx={{ my: 1 }} />
                                        </Box>
                                    ))}
                                </Stack>
                            </Box>

                            {/* Highlights */}
                            {data.Highlights?.length > 0 && (
                                <Box
                                    sx={{
                                        bgcolor: "#fff",
                                        p: 2,
                                        borderRadius: 3,
                                        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                                    }}
                                >
                                    <Typography fontWeight={700} mb={2}> Điểm nổi bật </Typography>

                                    <Stack spacing={1}>
                                        {data.Highlights.map((h, i) => (
                                            <Typography key={i}>
                                                • {h}
                                            </Typography>
                                        ))}
                                    </Stack>
                                </Box>
                            )}
                        </Stack>
                    </Grid>
                </Grid>
                <Button
                    variant="contained"
                    startIcon={<Edit />}
                    onClick={() => setOpen(true)}
                    sx={{ borderRadius: 3 }}
                >
                    Cập nhật thông tin
                </Button>
            </Container>
            <UpdateOrganizationDialog open={open} onClose={() => setOpen(false)} />
        </Box>
    );
}