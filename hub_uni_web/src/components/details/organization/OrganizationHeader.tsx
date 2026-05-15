import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import Favorite from "@mui/icons-material/Favorite";
import CircularProgress from "@mui/material/CircularProgress";
import { HighlightsInline } from "./cards/HighlightsInline";
import { OrganizationDetailResponse } from "../../../app/models/organization.model";

interface OrganizationHeaderProps {
    organization: OrganizationDetailResponse;
    isFollowed: boolean;
    isFollowing: boolean;
    isUnfollowing: boolean;
    isAdminOrStaff: boolean;
    onFollowToggle: () => void;
}

export const OrganizationHeader = ({ organization, isFollowed, isFollowing, isUnfollowing, isAdminOrStaff, onFollowToggle }: OrganizationHeaderProps) => {
    return (
        <Card>
            <CardContent>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'center', sm: 'flex-start' }, textAlign: { xs: 'center', sm: 'left' }, gap: 1.5 }}>
                    {organization.LogoFullUrl && (
                        <Box component="img" src={organization.LogoFullUrl} loading="lazy" alt={organization.Name} sx={{ width: { xs: 60, sm: 80 }, height: { xs: 60, sm: 80 }, borderRadius: 2, objectFit: 'cover', border: '1px solid #e0e0e0', flexShrink: 0 }} />
                    )}

                    <Box sx={{ flex: 1, minWidth: 0, width: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: { xs: 'center', sm: 'flex-start' }, justifyContent: 'space-between', gap: 1, flexWrap: 'wrap', flexDirection: { xs: 'column', sm: 'row' } }}>
                            <Box sx={{ flex: 1, minWidth: 0, width: { xs: '100%', sm: 'auto' } }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', sm: 'flex-start' }, gap: 1, flexWrap: 'wrap' }}>
                                    <Typography variant="h5" fontWeight={600} sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.75rem' }, lineHeight: 1.3, textAlign: { xs: 'center', sm: 'left' } }}>
                                        {organization.Name}
                                    </Typography>

                                    {organization.IsTop && (
                                        <Chip label="Nổi bật" size="small" sx={{ fontWeight: 700, fontSize: '0.65rem', height: 20, bgcolor: '#1975d1', color: '#fff', flexShrink: 0 }} />
                                    )}
                                </Box>

                                <Box sx={{ mt: 0.5, display: 'flex', justifyContent: { xs: 'center', sm: 'flex-start' }, gap: 1 }}>
                                    <Chip label={organization.MainProfession?.ProfessionName} size="small" sx={{ fontWeight: 600, fontSize: '0.75rem', height: 22, bgcolor: '#e3f2fd', color: '#1976d2', maxWidth: { xs: '90%', sm: '100%' }, '& .MuiChip-label': { px: 1, overflow: 'hidden', textOverflow: 'ellipsis' } }} />
                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: { xs: "center", sm: "flex-start" }, gap: 0.5 }}>
                                        <PeopleAltIcon sx={{ fontSize: 16, color: "text.secondary", }} />
                                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.75rem", fontWeight: 500, }}>
                                            {organization.FollowCount || 0} người theo dõi
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>

                            {!isAdminOrStaff && (
                                <Tooltip title={isFollowed ? "Bỏ theo dõi" : "Theo dõi"}>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        startIcon={isFollowing || isUnfollowing ? (<CircularProgress size={16} color="inherit" />) : isFollowed ? (<Favorite fontSize="small" />) : (<PlaylistAddIcon fontSize="small" />)}
                                        onClick={onFollowToggle}
                                        disabled={isFollowing || isUnfollowing}
                                        sx={{
                                            textTransform: "none", fontSize: { xs: "0.75rem", sm: "0.8rem" }, borderRadius: "8px", minWidth: { xs: "100%", sm: "auto" }, boxShadow: "none", alignSelf: { xs: 'center', sm: 'flex-start' },
                                            ...(isFollowed ? { bgcolor: "#e4e6eb", color: "#050505", "&:hover": { bgcolor: "#d8dadf", }, } : { bgcolor: "#1877F2", color: "#fff", "&:hover": { bgcolor: "#166fe5", }, }),
                                        }}
                                    >
                                        {isFollowing ? "Đang theo dõi..." : isUnfollowing ? "Đang hủy..." : isFollowed ? "Đang theo dõi" : "Theo dõi"}
                                    </Button>
                                </Tooltip>
                            )}
                        </Box>
                    </Box>
                </Box>

                {organization.Highlights && organization.Highlights.length > 0 ? (<HighlightsInline highlights={organization.Highlights} />) : organization.Summary ? (
                    <Box sx={{ mt: 1, p: 1, bgcolor: 'action.hover', borderRadius: 1 }}>
                        <Typography variant="body2" color="text.secondary" lineHeight={1}>
                            {organization.Summary}
                        </Typography>
                    </Box>
                ) : null}
            </CardContent>
        </Card>

    );
};