import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import CardGiftcard from "@mui/icons-material/CardGiftcard";
import EmojiEvents from "@mui/icons-material/EmojiEvents";
import Star from "@mui/icons-material/Star";
import LanguageIcon from "@mui/icons-material/Language";
import { Flight, Percent } from "@mui/icons-material";
import { OrganizationDetailResponse, Scholarship } from "../../../../app/models/organization.model";

interface ScholarshipTabProps {
    organization: OrganizationDetailResponse;
}

export const ScholarshipTab = ({ organization }: ScholarshipTabProps) => {
    const scholarships = organization.Scholarships || [];

    return (
        <Box sx={{ p: { xs: 1.5, md: 2 } }}>
            <Box sx={{ mb: 1.5 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 36, height: 36, borderRadius: '10px', background: 'linear-gradient(135deg, #1565c0 0%, #42a5f5 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CardGiftcard sx={{ fontSize: 22, color: '#fff' }} />
                    </Box>
                    <Typography variant="h6" fontWeight={700}>Học bổng</Typography>
                </Stack>
            </Box>

            {scholarships.length > 0 ? (
                <Stack spacing={1}>
                    {scholarships.map((scholarship: Scholarship) => (
                        <Box
                            key={scholarship.Id}
                            sx={{
                                position: 'relative',
                                overflow: 'hidden',
                                borderRadius: 3,
                                background: 'linear-gradient(135deg, #1565c0 0%, #1e88e5 60%, #42a5f5 100%)',
                                p: { xs: 1.5, sm: 2 },
                                transition: 'all .25s ease',
                                boxShadow: '0 4px 14px rgba(21,101,192,0.18)',
                                '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 10px 28px rgba(21,101,192,0.25)', },
                            }}
                        >
                            {/* glow background */}
                            <Box sx={{ position: 'absolute', top: -50, right: -50, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', }} />
                            <Box sx={{ position: 'relative', zIndex: 1 }}>
                                {/* Header */}
                                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1} mb={1.5} >
                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                        <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                                            <EmojiEvents sx={{ fontSize: 22, color: '#fff', flexShrink: 0, }} />
                                            <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#fff', lineHeight: 1.3 }}>
                                                {scholarship.Name}
                                            </Typography>
                                        </Stack>

                                        {scholarship.Description && (
                                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.82)', lineHeight: 1.6, fontSize: '0.8rem', }}>
                                                {scholarship.Description}
                                            </Typography>
                                        )}
                                    </Box>
                                </Stack>

                                <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)', my: 1.5, }} />

                                {/* Info grid */}
                                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', }, gap: 1.25, }}>
                                    {/* GPA */}
                                    <Stack direction="row" spacing={1.2} alignItems="center" sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.08)', }}>
                                        <Box sx={{ width: 30, height: 30, borderRadius: 1.5, bgcolor: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, }}>
                                            <Star sx={{ fontSize: 20, color: '#fff' }} />
                                        </Box>

                                        <Box sx={{ minWidth: 0 }}>
                                            <Typography sx={{ color: 'rgba(255,255,255,0.72)', fontSize: '0.68rem', lineHeight: 1.2, }}>
                                                GPA yêu cầu
                                            </Typography>

                                            <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '0.85rem', }}>
                                                {scholarship.Gpa}
                                            </Typography>
                                        </Box>
                                    </Stack>

                                    {/* Language */}
                                    {scholarship.LanguageLevel && (
                                        <Stack direction="row" spacing={1.2} alignItems="center" sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.08)', }}>
                                            <Box sx={{ width: 30, height: 30, borderRadius: 1.5, bgcolor: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, }}>
                                                <LanguageIcon sx={{ fontSize: 20, color: '#fff', }} />
                                            </Box>

                                            <Box sx={{ minWidth: 0 }}>
                                                <Typography sx={{ color: 'rgba(255,255,255,0.72)', fontSize: '0.68rem', lineHeight: 1.2, }}>
                                                    Ngoại ngữ
                                                </Typography>

                                                <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '0.85rem', }}>
                                                    {scholarship.LanguageLevel}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    )}

                                    {/* Visa */}
                                    {scholarship.VisaType && (
                                        <Stack direction="row" spacing={1.2} alignItems="center" sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.08)', }}>
                                            <Box sx={{ width: 30, height: 30, borderRadius: 1.5, bgcolor: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, }}>
                                                <Flight sx={{ fontSize: 20, color: '#fff', }} />
                                            </Box>

                                            <Box sx={{ minWidth: 0 }}>
                                                <Typography sx={{ color: 'rgba(255,255,255,0.72)', fontSize: '0.68rem', lineHeight: 1.2, }}>
                                                    Visa
                                                </Typography>

                                                <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '0.85rem', }}>
                                                    {scholarship.VisaType}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    )}
                                    {scholarship.Percentage && (
                                        <Stack direction="row" spacing={1.2} alignItems="center" sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.08)', }}>
                                            <Box sx={{ width: 30, height: 30, borderRadius: 1.5, bgcolor: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, }}>
                                                <Percent sx={{ fontSize: 20, color: '#fff', }} />
                                            </Box>

                                            <Box sx={{ minWidth: 0 }}>
                                                <Typography sx={{ color: 'rgba(255,255,255,0.72)', fontSize: '0.68rem', lineHeight: 1.2, }}>
                                                    Hỗ trợ
                                                </Typography>

                                                <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '0.85rem', }}>
                                                    {scholarship.Percentage}% học phí
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    )}
                                </Box>
                            </Box>
                        </Box>
                    ))}
                </Stack>
            ) : (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                    <CardGiftcard sx={{ fontSize: 56, color: 'text.disabled', mb: 2 }} />
                    <Typography color="text.secondary">Chưa có thông tin học bổng</Typography>
                </Box>
            )}
        </Box>
    );
};