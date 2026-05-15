import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import School from "@mui/icons-material/School";
import Business from "@mui/icons-material/Business";
import { ConvertService } from "../../../../app/services/convert.service";

interface TuitionTabProps {
    organization: any;
}

export const TuitionTab = ({ organization }: TuitionTabProps) => {
    return (
        <Box sx={{ p: { xs: 1, md: 1.5 } }}>
            <Box sx={{ mb: 2 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 36, height: 36, borderRadius: '10px', background: 'linear-gradient(135deg, #1565c0 0%, #42a5f5 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <School sx={{ fontSize: 20, color: '#fff' }} />
                    </Box>
                    <Typography variant="h6" fontWeight={700}>Học phí các ngành</Typography>
                </Stack>
            </Box>

            <Stack spacing={2}>
                {organization.MainProfession && (
                    <Box sx={{ position: 'relative', borderRadius: 2.5, background: 'linear-gradient(135deg, #1565c0 0%, #1e88e5 60%, #42a5f5 100%)', p: { xs: 1, md: 1.5 }, overflow: 'hidden' }}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1} sx={{ position: 'relative', zIndex: 1 }}>
                            <Box>
                                <Chip label="Ngành thế mạnh" size="small" sx={{ mb: 1, bgcolor: 'rgba(255,255,255,0.18)', color: '#fff', fontWeight: 600, fontSize: '0.68rem' }} />
                                <Typography variant="subtitle1" fontWeight={700} color="#fff" lineHeight={1.3}>
                                    {organization.MainProfession.ProfessionName}
                                </Typography>
                            </Box>
                            <Box sx={{ bgcolor: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 2, px: 2, py: 1, textAlign: { xs: 'left', sm: 'right' } }}>
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.75)', display: 'block', fontSize: '0.68rem' }}>Học phí</Typography>
                                <Typography variant="h6" fontWeight={800} color="#fff" sx={{ letterSpacing: '-0.5px' }}>
                                    {ConvertService.formatCurrencyVND(organization.MainProfession.Cost)}
                                    <Typography component="span" variant="caption" sx={{ color: 'rgba(255,255,255,0.8)', ml: 0.5 }}>{organization.Currency}</Typography>
                                </Typography>
                            </Box>
                        </Stack>
                    </Box>
                )}

                {organization.Professions && organization.Professions.length > 0 && (
                    <Box>
                        <Typography variant="caption" fontWeight={700} sx={{ mb: 1, display: 'block' }}>Các ngành khác</Typography>
                        <Stack spacing={1}>
                            {organization.Professions.map((p: any) => (
                                <Box key={p.ProfessionId} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 1.5, py: 1, borderRadius: 2, border: '1px solid', borderColor: 'divider', bgcolor: '#fafafa', '&:hover': { borderColor: 'primary.light', bgcolor: '#f0f7ff' } }}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: 'primary.main' }} />
                                        <Typography variant="body2" fontWeight={500}>{p.ProfessionName}</Typography>
                                    </Stack>
                                    <Typography variant="body2" fontWeight={700} color="primary.dark">
                                        {ConvertService.formatCurrencyVND(p.Cost)} <Typography component="span" variant="caption" color="text.secondary">{organization.Currency}</Typography>
                                    </Typography>
                                </Box>
                            ))}
                        </Stack>
                    </Box>
                )}

                {organization.DormCost && (
                    <Box sx={{ borderRadius: 2, border: '1px dashed', borderColor: 'primary.light', bgcolor: '#f8fbff', p: 1 }}>
                        <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                            <Box sx={{ width: 28, height: 28, borderRadius: '8px', bgcolor: '#e3f2fd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Business sx={{ fontSize: 16, color: 'primary.main' }} />
                            </Box>
                            <Typography variant="subtitle2" fontWeight={700}>Phí ký túc xá</Typography>
                        </Stack>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#fff', borderRadius: 1.5, px: 2, py: 1.25, border: '1px solid #e3f2fd' }}>
                            <Typography variant="body2" color="text.secondary">Chi phí ký túc xá</Typography>
                            <Typography variant="body1" fontWeight={700} color="primary.dark">
                                {ConvertService.formatCurrencyVND(organization.DormCost)} <Typography component="span" variant="caption" color="text.secondary">{organization.Currency}</Typography>
                            </Typography>
                        </Box>
                    </Box>
                )}
            </Stack>
        </Box>
    );
};