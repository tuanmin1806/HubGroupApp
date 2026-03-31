import { lazy } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import LocationOn from "@mui/icons-material/LocationOn";
import Language from "@mui/icons-material/Language";
import Share from "@mui/icons-material/Share";
import Info from "@mui/icons-material/Info";
import Phone from "@mui/icons-material/Phone";
import Business from "@mui/icons-material/Business";
import School from "@mui/icons-material/School";
import Email from "@mui/icons-material/Email";
import WorkOutline from "@mui/icons-material/WorkOutline";
import PeopleAlt from "@mui/icons-material/PeopleAlt";
import Star from "@mui/icons-material/Star";
import PhotoLibrary from "@mui/icons-material/PhotoLibrary";
import ChevronRight from "@mui/icons-material/ChevronRight";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import NotificationsActive from "@mui/icons-material/NotificationsActive";
import Facebook from "@mui/icons-material/Facebook";
import LinkedIn from "@mui/icons-material/LinkedIn";
import YouTube from "@mui/icons-material/YouTube";
import Twitter from "@mui/icons-material/Twitter";
import Instagram from "@mui/icons-material/Instagram";
import Map from "@mui/icons-material/Map";
import AccessTime from "@mui/icons-material/AccessTime";
import MuiLink from "@mui/material/Link";
import { useParams, useNavigate } from "react-router-dom";
import { useGetOrganizationBySeoQuery } from "../../../app/features/organization.api";
import { useGetRecruitmentPostsByOrganizationWithPageQuery } from "../../../app/features/recruitment-post.api";
import { useEffect, useState } from "react";
import { formatDate } from "../../../utils/date.utils";
import { normalizeUrl } from "../../../utils/recruitment-post.utils";
import { ConvertService } from "../../../app/services/convert.service";
const OrganizationSelectActionCard = lazy(() => import("../../../components/cards/organization-card.card"));

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`organization-tabpanel-${index}`}
            aria-labelledby={`organization-tab-${index}`}
            {...other}
        >
            {value === index && <Box>{children}</Box>}
        </div>
    );
}

function HighlightsInline({ highlights }: { highlights: string[] }) {
    if (!highlights || highlights.length === 0) return null;
    return (
        <Box
            sx={{ mt: 1.5, p: 1.5, borderRadius: 1.5, background: 'linear-gradient(135deg, #e3f2fd 0%, #f0f7ff 100%)', border: '1px solid #bbdefb', }}
        >
            <Stack direction="row" spacing={0.75} alignItems="center" mb={1}>
                <Star sx={{ fontSize: 16, color: '#f59e0b' }} />
                <Typography
                    variant="caption"
                    fontWeight={700}
                    color="primary.main"
                    sx={{ letterSpacing: 0.5, textTransform: 'uppercase', fontSize: '0.7rem' }}
                >
                    Điểm nổi bật
                </Typography>
            </Stack>

            <Stack spacing={0.75}>
                {highlights.map((item, idx) => (
                    <Stack
                        key={idx}
                        direction="row"
                        spacing={1}
                        alignItems="center"
                    >
                        <Box sx={{ width: 6, height: 6, borderRadius: "50%", background: "linear-gradient(135deg, #42a5f5, #1976d2)", mt: "6px", flexShrink: 0, }} />

                        <Typography
                            variant="body2"
                            color="text.primary"
                            lineHeight={1.55}
                            fontSize="0.82rem"
                            sx={{ wordBreak: "break-word", }}
                        >
                            {item}
                        </Typography>
                    </Stack>
                ))}
            </Stack>
        </Box>
    );
}

function FeaturedGallerySidebar({ images }: { images: string[] }) {
    const [selected, setSelected] = useState<string | null>(null);
    if (!images || images.length === 0) return null;

    const MAX_VISIBLE = 3;
    const visibleImages = images.slice(0, MAX_VISIBLE);
    const extraCount = images.length - MAX_VISIBLE;
    const thumbnails = visibleImages.slice(1);

    return (
        <>
            <Card>
                <CardContent sx={{ pb: '12px !important' }}>
                    <Stack direction="row" spacing={1} alignItems="center" mb={1.5}>
                        <PhotoLibrary color="primary" fontSize="small" />
                        <Typography fontWeight={600} variant="subtitle2"> Hình ảnh ({images.length}) </Typography>
                    </Stack>

                    <Box
                        onClick={() => setSelected(images[0])}
                        sx={{ width: '100%', height: 160, borderRadius: 1.5, overflow: 'hidden', cursor: 'pointer', mb: thumbnails.length > 0 ? 0.75 : 0, '&:hover img': { transform: 'scale(1.04)', filter: 'brightness(0.88)' }, }}
                    >
                        <Box
                            component="img"
                            src={images[0]}
                            alt="featured-0"
                            loading="lazy"
                            sx={{ width: '100%', height: '100%', objectFit: 'contain', transition: 'transform 0.3s ease, filter 0.3s ease', display: 'block', }}
                        />
                    </Box>

                    {thumbnails.length > 0 && (
                        <Box sx={{ display: 'grid', gridTemplateColumns: `repeat(${thumbnails.length}, 1fr)`, gap: '6px' }}>
                            {thumbnails.map((url, idx) => {
                                const isLast = idx === thumbnails.length - 1;
                                const showOverlay = isLast && extraCount > 0;
                                return (
                                    <Box
                                        key={idx}
                                        onClick={() => showOverlay ? setSelected(images[MAX_VISIBLE]) : setSelected(url)}
                                        sx={{ position: 'relative', height: 90, borderRadius: 1.5, overflow: 'hidden', cursor: 'pointer', '&:hover img': { transform: 'scale(1.06)', filter: showOverlay ? 'none' : 'brightness(0.86)' }, }}
                                    >
                                        <Box
                                            component="img"
                                            src={url}
                                            alt={`featured-${idx + 1}`}
                                            loading="lazy"
                                            sx={{ width: '100%', height: '100%', objectFit: 'contain', transition: 'transform 0.3s ease, filter 0.3s ease', display: 'block', }}
                                        />
                                        {showOverlay && (
                                            <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.52)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 1.5, transition: 'bgcolor 0.2s', '&:hover': { bgcolor: 'rgba(0,0,0,0.65)' }, }}>
                                                <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '1.15rem', letterSpacing: 0.5, userSelect: 'none', }}>
                                                    +{extraCount}
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                );
                            })}
                        </Box>
                    )}
                </CardContent>
            </Card>

            {selected && (() => {
                const currentIdx = images.indexOf(selected);
                const hasPrev = currentIdx > 0;
                const hasNext = currentIdx < images.length - 1;
                return (
                    <Box
                        onClick={() => setSelected(null)}
                        sx={{ position: 'fixed', inset: 0, bgcolor: 'rgba(0,0,0,0.88)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2, }}
                    >
                        <Box
                            onClick={(e) => { e.stopPropagation(); setSelected(null); }}
                            sx={{ position: 'absolute', top: 16, right: 16, width: 36, height: 36, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', fontSize: 20, fontWeight: 300, transition: 'bgcolor 0.2s', '&:hover': { bgcolor: 'rgba(255,255,255,0.28)' }, userSelect: 'none', }}
                        >
                            ✕
                        </Box>
                        <Box
                            onClick={(e) => { e.stopPropagation(); if (hasPrev) setSelected(images[currentIdx - 1]); }}
                            sx={{ position: "absolute", left: { xs: 8, md: 24 }, width: { xs: 36, md: 44 }, height: { xs: 36, md: 44 }, borderRadius: "50%", bgcolor: hasPrev ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", cursor: hasPrev ? "pointer" : "default", color: hasPrev ? "#fff" : "rgba(255,255,255,0.25)", transition: "all 0.2s", "&:hover": hasPrev ? { bgcolor: "rgba(255,255,255,0.30)", transform: "scale(1.08)", } : {}, userSelect: "none", }}
                        >
                            <ChevronLeft sx={{ fontSize: { xs: 20, md: 26 }, }} />
                        </Box>
                        <Box
                            onClick={(e) => e.stopPropagation()}
                            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}
                        >
                            <Box
                                component="img"
                                src={selected}
                                loading="lazy"
                                alt="preview"
                                sx={{ maxWidth: '80vw', maxHeight: '82vh', borderRadius: 2, boxShadow: '0 24px 80px rgba(0,0,0,0.6)', objectFit: 'contain', display: 'block', }}
                            />
                        </Box>
                        <Box
                            onClick={(e) => { e.stopPropagation(); if (hasNext) setSelected(images[currentIdx + 1]); }}
                            sx={{ position: "absolute", right: { xs: 8, md: 24 }, width: { xs: 36, md: 44 }, height: { xs: 36, md: 44 }, borderRadius: "50%", bgcolor: hasNext ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", cursor: hasNext ? "pointer" : "default", color: hasNext ? "#fff" : "rgba(255,255,255,0.25)", transition: "all 0.2s", "&:hover": hasNext ? { bgcolor: "rgba(255,255,255,0.30)", transform: "scale(1.08)", } : {}, userSelect: "none", }}
                        >
                            <ChevronRight sx={{ fontSize: { xs: 20, md: 26 }, }} />
                        </Box>
                    </Box>
                );
            })()}
        </>
    );
}

const OrganizationDetailPage = () => {
    const { seoUrl } = useParams<{ seoUrl: string }>();
    const navigate = useNavigate();
    const [tabValue, setTabValue] = useState(0);

    const { data: organization, isLoading, error } = useGetOrganizationBySeoQuery(seoUrl!, { skip: !seoUrl });
    const { data: recruitmentPosts, isLoading: loadingPosts } = useGetRecruitmentPostsByOrganizationWithPageQuery(seoUrl!, { skip: !seoUrl });

    useEffect(() => {
        if (organization?.Name) {
            document.title = `${organization?.Name} | duhochan.hubgroup.vn`;
        }
    }, [organization?.Name]);

    const socialLinks = [
        { icon: <Facebook />, url: organization?.FacebookUrl, label: "Facebook" },
        { icon: <LinkedIn />, url: organization?.LinkedinUrl, label: "LinkedIn" },
        { icon: <YouTube />, url: organization?.YoutubeUrl, label: "YouTube" },
        { icon: <Twitter />, url: organization?.TwitterUrl, label: "Twitter" },
        { icon: <Instagram />, url: organization?.InstagramUrl, label: "Instagram" },
        { icon: <Map />, url: organization?.GoogleMapUrl, label: "Google Maps" },
    ].filter((s) => s.url);

    if (isLoading) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <CircularProgress />
                <Typography sx={{ mt: 2 }}>Đang tải thông tin...</Typography>
            </Box>
        );
    }

    if (error || !organization) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography color="error">Không tìm thấy thông tin trường</Typography>
                <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/')}> Quay về trang chủ </Button>
            </Box>
        );
    }

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({ title: organization.Name, text: organization.Summary, url: window.location.href });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Đã copy link vào clipboard!');
        }
    };

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    return (
        <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
            {organization.WallpaperFullUrl && (
                <Box sx={{ p: { xs: 1, md: 1 }, maxWidth: 1200, mx: 'auto' }}>
                    <Box sx={{ maxWidth: 1200, mx: 'auto', height: { xs: 200, md: 300 }, backgroundImage: `url(${organization.WallpaperFullUrl})`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', borderRadius: 2, boxShadow: '0 6px 24px rgba(0,0,0,0.12)', }} />
                </Box>
            )}

            <Box sx={{ p: { xs: 1, md: 1 }, maxWidth: 1200, mx: 'auto' }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 1, md: 2 } }}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Stack spacing={1}>

                            <Card>
                                <CardContent>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: { xs: 'column', sm: 'row' },
                                            alignItems: { xs: 'center', sm: 'flex-start' },
                                            textAlign: { xs: 'center', sm: 'left' },
                                            gap: 1.5
                                        }}
                                    >
                                        {organization.LogoFullUrl && (
                                            <Box
                                                component="img"
                                                src={organization.LogoFullUrl}
                                                loading="lazy"
                                                alt={organization.Name}
                                                sx={{ width: 80, height: 80, borderRadius: 2, objectFit: 'cover', border: '1px solid #e0e0e0', flexShrink: 0, }}
                                            />
                                        )}
                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1, }}>
                                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                                <Typography variant="h5" fontWeight={600} sx={{ fontSize: { xs: '1.1rem', sm: '1.5rem' }, lineHeight: 1.3, }}> {organization.Name} </Typography>

                                                <Box sx={{ mt: 0.5 }}>
                                                    <Chip
                                                        label={organization.MainProfession?.ProfessionName}
                                                        size="small"
                                                        sx={{ fontWeight: 600, fontSize: '0.75rem', height: 22, bgcolor: '#e3f2fd', color: '#1976d2', maxWidth: '100%', '& .MuiChip-label': { px: 1, overflow: 'hidden', textOverflow: 'ellipsis', }, }}
                                                    />
                                                </Box>
                                            </Box>

                                            {organization.IsTop && (
                                                <Chip
                                                    label="Nổi bật"
                                                    size="small"
                                                    sx={{ flexShrink: 0, fontWeight: 700, fontSize: '0.6rem', height: 22, bgcolor: '#1975d1', color: '#fff' }}
                                                />
                                            )}
                                        </Box>
                                    </Box>

                                    {organization.Highlights && organization.Highlights.length > 0 ? (<HighlightsInline highlights={organization.Highlights} />
                                    ) : organization.Summary ? (
                                        <Box sx={{ mt: 1, p: 1, bgcolor: 'action.hover', borderRadius: 1 }}>
                                            <Typography variant="body2" color="text.secondary" lineHeight={1}> {organization.Summary} </Typography>
                                        </Box>
                                    ) : null}
                                </CardContent>
                            </Card>

                            <Card>
                                <Box sx={{ px: 2, pt: 1, pb: 0, bgcolor: '#fff' }}>
                                    <Stack direction="row" sx={{ overflowX: 'auto', '&::-webkit-scrollbar': { display: 'none' } }}>
                                        {[
                                            { label: "Giới thiệu", icon: <Info sx={{ fontSize: 17 }} /> },
                                            { label: "Chương trình tuyển sinh", icon: <NotificationsActive sx={{ fontSize: 17 }} /> },
                                            { label: "Học phí", icon: <School sx={{ fontSize: 17 }} /> },
                                        ].map((tab, idx) => {
                                            const isSelected = tabValue === idx;
                                            return (
                                                <Box
                                                    key={idx}
                                                    onClick={() => handleTabChange(null as any, idx)}
                                                    sx={{ display: "flex", alignItems: "center", gap: 0.75, px: 2, py: 1, borderRadius: "5px 5px 0 0", cursor: "pointer", position: "relative", bgcolor: isSelected ? "#fff" : "transparent", border: "1px solid #e0e0e0", color: isSelected ? "primary.main" : "text.secondary", fontWeight: isSelected ? 700 : 500, "&:hover": { bgcolor: isSelected ? "#fff" : "rgba(21,101,192,0.04)", color: "primary.main", }, }}
                                                >
                                                    <Box sx={{ display: "flex", alignItems: "center", color: isSelected ? "primary.main" : "text.disabled", transition: "color 0.2s", }}>
                                                        {tab.icon}
                                                    </Box>
                                                    <Typography sx={{ fontSize: { xs: "0.78rem", sm: "0.875rem" }, fontWeight: "inherit", lineHeight: 1, whiteSpace: "nowrap", }}>
                                                        {tab.label}
                                                    </Typography>
                                                </Box>
                                            );
                                        })}
                                    </Stack>
                                    <Divider />
                                </Box>

                                <TabPanel value={tabValue} index={0}>
                                    <CardContent>
                                        <Typography variant="h6" fontWeight={600} gutterBottom> Giới thiệu chi tiết </Typography>
                                        <Divider sx={{ mb: 2 }} />
                                        {organization.Description ? (
                                            <Box
                                                sx={{
                                                    '& img': { maxWidth: '100%', height: 'auto', borderRadius: 1, my: 2 },
                                                    '& h1, & h2, & h3, & h4, & h5, & h6': { mt: 3, mb: 2, fontWeight: 600 },
                                                    '& p': { mb: 2, lineHeight: 1.7 },
                                                    '& table': { width: '100%', borderCollapse: 'collapse', my: 2 },
                                                    '& td, & th': { border: '1px solid #ddd', p: 1 },
                                                    '& a': { color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } },
                                                }}
                                                dangerouslySetInnerHTML={{ __html: organization.Description }}
                                            />
                                        ) : (<Typography color="text.secondary">Chưa có thông tin giới thiệu chi tiết</Typography>)}

                                        <Box sx={{ mt: 3 }}>
                                            <Stack direction="row" flexWrap="wrap" gap={1}>
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    startIcon={<Language />}
                                                    component="a"
                                                    href={normalizeUrl(organization.WebsiteUrl)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    disabled={!organization.WebsiteUrl}
                                                    sx={{ textTransform: 'none', fontSize: 12, px: 2, py: 0.5 }}
                                                >
                                                    Truy cập website
                                                </Button>
                                                <Button variant="outlined" size="small" startIcon={<Share />} onClick={handleShare} sx={{ textTransform: 'none', fontSize: 12, px: 2, py: 0.5 }}> Chia sẻ </Button>
                                            </Stack>
                                        </Box>
                                    </CardContent>
                                </TabPanel>

                                <TabPanel value={tabValue} index={1}>
                                    <CardContent>
                                        {loadingPosts ? (<Box sx={{ textAlign: 'center', py: 4 }}> <CircularProgress /> </Box>) : recruitmentPosts?.Items && recruitmentPosts.Items.length > 0 ? (
                                            <Stack spacing={1.5}>
                                                {recruitmentPosts.Items.map((post) => (
                                                    <Card
                                                        key={post.Id}
                                                        variant="outlined"
                                                        sx={{ cursor: 'pointer', transition: 'all 0.2s', position: 'relative', '&:hover': { transform: 'translateY(-2px)' }, }}
                                                        onClick={() => navigate(`/chuong-trinh-tuyen-sinh/${post.SeoUrl}`)}
                                                    >
                                                        {post.IsTop && (
                                                            <Box sx={{ position: 'absolute', top: 8, right: 8, bgcolor: '#f3522a', color: '#fafafa', fontSize: '0.7rem', fontWeight: 500, px: 0.75, py: 0.25, borderRadius: 0.75, letterSpacing: 0.4, lineHeight: 1.5, zIndex: 1, }}>
                                                                Nổi bật
                                                            </Box>
                                                        )}
                                                        <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                                                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                                                                <Box sx={{ flex: 1, minWidth: 0, pr: post.IsTop ? 6 : 0 }}>
                                                                    <Typography variant="body1" fontWeight={600} sx={{ fontSize: { xs: '0.875rem', sm: '0.95rem' }, lineHeight: 1.35, WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', mb: 0.75, '&:hover': { color: 'primary.main' }, transition: 'color 0.2s', }}>
                                                                        {post.Name}
                                                                    </Typography>
                                                                    {post.Professions && post.Professions.length > 0 && (
                                                                        <Stack direction="row" flexWrap="wrap" gap={0.5} mb={0.75}>
                                                                            {post.Professions.slice(0, 3).map((p) => (
                                                                                <Chip
                                                                                    key={p.Id}
                                                                                    label={p.Name}
                                                                                    size="small"
                                                                                    variant="outlined"
                                                                                    sx={{ height: 20, fontSize: '0.65rem', borderColor: 'primary.light', color: 'primary.main', '& .MuiChip-label': { px: 0.75 }, }}
                                                                                />
                                                                            ))}
                                                                            {post.Professions.length > 3 && (
                                                                                <Chip
                                                                                    label={`+${post.Professions.length - 3}`}
                                                                                    size="small"
                                                                                    variant="outlined"
                                                                                    sx={{ height: 20, fontSize: '0.65rem', '& .MuiChip-label': { px: 0.75 } }}
                                                                                />
                                                                            )}
                                                                        </Stack>
                                                                    )}
                                                                    <Stack direction="row" flexWrap="wrap" alignItems="center" gap={{ xs: 0.75, sm: 1.5 }}>
                                                                        <Stack direction="row" spacing={0.4} alignItems="center">
                                                                            <PeopleAlt sx={{ fontSize: 14, color: 'primary.main' }} />
                                                                            <Typography variant="caption" sx={{ fontSize: '0.72rem' }}>{post.Quantity} chỉ tiêu</Typography>
                                                                        </Stack>
                                                                        {post.Province && (
                                                                            <Stack direction="row" spacing={0.4} alignItems="center">
                                                                                <LocationOn sx={{ fontSize: 14, color: 'primary.main' }} />
                                                                                <Typography variant="caption" sx={{ fontSize: '0.72rem' }}>{post.Province}</Typography>
                                                                            </Stack>
                                                                        )}
                                                                        {post.RecruitmentToDate && (
                                                                            <Stack direction="row" spacing={0.4} alignItems="center">
                                                                                <AccessTime sx={{ fontSize: 13, color: 'primary.main' }} />
                                                                                <Typography variant="caption" sx={{ fontSize: '0.72rem' }}>{formatDate(post.RecruitmentToDate)}</Typography>
                                                                            </Stack>
                                                                        )}
                                                                    </Stack>
                                                                </Box>
                                                            </Box>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </Stack>
                                        ) : (
                                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                                <WorkOutline sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                                                <Typography color="text.secondary">Chưa chương trình tuyển sinh</Typography>
                                            </Box>
                                        )}
                                    </CardContent>
                                </TabPanel>
                                <TabPanel value={tabValue} index={2}>
                                    <CardContent sx={{ p: { xs: 1, md: 1.5 } }}>

                                        {/* Header */}
                                        <Box sx={{ mb: 2 }}>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Box sx={{ width: 36, height: 36, borderRadius: '10px', background: 'linear-gradient(135deg, #1565c0 0%, #42a5f5 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
                                                    <School sx={{ fontSize: 20, color: '#fff' }} />
                                                </Box>
                                                <Typography variant="h6" fontWeight={700}>
                                                    Học phí các ngành
                                                </Typography>
                                            </Stack>
                                        </Box>

                                        <Stack spacing={2}>

                                            {/* Main Profession */}
                                            {organization.MainProfession && (
                                                <Box sx={{ position: 'relative', borderRadius: 2.5, background: 'linear-gradient(135deg, #1565c0 0%, #1e88e5 60%, #42a5f5 100%)', p: { xs: 1, md: 1.5 }, overflow: 'hidden', }}>
                                                    {/* Decorative circles */}
                                                    <Box sx={{
                                                        position: 'absolute', top: -20, right: -20,
                                                        width: 120, height: 120, borderRadius: '50%',
                                                        bgcolor: 'rgba(255,255,255,0.07)',
                                                    }} />
                                                    <Box sx={{
                                                        position: 'absolute', bottom: -30, right: 60,
                                                        width: 80, height: 80, borderRadius: '50%',
                                                        bgcolor: 'rgba(255,255,255,0.05)',
                                                    }} />

                                                    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1} sx={{ position: 'relative', zIndex: 1 }}>
                                                        <Box>
                                                            <Chip label="Ngành thế mạnh" size="small" sx={{ mb: 1, bgcolor: 'rgba(255,255,255,0.18)', color: '#fff', fontWeight: 600, fontSize: '0.68rem', }} />
                                                            <Typography variant="subtitle1" fontWeight={700} color="#fff" lineHeight={1.3}>
                                                                {organization.MainProfession.ProfessionName}
                                                            </Typography>
                                                        </Box>
                                                        <Box sx={{
                                                            bgcolor: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 2, px: 2, py: 1, textAlign: { xs: 'left', sm: 'right' }, flexShrink: 0,
                                                        }}>
                                                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.75)', display: 'block', fontSize: '0.68rem' }}>
                                                                Học phí
                                                            </Typography>
                                                            <Typography variant="h6" fontWeight={800} color="#fff" sx={{ letterSpacing: '-0.5px', lineHeight: 1.2 }}>
                                                                {ConvertService.formatCurrencyVND(organization.MainProfession.Cost)}
                                                                <Typography component="span" variant="caption" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 500, ml: 0.5 }}>
                                                                    {organization.Currency}
                                                                </Typography>
                                                            </Typography>
                                                        </Box>
                                                    </Stack>
                                                </Box>
                                            )}

                                            {organization.Professions && organization.Professions.length > 0 && (
                                                <Box>
                                                    <Typography variant="caption" fontWeight={700} sx={{ mb: 1, display: 'block' }}>
                                                        Các ngành khác
                                                    </Typography>
                                                    <Stack spacing={1}>
                                                        {organization.Professions.map((p, idx) => (
                                                            <Box
                                                                key={p.ProfessionId}
                                                                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: { xs: 1, md: 1.5 }, py: 1, borderRadius: 2, border: '1px solid', borderColor: 'divider', bgcolor: '#fafafa', transition: 'all 0.18s', '&:hover': { borderColor: 'primary.light', bgcolor: '#f0f7ff', transform: 'translateX(3px)', }, gap: 1, }}>
                                                                <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
                                                                    <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: 'primary.main', flexShrink: 0, }} />
                                                                    <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary', lineHeight: 1.4 }}>
                                                                        {p.ProfessionName}
                                                                    </Typography>
                                                                </Stack>
                                                                <Typography
                                                                    variant="body2"
                                                                    fontWeight={700}
                                                                    color="primary.dark"
                                                                    sx={{ flexShrink: 0, whiteSpace: 'nowrap' }}
                                                                >
                                                                    {ConvertService.formatCurrencyVND(p.Cost)}
                                                                    <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 0.4, fontWeight: 400 }}>
                                                                        {organization.Currency}
                                                                    </Typography>
                                                                </Typography>
                                                            </Box>
                                                        ))}
                                                    </Stack>
                                                </Box>
                                            )}

                                            {organization.DormCost && (
                                                <Box sx={{ borderRadius: 2, border: '1px dashed', borderColor: 'primary.light', bgcolor: '#f8fbff', p: { xs: 0.5, md: 1 }, }}>
                                                    <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                                                        <Box sx={{ width: 28, height: 28, borderRadius: '8px', bgcolor: '#e3f2fd', display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
                                                            <Business sx={{ fontSize: 16, color: 'primary.main' }} />
                                                        </Box>
                                                        <Typography variant="subtitle2" fontWeight={700} color="text.primary">
                                                            Phí ký túc xá
                                                        </Typography>
                                                    </Stack>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#fff', borderRadius: 1.5, px: 2, py: 1.25, border: '1px solid #e3f2fd', }}>
                                                        <Typography variant="body2" color="text.secondary">Chi phí ký túc xá</Typography>
                                                        <Typography variant="body1" fontWeight={700} color="primary.dark">
                                                            {ConvertService.formatCurrencyVND(organization.DormCost)}
                                                            <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 0.4, fontWeight: 400 }}>
                                                                {organization.Currency}
                                                            </Typography>
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            )}

                                            {!organization.MainProfession && (!organization.Professions || organization.Professions.length === 0) && !organization.DormCost && (
                                                <Box sx={{ textAlign: 'center', py: 6 }}>
                                                    <School sx={{ fontSize: 48, color: 'text.disabled', mb: 1.5 }} />
                                                    <Typography color="text.secondary" variant="body2">Chưa có thông tin học phí</Typography>
                                                </Box>
                                            )}

                                        </Stack>
                                    </CardContent>
                                </TabPanel>
                            </Card>

                            {organization.Professions && organization.Professions.length > 0 && (
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" fontWeight={600} gutterBottom> Các ngành đào tạo ({organization.Professions.length}) </Typography>
                                        <Divider sx={{ mb: 2 }} />
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                            {organization.Professions.map((profession) => (
                                                <Chip
                                                    key={profession.ProfessionId}
                                                    label={profession.ProfessionName}
                                                    variant={profession.ProfessionId === organization.MainProfessionId ? 'filled' : 'outlined'}
                                                    color={profession.ProfessionId === organization.MainProfessionId ? 'primary' : 'default'}
                                                    onClick={() => { }}
                                                />
                                            ))}
                                        </Box>
                                    </CardContent>
                                </Card>
                            )}

                            <Card>
                                <CardContent>
                                    <Typography variant="h6" fontWeight={600} gutterBottom> Danh sách trường liên quan </Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    <OrganizationSelectActionCard organizations={[]} />
                                </CardContent>
                            </Card>
                        </Stack>
                    </Box>

                    <Box sx={{ width: { xs: '100%', md: 340 }, flexShrink: 0, order: { xs: 2, md: 2 } }}>
                        <Stack spacing={1}>

                            <Card>
                                <CardContent>
                                    <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                                        <Info color="primary" />
                                        <Typography fontWeight={600}>Thông tin liên hệ</Typography>
                                    </Stack>
                                    <Stack spacing={1}>
                                        {organization.Address && (
                                            <Stack direction="row" spacing={1} alignItems="flex-start">
                                                <LocationOn fontSize="small" sx={{ mt: 0.5 }} />
                                                <Typography variant="body2">{organization.Address}</Typography>
                                            </Stack>
                                        )}
                                        {organization.PhoneNumber && (
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Phone fontSize="small" />
                                                <MuiLink href={`tel:${organization.PhoneNumber}`} variant="body2" underline="hover">
                                                    {organization.PhoneNumber}
                                                </MuiLink>
                                            </Stack>
                                        )}
                                        {organization.Email && (
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Email fontSize="small" />
                                                <MuiLink href={`mailto:${organization.Email}`} variant="body2" underline="hover">
                                                    {organization.Email}
                                                </MuiLink>
                                            </Stack>
                                        )}
                                        {organization.WebsiteUrl && (
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Language fontSize="small" />
                                                <MuiLink href={organization.WebsiteUrl} target="_blank" variant="body2" underline="hover">
                                                    {organization.WebsiteUrl}
                                                </MuiLink>
                                            </Stack>
                                        )}
                                        {socialLinks.length > 0 && (
                                            <>
                                                <Divider sx={{ my: 1 }} />
                                                <Stack direction="row" spacing={0.5} flexWrap="wrap">
                                                    {socialLinks.map((s, i) => (
                                                        <Tooltip key={i} title={s.label}>
                                                            <IconButton
                                                                component="a"
                                                                href={s.url!}
                                                                target="_blank"
                                                                rel="noopener"
                                                                size="small"
                                                                sx={{ color: "text.secondary", "&:hover": { color: "#1975d1", bgcolor: "rgba(107, 223, 243, 0.08)" }, }}>
                                                                {s.icon}
                                                            </IconButton>
                                                        </Tooltip>
                                                    ))}
                                                </Stack>
                                            </>
                                        )}
                                    </Stack>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent>
                                    <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                                        <Business color="primary" />
                                        <Typography fontWeight={600}>Thông tin chung</Typography>
                                    </Stack>
                                    <Stack spacing={1.5}>
                                        {organization.OrganizationType && (
                                            <Box>
                                                <Typography variant="caption" color="text.secondary">Loại hình:</Typography>
                                                <Typography variant="body2">{organization.OrganizationType}</Typography>
                                            </Box>
                                        )}
                                        {organization.TaxCode && (
                                            <Box>
                                                <Typography variant="caption" color="text.secondary">Mã số thuế:</Typography>
                                                <Typography variant="body2">{organization.TaxCode}</Typography>
                                            </Box>
                                        )}
                                        {organization.Province && organization.Commune && (
                                            <Box>
                                                <Typography variant="caption" color="text.secondary">Khu vực:</Typography>
                                                <Typography variant="body2">{organization.Commune}, {organization.Province}</Typography>
                                            </Box>
                                        )}
                                        {organization.ManagedBy && (
                                            <Box>
                                                <Typography variant="caption" color="text.secondary">Quản lý bởi:</Typography>
                                                <Typography variant="body2">{organization.ManagedBy}</Typography>
                                            </Box>
                                        )}
                                    </Stack>
                                </CardContent>
                            </Card>

                            {organization.FeaturedImageFullUrls && organization.FeaturedImageFullUrls.length > 0 && (<FeaturedGallerySidebar images={organization.FeaturedImageFullUrls} />)}

                            {organization.MainProfessionId && organization.MainProfession && (
                                <Card>
                                    <CardContent>
                                        <Typography fontWeight={600} gutterBottom>Ngành đào tạo thế mạnh</Typography>
                                        <Stack spacing={1} mt={1}>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <School fontSize="small" color="primary" />
                                                <Typography variant="body2">{organization.MainProfession.ProfessionName}</Typography>
                                            </Stack>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            )}
                        </Stack>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default OrganizationDetailPage;