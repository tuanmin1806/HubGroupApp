import { LocationOn, Category, AccountBalance, Language, BookmarkBorder, Share, Info, Phone, Business, School, Email, WorkOutline, PeopleAlt, CalendarToday } from "@mui/icons-material";
import { Box, Typography, Stack, Card, CardContent, Chip, Divider, Button, Tabs, Tab, CircularProgress } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useGetOrganizationBySeoQuery } from "../../../app/features/organization.api";
import { useGetRecruitmentPostsByOrganizationWithPageQuery } from "../../../app/features/recruitment-post.api";
import OrganizationSelectActionCard from "../../../components/cards/organization-card.card";
import MuiLink from "@mui/material/Link";
import { useState } from "react";
import { formatDate } from "../../../utils/date.utils";

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

const OrganizationDetailPage = () => {
    const { seoUrl } = useParams<{ seoUrl: string }>();
    const navigate = useNavigate();
    const [tabValue, setTabValue] = useState(0);

    const { data: organization, isLoading, error } = useGetOrganizationBySeoQuery(seoUrl!, { skip: !seoUrl, });
    const { data: recruitmentPosts, isLoading: loadingPosts } = useGetRecruitmentPostsByOrganizationWithPageQuery(seoUrl!, { skip: !seoUrl, });

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
                <Typography color="error">Không tìm thấy thông tin tổ chức</Typography>
                <Button
                    variant="contained"
                    sx={{ mt: 2 }}
                    onClick={() => navigate('/')}
                >
                    Quay về trang chủ
                </Button>
            </Box>
        );
    }

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: organization.Name,
                text: organization.Summary,
                url: window.location.href,
            });
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
            {/* Wallpaper/Banner */}
            {organization.WallpaperFullUrl && (
                <Box sx={{ p: { xs: 1, md: 1 }, maxWidth: 1200, mx: "auto" }}>
                    <Box
                        sx={{
                            maxWidth: 1200,
                            mx: 'auto',
                            height: { xs: 200, md: 300 },
                            backgroundImage: `url(${organization.WallpaperFullUrl})`,
                            backgroundSize: 'contain',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            borderRadius: 2,
                            boxShadow: '0 6px 24px rgba(0,0,0,0.12)',
                        }}
                    />
                </Box>
            )}

            <Box sx={{ p: { xs: 1, md: 1 }, maxWidth: 1200, mx: "auto" }}>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
                    {/* LEFT COLUMN */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Stack spacing={1}>
                            {/* Header Card */}
                            <Card>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                        {organization.LogoFullUrl && (
                                            <Box
                                                component="img"
                                                src={organization.LogoFullUrl}
                                                alt={organization.Name}
                                                sx={{
                                                    width: 80,
                                                    height: 80,
                                                    borderRadius: 2,
                                                    objectFit: 'cover',
                                                    border: '1px solid #e0e0e0'
                                                }}
                                            />
                                        )}
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="h5" fontWeight={600} gutterBottom>
                                                {organization.Name}
                                            </Typography>
                                            {organization.IsTop && (
                                                <Chip
                                                    label="Tổ chức nổi bật"
                                                    color="primary"
                                                    size="small"
                                                />
                                            )}
                                        </Box>
                                    </Box>

                                    {organization.Summary && (
                                        <Box sx={{ mt: 1, p: 1, bgcolor: 'action.hover', borderRadius: 1 }}>
                                            <Typography variant="body2" color="text.secondary" lineHeight={1}>
                                                {organization.Summary}
                                            </Typography>
                                        </Box>
                                    )}

                                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2, mt: 2 }}>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <LocationOn fontSize="small" color="primary" />
                                            <Typography variant="body2">
                                                {organization.Province || 'Chưa cập nhật'}
                                            </Typography>
                                        </Stack>

                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Category fontSize="small" color="primary" />
                                            <Typography variant="body2">
                                                {organization.OrganizationType || 'Chưa cập nhật'}
                                            </Typography>
                                        </Stack>

                                        {organization.ManagedBy && (
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <AccountBalance fontSize="small" color="primary" />
                                                <Typography variant="body2">
                                                    {organization.ManagedBy}
                                                </Typography>
                                            </Stack>
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>

                            {/* Tabs Section */}
                            <Card>
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <Tabs
                                        value={tabValue}
                                        onChange={handleTabChange}
                                        sx={{
                                            minHeight: 50,
                                            '& .MuiTab-root': {
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                fontSize: '1rem',
                                                minHeight: 50,
                                                py: 0,
                                                gap: 0.5,
                                                '&.Mui-selected': {
                                                    color: 'primary.main',
                                                },
                                            },
                                            '& .MuiTab-iconWrapper': {
                                                fontSize: 18,
                                            },
                                        }}
                                    >
                                        <Tab
                                            label="Giới thiệu"
                                            icon={<Info sx={{ fontSize: 18 }} />}
                                            iconPosition="start"
                                        />
                                        <Tab
                                            label={`Tin tuyển sinh (${recruitmentPosts?.Total || 0})`}
                                            icon={<WorkOutline sx={{ fontSize: 18 }} />}
                                            iconPosition="start"
                                        />
                                    </Tabs>
                                </Box>

                                <TabPanel value={tabValue} index={0}>
                                    <CardContent>
                                        <Typography variant="h6" fontWeight={600} gutterBottom>
                                            Giới thiệu chi tiết
                                        </Typography>
                                        <Divider sx={{ mb: 2 }} />

                                        {organization.Description ? (
                                            <Box
                                                sx={{
                                                    '& img': {
                                                        maxWidth: '100%',
                                                        height: 'auto',
                                                        borderRadius: 1,
                                                        my: 2
                                                    },
                                                    '& h1, & h2, & h3, & h4, & h5, & h6': {
                                                        mt: 3,
                                                        mb: 2,
                                                        fontWeight: 600
                                                    },
                                                    '& p': {
                                                        mb: 2,
                                                        lineHeight: 1.7
                                                    },
                                                    '& table': {
                                                        width: '100%',
                                                        borderCollapse: 'collapse',
                                                        my: 2
                                                    },
                                                    '& td, & th': {
                                                        border: '1px solid #ddd',
                                                        p: 1
                                                    },
                                                    '& a': {
                                                        color: 'primary.main',
                                                        textDecoration: 'none',
                                                        '&:hover': {
                                                            textDecoration: 'underline'
                                                        }
                                                    }
                                                }}
                                                dangerouslySetInnerHTML={{ __html: organization.Description }}
                                            />
                                        ) : (
                                            <Typography color="text.secondary">
                                                Chưa có thông tin giới thiệu chi tiết
                                            </Typography>
                                        )}

                                        <Box sx={{ mt: 3 }}>
                                            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                                                <Button
                                                    variant="contained"
                                                    size="medium"
                                                    startIcon={<Language />}
                                                    component="a"
                                                    href={organization.WebsiteUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    disabled={!organization.WebsiteUrl}
                                                    sx={{ textTransform: "none" }}
                                                >
                                                    Truy cập website
                                                </Button>

                                                <Button
                                                    variant="outlined"
                                                    size="medium"
                                                    startIcon={<BookmarkBorder />}
                                                    sx={{ textTransform: 'none' }}
                                                >
                                                    Lưu tin
                                                </Button>

                                                <Button
                                                    variant="outlined"
                                                    size="medium"
                                                    startIcon={<Share />}
                                                    onClick={handleShare}
                                                    sx={{ textTransform: 'none' }}
                                                >
                                                    Chia sẻ
                                                </Button>
                                            </Stack>
                                        </Box>
                                    </CardContent>
                                </TabPanel>

                                <TabPanel value={tabValue} index={1}>
                                    <CardContent>
                                        {loadingPosts ? (
                                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                                <CircularProgress />
                                            </Box>
                                        ) : recruitmentPosts?.Items && recruitmentPosts.Items.length > 0 ? (
                                            <Stack spacing={1.5}>
                                                {recruitmentPosts.Items.map((post) => (
                                                    <Card
                                                        key={post.Id}
                                                        variant="outlined"
                                                        sx={{
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s',
                                                            position: 'relative',
                                                            '&:hover': {
                                                                transform: 'translateY(-2px)',
                                                            },
                                                        }}
                                                        onClick={() => navigate(`/tin-tuyen-sinh/${post.SeoUrl}`)}
                                                    >
                                                        {/* IsTop badge */}
                                                        {post.IsTop && (
                                                            <Box sx={{
                                                                position: 'absolute', top: 8, right: 8,
                                                                bgcolor: '#f3522a', color: '#fafafa',
                                                                fontSize: "0.7rem", fontWeight: 500,
                                                                px: 0.75, py: 0.25, borderRadius: 0.75,
                                                                letterSpacing: 0.4, lineHeight: 1.5, zIndex: 1,
                                                            }}>
                                                                Nổi bật
                                                            </Box>
                                                        )}

                                                        <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                                                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                                                                {/* Content */}
                                                                <Box sx={{ flex: 1, minWidth: 0, pr: post.IsTop ? 6 : 0 }}>
                                                                    {/* Title */}
                                                                    <Typography
                                                                        variant="body1"
                                                                        fontWeight={600}
                                                                        sx={{
                                                                            fontSize: { xs: '0.875rem', sm: '0.95rem' },
                                                                            lineHeight: 1.35,
                                                                            WebkitLineClamp: 2,
                                                                            WebkitBoxOrient: 'vertical',
                                                                            overflow: 'hidden',
                                                                            mb: 0.75,
                                                                            '&:hover': { color: 'primary.main' },
                                                                            transition: 'color 0.2s',
                                                                        }}
                                                                    >
                                                                        {post.Name}
                                                                    </Typography>

                                                                    {/* Professions chips */}
                                                                    {post.Professions && post.Professions.length > 0 && (
                                                                        <Stack direction="row" flexWrap="wrap" gap={0.5} mb={0.75}>
                                                                            {post.Professions.slice(0, 3).map((p) => (
                                                                                <Chip
                                                                                    key={p.Id}
                                                                                    label={p.Name}
                                                                                    size="small"
                                                                                    variant="outlined"
                                                                                    sx={{
                                                                                        height: 20,
                                                                                        fontSize: '0.65rem',
                                                                                        borderColor: 'primary.light',
                                                                                        color: 'primary.main',
                                                                                        '& .MuiChip-label': { px: 0.75 },
                                                                                    }}
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

                                                                    {/* Meta: quantity + deadline */}
                                                                    <Stack
                                                                        direction="row"
                                                                        flexWrap="wrap"
                                                                        alignItems="center"
                                                                        gap={{ xs: 0.75, sm: 1.5 }}
                                                                    >
                                                                        {/* Số lượng */}
                                                                        <Stack direction="row" spacing={0.4} alignItems="center">
                                                                            <PeopleAlt sx={{ fontSize: 14, color: 'primary.main' }} />
                                                                            <Typography variant="caption" sx={{ fontSize: '0.72rem' }}>
                                                                                {post.Quantity} chỉ tiêu
                                                                            </Typography>
                                                                        </Stack>

                                                                        {/* Tỉnh */}
                                                                        {post.Province && (
                                                                            <>
                                                                                <Stack direction="row" spacing={0.4} alignItems="center">
                                                                                    <LocationOn sx={{ fontSize: 14, color: 'primary.main' }} />
                                                                                    <Typography variant="caption" sx={{ fontSize: '0.72rem' }}>
                                                                                        {post.Province}
                                                                                    </Typography>
                                                                                </Stack>
                                                                            </>
                                                                        )}

                                                                        {/* Hạn nộp */}
                                                                        {post.RecruitmentToDate && (
                                                                            <Stack direction="row" spacing={0.4} alignItems="center">
                                                                                <CalendarToday sx={{ fontSize: 13, color: 'primary.main' }} />
                                                                                <Typography variant="caption" sx={{ fontSize: '0.72rem' }}>
                                                                                    {formatDate(post.RecruitmentToDate)}
                                                                                </Typography>
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
                                                <Typography color="text.secondary">
                                                    Chưa có tin tuyển sinh
                                                </Typography>
                                            </Box>
                                        )}
                                    </CardContent>
                                </TabPanel>
                            </Card>

                            {/* Professions/Programs */}
                            {organization.Professions && organization.Professions.length > 0 && (
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" fontWeight={600} gutterBottom>
                                            Các ngành đào tạo ({organization.Professions.length})
                                        </Typography>
                                        <Divider sx={{ mb: 2 }} />
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                            {organization.Professions.map((profession) => (
                                                <Chip
                                                    key={profession.Id}
                                                    label={profession.Name}
                                                    variant={profession.Id === organization.MainProfessionId ? "filled" : "outlined"}
                                                    color={profession.Id === organization.MainProfessionId ? "primary" : "default"}
                                                    onClick={() => {/* Navigate to profession detail */ }}
                                                />
                                            ))}
                                        </Box>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Related Organizations */}
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" fontWeight={600} gutterBottom>
                                        Tổ chức liên quan
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    <OrganizationSelectActionCard organizations={[]} />
                                </CardContent>
                            </Card>
                        </Stack>
                    </Box>

                    {/* RIGHT SIDEBAR */}
                    <Box sx={{ width: { xs: '100%', md: '340px' }, flexShrink: 0 }}>
                        <Stack spacing={1}>
                            {/* Contact Information */}
                            <Card>
                                <CardContent>
                                    <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                                        <Info color="primary" />
                                        <Typography fontWeight={600}>
                                            Thông tin liên hệ
                                        </Typography>
                                    </Stack>

                                    <Stack spacing={1}>
                                        {organization.Address && (
                                            <Stack direction="row" spacing={1} alignItems="flex-start">
                                                <LocationOn fontSize="small" sx={{ mt: 0.5 }} />
                                                <Typography variant="body2">
                                                    {organization.Address}
                                                </Typography>
                                            </Stack>
                                        )}

                                        {organization.PhoneNumber && (
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Phone fontSize="small" />
                                                <MuiLink
                                                    href={`tel:${organization.PhoneNumber}`}
                                                    variant="body2"
                                                    underline="hover"
                                                >
                                                    {organization.PhoneNumber}
                                                </MuiLink>
                                            </Stack>
                                        )}

                                        {organization.Email && (
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Email fontSize="small" />
                                                <MuiLink
                                                    href={`mailto:${organization.Email}`}
                                                    variant="body2"
                                                    underline="hover"
                                                >
                                                    {organization.Email}
                                                </MuiLink>
                                            </Stack>
                                        )}

                                        {organization.WebsiteUrl && (
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Language fontSize="small" />
                                                <MuiLink
                                                    href={organization.WebsiteUrl}
                                                    target="_blank"
                                                    variant="body2"
                                                    underline="hover"
                                                >
                                                    {organization.WebsiteUrl}
                                                </MuiLink>
                                            </Stack>
                                        )}
                                    </Stack>
                                </CardContent>
                            </Card>

                            {/* General Info */}
                            <Card>
                                <CardContent>
                                    <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                                        <Business color="primary" />
                                        <Typography fontWeight={600}>
                                            Thông tin chung
                                        </Typography>
                                    </Stack>

                                    <Stack spacing={1.5}>
                                        {organization.OrganizationType && (
                                            <Box>
                                                <Typography variant="caption" color="text.secondary">
                                                    Loại hình:
                                                </Typography>
                                                <Typography variant="body2">
                                                    {organization.OrganizationType}
                                                </Typography>
                                            </Box>
                                        )}

                                        {organization.TaxCode && (
                                            <Box>
                                                <Typography variant="caption" color="text.secondary">
                                                    Mã số thuế:
                                                </Typography>
                                                <Typography variant="body2">
                                                    {organization.TaxCode}
                                                </Typography>
                                            </Box>
                                        )}

                                        {organization.Province && organization.Commune && (
                                            <Box>
                                                <Typography variant="caption" color="text.secondary">
                                                    Khu vực:
                                                </Typography>
                                                <Typography variant="body2">
                                                    {organization.Commune}, {organization.Province}
                                                </Typography>
                                            </Box>
                                        )}

                                        <Box>
                                            <Typography variant="caption" color="text.secondary">
                                                Trạng thái:
                                            </Typography>
                                            <Chip
                                                label={organization.Status || 'Đang hoạt động'}
                                                color={organization.Status === 'Active' ? 'success' : 'default'}
                                                size="small"
                                                sx={{ mt: 0.5 }}
                                            />
                                        </Box>
                                    </Stack>
                                </CardContent>
                            </Card>

                            {/* Main Profession */}
                            {organization.MainProfessionId && organization.MainProfession && (
                                <Card>
                                    <CardContent>
                                        <Typography fontWeight={600} gutterBottom>
                                            Ngành đào tạo thế mạnh
                                        </Typography>
                                        <Stack spacing={1} mt={1}>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <School fontSize="small" color="primary" />
                                                <Typography variant="body2">
                                                    {organization.MainProfession.Name}
                                                </Typography>
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
}

export default OrganizationDetailPage;