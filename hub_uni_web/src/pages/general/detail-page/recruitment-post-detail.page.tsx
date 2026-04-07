import { lazy } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Favorite from "@mui/icons-material/Favorite"
import FavoriteBorder from "@mui/icons-material/FavoriteBorder"
import LocationOn from "@mui/icons-material/LocationOn";
import Share from "@mui/icons-material/Share";
import AccessTime from "@mui/icons-material/AccessTime";
import Work from "@mui/icons-material/Work";
import AttachMoney from "@mui/icons-material/AttachMoney";
import School from "@mui/icons-material/School";
import Cake from "@mui/icons-material/Cake";
import Wc from "@mui/icons-material/Wc";
import Business from "@mui/icons-material/Business";
import CheckCircle from "@mui/icons-material/CheckCircle";
import PeopleAlt from "@mui/icons-material/PeopleAlt";
import Star from "@mui/icons-material/Star";
import RunningWithErrors from "@mui/icons-material/RunningWithErrors";
import Flight from "@mui/icons-material/Flight";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import { useAuthGuard } from "../../../hooks/useAuthGuard";
import { formatDate } from "../../../utils/date.utils";
import { ConvertService } from "../../../app/services/convert.service";
import { formatCurrency } from "../../../utils/recruitment-post.utils";
import { getUserInfo } from "../../../app/services/auth.service";
import { showSnackbar } from "../../../app/features/snackbar/snackbar.slice";
import { AppDispatch } from "../../../app/store";
import { useDispatch } from "react-redux";
import { hasAccountType } from "../../../utils/auth.utils";
import { AccountType } from "../../../app/models/enums.model";
import { useGetRecruitmentPostBySeoQuery, useGetRecruitmentPostsByPageQuery } from "../../../app/features/recruitment-post.api";
import { useCreateFavouriteMutation, useDeleteFavouriteMutation } from "../../../app/features/favourite.api";
import { useDeleteApplicationMutation } from "../../../app/features/application.api";
const ApplyConfirmDialog = lazy(() => import("../../../components/dialogs/general/apply-confirm-dialog.dialog"));

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
    const [showButton, setShowButton] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const checkAuth = useAuthGuard();
    const [applyDialogOpen, setApplyDialogOpen] = useState(false);
    const [createFavourite, { isLoading: isSaving }] = useCreateFavouriteMutation();
    const [deleteFavourite, { isLoading: isDeleting }] = useDeleteFavouriteMutation();
    const [deleteApplication, { isLoading: isDeletingApply }] = useDeleteApplicationMutation();
    const [isSaved, setIsSaved] = useState(false);
    const userInfo = getUserInfo();
    const isAdminOrStaff = hasAccountType(AccountType.Manager) || hasAccountType(AccountType.Collaborator);

    const { data: recruitmentPost, isLoading, error } = useGetRecruitmentPostBySeoQuery(seoUrl!, { skip: !seoUrl, });
    const { data: relatedPosts, isLoading: isLoadingRelated } = useGetRecruitmentPostsByPageQuery({ page: 1, size: 6, });

    useEffect(() => { if (recruitmentPost?.Name) document.title = `${recruitmentPost?.Name} | duhochan.hubgroup.vn`; }, [recruitmentPost?.Name]);
    useEffect(() => { if (recruitmentPost?.IsSaved !== undefined) { setIsSaved(recruitmentPost.IsSaved); } }, [recruitmentPost?.IsSaved]);

    useEffect(() => {
        const handleScroll = () => {
            setShowButton(window.scrollY > 1000);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleSaveToggle = async () => {
        if (!checkAuth()) return;
        try {
            if (isSaved) {
                await deleteFavourite(recruitmentPost?.SaveId || "").unwrap();
                setIsSaved(false);
                dispatch(showSnackbar({ message: "Đã hủy lưu chương trình tuyển sinh!", severity: "success" }));
            } else {
                await createFavourite({
                    CustomerId: userInfo?.Id || "",
                    RecruitPostId: recruitmentPost?.Id || "",
                }).unwrap();
                setIsSaved(true);
                dispatch(showSnackbar({ message: "Đã lưu chương trình tuyển sinh thành công!", severity: "success" }));
            }
        } catch (err) {
            dispatch(showSnackbar({ message: isSaved ? "Hủy lưu tin thất bại, vui lòng thử lại!" : "Lưu tin thất bại, vui lòng thử lại!", severity: "error" }));
        }
    };

    const handleApplyClick = async () => {
        if (!checkAuth()) return;

        try {
            if (recruitmentPost?.Applied) {
                await deleteApplication(recruitmentPost?.ApplicationId || "").unwrap();
                dispatch(showSnackbar({ message: "Đã hủy ứng tuyển!", severity: "success" }));
            } else {
                setApplyDialogOpen(true);
            }
        } catch (err) {
            dispatch(showSnackbar({ message: "Hủy ứng tuyển thất bại, vui lòng thử lại!", severity: "error" }));
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
                <Typography variant="h5" color="error" gutterBottom>Không tìm thấy thông tin chương trình tuyển sinh</Typography>
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
                                    label="Chương trình tuyển sinh nổi bật"
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
                                        {!isAdminOrStaff && (
                                            <Button
                                                variant="contained"
                                                size="small"
                                                onClick={handleApplyClick}
                                                disabled={isDeletingApply}
                                                startIcon={isDeletingApply ? <CircularProgress size={16} color="inherit" /> : recruitmentPost.Applied ? <CheckCircle sx={{ fontSize: 16 }} /> : undefined}
                                                sx={{
                                                    fontWeight: 600,
                                                    fontSize: 12,
                                                    px: 2,
                                                    py: 0.5,
                                                    bgcolor: recruitmentPost.Applied ? '#9e9e9e' : '#ff5722',
                                                    color: 'white',
                                                    cursor: isDeletingApply ? 'not-allowed' : 'pointer',
                                                    '&:hover': { bgcolor: recruitmentPost.Applied ? '#757575' : '#e64a19', transform: 'translateY(-2px)' }
                                                }}
                                            >
                                                {isDeletingApply ? 'Đang hủy...' : recruitmentPost.Applied ? 'Đã ứng tuyển' : 'Ứng tuyển ngay'}
                                            </Button>
                                        )}
                                        {!isAdminOrStaff && (
                                            <Button
                                                variant={isSaved ? "contained" : "outlined"}
                                                size="small"
                                                startIcon={isSaving || isDeleting ? <CircularProgress size={18} color="inherit" /> : isSaved ? <Favorite /> : <FavoriteBorder />}
                                                onClick={handleSaveToggle}
                                                disabled={isSaving || isDeleting}
                                                sx={{
                                                    fontWeight: 600,
                                                    px: 2,
                                                    py: 0.5,
                                                    fontSize: 12,
                                                    transition: 'all 0.25s ease',
                                                    ...(isSaved ? { bgcolor: '#ff5722', borderColor: '#ff5722', color: 'white', '&:hover': { bgcolor: '#ff3c00ff', borderColor: '#ff3c00ff', color: 'white', }, } : { borderColor: '#ff5722', color: '#ff5722', '&:hover': { bgcolor: '#ff5722', color: 'white', }, }),
                                                }}
                                            >
                                                {isSaving ? 'Đang lưu...' : isDeleting ? 'Đang hủy...' : isSaved ? 'Đã lưu' : 'Lưu tin'}
                                            </Button>
                                        )}

                                        <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<Share />}
                                            onClick={handleShare}
                                            sx={{
                                                borderColor: '#ff5722',
                                                color: '#ff5722',
                                                fontWeight: 600,
                                                fontSize: 12,
                                                px: 2,
                                                py: 0.5,
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
                                                    value={
                                                        recruitmentPost.Requirement.FromAge || recruitmentPost.Requirement.ToAge ? `${recruitmentPost.Requirement.FromAge ? `Từ ${recruitmentPost.Requirement.FromAge}` : ""}
                                                        ${recruitmentPost.Requirement.FromAge && recruitmentPost.Requirement.ToAge ? " – " : ""}
                                                        ${recruitmentPost.Requirement.ToAge ? `Đến ${recruitmentPost.Requirement.ToAge}` : ""} tuổi` : "Không yêu cầu"
                                                    }
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

                                                {recruitmentPost.Requirement.VisaType != null && (
                                                    <RequirementRow
                                                        icon={<Flight sx={{ fontSize: 20, color: '#b950ffff' }} />}
                                                        label="Loại Visa"
                                                        value={`${recruitmentPost.Requirement.VisaType}`}
                                                        color="#fad3e2ff"
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
                        <Typography fontSize={20} fontWeight={700} gutterBottom color="primary.main">Chương trình tuyển sinh khác</Typography>

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
                requirement={recruitmentPost.Requirement}
            />
            {!isAdminOrStaff && showButton && (
                <Box
                    sx={{
                        position: "fixed",
                        bottom: { xs: 0, sm: 20 },
                        left: { xs: 0, sm: "50%" },
                        transform: { xs: "none", sm: "translateX(-50%)" },
                        width: { xs: "100%", sm: "auto" },
                        px: { xs: 2, sm: 0 },
                        py: { xs: 1.5, sm: 0 },
                        bgcolor: { xs: "rgba(255,255,255,0.95)", sm: "transparent" },
                        backdropFilter: { xs: "blur(10px)", sm: "none" },
                        borderTop: { xs: "1px solid #eee", sm: "none" },
                        zIndex: 1300,
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <Button
                        fullWidth={true}
                        variant="contained"
                        onClick={handleApplyClick}
                        disabled={isDeletingApply}
                        startIcon={isDeletingApply ? <CircularProgress size={16} color="inherit" /> : recruitmentPost.Applied ? <CheckCircle /> : undefined}
                        sx={{
                            position: "relative",
                            borderRadius: { xs: 2, sm: 10 },
                            px: 3,
                            py: 1,
                            fontWeight: 700,
                            fontSize: 15,
                            color: "#fff",

                            background: recruitmentPost.Applied ? "#9e9e9e" : "linear-gradient(45deg, #ff5722, #ff8a50)",

                            boxShadow: recruitmentPost.Applied ? "none" : "0 0 0 rgba(255,87,34, 0.7)",

                            animation: recruitmentPost.Applied ? "none" : "pulse 1.8s infinite",

                            "&:hover": {
                                background: recruitmentPost.Applied ? "#757575" : "linear-gradient(45deg, #e64a19, #ff7043)",
                                transform: "translateY(-2px) scale(1.03)",
                            },

                            "@keyframes shake": {
                                "0%": { transform: "translateX(0)" },
                                "25%": { transform: "translateX(-2px)" },
                                "50%": { transform: "translateX(2px)" },
                                "75%": { transform: "translateX(-2px)" },
                                "100%": { transform: "translateX(0)" },
                            },

                            "@keyframes pulse": {
                                "0%": { boxShadow: "0 0 0 0 rgba(255,87,34, 0.7)", },
                                "70%": { boxShadow: "0 0 0 12px rgba(255,87,34, 0)", },
                                "100%": { boxShadow: "0 0 0 0 rgba(255,87,34, 0)", },
                            },

                            animationDelay: "0s, 1s",
                            animationIterationCount: "1, infinite",
                            animationName: recruitmentPost.Applied ? "none" : "shake, pulse",
                            animationDuration: "0.4s, 1.2s",
                        }}
                    >
                        {isDeletingApply ? "Đang xử lý..." : recruitmentPost.Applied ? "Đã ứng tuyển" : "Ứng tuyển ngay !"}
                    </Button>
                </Box>
            )}
        </Box>
    );
}

export default RecruitmentPostDetailPage;