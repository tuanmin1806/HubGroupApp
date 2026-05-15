import { lazy, useEffect, useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useGetOrganizationBySeoQuery } from "../../../app/features/organization.api";
import { useGetRecruitmentPostsByOrganizationWithPageQuery } from "../../../app/features/recruitment-post.api";
import { useCreateFollowMutation, useDeleteFollowMutation } from "../../../app/features/follow.api";
import { useAuthGuard } from "../../../hooks/useAuthGuard";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../../app/features/snackbar/snackbar.slice";
import { getUserInfo } from "../../../app/services/auth.service";
import { hasAccountType } from "../../../utils/auth.utils";
import { AccountType } from "../../../app/models/enums.model";
import { normalizeUrl } from "../../../utils/recruitment-post.utils";
import Facebook from "@mui/icons-material/Facebook";
import { LinkedIn, YouTube, Twitter, Instagram, Map } from "@mui/icons-material";
import { OrganizationHeader } from "../../../components/details/organization/OrganizationHeader";
import { OrganizationTabs } from "../../../components/details/organization/tabs/OrganizationTabs";
import { ContactInfoCard } from "../../../components/details/organization/cards/ContactInfoCard";
import { GeneralInfoCard } from "../../../components/details/organization/cards/GeneralInfoCard";
import { FeaturedGallerySidebar } from "../../../components/details/organization/cards/FeaturedGallerySidebar";

const OrganizationDetailPage = () => {
    const { seoUrl } = useParams<{ seoUrl: string }>();
    const [tabValue, setTabValue] = useState(0);
    const [isFollowed, setIsFollowed] = useState(false);

    const checkAuth = useAuthGuard();
    const dispatch = useDispatch();
    const userInfo = getUserInfo();
    const isAdminOrStaff = hasAccountType(AccountType.Manager) || hasAccountType(AccountType.Collaborator);

    const { data: organization, isLoading, error } = useGetOrganizationBySeoQuery(seoUrl!, { skip: !seoUrl });
    const { data: recruitmentPosts, isLoading: loadingPosts } = useGetRecruitmentPostsByOrganizationWithPageQuery(seoUrl!, { skip: !seoUrl });

    const [createFollow, { isLoading: isFollowing }] = useCreateFollowMutation();
    const [deleteFollow, { isLoading: isUnfollowing }] = useDeleteFollowMutation();

    useEffect(() => {
        if (organization?.Name) document.title = `${organization.Name} | duhochan.hubgroup.vn`;
    }, [organization?.Name]);

    const socialLinks = [
        { icon: <Facebook />, url: normalizeUrl(organization?.FacebookUrl || ""), label: "Facebook" },
        { icon: <LinkedIn />, url: normalizeUrl(organization?.LinkedinUrl || ""), label: "LinkedIn" },
        { icon: <YouTube />, url: normalizeUrl(organization?.YoutubeUrl || ""), label: "YouTube" },
        { icon: <Twitter />, url: normalizeUrl(organization?.TwitterUrl || ""), label: "Twitter" },
        { icon: <Instagram />, url: normalizeUrl(organization?.InstagramUrl || ""), label: "Instagram" },
        { icon: <Map />, url: normalizeUrl(organization?.GoogleMapUrl || ""), label: "Google Maps" },
    ].filter((s) => s.url);

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({ title: organization?.Name, url: window.location.href });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert("Đã copy link!");
        }
    };

    const handleFollowToggle = async () => {
        if (!checkAuth()) return;
        try {
            if (isFollowed) {
                await deleteFollow(organization?.FollowId || "").unwrap();
                setIsFollowed(false);
                dispatch(showSnackbar({ message: "Đã hủy theo dõi trường!", severity: "success" }));
            } else {
                await createFollow({
                    CustomerId: userInfo?.Id || "",
                    OrgId: organization?.Id || "",
                }).unwrap();
                setIsFollowed(true);
                dispatch(showSnackbar({ message: "Đã theo dõi trường thành công!", severity: "success" }));
            }
        } catch (err) {
            dispatch(showSnackbar({
                message: isFollowed ? "Hủy theo dõi thất bại, vui lòng thử lại!" : "Theo dõi thất bại, vui lòng thử lại!",
                severity: "error"
            }));
        }
    };

    if (isLoading) return <Box sx={{ p: 4, textAlign: 'center' }}><Typography>Đang tải...</Typography></Box>;
    if (error || !organization) return <Box sx={{ p: 4, textAlign: 'center' }}>Không tìm thấy tổ chức</Box>;

    return (
        <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
            {organization.WallpaperFullUrl && (
                <Box sx={{ p: { xs: 1, md: 1 }, maxWidth: 1200, mx: 'auto' }}>
                    <Box sx={{ maxWidth: 1200, mx: 'auto', height: { xs: 200, md: 300 }, backgroundImage: `url(${organization.WallpaperFullUrl})`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', borderRadius: 2, boxShadow: '0 6px 24px rgba(0,0,0,0.12)', }} />
                </Box>
            )}

            <Box sx={{ p: { xs: 1, md: 2 }, maxWidth: 1200, mx: 'auto' }}>
                <Stack spacing={2}>
                    <OrganizationHeader
                        organization={organization}
                        isFollowed={isFollowed}
                        isFollowing={isFollowing}
                        isUnfollowing={isUnfollowing}
                        isAdminOrStaff={isAdminOrStaff}
                        onFollowToggle={handleFollowToggle}
                    />

                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
                        <Box sx={{ flex: 1 }}>
                            <OrganizationTabs
                                tabValue={tabValue}
                                setTabValue={setTabValue}
                                organization={organization}
                                recruitmentPosts={recruitmentPosts}
                                loadingPosts={loadingPosts}
                                onShare={handleShare}
                            />
                        </Box>

                        <Box sx={{ width: { xs: '100%', md: 340 }, flexShrink: 0 }}>
                            <Stack spacing={2}>
                                <ContactInfoCard organization={organization} socialLinks={socialLinks} />
                                <GeneralInfoCard organization={organization} />
                                {organization.FeaturedImageFullUrls?.length > 0 && (
                                    <FeaturedGallerySidebar images={organization.FeaturedImageFullUrls} />
                                )}
                            </Stack>
                        </Box>
                    </Box>
                </Stack>
            </Box>
        </Box>
    );
};

export default OrganizationDetailPage;