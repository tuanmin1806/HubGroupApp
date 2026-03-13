import { Box, Container, Typography, Stack, Grid, Chip, CircularProgress, Divider, Button, IconButton, Tooltip } from "@mui/material";
import { getUserInfo } from "../../app/services/auth.service";
import { useGetOrganizationByIdQuery } from "../../app/features/organization.api";
import { Edit, LocationOn, Email, Language, Business, School, Phone, AccountBalance, Star, Facebook, LinkedIn, YouTube, Twitter, Instagram, Map, Bed, CameraAlt } from "@mui/icons-material";
import { useState } from "react";
import UpdateOrganizationDialog from "../../components/dialogs/admin/organization/update-organization.dialog";
import { ConvertService } from "../../app/services/convert.service";
import { Profession } from "../../app/models/organization.model";
import LogoUploadDialog from "../../components/dialogs/admin/logo-upload.dialog";

export default function OrganizationInforPage() {
    const userInfo = getUserInfo();
    const organizationId = userInfo?.OrganizationId ?? "";
    const [open, setOpen] = useState(false);
    const [logoDialogOpen, setLogoDialogOpen] = useState(false);

    const { data, isLoading } = useGetOrganizationByIdQuery(organizationId, { skip: !organizationId });

    if (isLoading) { return (<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}> <CircularProgress sx={{ color: "#1975d1" }} /></Box>); }

    if (!data) return null;

    const socialLinks = [
        { icon: <Facebook />, url: data.FacebookUrl, label: "Facebook" },
        { icon: <LinkedIn />, url: data.LinkedinUrl, label: "LinkedIn" },
        { icon: <YouTube />, url: data.YoutubeUrl, label: "YouTube" },
        { icon: <Twitter />, url: data.TwitterUrl, label: "Twitter" },
        { icon: <Instagram />, url: data.InstagramUrl, label: "Instagram" },
        { icon: <Map />, url: data.GoogleMapUrl, label: "Google Maps" },
    ].filter((s) => s.url);

    return (
        <Box sx={{ bgcolor: "#f0f2f5", minHeight: "100vh", pb: 2 }}>
            <Box
                sx={{
                    width: "100%",
                    height: { xs: 240, sm: 300, md: 400 },
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <Box
                    component="img"
                    src={data.WallpaperFullUrl}
                    sx={{
                        width: "100%", height: "100%",
                        objectFit: "contain",
                        display: "block",
                    }}
                />
                <Box
                    sx={{
                        position: "absolute", inset: 0,
                        background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.65) 100%)",
                    }}
                />

                <Box sx={{ position: "absolute", top: 16, right: 16, zIndex: 3 }}>
                    <Button
                        variant="contained"
                        startIcon={<Edit />}
                        onClick={() => setOpen(true)}
                        size="small"
                        sx={{
                            bgcolor: "#1975d1",
                            backdropFilter: "blur(8px)",
                            border: "1px solid rgba(255,255,255,0.3)",
                            color: "#fff",
                            fontWeight: 600,
                            borderRadius: 2,
                            textTransform: "none",
                            "&:hover": { bgcolor: "rgba(255,255,255,0.25)" },
                        }}
                    >
                        Cập nhật thông tin
                    </Button>
                </Box>

                <Container
                    sx={{
                        position: "absolute", bottom: 0, left: "50%",
                        transform: "translateX(-50%)",
                        zIndex: 2, pb: { xs: 1, md: 2 },
                        width: "100%",
                    }}
                >
                    <Stack direction="row" spacing={{ xs: 2, md: 3 }} alignItems="flex-end">
                        <Box
                            sx={{
                                flexShrink: 0,
                                position: "relative",
                                width: { xs: 72, md: 110 },
                                height: { xs: 72, md: 110 },
                                mb: { xs: 0, md: "6px" },
                                cursor: "pointer",
                                "&:hover .logo-overlay": { opacity: 1 },
                            }}
                            onClick={() => setLogoDialogOpen(true)}
                        >
                            <Box
                                sx={{
                                    width: "100%",
                                    height: "100%",
                                    borderRadius: 3,
                                    overflow: "hidden",
                                    border: "3px solid #fff",
                                    bgcolor: "#fff",
                                    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                                }}
                            >
                                <Box
                                    component="img"
                                    src={data.LogoFullUrl}
                                    sx={{ width: "100%", height: "100%", objectFit: "contain", p: 0.5 }}
                                />
                            </Box>

                            <Box
                                className="logo-overlay"
                                sx={{
                                    position: "absolute",
                                    inset: 0,
                                    borderRadius: 3,
                                    bgcolor: "rgba(0,0,0,0.45)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    opacity: 0,
                                    transition: "opacity 0.2s ease",
                                }}
                            >
                                <CameraAlt sx={{ color: "#fff", fontSize: { xs: 20, md: 28 } }} />
                            </Box>
                        </Box>

                        <Box pb={0.5}>
                            <Stack direction="row" alignItems="center" spacing={1} mb={0.5} flexWrap="wrap">
                                <Typography
                                    variant="h5"
                                    sx={{
                                        color: "#fff",
                                        fontWeight: 800,
                                        fontSize: { xs: 16, sm: 22, md: 28 },
                                        lineHeight: 1.2,
                                        textShadow: "0 1px 4px rgba(0,0,0,0.4)",
                                    }}
                                >
                                    {data.Name}
                                </Typography>
                                {data.IsTop && (
                                    <Chip
                                        icon={<Star sx={{ fontSize: 14, color: "#1975d1 !important" }} />}
                                        label="TOP"
                                        size="small"
                                        sx={{
                                            bgcolor: "rgba(250,161,27,0.2)",
                                            border: "1px solid #1975d1",
                                            color: "#1975d1",
                                            fontWeight: 700,
                                            fontSize: 11,
                                            height: 22,
                                        }}
                                    />
                                )}
                            </Stack>
                            {data.InternationalName && (
                                <Typography sx={{ color: "rgba(255,255,255,0.75)", fontSize: { xs: 12, md: 14 } }}>
                                    {data.InternationalName}
                                </Typography>
                            )}
                            <Stack direction="row" spacing={1} mt={0.5} flexWrap="wrap">
                                {data.OrganizationType && (
                                    <Chip
                                        label={data.OrganizationType}
                                        size="small"
                                        sx={{
                                            bgcolor: "rgba(255,255,255,0.15)",
                                            backdropFilter: "blur(6px)",
                                            color: "#fff",
                                            fontSize: 11,
                                            height: 20,
                                            border: "1px solid rgba(255,255,255,0.25)",
                                        }}
                                    />
                                )}
                                {data.Province && (
                                    <Chip
                                        icon={<LocationOn sx={{ fontSize: 12, color: "rgba(255,255,255,0.8) !important" }} />}
                                        label={data.Province}
                                        size="small"
                                        sx={{
                                            bgcolor: "rgba(255,255,255,0.15)",
                                            backdropFilter: "blur(6px)",
                                            color: "#fff",
                                            fontSize: 11,
                                            height: 20,
                                            border: "1px solid rgba(255,255,255,0.25)",
                                        }}
                                    />
                                )}
                            </Stack>
                        </Box>
                    </Stack>
                </Container>
            </Box>

            <Container sx={{ mt: 1 }}>
                <Grid container spacing={0.5}>

                    <Grid size={{ xs: 12, md: 8 }}>
                        <Stack spacing={0.5}>

                            {data.Summary && (
                                <SectionCard title="Giới thiệu" icon={<School sx={{ color: "#1975d1" }} />}>
                                    <Typography
                                        color="text.secondary"
                                        sx={{ lineHeight: 1.8, fontSize: 15 }}
                                    >
                                        {data.Summary}
                                    </Typography>
                                </SectionCard>
                            )}

                            {data.Highlights?.length > 0 && (
                                <SectionCard title="Điểm nổi bật" icon={<Star sx={{ color: "#1975d1" }} />}>
                                    <Stack spacing={1}>
                                        {data.Highlights.map((h: string, i: number) => (
                                            <Stack key={i} direction="row" spacing={1} alignItems="center">
                                                <Box
                                                    sx={{
                                                        width: 6, height: 6, borderRadius: "50%",
                                                        bgcolor: "#1975d1", mt: "8px", flexShrink: 0,
                                                    }}
                                                />
                                                <Typography color="text.secondary" sx={{ fontSize: 14, lineHeight: 1.7 }}>
                                                    {h}
                                                </Typography>
                                            </Stack>
                                        ))}
                                    </Stack>
                                </SectionCard>
                            )}

                            {data.Description && (
                                <SectionCard title="Thông tin chi tiết" icon={<Business sx={{ color: "#1975d1" }} />}>
                                    <Box
                                        sx={{
                                            "& img": { maxWidth: "100%", borderRadius: 2 },
                                            "& h1,& h2,& h3": { color: "#222", mt: 2, mb: 1 },
                                            "& table": {
                                                width: "100%", borderCollapse: "collapse",
                                                fontSize: 13, mb: 2,
                                            },
                                            "& td, & th": {
                                                border: "1px solid #e0e0e0",
                                                p: "6px 10px",
                                            },
                                            "& th": { bgcolor: "#faf5ec", fontWeight: 700 },
                                            "& p": { lineHeight: 1.8, color: "#444", mb: 1 },
                                            "& a": { color: "#1975d1" },
                                            fontSize: 14,
                                        }}
                                        dangerouslySetInnerHTML={{ __html: data.Description }}
                                    />
                                </SectionCard>
                            )}

                            {data.FeaturedImageFullUrls?.length > 0 && (
                                <SectionCard title="Hình ảnh" icon={<Star sx={{ color: "#1975d1" }} />}>
                                    <Grid container spacing={1.5}>
                                        {data.FeaturedImageFullUrls.map((img: string, index: number) => (
                                            <Grid key={index} size={{ xs: 6, sm: 4 }}>
                                                <Box
                                                    component="img"
                                                    src={img}
                                                    sx={{
                                                        width: "100%",
                                                        height: { xs: 120, sm: 150 },
                                                        objectFit: "cover",
                                                        borderRadius: 2,
                                                        display: "block",
                                                        transition: "transform 0.2s",
                                                        "&:hover": { transform: "scale(1.02)" },
                                                    }}
                                                />
                                            </Grid>
                                        ))}
                                    </Grid>
                                </SectionCard>
                            )}
                        </Stack>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Stack spacing={0.5}>

                            {/* Contact info */}
                            <SectionCard title="Thông tin liên hệ" icon={<Phone sx={{ color: "#1975d1" }} />}>
                                <Stack spacing={1.5}>
                                    {[
                                        { icon: <LocationOn sx={{ fontSize: 16, color: "#1975d1" }} />, label: data.Province },
                                        data.PhoneNumber && { icon: <Phone sx={{ fontSize: 16, color: "#1975d1" }} />, label: data.PhoneNumber },
                                        data.Email && { icon: <Email sx={{ fontSize: 16, color: "#1975d1" }} />, label: data.Email },
                                        data.WebsiteUrl && { icon: <Language sx={{ fontSize: 16, color: "#1975d1" }} />, label: data.WebsiteUrl, href: data.WebsiteUrl },
                                        data.ManagedBy && { icon: <AccountBalance sx={{ fontSize: 16, color: "#1975d1" }} />, label: `Quản lý: ${data.ManagedBy}` },
                                    ].filter(Boolean).map((item: any, i) => (
                                        item && (
                                            <Stack key={i} direction="row" spacing={1} alignItems="flex-start">
                                                <Box mt="2px" flexShrink={0}>{item.icon}</Box>
                                                {item.href ? (
                                                    <Typography
                                                        component="a"
                                                        href={item.href}
                                                        target="_blank"
                                                        rel="noopener"
                                                        sx={{ fontSize: 13, color: "#1975d1", wordBreak: "break-all", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
                                                    >
                                                        {item.label}
                                                    </Typography>
                                                ) : (
                                                    <Typography sx={{ fontSize: 13, color: "text.secondary", lineHeight: 1.5 }}>
                                                        {item.label}
                                                    </Typography>
                                                )}
                                            </Stack>
                                        )
                                    ))}
                                </Stack>

                                {socialLinks.length > 0 && (
                                    <>
                                        <Divider sx={{ my: 1.5 }} />
                                        <Stack direction="row" spacing={0.5} flexWrap="wrap">
                                            {socialLinks.map((s, i) => (
                                                <Tooltip key={i} title={s.label}>
                                                    <IconButton
                                                        component="a"
                                                        href={s.url!}
                                                        target="_blank"
                                                        rel="noopener"
                                                        size="small"
                                                        sx={{
                                                            color: "text.secondary",
                                                            "&:hover": { color: "#1975d1", bgcolor: "rgba(250,161,27,0.08)" },
                                                        }}
                                                    >
                                                        {s.icon}
                                                    </IconButton>
                                                </Tooltip>
                                            ))}
                                        </Stack>
                                    </>
                                )}
                            </SectionCard>

                            {/* Dorm cost */}
                            {data.DormCost && (
                                <SectionCard title="Ký túc xá" icon={<Bed sx={{ color: "#1975d1" }} />}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography sx={{ fontSize: 13, color: "text.secondary" }}>Chi phí</Typography>
                                        <Typography sx={{ fontWeight: 700, color: "#1975d1", fontSize: 15 }}>
                                            {ConvertService.formatCurrencyVND(data.DormCost)}{data.Currency}
                                        </Typography>
                                    </Stack>
                                </SectionCard>
                            )}

                            {/* Main Profession */}
                            {data.MainProfession && (
                                <SectionCard title="Ngành chính" icon={<Star sx={{ color: "#1975d1" }} />}>
                                    <Box
                                        sx={{
                                            p: 1,
                                            borderRadius: 1,
                                            bgcolor: "#c8dff7ff",
                                        }}
                                    >
                                        <Typography fontWeight={700} fontSize={14} mb={0.5}>
                                            {data.MainProfession.ProfessionName}
                                        </Typography>
                                        <Typography sx={{ color: "#1975d1", fontWeight: 600, fontSize: 13 }}>
                                            {ConvertService.formatCurrencyVND(data.MainProfession.Cost)} {data.Currency}
                                        </Typography>
                                    </Box>
                                </SectionCard>
                            )}

                            {/* Professions */}
                            {data.Professions?.length > 0 && (
                                <SectionCard title={`Ngành đào tạo (${data.Professions.length})`} icon={<School sx={{ color: "#1975d1" }} />}>
                                    <Stack spacing={0} divider={<Divider />}>
                                        {data.Professions.map((p: Profession, i: number) => (
                                            <Stack
                                                key={i}
                                                direction="row"
                                                justifyContent="space-between"
                                                alignItems="center"
                                                py={1}
                                            >
                                                <Typography sx={{ fontSize: 13, flex: 1, pr: 1 }}>
                                                    {p.ProfessionName}
                                                </Typography>
                                                <Typography
                                                    sx={{
                                                        fontSize: 12, fontWeight: 600,
                                                        color: "#1975d1", whiteSpace: "nowrap",
                                                    }}
                                                >
                                                    {ConvertService.formatCurrencyVND(p.Cost)} {data.Currency}
                                                </Typography>
                                            </Stack>
                                        ))}
                                    </Stack>
                                </SectionCard>
                            )}
                        </Stack>
                    </Grid>
                </Grid>
            </Container>

            <UpdateOrganizationDialog open={open} onClose={() => setOpen(false)} />
            <LogoUploadDialog open={logoDialogOpen} onClose={() => setLogoDialogOpen(false)} currentLogoUrl={data.LogoFullUrl} organizationId={organizationId} />
        </Box>
    );
}

function SectionCard({
    title, icon, children,
}: {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <Box
            sx={{
                bgcolor: "#fff",
                borderRadius: 1.5,
                overflow: "hidden",
            }}
        >
            <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{
                    px: 2, py: 1,
                    borderBottom: "1px solid #f0f0f0",
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center" }}>{icon}</Box>
                <Typography fontWeight={700} fontSize={15}>
                    {title}
                </Typography>
            </Stack>
            <Box sx={{ p: 2 }}>{children}</Box>
        </Box>
    );
}