import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Business from "@mui/icons-material/Business";
import { OrganizationDetailResponse } from "../../../../app/models/organization.model";

interface GeneralInfoCardProps {
    organization: OrganizationDetailResponse;
}

export const GeneralInfoCard = ({ organization }: GeneralInfoCardProps) => {
    return (
        <Card>
            <CardContent>
                <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                    <Business color="primary" />
                    <Typography fontWeight={600}>Thông tin chung</Typography>
                </Stack>

                <Stack spacing={1.5}>
                    {organization.OrganizationType && (
                        <Box>
                            <Typography variant="caption" color="text.secondary">Loại hình:</Typography>
                            <Typography variant="body2">{organization.OrganizationType}</Typography>
                        </Box>
                    )}

                    {organization.TaxCode && (
                        <Box>
                            <Typography variant="caption" color="text.secondary">Mã số thuế:</Typography>
                            <Typography variant="body2">{organization.TaxCode}</Typography>
                        </Box>
                    )}

                    {organization.Province && organization.Commune && (
                        <Box>
                            <Typography variant="caption" color="text.secondary">Khu vực:</Typography>
                            <Typography variant="body2">{organization.Commune}, {organization.Province}</Typography>
                        </Box>
                    )}

                    {organization.ManagedBy && (
                        <Box>
                            <Typography variant="caption" color="text.secondary">Quản lý bởi:</Typography>
                            <Typography variant="body2">{organization.ManagedBy}</Typography>
                        </Box>
                    )}
                </Stack>
            </CardContent>
        </Card>
    );
};