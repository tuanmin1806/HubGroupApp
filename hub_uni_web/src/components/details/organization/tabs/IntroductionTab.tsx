import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Language from "@mui/icons-material/Language";
import Share from "@mui/icons-material/Share";

interface IntroductionTabProps {
    organization: any;
    onShare: () => void;
}

export const IntroductionTab = ({ organization, onShare }: IntroductionTabProps) => {
    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>Giới thiệu chi tiết</Typography>
            <Divider sx={{ mb: 2 }} />

            {organization.Description ? (
                <Box
                    sx={{
                        '& img': { maxWidth: '100%', height: 'auto', borderRadius: 1, my: 2 },
                        '& h1, & h2, & h3': { mt: 3, mb: 2 },
                        '& p': { mb: 2, lineHeight: 1.7 },
                    }}
                    dangerouslySetInnerHTML={{ __html: organization.Description }}
                />
            ) : (
                <Typography color="text.secondary">Chưa có thông tin giới thiệu chi tiết</Typography>
            )}

            <Box sx={{ mt: 4 }}>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Button
                        variant="contained"
                        startIcon={<Language />}
                        component="a"
                        href={organization.WebsiteUrl}
                        target="_blank"
                        disabled={!organization.WebsiteUrl}
                    >
                        Truy cập website
                    </Button>
                    <Button variant="outlined" startIcon={<Share />} onClick={onShare}>
                        Chia sẻ
                    </Button>
                </Stack>
            </Box>
        </Box>
    );
};