import { useNavigate, useParams } from "react-router-dom";
import { useGetRecruitmentPostBySeoQuery } from "../../../app/features/recruitment-post.api";
import { 
    LocationOn, 
    Category, 
    BookmarkBorder, 
    Share, 
    AccessTime,
    Work,
    AttachMoney,
    School,
    Cake,
    Wc
} from "@mui/icons-material";
import { 
    Box, 
    Typography, 
    Button, 
    Stack, 
    Card, 
    CardContent, 
    Chip, 
    Divider
} from "@mui/material";
import OrganizationSelectActionCard from "../../../components/cards/organization-card.card";

const RecruitmentPostDetailPage = () => {
    const { seoUrl } = useParams<{ seoUrl: string }>();
    const navigate = useNavigate();

    const { data: recruitmentPost, isLoading, error } =
        useGetRecruitmentPostBySeoQuery(seoUrl!, {
            skip: !seoUrl,
        });

    if (isLoading) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography>Đang tải thông tin...</Typography>
            </Box>
        );
    }

    if (error || !recruitmentPost) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography color="error">Không tìm thấy thông tin tin tuyển dụng</Typography>
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
                title: recruitmentPost.Name,
                text: recruitmentPost.Name,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Đã copy link vào clipboard!');
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString || dateString === "0001-01-01") return "Không giới hạn";
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const getExperienceLabel = (exp: string) => {
        const labels: Record<string, string> = {
            'LessThan1Year': 'Dưới 1 năm',
            '1-3Years': '1-3 năm',
            '3-5Years': '3-5 năm',
            'MoreThan5Years': 'Trên 5 năm'
        };
        return labels[exp] || exp;
    };

    const getEducationLabel = (edu: string) => {
        const labels: Record<string, string> = {
            'PrimarySchool': 'Tiểu học',
            'SecondarySchool': 'Trung học cơ sở',
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
        <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', pb: 4 }}>
            <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: "auto" }}>
                <Stack spacing={3}>
                    {/* Header Card */}
                    <Card elevation={2}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                                <Box sx={{ flex: 1, minWidth: 250 }}>
                                    <Typography variant="h4" fontWeight={700} color="primary.main" gutterBottom>
                                        {recruitmentPost.Name}
                                    </Typography>
                                    
                                    <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap', gap: 1 }}>
                                        {recruitmentPost.IsTop && (
                                            <Chip
                                                label="Tin tuyển dụng nổi bật"
                                                color="error"
                                                size="small"
                                            />
                                        )}
                                        <Chip
                                            label={recruitmentPost.Status}
                                            color="success"
                                            size="small"
                                        />
                                    </Stack>
                                </Box>

                                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
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

                            <Box sx={{ 
                                display: 'grid', 
                                gridTemplateColumns: { 
                                    xs: '1fr', 
                                    sm: 'repeat(2, 1fr)', 
                                    md: 'repeat(4, 1fr)' 
                                }, 
                                gap: 2 
                            }}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <LocationOn fontSize="small" color="primary" />
                                    <Typography variant="body2">
                                        {recruitmentPost.Province || 'Chưa cập nhật'}
                                    </Typography>
                                </Stack>

                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Work fontSize="small" color="primary" />
                                    <Typography variant="body2">
                                        SL: {recruitmentPost.Quantity} người
                                    </Typography>
                                </Stack>

                                <Stack direction="row" spacing={1} alignItems="center">
                                    <AttachMoney fontSize="small" color="primary" />
                                    <Typography variant="body2">
                                        {recruitmentPost.Currency}
                                    </Typography>
                                </Stack>

                                <Stack direction="row" spacing={1} alignItems="center">
                                    <AccessTime fontSize="small" color="primary" />
                                    <Typography variant="body2">
                                        Hạn: {formatDate(recruitmentPost.RecruitmentToDate)}
                                    </Typography>
                                </Stack>
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Organization Info */}
                    {recruitmentPost.Organization && (
                        <Card elevation={2}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight={600} gutterBottom>
                                    Thông tin tổ chức
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                
                                <Stack spacing={2}>
                                    <Typography variant="subtitle1" fontWeight={600}>
                                        {recruitmentPost.Organization.Name}
                                    </Typography>
                                    
                                    <Box sx={{ 
                                        display: 'grid', 
                                        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, 
                                        gap: 2 
                                    }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Mã số thuế: {recruitmentPost.Organization.TaxCode}
                                        </Typography>
                                        
                                        <Typography variant="body2" color="text.secondary">
                                            Địa chỉ: {recruitmentPost.Organization.Address}
                                        </Typography>
                                    </Box>
                                    
                                    {recruitmentPost.Organization.Summary && (
                                        <Typography variant="body2">
                                            {recruitmentPost.Organization.Summary}
                                        </Typography>
                                    )}
                                </Stack>
                            </CardContent>
                        </Card>
                    )}

                    {/* Job Description */}
                    <Card elevation={2}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                                Mô tả công việc
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Box 
                                dangerouslySetInnerHTML={{ __html: recruitmentPost.Description }}
                                sx={{
                                    '& p': { mb: 1 },
                                    '& ul, & ol': { pl: 3 },
                                }}
                            />
                        </CardContent>
                    </Card>

                    {/* Requirements */}
                    {recruitmentPost.Requirement && (
                        <Card elevation={2}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight={600} gutterBottom>
                                    Yêu cầu ứng viên
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                
                                <Box sx={{ 
                                    display: 'grid', 
                                    gridTemplateColumns: { 
                                        xs: '1fr', 
                                        sm: 'repeat(2, 1fr)', 
                                        md: 'repeat(4, 1fr)' 
                                    }, 
                                    gap: 3 
                                }}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Cake fontSize="small" color="action" />
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" display="block">
                                                Độ tuổi
                                            </Typography>
                                            <Typography variant="body2" fontWeight={500}>
                                                {recruitmentPost.Requirement.FromAge} - {recruitmentPost.Requirement.ToAge} tuổi
                                            </Typography>
                                        </Box>
                                    </Stack>

                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Wc fontSize="small" color="action" />
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" display="block">
                                                Giới tính
                                            </Typography>
                                            <Typography variant="body2" fontWeight={500}>
                                                {getGenderLabel(recruitmentPost.Requirement.Gender)}
                                            </Typography>
                                        </Box>
                                    </Stack>

                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Work fontSize="small" color="action" />
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" display="block">
                                                Kinh nghiệm
                                            </Typography>
                                            <Typography variant="body2" fontWeight={500}>
                                                {getExperienceLabel(recruitmentPost.Requirement.Experience)}
                                            </Typography>
                                        </Box>
                                    </Stack>

                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <School fontSize="small" color="action" />
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" display="block">
                                                Trình độ
                                            </Typography>
                                            <Typography variant="body2" fontWeight={500}>
                                                {getEducationLabel(recruitmentPost.Requirement.EducationLevel)}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </Box>
                            </CardContent>
                        </Card>
                    )}

                    {/* Professions */}
                    {recruitmentPost.Professions && recruitmentPost.Professions.length > 0 && (
                        <Card elevation={2}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight={600} gutterBottom>
                                    Ngành nghề liên quan ({recruitmentPost.Professions.length})
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                
                                <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                                    {recruitmentPost.Professions.map((profession) => (
                                        <Chip
                                            key={profession.Id}
                                            label={profession.Name}
                                            variant="outlined"
                                            color="primary"
                                            icon={<Category />}
                                        />
                                    ))}
                                </Stack>
                            </CardContent>
                        </Card>
                    )}

                    {/* Related Organizations */}
                    <Card elevation={2}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                                Tổ chức liên quan
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <OrganizationSelectActionCard 
                                organizations={recruitmentPost.Organization ? [recruitmentPost.Organization] : []} 
                            />
                        </CardContent>
                    </Card>
                </Stack>
            </Box>
        </Box>
    );
}

export default RecruitmentPostDetailPage;