import { useNavigate, useParams } from "react-router-dom";
import { useGetRecruitmentPostBySeoQuery, useGetRecruitmentPostsByPageQuery } from "../../../app/features/recruitment-post.api";
import {
    LocationOn,
    BookmarkBorder,
    Share,
    AccessTime,
    Work,
    AttachMoney,
    School,
    Cake,
    Wc,
    Business,
    CheckCircle,
    PeopleAlt
} from "@mui/icons-material";
import {
    Box,
    Typography,
    Button,
    Stack,
    Card,
    CardContent,
    Chip,
    Divider,
    Container,
    Avatar,
    Grid,
    Paper
} from "@mui/material";
import { useState } from "react";
import ApplyConfirmDialog from "../../../components/dialogs/general/apply-confirm-dialog.dialog";
import { useAuthGuard } from "../../../hooks/useAuthGuard";

const RecruitmentPostDetailPage = () => {
    const { seoUrl } = useParams<{ seoUrl: string }>();
    const navigate = useNavigate();
    const checkAuth = useAuthGuard();
    const [applyDialogOpen, setApplyDialogOpen] = useState(false);

    const { data: recruitmentPost, isLoading, error } =
        useGetRecruitmentPostBySeoQuery(seoUrl!, {
            skip: !seoUrl,
        });

    // Lấy các tin tuyển dụng cùng ngành
    const { data: relatedPosts, isLoading: isLoadingRelated } =
        useGetRecruitmentPostsByPageQuery({
            page: 1,
            size: 6,
        });

    if (isLoading) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '60vh'
            }}>
                <Typography variant="h6" color="text.secondary">
                    Đang tải thông tin...
                </Typography>
            </Box>
        );
    }

    if (error || !recruitmentPost) {
        return (
            <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
                <Typography variant="h5" color="error" gutterBottom>
                    Không tìm thấy thông tin tin tuyển sinh
                </Typography>
                <Button
                    variant="contained"
                    size="large"
                    sx={{ mt: 3 }}
                    onClick={() => navigate('/')}
                >
                    Quay về trang chủ
                </Button>
            </Container>
        );
    }

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: recruitmentPost.Name,
                text: recruitmentPost.Name,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Đã copy link vào clipboard!');
        }
    };

    const handleApplyClick = () => {
        if (!checkAuth()) return;
        setApplyDialogOpen(true);
    };

    const formatDate = (dateString: string) => {
        if (!dateString || dateString === "0001-01-01") return "Không giới hạn";
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const getExperienceLabel = (exp: string) => {
        const labels: Record<string, string> = {
            'LessThan1Year': 'Dưới 1 năm',
            'From1To2Years': '1-2 năm',
            'From2To3Years': '2-3 năm',
            'From3To5Years': '3-5 năm',
            'MoreThan5Years': 'Trên 5 năm'
        };
        return labels[exp] || exp;
    };

    const getEducationLabel = (edu: string) => {
        const labels: Record<string, string> = {
            'PrimarySchool': 'Tiểu học',
            'MiddleSchool': 'Trung học cơ sở',
            'HighSchool': 'Trung học phổ thông',
            'College': 'Cao đẳng',
            'University': 'Đại học',
            'Master': 'Thạc sĩ',
            'PhD': 'Tiến sĩ'
        };
        return labels[edu] || edu;
    };

    const getGenderLabel = (gender: string) => {
        const labels: Record<string, string> = {
            'Male': 'Nam',
            'Female': 'Nữ',
            'Other': 'Khác'
        };
        return labels[gender] || 'Không yêu cầu';
    };

    return (
        <Box sx={{ bgcolor: '#f5f7fa', minHeight: '100vh', pb: 3 }}>
            {/* Hero Section */}
            <Box sx={{
                bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                background: 'linear-gradient(135deg, #fc7248 50%, #ff9800 100%)',
                py: 4,
                mb: 1,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}>
                <Container maxWidth="lg">
                    <Stack spacing={2}>
                        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                            {recruitmentPost.IsTop && (
                                <Chip
                                    icon={<CheckCircle sx={{ fontSize: 16 }} />}
                                    label="Tin tuyển sinh nổi bật"
                                    sx={{
                                        bgcolor: 'rgba(255,255,255,0.25)',
                                        color: 'white',
                                        fontWeight: 600,
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255,255,255,0.3)',
                                        '& .MuiChip-icon': {
                                            color: '#4a8abe'
                                        }
                                    }}
                                />
                            )}
                            <Chip
                                label={recruitmentPost.Status === 'Activated' ? 'Đang tuyển' : recruitmentPost.Status}
                                sx={{
                                    bgcolor: 'rgba(47, 153, 51, 0.9)',
                                    color: 'white',
                                    fontWeight: 600
                                }}
                            />
                        </Stack>

                        <Typography
                            variant="h3"
                            fontWeight={700}
                            color="white"
                            sx={{
                                fontSize: { xs: '1.25rem', md: '2rem' },
                                textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                            }}
                        >
                            {recruitmentPost.Name}
                        </Typography>

                        {/* Quick Info with Salary */}
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={2}
                            flexWrap="wrap"
                            sx={{ mt: 2 }}
                        >
                            <Stack direction="row" spacing={1} alignItems="center">
                                <LocationOn sx={{ color: 'white', fontSize: 20 }} />
                                <Typography variant="body1" color="white" fontWeight={500}>
                                    {recruitmentPost.Province || 'Chưa cập nhật'}
                                </Typography>
                            </Stack>

                            <Stack direction="row" spacing={1} alignItems="center">
                                <PeopleAlt sx={{ color: 'white', fontSize: 20 }} />
                                <Typography variant="body1" color="white" fontWeight={500}>
                                    {recruitmentPost.Quantity} chỉ tiêu
                                </Typography>
                            </Stack>

                            <Stack direction="row" spacing={1} alignItems="center">
                                <AttachMoney sx={{ color: 'white', fontSize: 20 }} />
                                <Typography variant="body1" color="white" fontWeight={500}>
                                    {(recruitmentPost.Currency)}
                                </Typography>
                            </Stack>

                            <Stack direction="row" spacing={1} alignItems="center">
                                <AccessTime sx={{ color: 'white', fontSize: 20 }} />
                                <Typography variant="body1" color="white" fontWeight={500}>
                                    Hạn nộp: {formatDate(recruitmentPost.RecruitmentToDate)}
                                </Typography>
                            </Stack>
                        </Stack>
                    </Stack>
                </Container>
            </Box>

            <Container maxWidth="lg">
                <Grid container spacing={1}>
                    {/* Main Content */}
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Stack spacing={3}>
                            {/* Job Description */}
                            <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid #e0e0e0' }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="h5" fontWeight={700} gutterBottom color="primary.main">
                                        Mô tả chi tiết
                                    </Typography>
                                    <Divider sx={{ mb: 3 }} />

                                    <Box
                                        dangerouslySetInnerHTML={{ __html: recruitmentPost.Description }}
                                        sx={{
                                            '& p': { mb: 2, lineHeight: 1.8, color: 'text.secondary' },
                                            '& ul, & ol': { pl: 3, mb: 2 },
                                            '& li': { mb: 1, lineHeight: 1.8 },
                                            '& h1, & h2, & h3': { color: 'text.primary', mt: 2, mb: 1 }
                                        }}
                                    />

                                    {/* ACTION BUTTONS */}
                                    <Divider sx={{ my: 4 }} />

                                    <Stack
                                        direction={{ xs: 'column', sm: 'row' }}
                                        spacing={2}
                                        justifyContent="left"
                                    >
                                        <Button
                                            variant="contained"
                                            size="large"
                                            onClick={handleApplyClick}
                                            sx={{
                                                bgcolor: '#ff5722',
                                                fontWeight: 600,
                                                px: 4,
                                                '&:hover': {
                                                    bgcolor: '#e64a19',
                                                    transform: 'translateY(-2px)',
                                                },
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            Ứng tuyển ngay
                                        </Button>

                                        <Button
                                            variant="outlined"
                                            size="large"
                                            startIcon={<BookmarkBorder />}
                                            sx={{
                                                borderColor: '#ff5722',
                                                color: '#ff5722',
                                                fontWeight: 600,
                                                px: 3,
                                                '&:hover': {
                                                    bgcolor: '#ff5722',
                                                    color: 'white'
                                                }
                                            }}
                                        >
                                            Lưu tin
                                        </Button>

                                        <Button
                                            variant="outlined"
                                            size="large"
                                            startIcon={<Share />}
                                            onClick={handleShare}
                                            sx={{
                                                borderColor: '#ff5722',
                                                color: '#ff5722',
                                                fontWeight: 600,
                                                px: 3,
                                                '&:hover': {
                                                    bgcolor: '#ff5722',
                                                    color: 'white'
                                                }
                                            }}
                                        >
                                            Chia sẻ
                                        </Button>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Stack>
                    </Grid>

                    {/* Sidebar */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Box
                            sx={{
                                position: 'sticky',
                            }}
                        >
                            <Stack spacing={1}>
                                {/* Organization Info */}
                                {recruitmentPost.Organization && (
                                    <Card
                                        elevation={0}
                                        sx={{
                                            borderRadius: 2,
                                            border: '1px solid #e0e0e0'
                                        }}
                                    >
                                        <CardContent sx={{ p: 2 }}>
                                            <Stack spacing={1}>
                                                <Box sx={{ textAlign: 'center' }}>
                                                    <Avatar
                                                        src={recruitmentPost.Organization.LogoFullUrl || undefined}
                                                        sx={{
                                                            width: 80,
                                                            height: 80,
                                                            mx: 'auto',
                                                            mb: 1,
                                                            bgcolor: '#ff5722',
                                                            fontSize: '2rem',
                                                            fontWeight: 700
                                                        }}
                                                    >
                                                        {recruitmentPost.Organization.Name.charAt(0)}
                                                    </Avatar>
                                                    <Typography variant="h6" fontWeight={700} gutterBottom>
                                                        {recruitmentPost.Organization.Name}
                                                    </Typography>
                                                </Box>

                                                <Divider />

                                                <Stack spacing={2}>
                                                    <Stack direction="row" spacing={1.5} alignItems="flex-start">
                                                        <Business sx={{ color: 'text.secondary', fontSize: 20, mt: 0.3 }} />
                                                        <Box>
                                                            <Typography variant="caption" color="text.secondary" display="block">
                                                                Mã số thuế
                                                            </Typography>
                                                            <Typography variant="body2" fontWeight={500}>
                                                                {recruitmentPost.Organization.TaxCode}
                                                            </Typography>
                                                        </Box>
                                                    </Stack>

                                                    <Stack direction="row" spacing={1.5} alignItems="flex-start">
                                                        <LocationOn sx={{ color: 'text.secondary', fontSize: 20, mt: 0.3 }} />
                                                        <Box>
                                                            <Typography variant="caption" color="text.secondary" display="block">
                                                                Địa chỉ
                                                            </Typography>
                                                            <Typography variant="body2" fontWeight={500}>
                                                                {recruitmentPost.Organization.Address}
                                                            </Typography>
                                                        </Box>
                                                    </Stack>

                                                    {recruitmentPost.Organization.Summary && (
                                                        <Box>
                                                            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                                                                Giới thiệu
                                                            </Typography>
                                                            <Typography
                                                                variant="body2"
                                                                color="text.secondary"
                                                                sx={{
                                                                    display: '-webkit-box',
                                                                    WebkitLineClamp: 5,
                                                                    WebkitBoxOrient: 'vertical',
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis'
                                                                }}
                                                            >
                                                                {recruitmentPost.Organization.Summary}
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                </Stack>

                                                <Button
                                                    variant="outlined"
                                                    fullWidth
                                                    onClick={() => navigate(`/to-chuc/${recruitmentPost.Organization.SeoUrl}`)}
                                                    sx={{
                                                        mt: 2,
                                                        borderColor: '#ff5722',
                                                        color: '#ff5722',
                                                        fontWeight: 600,
                                                        '&:hover': {
                                                            borderColor: '#ff5722',
                                                            bgcolor: '#ff5722',
                                                            color: 'white'
                                                        }
                                                    }}
                                                >
                                                    Xem trang tổ chức
                                                </Button>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Requirements */}
                                {recruitmentPost.Requirement && (
                                    <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid #e0e0e0' }}>
                                        <CardContent sx={{ p: 1 }}>
                                            <Typography variant="h6" fontWeight={700} gutterBottom color="primary.main">
                                                Yêu cầu ứng viên
                                            </Typography>
                                            <Divider sx={{ mb: 2 }} />

                                            <Stack spacing={2}>
                                                <Paper
                                                    elevation={0}
                                                    sx={{
                                                        p: 2,
                                                        bgcolor: '#f8f9fa',
                                                        borderRadius: 2,
                                                        border: '1px solid #e9ecef'
                                                    }}
                                                >
                                                    <Stack direction="row" spacing={1.5} alignItems="center">
                                                        <Avatar sx={{ bgcolor: '#ff5722', width: 40, height: 40 }}>
                                                            <Cake sx={{ fontSize: 20 }} />
                                                        </Avatar>
                                                        <Box>
                                                            <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                                                Độ tuổi
                                                            </Typography>
                                                            <Typography variant="body2" fontWeight={600} color="text.primary">
                                                                {recruitmentPost.Requirement.FromAge} - {recruitmentPost.Requirement.ToAge} tuổi
                                                            </Typography>
                                                        </Box>
                                                    </Stack>
                                                </Paper>

                                                <Paper
                                                    elevation={0}
                                                    sx={{
                                                        p: 2,
                                                        bgcolor: '#f8f9fa',
                                                        borderRadius: 2,
                                                        border: '1px solid #e9ecef'
                                                    }}
                                                >
                                                    <Stack direction="row" spacing={1.5} alignItems="center">
                                                        <Avatar sx={{ bgcolor: '#2196f3', width: 40, height: 40 }}>
                                                            <Wc sx={{ fontSize: 20 }} />
                                                        </Avatar>
                                                        <Box>
                                                            <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                                                Giới tính
                                                            </Typography>
                                                            <Typography variant="body2" fontWeight={600} color="text.primary">
                                                                {getGenderLabel(recruitmentPost.Requirement.Gender)}
                                                            </Typography>
                                                        </Box>
                                                    </Stack>
                                                </Paper>

                                                <Paper
                                                    elevation={0}
                                                    sx={{
                                                        p: 2,
                                                        bgcolor: '#f8f9fa',
                                                        borderRadius: 2,
                                                        border: '1px solid #e9ecef'
                                                    }}
                                                >
                                                    <Stack direction="row" spacing={1.5} alignItems="center">
                                                        <Avatar sx={{ bgcolor: '#4caf50', width: 40, height: 40 }}>
                                                            <Work sx={{ fontSize: 20 }} />
                                                        </Avatar>
                                                        <Box>
                                                            <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                                                Kinh nghiệm
                                                            </Typography>
                                                            <Typography variant="body2" fontWeight={600} color="text.primary">
                                                                {getExperienceLabel(recruitmentPost.Requirement.Experience)}
                                                            </Typography>
                                                        </Box>
                                                    </Stack>
                                                </Paper>

                                                <Paper
                                                    elevation={0}
                                                    sx={{
                                                        p: 2,
                                                        bgcolor: '#f8f9fa',
                                                        borderRadius: 2,
                                                        border: '1px solid #e9ecef'
                                                    }}
                                                >
                                                    <Stack direction="row" spacing={1.5} alignItems="center">
                                                        <Avatar sx={{ bgcolor: '#9c27b0', width: 40, height: 40 }}>
                                                            <School sx={{ fontSize: 20 }} />
                                                        </Avatar>
                                                        <Box>
                                                            <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                                                Trình độ học vấn
                                                            </Typography>
                                                            <Typography variant="body2" fontWeight={600} color="text.primary">
                                                                {getEducationLabel(recruitmentPost.Requirement.EducationLevel)}
                                                            </Typography>
                                                        </Box>
                                                    </Stack>
                                                </Paper>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                )}
                            </Stack>
                        </Box>
                    </Grid>
                </Grid>

                {/* Related Jobs Section */}
                {relatedPosts && relatedPosts.Items && relatedPosts.Items.length > 0 && (
                    <Box sx={{ mt: 6 }}>
                        <Typography variant="h5" fontWeight={700} gutterBottom color="primary.main">
                            Tin tuyển sinh khác
                        </Typography>

                        <Stack spacing={1}>
                            {relatedPosts.Items
                                .filter(post => post.Id !== recruitmentPost.Id)
                                .slice(0, 6)
                                .map((post) => (
                                    <Card
                                        key={post.Id}
                                        elevation={0}
                                        sx={{
                                            borderRadius: 2,
                                            border: '1px solid #e0e0e0',
                                            transition: 'all 0.3s ease',
                                            cursor: 'pointer',
                                            '&:hover': {
                                                transform: 'translateX(4px)',
                                                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                                borderColor: '#ff5722'
                                            }
                                        }}
                                        onClick={() => navigate(`/tin-tuyen-sinh/${post.SeoUrl}`)}
                                    >
                                        <CardContent sx={{
                                            p: 0,
                                            '&:last-child': {
                                                pb: 0
                                            }
                                        }}>
                                            <Grid container>
                                                {/* Left Side - Organization Logo */}
                                                <Grid
                                                    size={{ xs: 12, sm: 3, md: 2 }}
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        bgcolor: '#f8f9fa',
                                                        borderRight: { xs: 'none', sm: '1px solid #e0e0e0' },
                                                        borderBottom: { xs: '1px solid #e0e0e0', sm: 'none' }
                                                    }}
                                                >
                                                    <Avatar
                                                        src={post.Organization?.LogoFullUrl || undefined}
                                                        sx={{
                                                            width: { xs: 80, sm: 90 },
                                                            height: { xs: 80, sm: 90 },
                                                            fontWeight: 700
                                                        }}
                                                    >
                                                        {post.Organization?.Name?.charAt(0) || 'C'}
                                                    </Avatar>
                                                </Grid>

                                                {/* Right Side - Job Information */}
                                                <Grid size={{ xs: 12, sm: 9, md: 10 }}>
                                                    <Box sx={{ p: 1 }}>
                                                        <Stack spacing={2}>
                                                            {/* Title and Organization */}
                                                            <Box>
                                                                <Typography
                                                                    variant="h6"
                                                                    fontWeight={700}
                                                                    sx={{
                                                                        display: '-webkit-box',
                                                                        WebkitLineClamp: 2,
                                                                        WebkitBoxOrient: 'vertical',
                                                                        overflow: 'hidden',
                                                                        textOverflow: 'ellipsis',
                                                                        color: 'text.primary',
                                                                        '&:hover': {
                                                                            color: '#ff5722'
                                                                        }
                                                                    }}
                                                                >
                                                                    {post.Name}
                                                                </Typography>
                                                                <Typography
                                                                    variant="body2"
                                                                    color="text.secondary"
                                                                    sx={{
                                                                        overflow: 'hidden',
                                                                        textOverflow: 'ellipsis',
                                                                        whiteSpace: 'nowrap'
                                                                    }}
                                                                >
                                                                    {post.Organization?.Name}
                                                                </Typography>
                                                            </Box>

                                                            {/* Job Details in Row */}
                                                            <Stack
                                                                direction={{ xs: 'column', sm: 'row' }}
                                                                spacing={{ xs: 1.5, sm: 3 }}
                                                                flexWrap="wrap"
                                                            >
                                                                <Stack direction="row" spacing={1} alignItems="center">
                                                                    <AttachMoney sx={{ color: '#4caf50', fontSize: 20 }} />
                                                                    <Typography variant="body2" fontWeight={600} color="#4caf50">
                                                                        {post.Currency}
                                                                    </Typography>
                                                                </Stack>

                                                                <Stack direction="row" spacing={1} alignItems="center">
                                                                    <LocationOn sx={{ color: 'text.secondary', fontSize: 20 }} />
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        {post.Province || 'Chưa cập nhật'}
                                                                    </Typography>
                                                                </Stack>

                                                                <Stack direction="row" spacing={1} alignItems="center">
                                                                    <PeopleAlt sx={{ color: 'text.secondary', fontSize: 20 }} />
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        {post.Quantity} chỉ tiêu
                                                                    </Typography>
                                                                </Stack>

                                                                <Stack direction="row" spacing={1} alignItems="center">
                                                                    <AccessTime sx={{ color: 'text.secondary', fontSize: 20 }} />
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        {formatDate(post.RecruitmentToDate)}
                                                                    </Typography>
                                                                </Stack>
                                                            </Stack>

                                                            {/* Professions Tags */}
                                                            {post.Professions && post.Professions.length > 0 && (
                                                                <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                                                                    {post.Professions.slice(0, 3).map((profession) => (
                                                                        <Chip
                                                                            key={profession.Id}
                                                                            label={profession.Name}
                                                                            size="small"
                                                                            sx={{
                                                                                bgcolor: '#fff3e0',
                                                                                color: '#ff5722',
                                                                                border: '1px solid #ffe0b2',
                                                                                fontWeight: 500,
                                                                                fontSize: '0.75rem'
                                                                            }}
                                                                        />
                                                                    ))}
                                                                </Stack>
                                                            )}
                                                        </Stack>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                ))}
                        </Stack>
                    </Box>
                )}
            </Container>
            <ApplyConfirmDialog
                open={applyDialogOpen}
                onClose={() => setApplyDialogOpen(false)}
                onSuccess={() => { }}
                organizationName={recruitmentPost.Organization?.Name || "Công ty"}
                organizationLogo={recruitmentPost.Organization?.LogoFullUrl}
                jobTitle={recruitmentPost.Name}
                recruitmentPostId={recruitmentPost.Id}
            />
        </Box>

    );
}

export default RecruitmentPostDetailPage;