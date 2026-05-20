import AccessTime from "@mui/icons-material/AccessTime";
import AttachMoney from "@mui/icons-material/AttachMoney";
import Business from "@mui/icons-material/Business";
import Cake from "@mui/icons-material/Cake";
import Female from "@mui/icons-material/Female";
import LocationOn from "@mui/icons-material/LocationOn";
import Male from "@mui/icons-material/Male";
import PeopleAlt from "@mui/icons-material/PeopleAlt";
import Transgender from "@mui/icons-material/Transgender";
import Work from "@mui/icons-material/Work";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { useGetFavouriteRecruitPostByCustomerQuery } from "../../app/features/favourite.api";
import { FavouriteResponse } from "../../app/models/favourite.model";
import { Gender } from "../../app/models/enums.model";
import { ConvertService } from "../../app/services/convert.service";
import { BACK_GROUND_BUTTON_COLOR } from "../../constants/common.constant";

import { formatCurrency, getRecruitmentStatus } from "../../utils/recruitment-post.utils";
import { formatDate } from "../../utils/date.utils";
import { getUserInfo } from "../../app/services/auth.service";
import LoadingOverlay from "../general/loading-overlay";

function FavouriteRecruitPostCard({ app }: { app: FavouriteResponse }) {
    const navigate = useNavigate();
    const post = app.RecruitmentPost;

    return (
        <Paper
            elevation={0}
            onClick={() => navigate(`/chuong-trinh-tuyen-sinh/${post?.SeoUrl}`)}
            sx={{
                p: 2,
                borderRadius: 2,
                border: "1px solid",
                borderColor: post?.IsTop ? '#faa11b' : '#dbd8d8',
                cursor: "pointer",
                transition: "all 0.2s ease",
                "&:hover": {
                    borderColor: post?.IsTop ? "#faa11b" : "divider",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    transform: "translateY(-2px)",
                },
            }}
        >
            <Stack spacing={1.25}>
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <Box
                        sx={{
                            width: { xs: 52, sm: 60 },
                            height: { xs: 52, sm: 60 },
                            borderRadius: 1.5,
                            backgroundColor: "#f5f5f5",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            overflow: "hidden",
                            border: "1px solid",
                            borderColor: "divider",
                        }}
                    >
                        {post?.Organization?.LogoFullUrl ? (
                            <Box
                                component="img"
                                src={post.Organization.LogoFullUrl}
                                alt={post.Organization.Name}
                                sx={{ width: "100%", height: "100%", objectFit: "contain" }}
                            />
                        ) : (
                            <Business sx={{ fontSize: 26, color: "text.secondary" }} />
                        )}
                    </Box>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Stack direction="row" alignItems="flex-start" gap={1} flexWrap="wrap">
                            <Typography
                                variant="subtitle1"
                                fontWeight={700}
                                sx={{
                                    fontSize: { xs: "0.9rem", sm: "1rem" },
                                    lineHeight: 1.35,
                                    flex: 1,
                                    minWidth: 0,
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                }}
                            >
                                {post?.Name ?? "Chương trình tuyển sinh"}
                            </Typography>
                            {post?.IsTop && (
                                <Chip
                                    label="Nổi bật"
                                    size="small"
                                    sx={{
                                        height: 20, fontSize: "0.62rem", fontWeight: 700, flexShrink: 0,
                                        alignSelf: "flex-start", bgcolor: "#f3522a", color: "#ffffff", border: "none",
                                    }}
                                />
                            )}
                        </Stack>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            fontWeight={500}
                            sx={{
                                fontSize: { xs: "0.78rem", sm: "0.82rem" }, mt: 0.25,
                                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                            }}
                        >
                            {post?.Organization?.Name ?? "—"}
                        </Typography>

                        <Stack direction="row" flexWrap="wrap" gap={{ xs: 0.75, sm: 1.5 }} mt={0.5}>
                            {post?.Province && (
                                <Stack direction="row" spacing={0.4} alignItems="center">
                                    <LocationOn sx={{ fontSize: 14, color: "#faa11b" }} />
                                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.72rem" }}>
                                        {post.Province}
                                    </Typography>
                                </Stack>
                            )}
                            {post?.Quantity && (
                                <Stack direction="row" spacing={0.4} alignItems="center">
                                    <PeopleAlt sx={{ fontSize: 14, color: "#faa11b" }} />
                                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.72rem" }}>
                                        {post.Quantity} Chỉ tiêu
                                    </Typography>
                                </Stack>
                            )}
                            {(post?.MinCost || post?.MaxCost) && (
                                <Stack direction="row" spacing={0.4} alignItems="center">
                                    <AttachMoney sx={{ fontSize: 14, color: "#faa11b" }} />
                                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.72rem", whiteSpace: "nowrap" }}>
                                        {post.MinCost && post.MaxCost && post.MinCost !== post.MaxCost
                                            ? `${formatCurrency(post.MinCost)} - ${formatCurrency(post.MaxCost)} ${post.Currency ?? ""}`
                                            : `${formatCurrency(post.MinCost || post.MaxCost)} ${post.Currency ?? ""}`}
                                    </Typography>
                                </Stack>
                            )}
                            {post?.RecruitmentToDate && (
                                <Stack direction="row" spacing={0.4} alignItems="center">
                                    <AccessTime sx={{ fontSize: 14, color: getRecruitmentStatus(post.RecruitmentToDate).color }} />
                                    <Typography variant="caption" sx={{ fontSize: "0.72rem", color: getRecruitmentStatus(post.RecruitmentToDate).color }}>
                                        {formatDate(post.RecruitmentToDate)}
                                    </Typography>
                                </Stack>
                            )}
                        </Stack>
                    </Box>
                </Stack>

                {post?.Professions && post.Professions.length > 0 && (
                    <Stack direction="row" flexWrap="wrap" gap={0.5}>
                        {post.Professions.slice(0, 3).map((profession) => (
                            <Chip
                                key={profession.Id}
                                label={profession.Name}
                                size="small"
                                variant="outlined"
                                sx={{
                                    height: 20, fontSize: "0.65rem",
                                    borderColor: "#f36730", color: "#f36730",
                                    "& .MuiChip-label": { px: 0.75 },
                                }}
                            />
                        ))}
                        {post.Professions.length > 3 && (
                            <Chip
                                label={`+${post.Professions.length - 3}`}
                                size="small"
                                variant="outlined"
                                sx={{ height: 20, fontSize: "0.65rem", "& .MuiChip-label": { px: 0.75 } }}
                            />
                        )}
                    </Stack>
                )}

                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    flexWrap={{ xs: "wrap", sm: "nowrap" }}
                    gap={1}
                >
                    {post?.Requirement && (
                        <Stack direction="row" flexWrap="wrap" gap={{ xs: 0.5, sm: 1.5 }}>
                            {post.Requirement.Gender && (
                                <Typography variant="caption" color="text.secondary"
                                    sx={{ fontSize: "0.7rem", display: "flex", alignItems: "center", gap: 0.5 }}>
                                    {post.Requirement.Gender === Gender.Male
                                        ? <Male sx={{ fontSize: "0.8rem" }} />
                                        : post.Requirement.Gender === Gender.Female
                                            ? <Female sx={{ fontSize: "0.8rem" }} />
                                            : <Transgender sx={{ fontSize: "0.8rem" }} />}
                                    {post.Requirement.Gender === Gender.Male ? "Nam"
                                        : post.Requirement.Gender === Gender.Female ? "Nữ"
                                            : "Không yêu cầu"}
                                </Typography>
                            )}
                            {post.Requirement.FromAge != null && post.Requirement.ToAge != null && (
                                <Typography variant="caption" color="text.secondary"
                                    sx={{ fontSize: "0.7rem", display: "flex", alignItems: "center", gap: 0.5 }}>
                                    <Cake sx={{ fontSize: "0.8rem" }} />
                                    {post.Requirement.FromAge === post.Requirement.ToAge
                                        ? `${post.Requirement.FromAge} tuổi`
                                        : `${post.Requirement.FromAge} đến ${post.Requirement.ToAge} tuổi`}
                                </Typography>
                            )}
                            {post.Requirement.Experience && (
                                <Typography variant="caption" color="text.secondary"
                                    sx={{ fontSize: "0.7rem", display: "flex", alignItems: "center", gap: 0.5 }}>
                                    <Work sx={{ fontSize: "0.8rem" }} />
                                    {ConvertService.convertJobExperience(ConvertService.convertJobExperienceFromString(post.Requirement.Experience))}
                                </Typography>
                            )}
                        </Stack>
                    )}

                    <Stack direction="row" spacing={0.75} flexShrink={0} sx={{ ml: "auto" }}>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={() => window.open(`/chuong-trinh-tuyen-sinh/${post.SeoUrl}`, "_blank")}
                            sx={{
                                backgroundColor: BACK_GROUND_BUTTON_COLOR,
                                borderRadius: 1.5, fontSize: "0.72rem",
                                px: 1.5, height: 30, textTransform: "none", fontWeight: 600,
                            }}
                        >
                            Xem chi tiết
                        </Button>
                    </Stack>
                </Stack>
            </Stack>
        </Paper>
    );
}

export default function FavouriteRecruitPostListPanel() {
    const navigate = useNavigate();
    const userInfo = getUserInfo();
    const { data, isLoading, isError } = useGetFavouriteRecruitPostByCustomerQuery({ customerId: userInfo?.Id ?? "" });

    return (
        <LoadingOverlay
            open={isLoading}
            error={isError}
            empty={!data?.Items?.length}
            emptyVariant="post"
            emptyTitle="Chưa có chương trình tuyển sinh nào được lưu"
            emptyDescription="Hãy khám phá các chương trình tuyển sinh và lưu lại ngay!"
            emptyAction={<Button variant="contained" disableElevation onClick={() => navigate("/chuong-trinh-tuyen-sinh")} sx={{ bgcolor: "#f36730", borderRadius: 2, textTransform: "none", fontWeight: 600, "&:hover": { bgcolor: "#e05520" }, }}>Xem chương trình tuyển sinh</Button>}
        >
            <Box>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5, fontSize: "1rem" }}>
                    Danh sách chương trình tuyển sinh đã lưu
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: "0.8rem" }}>
                    {data?.Items?.length ?? 0} chương trình đã lưu
                </Typography>
                <Stack spacing={1.25}>
                    {data?.Items?.map((app: FavouriteResponse) => (
                        <FavouriteRecruitPostCard key={app.Id} app={app} />
                    ))}
                </Stack>
            </Box>
        </LoadingOverlay>
    );
}