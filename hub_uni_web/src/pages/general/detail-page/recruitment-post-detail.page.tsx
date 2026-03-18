import { useNavigate, useParams } from "react-router-dom";
import { useGetRecruitmentPostBySeoQuery, useGetRecruitmentPostsByPageQuery } from "../../../app/features/recruitment-post.api";
import { LocationOn, BookmarkBorder, Share, AccessTime, Work, AttachMoney, School, Cake, Wc, Business, CheckCircle, PeopleAlt, Star, RunningWithErrors, Bookmark } from "@mui/icons-material";
import { Box, Typography, Button, Stack, Card, CardContent, Chip, Divider, Container, Avatar, Grid, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import ApplyConfirmDialog from "../../../components/dialogs/general/apply-confirm-dialog.dialog";
import { useAuthGuard } from "../../../hooks/useAuthGuard";
import { formatDate } from "../../../utils/date.utils";
import { ConvertService } from "../../../app/services/convert.service";
import { formatCurrency } from "../../../utils/recruitment-post.utils";
import { useCreateFavouriteMutation, useDeleteFavouriteMutation } from "../../../app/features/favourite.api";
import { getUserInfo } from "../../../app/services/auth.service";
import { showSnackbar } from "../../../app/features/snackbar/snackbar.slice";
import { AppDispatch } from "../../../app/store";
import { useDispatch } from "react-redux";

const RequirementRow = ({ icon, label, value, color, }: { icon: React.ReactNode; label: string; value: string; color: string; }) => (
    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ p: 1.25, borderRadius: 1.5, bgcolor: color, border: '1px solid', borderColor: 'rgba(0,0,0,0.06)', }}>
        <Box sx={{ width: 32, height: 32, borderRadius: 1.5, bgcolor: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, }}>{icon}</Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ fontSize: '0.7rem', lineHeight: 1.2, display: 'block' }}>{label}</Typography>
            <Typography variant="body2" fontWeight={700} color="text.primary" sx={{ fontSize: '0.85rem', lineHeight: 1.4 }}>{value}</Typography>
        </Box>
    </Stack>
);

const RecruitmentPostDetailPage = () => {
    const { seoUrl } = useParams<{ seoUrl: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const checkAuth = useAuthGuard();
    const [applyDialogOpen, setApplyDialogOpen] = useState(false);
    const [createFavourite, { isLoading: isSaving }] = useCreateFavouriteMutation();
    const [deleteFavourite, { isLoading: isDeleting }] = useDeleteFavouriteMutation();
    const [isSaved, setIsSaved] = useState(false);
    const userInfo = getUserInfo();

    const { data: recruitmentPost, isLoading, error } = useGetRecruitmentPostBySeoQuery(seoUrl!, { skip: !seoUrl, });
    const { data: relatedPosts, isLoading: isLoadingRelated } = useGetRecruitmentPostsByPageQuery({ page: 1, size: 6, });

    useEffect(() => { if (recruitmentPost?.Name) document.title = `${recruitmentPost?.Name} | duhochan.hubgroup.vn`; }, [recruitmentPost?.Name]);
    useEffect(() => { if (recruitmentPost?.IsSaved !== undefined) { setIsSaved(recruitmentPost.IsSaved); } }, [recruitmentPost?.IsSaved]);

    const handleSaveToggle = async () => {
        if (!checkAuth()) return;
        try {
            if (isSaved) {
                await deleteFavourite(recruitmentPost?.SaveId || "").unwrap();
                setIsSaved(false);
                dispatch(showSnackbar({ message: "Đã hủy lưu tin tuyển sinh!", severity: "info" }));
            } else {
                await createFavourite({
                    CustomerId: userInfo?.Id || "",
                    RecruitPostId: recruitmentPost?.Id || "",
                }).unwrap();
                setIsSaved(true);
                dispatch(showSnackbar({ message: "Đã lưu tin tuyển sinh thành công!", severity: "success" }));
            }
        } catch (err) {
            dispatch(showSnackbar({ message: isSaved ? "Hủy lưu tin thất bại, vui lòng thử lại!" : "Lưu tin thất bại, vui lòng thử lại!", severity: "error" }));
        }
    };

    if (isLoading) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '60vh'
            }}>
                <Typography variant="h6" color="text.secondary">Đang tải thông tin...</Typography>
            </Box>
        );
    }

    if (error || !recruitmentPost) {
        return (
            <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
                <Typography variant="h5" color="error" gutterBottom>Không tìm thấy thông tin tin tuyển sinh</Typography>
                <Button variant="contained" size="large" sx={{ mt: 3 }} onClick={() => navigate('/')}>Quay về trang chủ</Button>
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

    return (
        <Box sx={{ bgcolor: '#f5f7fa', minHeight: '100vh', pb: 3 }}>
            <Box
                sx={{
                    background: 'linear-gradient(135deg, rgba(247,148,0,0.95) 0%, rgba(252,167,40,0.85) 40%, rgb(255,183,116) 100%)',
                    py: { xs: 3, md: 5 },
                    mb: 1,
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <Box sx={{ position: 'absolute', top: '-100%', left: '-25%', width: '55%', height: '350%', background: 'rgba(49, 19, 19, 0.06)', transform: 'rotate(-45deg)', pointerEvents: 'none' }} />
                <Box sx={{ position: 'absolute', top: '-100%', left: '-10%', width: '30%', height: '350%', background: 'rgba(255,255,255,0.10)', transform: 'rotate(-45deg)', pointerEvents: 'none' }} />
                <Box sx={{ position: 'absolute', top: '-100%', left: '5%', width: '15%', height: '350%', background: 'rgba(255,255,255,0.13)', transform: 'rotate(-45deg)', pointerEvents: 'none' }} />
                <Box sx={{ position: 'absolute', top: '-100%', right: '-25%', width: '55%', height: '350%', background: 'rgba(133, 125, 125, 0.06)', transform: 'rotate(-45deg)', pointerEvents: 'none' }} />
                <Box sx={{ position: 'absolute', top: '-100%', right: '-10%', width: '30%', height: '350%', background: 'rgba(226, 212, 212, 0.06)', transform: 'rotate(-45deg)', pointerEvents: 'none' }} />
                <Box sx={{ position: 'absolute', top: '-100%', right: '5%', width: '15%', height: '350%', background: 'rgba(235, 224, 224, 0.13)', transform: 'rotate(-45deg)', pointerEvents: 'none' }} />

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <Stack spacing={2.5}>
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
                                        border: '1px solid rgba(255,255,255,0.4)', '& .MuiChip-icon': { color: 'white' }
                                    }}
                                />
                            )}
                        </Stack>

                        <Typography
                            variant="h3"
                            fontWeight={700}
                            color="white"
                            sx={{
                                fontSize: { xs: '1.4rem', sm: '1.75rem', md: '2.25rem' },
                                textShadow: '0 2px 8px rgba(0,0,0,0.2)',
                                lineHeight: 1.3,
                            }}
                        >
                            {recruitmentPost.Name}
                        </Typography>

                        <Stack
                            direction="row"
                            flexWrap="wrap"
                            gap={1.5}
                            sx={{ mt: 1 }}
                        >
                            {[
                                { icon: <LocationOn sx={{ fontSize: 16 }} />, label: recruitmentPost.Province || 'Chưa cập nhật' },
                                { icon: <PeopleAlt sx={{ fontSize: 16 }} />, label: `${recruitmentPost.Quantity} chỉ tiêu` },
                                { icon: <AccessTime sx={{ fontSize: 16 }} />, label: `Hạn nộp: ${formatDate(recruitmentPost.RecruitmentToDate)}` },
                            ].map((item, i) => (
                                <Box
                                    key={i}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.75,
                                        bgcolor: 'rgba(255,255,255,0.2)',
                                        backdropFilter: 'blur(8px)',
                                        border: '1px solid rgba(255,255,255,0.35)',
                                        borderRadius: 10,
                                        px: 1,
                                        py: 0.5,
                                        color: 'white',
                                    }}
                                >
                                    {item.icon}
                                    <Typography variant="body2" fontWeight={500} color="white">
                                        {item.label}
                                    </Typography>
                                </Box>
                            ))}
                        </Stack>

                        <Box
                            sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 1.5,
                                bgcolor: 'rgba(255,255,255,0.15)',
                                border: '1px solid rgba(255,255,255,0.35)',
                                borderRadius: 2,
                                px: 2,
                                width: { xs: '100%', sm: 'fit-content' },
                                boxSizing: 'border-box',
                            }}
                        >
                            <AttachMoney sx={{ color: 'white', fontSize: { xs: 28, md: 32 }, flexShrink: 0 }} />
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography variant="caption" color="rgba(255,255,255,0.8)" fontWeight={500}>
                                    Học phí
                                </Typography>
                                <Stack
                                    direction={{ xs: 'column', sm: 'row' }}
                                    spacing={{ xs: 0.5, sm: 1 }}
                                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                                    flexWrap="wrap"
                                >
                                    {recruitmentPost.MinCost === recruitmentPost.MaxCost ? (
                                        <Typography variant="h6" fontWeight={700} color="white" sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>
                                            {formatCurrency(recruitmentPost.MinCost)} {recruitmentPost.Currency}
                                        </Typography>
                                    ) : (
                                        <Stack direction="row" spacing={0.5} alignItems="center" flexWrap="wrap">
                                            <Typography variant="h6" fontWeight={700} color="white" sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>
                                                {formatCurrency(recruitmentPost.MinCost)}
                                            </Typography>
                                            <Typography variant="body2" color="rgba(255,255,255,0.8)" fontWeight={500}>—</Typography>
                                            <Typography variant="h6" fontWeight={700} color="white" sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>
                                                {formatCurrency(recruitmentPost.MaxCost)}{recruitmentPost.Currency}
                                            </Typography>
                                        </Stack>
                                    )}
                                </Stack>
                            </Box>
                        </Box>
                    </Stack>
                </Container>
            </Box>

            <Container maxWidth="lg">
                <Grid container spacing={1}>
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Stack spacing={1}>
                            {recruitmentPost.Highlights && recruitmentPost.Highlights.length > 0 && (
                                <Box
                                    sx={{
                                        mt: 1.5,
                                        p: 1.5,
                                        borderRadius: 1.5,
                                        background: 'linear-gradient(135deg, #e3f2fd 0%, #f0f7ff 100%)',
                                        border: '1px solid #bbdefb',
                                    }}
                                >
                                    <Stack direction="row" spacing={0.75} alignItems="center" mb={1}>
                                        <Star sx={{ fontSize: 16, color: '#f59e0b' }} />
                                        <Typography
                                            variant="caption"
                                            fontWeight={700}
                                            color="primary.main"
                                            sx={{
                                                letterSpacing: 0.5,
                                                textTransform: 'uppercase',
                                                fontSize: '0.7rem'
                                            }}
                                        >
                                            Điểm nổi bật
                                        </Typography>
                                    </Stack>

                                    <Stack spacing={0.75}>
                                        {recruitmentPost.Highlights.map((item, idx) => (
                                            <Stack
                                                key={idx}
                                                direction="row"
                                                spacing={1}
                                                alignItems="center"
                                            >
                                                <Box
                                                    sx={{
                                                        width: 6,
                                                        height: 6,
                                                        borderRadius: "50%",
                                                        bgcolor: "#1976d2",
                                                        mt: "6px",
                                                        flexShrink: 0,
                                                    }}
                                                />

                                                <Typography
                                                    variant="body2"
                                                    color="text.primary"
                                                    lineHeight={1.55}
                                                    fontSize="0.82rem"
                                                    sx={{
                                                        wordBreak: "break-word",
                                                    }}
                                                >
                                                    {item}
                                                </Typography>
                                            </Stack>
                                        ))}
                                    </Stack>
                                </Box>
                            )}
                            <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid #e0e0e0' }}>
                                <CardContent sx={{ p: 2 }}>
                                    <Typography variant="h5" fontWeight={700} gutterBottom color="primary.main">Mô tả chi tiết</Typography>
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
                                    <Divider sx={{ my: 2 }} />

                                    <Stack
                                        direction={{ xs: 'column', sm: 'row' }}
                                        spacing={1.5}
                                        justifyContent="left"
                                    >
                                        <Button
                                            variant="contained"
                                            size="small"
                                            onClick={handleApplyClick}
                                            sx={{
                                                bgcolor: '#ff5722',
                                                fontWeight: 600,
                                                fontSize: 11,
                                                px: 1, '&:hover': { bgcolor: '#e64a19', transform: 'translateY(-2px)' },
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            Ứng tuyển ngay
                                        </Button>

                                        <Button
                                            variant={isSaved ? "contained" : "outlined"}
                                            size="small"
                                            startIcon={isSaving || isDeleting ? <CircularProgress size={18} color="inherit" /> : isSaved ? <Bookmark /> : <BookmarkBorder />}
                                            onClick={handleSaveToggle}
                                            disabled={isSaving || isDeleting}
                                            sx={{
                                                fontWeight: 600,
                                                px: 1,
                                                fontSize: 11,
                                                transition: 'all 0.25s ease',
                                                ...(isSaved ? { bgcolor: '#ff5722', borderColor: '#ff5722', color: 'white', '&:hover': { bgcolor: '#c62828', borderColor: '#c62828', color: 'white', }, } : { borderColor: '#ff5722', color: '#ff5722', '&:hover': { bgcolor: '#ff5722', color: 'white', }, }),
                                            }}
                                        >
                                            {isSaving ? 'Đang lưu...' : isDeleting ? 'Đang hủy...' : isSaved ? 'Đã lưu' : 'Lưu tin'}
                                        </Button>

                                        <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<Share />}
                                            onClick={handleShare}
                                            sx={{
                                                borderColor: '#ff5722',
                                                color: '#ff5722',
                                                fontWeight: 600,
                                                fontSize: 11,
                                                px: 1,
                                                '&:hover': { bgcolor: '#ff5722', color: 'white' }
                                            }}
                                        >
                                            Chia sẻ
                                        </Button>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Stack>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Box sx={{ position: 'sticky' }}>
                            <Stack spacing={1}>
                                {recruitmentPost.Requirement && (
                                    <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid #e0e0e0', overflow: 'hidden' }}>
                                        <Box
                                            sx={{
                                                px: 2.5,
                                                py: 1.5,
                                                background: 'linear-gradient(135deg, #1565c0 0%, #1e88e5 60%, #42a5f5 100%)',
                                            }}
                                        >
                                            <Typography variant="h6" fontWeight={700} color="white" sx={{ fontSize: '1rem' }}>Yêu cầu ứng viên</Typography>
                                        </Box>

                                        <CardContent sx={{ p: 1 }}>
                                            <Stack spacing={1}>
                                                <RequirementRow
                                                    icon={<Cake sx={{ fontSize: 20, color: '#ff5722' }} />}
                                                    label="Độ tuổi"
                                                    value={`${recruitmentPost.Requirement.FromAge} – ${recruitmentPost.Requirement.ToAge} tuổi`}
                                                    color="#fff3e0"
                                                />

                                                <RequirementRow
                                                    icon={<Wc sx={{ fontSize: 20, color: '#1976d2' }} />}
                                                    label="Giới tính"
                                                    value={ConvertService.convertGender(ConvertService.convertGenderFromString(recruitmentPost.Requirement.Gender))}
                                                    color="#e3f2fd"
                                                />

                                                <RequirementRow
                                                    icon={<Work sx={{ fontSize: 20, color: '#388e3c' }} />}
                                                    label="Kinh nghiệm"
                                                    value={ConvertService.convertJobExperience(ConvertService.convertJobExperienceFromString(recruitmentPost.Requirement.Experience))}
                                                    color="#e8f5e9"
                                                />

                                                <RequirementRow
                                                    icon={<School sx={{ fontSize: 20, color: '#7b1fa2' }} />}
                                                    label="Trình độ học vấn"
                                                    value={ConvertService.convertEducationLevel(ConvertService.convertEducationLevelFromString(recruitmentPost.Requirement.EducationLevel))}
                                                    color="#f3e5f5"
                                                />

                                                {recruitmentPost.Requirement.MinimumGpa != null && (
                                                    <RequirementRow
                                                        icon={<Typography sx={{ fontSize: 14, fontWeight: 800, color: '#f57c00', lineHeight: 1 }}>GPA</Typography>}
                                                        label="Điểm GPA tối thiểu"
                                                        value={`${recruitmentPost.Requirement.MinimumGpa}`}
                                                        color="#fff8e1"
                                                    />
                                                )}

                                                {recruitmentPost.Requirement.MaxYearsSinceGrad != null && (
                                                    <RequirementRow
                                                        icon={<AccessTime sx={{ fontSize: 20, color: '#0288d1' }} />}
                                                        label="Thời hạn tốt nghiệp tối đa"
                                                        value={`${recruitmentPost.Requirement.MaxYearsSinceGrad} năm`}
                                                        color="#e1f5fe"
                                                    />
                                                )}

                                                {recruitmentPost.Requirement.MaxAbsence != null && (
                                                    <RequirementRow
                                                        icon={<RunningWithErrors sx={{ fontSize: 20, color: '#c62828' }} />}
                                                        label="Số buổi nghỉ tối đa"
                                                        value={`${recruitmentPost.Requirement.MaxAbsence} buổi`}
                                                        color="#ffebee"
                                                    />
                                                )}
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                )}
                                {recruitmentPost.Organization && (
                                    <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid #e0e0e0' }}>
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
                                                    <Typography variant="h6" fontWeight={700} gutterBottom>{recruitmentPost.Organization.Name}</Typography>
                                                </Box>

                                                <Divider />

                                                <Stack spacing={2}>
                                                    <Stack direction="row" spacing={1.5} alignItems="flex-start">
                                                        <Business sx={{ color: 'text.secondary', fontSize: 20, mt: 0.3 }} />
                                                        <Box>
                                                            <Typography variant="caption" color="text.secondary" display="block">Mã số thuế</Typography>
                                                            <Typography variant="body2" fontWeight={500}>{recruitmentPost.Organization.TaxCode}</Typography>
                                                        </Box>
                                                    </Stack>

                                                    <Stack direction="row" spacing={1.5} alignItems="flex-start">
                                                        <LocationOn sx={{ color: 'text.secondary', fontSize: 20, mt: 0.3 }} />
                                                        <Box>
                                                            <Typography variant="caption" color="text.secondary" display="block">Địa chỉ</Typography>
                                                            <Typography variant="body2" fontWeight={500}>{recruitmentPost.Organization.Address}</Typography>
                                                        </Box>
                                                    </Stack>

                                                    {recruitmentPost.Organization.Summary && (
                                                        <Box>
                                                            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>Giới thiệu</Typography>
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
                                                    onClick={() => navigate(`/thong-tin-truong/${recruitmentPost.Organization.SeoUrl}`)}
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
                                                    Xem thông tin trường
                                                </Button>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                )}


                            </Stack>
                        </Box>
                    </Grid>
                </Grid>

                {relatedPosts && relatedPosts.Items && relatedPosts.Items.length > 0 && (
                    <Box sx={{ mt: 6 }}>
                        <Typography fontSize={20} fontWeight={700} gutterBottom color="primary.main">Tin tuyển sinh khác</Typography>

                        <Stack spacing={1}>
                            {relatedPosts.Items.filter(post => post.Id !== recruitmentPost.Id).slice(0, 6).map((post) => (
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
                                    onClick={() => navigate(`/chuong-trinh-tuyen-sinh/${post.SeoUrl}`)}
                                >
                                    <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                                        <Grid container>
                                            <Grid size={{ xs: 12, sm: 3, md: 2 }} sx={{
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

                                            <Grid size={{ xs: 12, sm: 9, md: 10 }}>
                                                <Box sx={{ p: 1 }}>
                                                    <Stack spacing={2}>
                                                        <Box>
                                                            <Typography
                                                                fontSize={18}
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
                                                                fontSize={14}
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

                                                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1.5, sm: 3 }} flexWrap="wrap">
                                                            <Stack direction="row" spacing={1} alignItems="center">
                                                                <LocationOn sx={{ color: 'text.secondary', fontSize: 20 }} />
                                                                <Typography variant="body2" color="text.secondary">{post.Province || 'Chưa cập nhật'}</Typography>
                                                            </Stack>

                                                            <Stack direction="row" spacing={1} alignItems="center">
                                                                <PeopleAlt sx={{ color: 'text.secondary', fontSize: 20 }} />
                                                                <Typography variant="body2" color="text.secondary">{post.Quantity} chỉ tiêu</Typography>
                                                            </Stack>

                                                            <Stack direction="row" spacing={1} alignItems="center">
                                                                <AccessTime sx={{ color: 'text.secondary', fontSize: 20 }} />
                                                                <Typography variant="body2" color="text.secondary">{formatDate(post.RecruitmentToDate)}</Typography>
                                                            </Stack>
                                                        </Stack>
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