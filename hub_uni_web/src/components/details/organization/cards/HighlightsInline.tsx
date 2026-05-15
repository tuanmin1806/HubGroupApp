import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Star from "@mui/icons-material/Star";

interface HighlightsInlineProps {
    highlights: string[];
}

export const HighlightsInline = ({ highlights }: HighlightsInlineProps) => {
    if (!highlights || highlights.length === 0) return null;

    return (
        <Box sx={{ mt: 1.5, p: 1.5, borderRadius: 1.5, background: 'linear-gradient(135deg, #e3f2fd 0%, #f0f7ff 100%)', border: '1px solid #bbdefb' }}>
            <Stack direction="row" spacing={0.75} alignItems="center" mb={1}>
                <Star sx={{ fontSize: 16, color: '#f59e0b' }} />
                <Typography variant="caption" fontWeight={700} color="primary.main" sx={{ letterSpacing: 0.5, textTransform: 'uppercase', fontSize: '0.7rem' }}>
                    Điểm nổi bật
                </Typography>
            </Stack>

            <Stack spacing={0.75}>
                {highlights.map((item, idx) => (
                    <Stack key={idx} direction="row" spacing={1} alignItems="center">
                        <Box sx={{ width: 6, height: 6, borderRadius: "50%", background: "linear-gradient(135deg, #42a5f5, #1976d2)", mt: "6px", flexShrink: 0 }} />
                        <Typography variant="body2" color="text.primary" lineHeight={1.55} fontSize="0.82rem" sx={{ wordBreak: "break-word" }}>
                            {item}
                        </Typography>
                    </Stack>
                ))}
            </Stack>
        </Box>
    );
};