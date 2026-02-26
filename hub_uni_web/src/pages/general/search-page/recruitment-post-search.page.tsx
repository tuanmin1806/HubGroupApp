import { useState } from "react";
import {
    Box,
    Container,
    Typography,
    Paper,
    Stack,
    Chip,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Divider,
    Button,
    Skeleton,
    Grid,
    IconButton,
} from "@mui/material";
import {
    WorkOutline,
    LocationOn,
    Business,
    CalendarToday,
    FilterList,
    Clear,
    FavoriteBorder,
    PeopleAlt,
    Wc,
    Male,
    Transgender,
    Cake,
    Work,
    Female,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useGetAllProfessionNoAuthenQuery } from "../../../app/features/profession.api";
import { useGetAllProvinceNoAuthenQuery } from "../../../app/features/province.api";
import { useGetRecruitmentPostsByPageQuery } from "../../../app/features/recruitment-post.api";
import OrganizationPagination from "../../../components/pagination/organization-pagination";
import SearchBar from "../../../components/searchs/search-bar.search";
import { BACK_GROUND_BUTTON_COLOR, DEFAULT_PAGE, PAGE_SIZE } from "../../../constants/common.constant";

const RecruitmentPostSearchPage = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(DEFAULT_PAGE);
    const [filters, setFilters] = useState({
        searchValue: "",
        provinceId: "",
        professionId: "",
    });

    const { data: recruitmentData, isLoading } = useGetRecruitmentPostsByPageQuery({
        page,
        size: PAGE_SIZE,
        ...filters,
    });

    const { data: provinces = [] } = useGetAllProvinceNoAuthenQuery();
    const { data: professions = [] } = useGetAllProfessionNoAuthenQuery();

    const totalPages = recruitmentData ? Math.ceil(recruitmentData.Total / PAGE_SIZE) : 1;
    const recruitmentPosts = recruitmentData?.Items || [];

    const handleSearch = (searchValue: string, provinceId: string) => {
        setFilters((prev) => ({ ...prev, searchValue, provinceId }));
        setPage(DEFAULT_PAGE);
    };

    const handleProvinceChange = (provinceId: string) => {
        setFilters((prev) => ({ ...prev, provinceId }));
        setPage(DEFAULT_PAGE);
    };

    const handleProfessionChange = (professionId: string) => {
        setFilters((prev) => ({ ...prev, professionId }));
        setPage(DEFAULT_PAGE);
    };

    const handleClearFilters = () => {
        setFilters({
            searchValue: "",
            provinceId: "",
            professionId: "",
        });
        setPage(DEFAULT_PAGE);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const hasActiveFilters = filters.provinceId || filters.professionId || filters.searchValue;

    return (
        <Box sx={{ backgroundColor: "#f8f9fa", minHeight: "100vh", py: 3 }}>
            <Container maxWidth="lg">
                {/* Search Bar */}
                <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
                    <SearchBar onSearch={handleSearch} />
                </Box>

                {/* Header */}
                <Box mb={3}>
                    <Typography variant="h5" fontWeight={700} gutterBottom>
                        Tìm kiếm tin tuyển sinh
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    {/* Sidebar Filters */}
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2.5,
                                borderRadius: 2,
                                border: "1px solid",
                                borderColor: "divider",
                                position: "sticky",
                                top: 20,
                            }}
                        >
                            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <FilterList sx={{ fontSize: 20 }} />
                                    <Typography variant="h6" fontWeight={700} sx={{ fontSize: "1.1rem" }}>
                                        Bộ lọc
                                    </Typography>
                                </Stack>
                                {hasActiveFilters && (
                                    <Button
                                        variant="text"
                                        size="small"
                                        startIcon={<Clear sx={{ fontSize: 16 }} />}
                                        onClick={handleClearFilters}
                                        sx={{ fontSize: "0.75rem", minWidth: 0, px: 1, py: 0.25}}
                                    >
                                        Xóa
                                    </Button>
                                )}
                            </Stack>

                            <Divider sx={{ mb: 2 }} />

                            {/* Province Filter */}
                            <FormControl component="fieldset" fullWidth sx={{ mb: 3 }}>
                                <FormLabel
                                    sx={{
                                        fontWeight: 600,
                                        fontSize: "0.9rem",
                                        color: "text.primary",
                                        mb: 1,
                                    }}
                                >
                                    <LocationOn sx={{ fontSize: 16, mr: 0.5, verticalAlign: "middle" }} />
                                    Tỉnh / Thành phố
                                </FormLabel>
                                <Box sx={{
                                    maxHeight: 300,
                                    overflowY: "auto",
                                    pr: 1
                                }}>
                                    <RadioGroup
                                        value={filters.provinceId}
                                        onChange={(e) => handleProvinceChange(e.target.value)}
                                    >
                                        <FormControlLabel
                                            value=""
                                            control={<Radio size="small" />}
                                            label={<Typography variant="body2">Tất cả</Typography>}
                                        />
                                        {provinces.map((province) => (
                                            <FormControlLabel
                                                key={province.Id}
                                                value={province.Id}
                                                control={<Radio size="small" />}
                                                label={<Typography variant="body2">{province.Name}</Typography>}
                                            />
                                        ))}
                                    </RadioGroup>
                                </Box>
                            </FormControl>

                            <Divider sx={{ mb: 2 }} />

                            {/* Profession Filter */}
                            <FormControl component="fieldset" fullWidth>
                                <FormLabel
                                    sx={{
                                        fontWeight: 600,
                                        fontSize: "0.9rem",
                                        color: "text.primary",
                                        mb: 1,
                                    }}
                                >
                                    <Business sx={{ fontSize: 16, mr: 0.5, verticalAlign: "middle" }} />
                                    Ngành nghề
                                </FormLabel>
                                <Box sx={{
                                    maxHeight: 300,
                                    overflowY: "auto",
                                    pr: 1
                                }}>
                                    <RadioGroup
                                        value={filters.professionId}
                                        onChange={(e) => handleProfessionChange(e.target.value)}
                                    >
                                        <FormControlLabel
                                            value=""
                                            control={<Radio size="small" />}
                                            label={<Typography variant="body2">Tất cả</Typography>}
                                        />
                                        {professions.map((profession) => (
                                            <FormControlLabel
                                                key={profession.Id}
                                                value={profession.Id}
                                                control={<Radio size="small" />}
                                                label={<Typography variant="body2">{profession.Name}</Typography>}
                                            />
                                        ))}
                                    </RadioGroup>
                                </Box>
                            </FormControl>
                        </Paper>
                    </Grid>

                    {/* Job Listings */}
                    <Grid size={{ xs: 12, md: 9 }}>
                        {isLoading ? (
                            <Stack spacing={2}>
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Skeleton key={i} variant="rectangular" height={160} sx={{ borderRadius: 2 }} />
                                ))}
                            </Stack>
                        ) : recruitmentPosts.length === 0 ? (
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 6,
                                    textAlign: "center",
                                    borderRadius: 2,
                                    border: "1px solid",
                                    borderColor: "divider",
                                }}
                            >
                                <WorkOutline sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                    Không tìm thấy vị trí tuyển dụng
                                </Typography>
                                <Typography variant="body2" color="text.secondary" mb={2}>
                                    Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm
                                </Typography>
                                {hasActiveFilters && (
                                    <Button
                                        variant="outlined"
                                        startIcon={<Clear />}
                                        onClick={handleClearFilters}
                                        sx={{ mt: 1 }}
                                    >
                                        Xóa bộ lọc
                                    </Button>
                                )}
                            </Paper>
                        ) : (
                            <>
                                <Stack spacing={2} mb={4}>
                                    {recruitmentPosts.map((post) => (
                                        <Paper
                                            key={post.Id}
                                            elevation={0}
                                            onClick={() => navigate(`/tin-tuyen-sinh/${post.SeoUrl}`)}
                                            sx={{
                                                p: 2.5,
                                                borderRadius: 2,
                                                border: "1px solid",
                                                borderColor: "divider",
                                                cursor: "pointer",
                                                transition: "all 0.2s ease",
                                                "&:hover": {
                                                    borderColor: post.IsTop ? "#faa11b" : "divider",
                                                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                                                    transform: "translateY(-2px)",
                                                },
                                            }}
                                        >
                                            <Stack spacing={1.25}>
                                                {/* Header row */}
                                                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                                                    {/* Logo */}
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
                                                        {post.Organization.LogoFullUrl ? (
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

                                                    {/* Main info */}
                                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                                        {/* Title + badge */}
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
                                                                {post.Name}
                                                            </Typography>

                                                            {post.IsTop && (
                                                                <Chip
                                                                    label="Nổi bật"
                                                                    size="small"
                                                                    sx={{
                                                                        height: 20,
                                                                        fontSize: "0.62rem",
                                                                        fontWeight: 700,
                                                                        flexShrink: 0,
                                                                        alignSelf: "flex-start",
                                                                        bgcolor: "#f3522a",
                                                                        color: "#ffffff",
                                                                        border: "none",
                                                                    }}
                                                                />
                                                            )}
                                                        </Stack>

                                                        {/* Org name */}
                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                            fontWeight={500}
                                                            sx={{
                                                                fontSize: { xs: "0.78rem", sm: "0.82rem" },
                                                                mt: 0.25,
                                                                overflow: "hidden",
                                                                textOverflow: "ellipsis",
                                                                whiteSpace: "nowrap",
                                                            }}
                                                        >
                                                            {post.Organization.Name}
                                                        </Typography>

                                                        {/* Meta row: location, quantity, deadline */}
                                                        <Stack
                                                            direction="row"
                                                            flexWrap="wrap"
                                                            gap={{ xs: 0.75, sm: 1.5 }}
                                                            mt={0.5}
                                                        >
                                                            <Stack direction="row" spacing={0.4} alignItems="center">
                                                                <LocationOn sx={{ fontSize: 14, color: "text.disabled" }} />
                                                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.72rem" }}>
                                                                    {post.Province}
                                                                </Typography>
                                                            </Stack>

                                                            <Stack direction="row" spacing={0.4} alignItems="center">
                                                                <PeopleAlt sx={{ fontSize: 14, color: "text.disabled" }} />
                                                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.72rem" }}>
                                                                    {post.Quantity} Chỉ tiêu
                                                                </Typography>
                                                            </Stack>

                                                            {post.RecruitmentToDate && (
                                                                <Stack direction="row" spacing={0.4} alignItems="center">
                                                                    <CalendarToday sx={{ fontSize: 14, color: "text.disabled" }} />
                                                                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.72rem" }}>
                                                                        Hạn: {formatDate(post.RecruitmentToDate)}
                                                                    </Typography>
                                                                </Stack>
                                                            )}
                                                        </Stack>
                                                    </Box>
                                                </Stack>

                                                {/* Professions */}
                                                {post.Professions && post.Professions.length > 0 && (
                                                    <Stack direction="row" flexWrap="wrap" gap={0.5}>
                                                        {post.Professions.slice(0, 3).map((profession) => (
                                                            <Chip
                                                                key={profession.Id}
                                                                label={profession.Name}
                                                                size="small"
                                                                variant="outlined"
                                                                sx={{
                                                                    height: 20,
                                                                    fontSize: "0.65rem",
                                                                    borderColor: "primary.light",
                                                                    color: "primary.main",
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

                                                {/* Footer: requirements + actions */}
                                                <Stack
                                                    direction="row"
                                                    alignItems="center"
                                                    justifyContent="space-between"
                                                    flexWrap={{ xs: "wrap", sm: "nowrap" }}
                                                    gap={1}
                                                >
                                                    {/* Requirements */}
                                                    {post.Requirement && (
                                                        <Stack direction="row" flexWrap="wrap" gap={{ xs: 0.5, sm: 1.5 }}>
                                                            {post.Requirement.Gender && (
                                                                <Typography variant="caption" color="text.disabled" sx={{ fontSize: "0.7rem", display: "flex", alignItems: "center", gap: 0.5 }}>
                                                                    {post.Requirement.Gender === "Male" ? (<Male sx={{ fontSize: "0.9rem" }} />) : post.Requirement.Gender === "Female" ? (<Female sx={{ fontSize: "0.9rem" }} />) : (<Transgender sx={{ fontSize: "0.9rem" }} />)}
                                                                    {post.Requirement.Gender === "Male" ? "Nam" : post.Requirement.Gender === "Female" ? "Nữ" : "Không yêu cầu"}
                                                                </Typography>
                                                            )}
                                                            {post.Requirement.FromAge && post.Requirement.ToAge && (
                                                                <Typography variant="caption" color="text.disabled" sx={{ fontSize: "0.7rem", display: "flex", alignItems: "center", gap: 0.5 }}>
                                                                    <Cake sx={{ fontSize: "0.9rem" }} /> {post.Requirement.FromAge}–{post.Requirement.ToAge}
                                                                </Typography>
                                                            )}
                                                            {post.Requirement.Experience && (
                                                                <Typography variant="caption" color="text.disabled" sx={{ fontSize: "0.7rem", display: "flex", alignItems: "center", gap: 0.5 }}>
                                                                    <Work sx={{ fontSize: "0.9rem" }} /> {post.Requirement.Experience}
                                                                </Typography>
                                                            )}
                                                        </Stack>
                                                    )}

                                                    {/* Actions */}
                                                    <Stack
                                                        direction="row"
                                                        spacing={0.75}
                                                        flexShrink={0}
                                                        sx={{ ml: "auto" }}
                                                    >
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                navigate(`/tin-tuyen-sinh/${post.SeoUrl}`);
                                                            }}
                                                            sx={{
                                                                backgroundColor: BACK_GROUND_BUTTON_COLOR,
                                                                borderRadius: 1.5,
                                                                fontSize: "0.72rem",
                                                                px: 1.5,
                                                                height: 30,
                                                                textTransform: "none",
                                                                fontWeight: 600,
                                                            }}
                                                        >
                                                            Ứng tuyển
                                                        </Button>
                                                        <IconButton
                                                            size="small"
                                                            color="primary"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                            }}
                                                            sx={{
                                                                border: "1px solid",
                                                                borderColor: "primary.light",
                                                                borderRadius: 1.5,
                                                                width: 30,
                                                                height: 30,
                                                            }}
                                                        >
                                                            <FavoriteBorder sx={{ fontSize: 16 }} />
                                                        </IconButton>
                                                    </Stack>
                                                </Stack>
                                            </Stack>
                                        </Paper>
                                    ))}
                                </Stack>

                                {/* Pagination */}
                                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                                    <OrganizationPagination
                                        page={page}
                                        totalPages={totalPages}
                                        onPrev={() => setPage((p) => Math.max(1, p - 1))}
                                        onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    />
                                </Box>
                            </>
                        )}
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default RecruitmentPostSearchPage;