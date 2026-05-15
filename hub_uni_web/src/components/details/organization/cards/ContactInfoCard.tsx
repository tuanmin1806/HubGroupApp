import { Link as MuiLink } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import LocationOn from "@mui/icons-material/LocationOn";
import Phone from "@mui/icons-material/Phone";
import Email from "@mui/icons-material/Email";
import Language from "@mui/icons-material/Language";
import Info from "@mui/icons-material/Info";
import { OrganizationDetailResponse } from "../../../../app/models/organization.model";

interface ContactInfoCardProps {
    organization: OrganizationDetailResponse;
    socialLinks: any[];
}

export const ContactInfoCard = ({ organization, socialLinks }: ContactInfoCardProps) => {
    return (
        <Card>
            <CardContent>
                <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                    <Info color="primary" />
                    <Typography fontWeight={600}>Thông tin liên hệ</Typography>
                </Stack>

                <Stack spacing={1.5}>
                    {organization.Address && (
                        <Stack direction="row" spacing={1} alignItems="flex-start">
                            <LocationOn fontSize="small" sx={{ mt: 0.5 }} />
                            <Typography variant="body2">{organization.Address}</Typography>
                        </Stack>
                    )}

                    {organization.PhoneNumber && (
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Phone fontSize="small" />
                            <MuiLink href={`tel:${organization.PhoneNumber}`} variant="body2" underline="hover">
                                {organization.PhoneNumber}
                            </MuiLink>
                        </Stack>
                    )}

                    {organization.Email && (
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Email fontSize="small" />
                            <MuiLink href={`mailto:${organization.Email}`} variant="body2" underline="hover">
                                {organization.Email}
                            </MuiLink>
                        </Stack>
                    )}

                    {organization.WebsiteUrl && (
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Language fontSize="small" />
                            <MuiLink href={organization.WebsiteUrl} target="_blank" variant="body2" underline="hover">
                                {organization.WebsiteUrl}
                            </MuiLink>
                        </Stack>
                    )}

                    {socialLinks.length > 0 && (
                        <>
                            <Divider sx={{ my: 1 }} />
                            <Stack direction="row" spacing={0.5} flexWrap="wrap">
                                {socialLinks.map((s: any, i: number) => (
                                    <MuiLink key={i} href={s.url} target="_blank" rel="noopener" sx={{ color: "inherit" }}>
                                        {s.icon}
                                    </MuiLink>
                                ))}
                            </Stack>
                        </>
                    )}
                </Stack>
            </CardContent>
        </Card>
    );
};