import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import { useNavigate } from "react-router-dom";
import LocationOn from "@mui/icons-material/LocationOn";
import AccessTime from "@mui/icons-material/AccessTime";
import PeopleAlt from "@mui/icons-material/PeopleAlt";
import WorkOutline from "@mui/icons-material/WorkOutline";
import { formatDate } from "../../../../utils/date.utils";

interface RecruitmentTabProps {
    recruitmentPosts: any;
    loadingPosts: boolean;
}

export const RecruitmentTab = ({ recruitmentPosts, loadingPosts }: RecruitmentTabProps) => {
    const navigate = useNavigate();

    if (loadingPosts) {
        return <Box sx={{ textAlign: 'center', py: 6 }}><Typography>Đang tải...</Typography></Box>;
    }

    return (
        <Box sx={{ p: 2 }}>
            {recruitmentPosts?.Items?.length > 0 ? (
                <Stack spacing={1.5}>
                    {recruitmentPosts.Items.map((post: any) => (
                        <Card
                            key={post.Id}
                            variant="outlined"
                            sx={{ cursor: 'pointer', '&:hover': { transform: 'translateY(-2px)' } }}
                            onClick={() => navigate(`/chuong-trinh-tuyen-sinh/${post.SeoUrl}`)}
                        >
                            <CardContent>
                                <Typography variant="body1" fontWeight={600} gutterBottom>
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
                            </CardContent>
                        </Card>
                    ))}
                </Stack>
            ) : (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <WorkOutline sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                    <Typography color="text.secondary">Chưa có chương trình tuyển sinh nào</Typography>
                </Box>
            )}
        </Box>
    );
};