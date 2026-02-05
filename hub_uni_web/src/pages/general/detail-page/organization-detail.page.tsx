import { LocationOn, Category, AccountBalance, Language, BookmarkBorder, Share, Info, Phone, Business, School, Email, WorkOutline } from "@mui/icons-material";
import { Box, Typography, Stack, Card, CardContent, Chip, Divider, Button, Tabs, Tab, CircularProgress } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useGetOrganizationBySeoQuery } from "../../../app/features/organization.api";
import { useGetRecruitmentPostsByOrganizationWithPageQuery } from "../../../app/features/recruitment-post.api";
import OrganizationSelectActionCard from "../../../components/cards/organization-card.card";
import MuiLink from "@mui/material/Link";
import { useState } from "react";

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

    const { data: organization, isLoading, error } =
        useGetOrganizationBySeoQuery(seoUrl!, {
            skip: !seoUrl,
        });

    const { data: recruitmentPosts, isLoading: loadingPosts } =
        useGetRecruitmentPostsByOrganizationWithPageQuery(seoUrl!, {
            skip: !seoUrl,
        });

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
                <Box
                    sx={{
                        width: "100%",
                        height: { xs: 220, md: 320 },
                        backgroundImage: `url(${organization.WallpaperFullUrl})`,
                        backgroundSize: "contain",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        borderRadius: { md: 2 },
                    }}
                />
            )}

            <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: "auto" }}>
                <Box sx={{ display: 'flex', gap: 3, flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
                    {/* LEFT COLUMN */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Stack spacing={3}>
                            {/* Header Card */}
                            <Card>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
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
                                            {organization.InternationalName && (
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                    {organization.InternationalName}
                                                </Typography>
                                            )}
                                            {organization.IsTop && (
                                                <Chip
                                                    label="Tổ chức nổi bật"
                                                    color="primary"
                                                    size="small"
                                                    sx={{ mt: 1 }}
                                                />
                                            )}
                                        </Box>
                                    </Box>

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
                                            px: 2,
                                            '& .MuiTab-root': {
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                fontSize: '1rem',
                                            }
                                        }}
                                    >
                                        <Tab
                                            label="Giới thiệu"
                                            icon={<Info />}
                                            iconPosition="start"
                                        />
                                        <Tab
                                            label={`Tin tuyển dụng (${recruitmentPosts?.Total || 0})`}
                                            icon={<WorkOutline />}
                                            iconPosition="start"
                                        />
                                    </Tabs>
                                </Box>

                                {/* Tab 1: Giới thiệu */}
                                <TabPanel value={tabValue} index={0}>
                                    <CardContent>
                                        <Typography variant="h6" fontWeight={600} gutterBottom>
                                            Giới thiệu chung
                                        </Typography>
                                        <Divider sx={{ mb: 2 }} />
                                        <Typography color="text.secondary" lineHeight={1.7}>
                                            {organization.Summary || 'Chưa có thông tin giới thiệu'}
                                        </Typography>

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

                                {/* Tab 2: Tin tuyển dụng */}
                                <TabPanel value={tabValue} index={1}>
                                    <CardContent>
                                        {loadingPosts ? (
                                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                                <CircularProgress />
                                            </Box>
                                        ) : recruitmentPosts?.Items && recruitmentPosts.Items.length > 0 ? (
                                            <Stack spacing={2}>
                                                {recruitmentPosts.Items.map((post) => (
                                                    <Card
                                                        key={post.Id}
                                                        variant="outlined"
                                                        sx={{
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s',
                                                            '&:hover': {
                                                                boxShadow: 2,
                                                                transform: 'translateX(4px)',
                                                            }
                                                        }}
                                                        onClick={() => navigate(`/tin-tuyen-dung/${post.SeoUrl}`)}
                                                    >
                                                        <CardContent sx={{ py: 2 }}>
                                                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                                                <WorkOutline
                                                                    sx={{
                                                                        color: 'primary.main',
                                                                        fontSize: 24,
                                                                        mt: 0.5,
                                                                        flexShrink: 0
                                                                    }}
                                                                />
                                                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                                                    <Typography
                                                                        variant="body1"
                                                                        fontWeight={600}
                                                                        sx={{
                                                                            mb: 0.5,
                                                                            whiteSpace: 'normal',
                                                                            wordBreak: 'break-word',
                                                                        }}
                                                                    >
                                                                        {post.Name}
                                                                    </Typography>

                                                                    {post.Name && (
                                                                        <Chip
                                                                            label={post.Name}
                                                                            size="small"
                                                                            variant="outlined"
                                                                            sx={{ mt: 1 }}
                                                                        />
                                                                    )}

                                                                    {post.Description && (
                                                                        <Typography
                                                                            variant="body2"
                                                                            color="text.secondary"
                                                                            sx={{
                                                                                mt: 1,
                                                                                display: '-webkit-box',
                                                                                WebkitLineClamp: 2,
                                                                                WebkitBoxOrient: 'vertical',
                                                                                overflow: 'hidden'
                                                                            }}
                                                                        >
                                                                            {post.Description}
                                                                        </Typography>
                                                                    )}
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
                                                    Chưa có tin tuyển dụng
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
                        <Stack spacing={3}>
                            {/* Contact Information */}
                            <Card>
                                <CardContent>
                                    <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                                        <Info color="primary" />
                                        <Typography fontWeight={600}>
                                            Thông tin liên hệ
                                        </Typography>
                                    </Stack>

                                    <Stack spacing={2}>
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

                            {/* Keywords/Tags */}
                            {organization.Keywords && (
                                <Card>
                                    <CardContent>
                                        <Typography fontWeight={600} gutterBottom>
                                            Từ khóa liên quan
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                                            {organization.Keywords.split(',').map((keyword, index) => (
                                                <Chip
                                                    key={index}
                                                    label={keyword.trim()}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            ))}
                                        </Box>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Main Profession */}
                            {organization.MainProfessionId && organization.MainProfession && (
                                <Card>
                                    <CardContent>
                                        <Typography fontWeight={600} gutterBottom>
                                            Ngành đào tạo chính
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