import { lazy, useEffect } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Edit from "@mui/icons-material/Edit";
import LocationOn from "@mui/icons-material/LocationOn";
import Email from "@mui/icons-material/Email";
import Language from "@mui/icons-material/Language";
import Business from "@mui/icons-material/Business";
import School from "@mui/icons-material/School";
import Phone from "@mui/icons-material/Phone";
import AccountBalance from "@mui/icons-material/AccountBalance";
import Star from "@mui/icons-material/Star";
import Facebook from "@mui/icons-material/Facebook";
import LinkedIn from "@mui/icons-material/LinkedIn";
import YouTube from "@mui/icons-material/YouTube";
import Twitter from "@mui/icons-material/Twitter";
import Instagram from "@mui/icons-material/Instagram";
import Map from "@mui/icons-material/Map";
import Bed from "@mui/icons-material/Bed";
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUp from '@mui/icons-material/KeyboardArrowUp';
import Add from "@mui/icons-material/Add";
import EditNoteIcon from '@mui/icons-material/EditNote';
import CameraAlt from "@mui/icons-material/CameraAlt";
import Info from "@mui/icons-material/Info";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import { useState } from "react";
import { getUserInfo } from "../../app/services/auth.service";
import { useGetOrganizationByIdQuery } from "../../app/features/organization.api";
import { ConvertService } from "../../app/services/convert.service";
import { hasAccountType } from "../../utils/auth.utils";
import { AccountType } from "../../app/models/enums.model";
import { Profession } from "../../app/models/organization.model";
import labelsVi from "../../i18n/labels.vi";
import { DEFAULT_PAGE, DEFAULT_SCHOLARSHIP_PAGE_SIZE } from "../../constants/common.constant";
import { useGetScholarshipsByOrganizationQuery } from "../../app/features/scholarship.api";
import { ScholarshipResponse } from "../../app/models/scholarship.model";
import UpdateScholarshipDialog from "../../components/dialogs/admin/scholarship/update-scholarship.dialog";
import CreateScholarshipDialog from "../../components/dialogs/admin/scholarship/create-scholarship.dialog";
const UpdateOrganizationDialog = lazy(() => import("../../components/dialogs/admin/organization/update-organization.dialog"));
const LogoUploadDialog = lazy(() => import("../../components/dialogs/admin/logo-upload.dialog"));

const labels = labelsVi.organization;

export default function OrganizationInforPage() {
    const userInfo = getUserInfo();
    const organizationId = userInfo?.OrganizationId ?? "";
    const [open, setOpen] = useState(false);
    const [logoDialogOpen, setLogoDialogOpen] = useState(false);
    const [openScholarshipDialog, setOpenScholarshipDialog] = useState(false);
    const [openCreateScholarshipDialog, setOpenCreateScholarshipDialog] = useState(false);
    const [selectedScholarshipId, setSelectedScholarshipId] = useState<string | null>(null);
    const [scholarshipPage, setScholarshipPage] = useState(DEFAULT_PAGE);
    const [allScholarships, setAllScholarships] = useState<ScholarshipResponse[]>([]);

    const { data, isLoading } = useGetOrganizationByIdQuery(organizationId, { skip: !organizationId });
    const { data: scholarshipData, isLoading: scholarshipLoading, } = useGetScholarshipsByOrganizationQuery({ organizationId, page: scholarshipPage, size: DEFAULT_SCHOLARSHIP_PAGE_SIZE }, { skip: !organizationId });
    useEffect(() => {
        if (scholarshipData?.Items) {
            setAllScholarships(prev => {
                if (scholarshipPage === 1) { return scholarshipData.Items; }
                const newItems = scholarshipData.Items.filter(newItem => !prev.some(existItem => existItem.Id === newItem.Id));
                return [...prev, ...newItems];
            });
        }
    }, [scholarshipData, scholarshipPage]);

    const scholarships = scholarshipData?.Items || [];
    const totalScholarships = scholarshipData?.Total || 0;
    const hasMoreScholarships = allScholarships.length < totalScholarships;

    useEffect(() => {
        setAllScholarships([]);
        setScholarshipPage(DEFAULT_PAGE);
    }, [organizationId]);

    if (isLoading) { return (<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}> <CircularProgress sx={{ color: "#1975d1" }} /></Box>); }

    if (!data) return null;

    const socialLinks = [
        { icon: <Facebook />, url: data.FacebookUrl, label: labels.facebook },
        { icon: <LinkedIn />, url: data.LinkedinUrl, label: labels.linkedIn },
        { icon: <YouTube />, url: data.YoutubeUrl, label: labels.youTube },
        { icon: <Twitter />, url: data.TwitterUrl, label: labels.twitter },
        { icon: <Instagram />, url: data.InstagramUrl, label: labels.instagram },
        { icon: <Map />, url: data.GoogleMapUrl, label: labels.googleMaps },
    ].filter((s) => s.url);

    const handleOpenScholarshipUpdate = (id: string) => {
        setSelectedScholarshipId(id);
        setOpenScholarshipDialog(true);
    };

    return (
        <Box sx={{ bgcolor: "#f0f2f5", minHeight: "100vh", pb: 2 }}>
            <Box sx={{ width: "100%", height: { xs: 240, sm: 300, md: 400 }, position: "relative", overflow: "hidden", }}>
                <Box component="img" src={data.WallpaperFullUrl} sx={{ width: "100%", height: "100%", objectFit: "contain", display: "block", }} />
                <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.65) 100%)", }} />
                <Box sx={{ position: "absolute", top: 16, right: 16, zIndex: 3 }}>
                    {hasAccountType(AccountType.Manager) && (
                        <Button variant="contained" startIcon={<Edit />} onClick={() => setOpen(true)} size="small"
                            sx={{ bgcolor: "#1975d1", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", fontWeight: 600, borderRadius: 2, textTransform: "none", "&:hover": { bgcolor: "rgba(255,255,255,0.25)" }, }}>
                            {labels.updateOrganization}
                        </Button>
                    )}
                </Box>

                <Container sx={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", zIndex: 2, pb: { xs: 1, md: 2 }, width: "100%", }}>
                    <Stack direction="row" spacing={{ xs: 2, md: 3 }} alignItems="flex-end">
                        <Box sx={{ flexShrink: 0, position: "relative", width: { xs: 72, md: 110 }, height: { xs: 72, md: 110 }, mb: { xs: 0, md: "6px" }, cursor: "pointer", "&:hover .logo-overlay": { opacity: 1 }, }} onClick={() => setLogoDialogOpen(true)}>
                            <Box sx={{ width: "100%", height: "100%", borderRadius: 3, overflow: "hidden", border: "3px solid #fff", bgcolor: "#fff", boxShadow: "0 4px 20px rgba(0,0,0,0.3)", }}>
                                <Box component="img" src={data.LogoFullUrl} sx={{ width: "100%", height: "100%", objectFit: "contain", p: 0.5 }} />
                            </Box>
                            <Box className="logo-overlay" sx={{ position: "absolute", inset: 0, borderRadius: 3, bgcolor: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.2s ease", }}>
                                <CameraAlt sx={{ color: "#fff", fontSize: { xs: 20, md: 28 } }} />
                            </Box>
                        </Box>

                        <Box pb={0.5}>
                            <Stack direction="row" alignItems="center" spacing={1} mb={0.5} flexWrap="wrap">
                                <Typography variant="h5" sx={{ color: "#fff", fontWeight: 600, fontSize: { xs: 16, sm: 22, md: 28 }, lineHeight: 1.2, textShadow: "0 1px 4px rgba(0,0,0,0.4)", }}>{data.Name}</Typography>
                                {data.IsTop && (
                                    <Chip icon={<Star sx={{ fontSize: 14, color: "#ffffff !important" }} />} label={labels.top} size="small" sx={{ bgcolor: "#1975d1", border: "1px solid #1975d1", color: "#ffffff", fontWeight: 700, fontSize: 11, height: 22, }} />
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
                                        sx={{ bgcolor: "rgba(255,255,255,0.15)", backdropFilter: "blur(6px)", color: "#fff", fontSize: 11, height: 20, border: "1px solid rgba(255,255,255,0.25)", }}
                                    />
                                )}
                                {data.Province && (
                                    <Chip
                                        icon={<LocationOn sx={{ fontSize: 12, color: "rgba(255,255,255,0.8) !important" }} />}
                                        label={data.Province}
                                        size="small"
                                        sx={{ bgcolor: "rgba(255,255,255,0.15)", backdropFilter: "blur(6px)", color: "#fff", fontSize: 11, height: 20, border: "1px solid rgba(255,255,255,0.25)", }}
                                    />
                                )}
                            </Stack>
                        </Box>
                    </Stack>
                </Container>
            </Box>

            <Container sx={{ mt: 1 }} maxWidth="xl">
                <Grid container spacing={0.5}>

                    <Grid size={{ xs: 12, md: 8 }}>
                        <Stack spacing={0.5}>

                            {data.Summary && (
                                <SectionCard title={labels.introduction} icon={<Info sx={{ color: "#1975d1" }} />}>
                                    <Typography
                                        color="text.secondary"
                                        sx={{ lineHeight: 1.8, fontSize: 15 }}
                                    >
                                        {data.Summary}
                                    </Typography>
                                </SectionCard>
                            )}

                            {data.Highlights?.length > 0 && (
                                <SectionCard title={labels.highlights} icon={<Star sx={{ color: "#1975d1" }} />}>
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

                            {/* Scholarships */}
                            {(scholarships.length > 0 || scholarshipLoading) && (
                                <SectionCard
                                    title={`Học bổng (${totalScholarships})`}
                                    icon={<EmojiEventsIcon sx={{ color: "#1975d1" }} />}
                                    action={
                                        <Tooltip title="Thêm học bổng">
                                            <IconButton size="small" onClick={() => setOpenCreateScholarshipDialog(true)}
                                                sx={{ border: "1px solid #dbeafe", color: "#1975d1", "&:hover": { bgcolor: "#1975d1", color: "#fff" } }}>
                                                <Add fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    }
                                >
                                    <Grid container spacing={1}>
                                        {allScholarships.map((s: ScholarshipResponse, index: number) => (
                                            <Grid key={s.Id || index} size={{ xs: 12, sm: 6 }}>
                                                <Box
                                                    sx={{ height: "100%", borderRadius: 3, p: 2, position: "relative", overflow: "hidden", background: "linear-gradient(135deg, #f8fbff 0%, #eef5ff 100%)", border: "1px solid rgba(25,117,209,0.12)", transition: "all 0.25s ease", "&:hover": { transform: "translateY(-2px)", boxShadow: "0 10px 24px rgba(25,117,209,0.12)", }, }}>
                                                    <Tooltip title="Chỉnh sửa học bổng">
                                                        <IconButton size="small" onClick={() => handleOpenScholarshipUpdate(s.Id)} sx={{ position: "absolute", top: 10, right: 10, width: 32, height: 32, bgcolor: "rgba(255,255,255,0.9)", border: "1px solid rgba(25,117,209,0.12)", backdropFilter: "blur(6px)", zIndex: 2, transition: "all 0.2s ease", "&:hover": { bgcolor: "#1975d1", color: "#fff", transform: "scale(1.05)", }, }}>
                                                            <EditNoteIcon sx={{ fontSize: 18 }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Stack spacing={1}>
                                                        <Typography sx={{ fontWeight: 700, fontSize: 14, color: "#1f2937", lineHeight: 1.5, }}>
                                                            {s.Name}
                                                        </Typography>

                                                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                                            {s.Gpa && (
                                                                <Chip size="small" label={`GPA ${s.Gpa}+`} sx={{ bgcolor: "#dbeafe", color: "#1975d1", fontWeight: 600, fontSize: 12, }} />
                                                            )}

                                                            {s.LanguageLevel && (
                                                                <Chip size="small" label={s.LanguageLevel} sx={{ bgcolor: "#ede9fe", color: "#6d28d9", fontWeight: 600, fontSize: 12, }} />
                                                            )}

                                                            {s.VisaType && (
                                                                <Chip size="small" label={s.VisaType} sx={{ bgcolor: "#dcfce7", color: "#15803d", fontWeight: 600, fontSize: 12, }} />
                                                            )}
                                                        </Stack>

                                                        <Divider />

                                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                            <Typography sx={{ fontSize: 13, color: "text.secondary", }}>
                                                                Hỗ trợ học phí
                                                            </Typography>

                                                            <Typography sx={{ fontWeight: 800, fontSize: 20, color: "#1975d1", lineHeight: 1 }}>
                                                                {s.Percentage}%
                                                            </Typography>
                                                        </Stack>

                                                        {s.Description && (
                                                            <Typography sx={{ fontSize: 13, color: "text.secondary", lineHeight: 1.7, mt: 0.5 }}>
                                                                {s.Description}
                                                            </Typography>
                                                        )}
                                                    </Stack>
                                                </Box>
                                            </Grid>
                                        ))}
                                    </Grid>

                                    {/* Loading */}
                                    {scholarshipLoading && (
                                        <Box sx={{ display: "flex", justifyContent: "center", py: 2, }}>
                                            <CircularProgress size={26} />
                                        </Box>
                                    )}

                                    {/* Actions */}
                                    {!scholarshipLoading && totalScholarships > 4 && (
                                        <Box sx={{ display: "flex", justifyContent: "center", mt: 2, }}>
                                            {hasMoreScholarships ? (
                                                <Button variant="outlined" endIcon={<KeyboardArrowDown />} onClick={() => setScholarshipPage((prev) => prev + 1)} sx={{ borderRadius: 999, textTransform: "none", px: 3, fontWeight: 600, }}>
                                                    Xem thêm
                                                </Button>
                                            ) : (
                                                <Button variant="outlined" color="inherit" endIcon={<KeyboardArrowUp />} onClick={() => setScholarshipPage(1)} sx={{ borderRadius: 999, textTransform: "none", px: 3, fontWeight: 600, }}>
                                                    Thu gọn
                                                </Button>
                                            )}
                                        </Box>
                                    )}
                                </SectionCard>
                            )}

                            {data.Description && (
                                <SectionCard title={labels.detail} icon={<Business sx={{ color: "#1975d1" }} />}>
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
                                <SectionCard title={labels.image} icon={<Star sx={{ color: "#1975d1" }} />}>
                                    <Grid container spacing={1.5}>
                                        {data.FeaturedImageFullUrls.map((img: string, index: number) => (
                                            <Grid key={index} size={{ xs: 6, sm: 4 }}>
                                                <Box component="img" src={img} sx={{ width: "100%", height: { xs: 120, sm: 150 }, objectFit: "cover", borderRadius: 2, display: "block", transition: "transform 0.2s", "&:hover": { transform: "scale(1.02)" }, }} />
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
                            <SectionCard title={labels.contactInfo} icon={<Phone sx={{ color: "#1975d1" }} />}>
                                <Stack spacing={2}>
                                    {[
                                        { icon: <LocationOn sx={{ fontSize: 16, color: "#1975d1" }} />, label: data.Province },
                                        data.PhoneNumber && { icon: <Phone sx={{ fontSize: 16, color: "#1975d1" }} />, label: data.PhoneNumber },
                                        data.Email && { icon: <Email sx={{ fontSize: 16, color: "#1975d1" }} />, label: data.Email },
                                        data.WebsiteUrl && { icon: <Language sx={{ fontSize: 16, color: "#1975d1" }} />, label: data.WebsiteUrl, href: data.WebsiteUrl },
                                        data.ManagedBy && { icon: <AccountBalance sx={{ fontSize: 16, color: "#1975d1" }} />, label: `Quản lý: ${data.ManagedBy}` },
                                    ].filter(Boolean).map((item: any, i) => (
                                        item && (
                                            <Stack key={i} direction="row" spacing={1} alignItems="center">
                                                <Box display="flex" flexShrink={0}>{item.icon}</Box>
                                                {item.href ? (
                                                    <Typography component="a" href={item.href} target="_blank" rel="noopener" sx={{ fontSize: 13, color: "#1975d1", wordBreak: "break-all", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>
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
                                                    <IconButton component="a" href={s.url!} target="_blank" rel="noopener" size="small" sx={{ color: "text.secondary", "&:hover": { color: "#1975d1", bgcolor: "rgba(250,161,27,0.08)" }, }} >{s.icon}</IconButton>
                                                </Tooltip>
                                            ))}
                                        </Stack>
                                    </>
                                )}
                            </SectionCard>

                            {/* Dorm cost */}
                            {data.DormCost && (
                                <SectionCard title={labels.dormitory} icon={<Bed sx={{ color: "#1975d1" }} />}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography sx={{ fontSize: 13, color: "text.secondary" }}>{labels.cost}</Typography>
                                        <Typography sx={{ fontWeight: 700, color: "#1975d1", fontSize: 15 }}>
                                            {ConvertService.formatCurrencyVND(data.DormCost)}{data.Currency}
                                        </Typography>
                                    </Stack>
                                </SectionCard>
                            )}

                            {/* Main Profession */}
                            {data.MainProfession && (
                                <SectionCard
                                    title={labels.mainProfession}
                                    icon={<BusinessCenterIcon sx={{ color: "#1975d1" }} />}
                                >
                                    <Box sx={{ position: "relative", overflow: "hidden", borderRadius: 3, p: { xs: 1, sm: 1.5 }, background: "linear-gradient(135deg, #f8fbff 0%, #eef5ff 45%, #e3f0ff 100%)", border: "1px solid rgba(25,117,209,0.12)", transition: "all 0.25s ease", "&:hover": { transform: "translateY(-2px)", boxShadow: "0 10px 24px rgba(25,117,209,0.12)", }, }}>
                                        <Box sx={{ position: "absolute", top: -30, right: -30, width: 100, height: 100, borderRadius: "50%", bgcolor: "rgba(25,117,209,0.08)", }} />
                                        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ position: "relative", zIndex: 1 }}>
                                            <Box flex={1} minWidth={0}>
                                                <Typography sx={{ fontWeight: 700, fontSize: { xs: 10, sm: 12, md: 12 }, color: "#1f2937", mb: 0.8, }}>
                                                    {data.MainProfession.ProfessionName}
                                                </Typography>

                                                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                                                    <Typography sx={{ color: "#1975d1", fontWeight: 800, fontSize: { xs: 12, sm: 14, }, lineHeight: 1, }} >
                                                        {ConvertService.formatCurrencyVND(data.MainProfession.Cost)}{" "}{data.Currency}
                                                    </Typography>
                                                </Stack>
                                            </Box>
                                        </Stack>
                                    </Box>
                                </SectionCard>
                            )}

                            {/* Professions */}
                            {data.Professions?.length > 0 && (
                                <SectionCard
                                    title={`${labels.professions} (${data.Professions.length})`}
                                    icon={<School sx={{ color: "#1975d1" }} />}
                                >
                                    <Stack spacing={1.2}>
                                        {data.Professions.map((p: Profession, i: number) => (
                                            <Box
                                                key={i}
                                                sx={{
                                                    position: "relative", overflow: "hidden", borderRadius: 2.5, p: { xs: 1.3, sm: 1.6 },
                                                    background: "linear-gradient(135deg, #ffffff 0%, #f8fbff 100%)", border: "1px solid rgba(25,117,209,0.10)", transition: "all 0.25s ease",
                                                    "&:hover": { transform: "translateY(-2px)", boxShadow: "0 8px 22px rgba(25,117,209,0.10)", borderColor: "rgba(25,117,209,0.20)", },
                                                }}
                                            >
                                                <Box sx={{ position: "absolute", top: -18, right: -18, width: 70, height: 70, borderRadius: "50%", bgcolor: "rgba(25,117,209,0.05)", }} />

                                                <Stack direction="row" spacing={1.2} alignItems="center" sx={{ position: "relative", zIndex: 1 }} >
                                                    <Box flex={1} minWidth={0}>
                                                        <Typography sx={{ fontSize: { xs: 13, sm: 14 }, fontWeight: 700, color: "#1f2937", lineHeight: 1.5, mb: 0.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", }}> {p.ProfessionName} </Typography>

                                                        <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
                                                            <Chip label="Ngành đào tạo" size="small" sx={{ height: 22, bgcolor: "#eef5ff", color: "#1975d1", fontWeight: 700, fontSize: 11, }} />
                                                            <Typography sx={{ fontSize: { xs: 13, sm: 14 }, fontWeight: 800, color: "#1975d1", whiteSpace: "nowrap", }}> {ConvertService.formatCurrencyVND(p.Cost)}{" "}{data.Currency} </Typography>
                                                        </Stack>
                                                    </Box>
                                                </Stack>
                                            </Box>
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
            <CreateScholarshipDialog open={openCreateScholarshipDialog} onClose={() => setOpenCreateScholarshipDialog(false)} />
            <UpdateScholarshipDialog open={openScholarshipDialog} scholarshipId={selectedScholarshipId} onClose={() => { setOpenScholarshipDialog(false); setSelectedScholarshipId(null); }} />
        </Box>
    );
}

function SectionCard({ title, icon, children, action }: { title: string; icon: React.ReactNode; children: React.ReactNode; action?: React.ReactNode }) {
    return (
        <Box sx={{ bgcolor: "#fff", borderRadius: 1.5, overflow: "hidden", }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2, py: 1, borderBottom: "1px solid #f0f0f0", }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        {icon}
                    </Box>

                    <Typography fontWeight={700} fontSize={15}>
                        {title}
                    </Typography>
                </Stack>

                {action}
            </Stack>
            <Box sx={{ p: 2 }}>{children}</Box>
        </Box>
    );
}