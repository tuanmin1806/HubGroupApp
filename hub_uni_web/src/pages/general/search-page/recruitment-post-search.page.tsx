import { useEffect, useState } from "react";
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
    CircularProgress,
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
    Category,
    LocationCity,
    AccessTime,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useGetAllProvinceNoAuthenQuery } from "../../../app/features/province.api";
import { useGetRecruitmentPostsByPageQuery } from "../../../app/features/recruitment-post.api";
import OrganizationPagination from "../../../components/pagination/organization-pagination";
import SearchBar from "../../../components/searchs/search-bar.search";
import { BACK_GROUND_BUTTON_COLOR, DEFAULT_PAGE, PAGE_SIZE } from "../../../constants/common.constant";
import { useGetProfessionsByPageQuery } from "../../../app/features/professtion.api";
import { getRecruitmentStatus } from "../../../utils/recruitment-post.utils";
import { ConvertService } from "../../../app/services/convert.service";
export interface RecruitmentPostFilterParams {
    page?: number;
    size?: number;
    searchValue?: string;
    professionId?: string;
    provinceId?: string;
}
const RecruitmentPostSearchPage = () => {
    const navigate = useNavigate();
    const FILTER_PAGE_SIZE = 10;
    const [page, setPage] = useState(DEFAULT_PAGE);
    const [professionPage, setProfessionPage] = useState(1);

    const [showAllProfessions, setShowAllProfessions] = useState(false);
    const [showAllProvinces, setShowAllProvinces] = useState(false);
    const searchParams = new URLSearchParams(location.search);
    const initialProvinceSeo = searchParams.get('provinceSeo') || '';
    const [selectedProvinceSeo, setSelectedProvinceSeo] = useState(initialProvinceSeo);
    const handleLoadMoreProfessions = () => { setProfessionPage(prev => prev + 1); };
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

    const { data: professionsData, isLoading: isLoadingProfessions } = useGetProfessionsByPageQuery({ page: professionPage, size: FILTER_PAGE_SIZE, });
    const { data: provinces, isLoading: isLoadingProvinces } = useGetAllProvinceNoAuthenQuery();

    const [allProfessions, setAllProfessions] = useState<any[]>([]);

    const totalPages = recruitmentData ? Math.ceil(recruitmentData.Total / PAGE_SIZE) : 1;
    const recruitmentPosts = recruitmentData?.Items || [];

    const handleFilterChange = (field: keyof RecruitmentPostFilterParams, value: string) => {
        if (field === 'provinceId' && value !== filters.provinceId) {
            const province = provinces?.find(p => p.Id === value);
            setSelectedProvinceSeo(province?.Seo || '');
            setFilters(prev => ({ ...prev, provinceId: value }));
        } else {
            setFilters({ ...filters, [field]: value });
        }
        setPage(DEFAULT_PAGE);
    };


    const handleSearch = (query?: string, provinceSeo?: string) => {
        if (query !== undefined) {
            setFilters(prev => ({ ...prev, searchValue: query }));
        }
        if (provinceSeo !== undefined && provinceSeo !== selectedProvinceSeo) {
            setSelectedProvinceSeo(provinceSeo);
            const province = provinces?.find(p => p.Seo === provinceSeo);
            setFilters(prev => ({
                ...prev,
                provinceId: province?.Id || '',
            }));
        }
        setPage(DEFAULT_PAGE);
    };

    const handleClearFilters = () => {
        setFilters({
            searchValue: "",
            provinceId: "",
            professionId: "",
        });
        setSelectedProvinceSeo('');
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

    useEffect(() => {
        if (professionsData?.Items) {
            setAllProfessions(prev => {
                const existingIds = new Set(prev.map(item => item.Id));
                const newItems = professionsData.Items.filter(item => !existingIds.has(item.Id));
                return [...prev, ...newItems];
            });
        }
    }, [professionsData]);

    useEffect(() => {
        if (initialProvinceSeo && provinces && provinces.length > 0 && !filters.provinceId) {
            const province = provinces.find(p => p.Seo === initialProvinceSeo);
            if (province) {
                setFilters(prev => ({ ...prev, provinceId: province.Id }));
            }
        }
    }, [provinces]);

    const hasMoreProfessions = professionsData && (allProfessions.length < professionsData.Total);
    const hasActiveFilters = filters.provinceId || filters.professionId || filters.searchValue;

    return (
        <Box sx={{ backgroundColor: "#f8f9fa", minHeight: "100vh", py: 3 }}>
            <Container maxWidth="lg">
                {/* Search Bar */}
                <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
                    <SearchBar
                        onSearch={handleSearch}
                        initialQuery={filters.searchValue}
                        initialProvinceSeo={selectedProvinceSeo}
                    />
                </Box>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
                    <Box
                        sx={{
                            width: { xs: "100%", md: 300 },
                            flexShrink: 0,
                        }}
                    >
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2.5,
                                borderRadius: 2,
                                border: "1px solid",
                                borderColor: "divider",
                                position: { md: "sticky" },
                                top: 24,
                            }}
                        >
                            {/* Header */}
                            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <FilterList sx={{ fontSize: 20 }} />
                                    <Typography variant="h6" fontWeight={700} sx={{ fontSize: "1.1rem" }}>
                                        Bộ lọc
                                    </Typography>
                                </Stack>
                                {hasActiveFilters && (
                                    <Button
                                        size="small"
                                        startIcon={<Clear sx={{ fontSize: 16 }} />}
                                        onClick={handleClearFilters}
                                        sx={{ fontSize: "0.75rem", minWidth: 0, px: 1 }}
                                    >
                                        Xóa
                                    </Button>
                                )}
                            </Stack>

                            <Divider sx={{ mb: 2 }} />

                            {/* Ngành nghề */}
                            <FormControl component="fieldset" fullWidth sx={{ mb: 3 }}>
                                <FormLabel
                                    sx={{
                                        fontWeight: 600,
                                        fontSize: "0.9rem",
                                        color: "text.primary",
                                        mb: 1,
                                    }}
                                >
                                    <Category sx={{ fontSize: 16, mr: 0.5, verticalAlign: "middle" }} />
                                    Ngành nghề
                                </FormLabel>
                                <Box sx={{ maxHeight: showAllProfessions ? 400 : 'auto', overflowY: "auto", pr: 1 }}>
                                    {isLoadingProfessions && allProfessions.length === 0 ? (
                                        <Box sx={{ display: 'flex', alignItems: 'center', py: 2 }}>
                                            <CircularProgress size={20} sx={{ mr: 1 }} />
                                            <Typography variant="body2" color="text.secondary">Đang tải...</Typography>
                                        </Box>
                                    ) : (
                                        <RadioGroup
                                            value={filters.professionId}
                                            onChange={(e) => handleFilterChange("professionId", e.target.value)}
                                        >
                                            <FormControlLabel
                                                value=""
                                                control={<Radio size="small" />}
                                                label={<Typography variant="body2">Tất cả</Typography>}
                                            />
                                            {(showAllProfessions ? allProfessions : allProfessions.slice(0, 5)).map((profession) => (
                                                <FormControlLabel
                                                    key={profession.Id}
                                                    value={profession.Id}
                                                    control={<Radio size="small" />}
                                                    label={<Typography variant="body2">{profession.Name}</Typography>}
                                                />
                                            ))}
                                        </RadioGroup>
                                    )}
                                    {hasMoreProfessions && !showAllProfessions && allProfessions.length >= 5 && (
                                        <Button
                                            size="small"
                                            onClick={handleLoadMoreProfessions}
                                            disabled={isLoadingProfessions}
                                            sx={{
                                                mt: 1,
                                                fontSize: "0.75rem",
                                                textTransform: "none",
                                                color: "primary.main"
                                            }}
                                        >
                                            {isLoadingProfessions ? <CircularProgress size={16} /> : "Xem thêm"}
                                        </Button>
                                    )}
                                    {allProfessions.length > 5 && (
                                        <Button
                                            size="small"
                                            onClick={() => setShowAllProfessions(!showAllProfessions)}
                                            sx={{
                                                mt: 1,
                                                fontSize: "0.75rem",
                                                textTransform: "none",
                                                color: "primary.main"
                                            }}
                                        >
                                            {showAllProfessions ? "Thu gọn" : "Xem thêm"}
                                        </Button>
                                    )}
                                </Box>
                            </FormControl>

                            <Divider sx={{ mb: 2 }} />

                            {/* Tỉnh / Thành phố */}
                            <FormControl component="fieldset" fullWidth sx={{ mb: 3 }}>
                                <FormLabel
                                    sx={{
                                        fontWeight: 600,
                                        fontSize: "0.9rem",
                                        color: "text.primary",
                                        mb: 1,
                                    }}
                                >
                                    <LocationCity sx={{ fontSize: 16, mr: 0.5, verticalAlign: "middle" }} />
                                    Tỉnh / Thành phố
                                </FormLabel>
                                <Box sx={{ maxHeight: showAllProvinces ? 400 : 'auto', overflowY: "auto", pr: 1 }}>
                                    {isLoadingProvinces ? (
                                        <Box sx={{ display: 'flex', alignItems: 'center', py: 2 }}>
                                            <CircularProgress size={20} sx={{ mr: 1 }} />
                                            <Typography variant="body2" color="text.secondary">Đang tải...</Typography>
                                        </Box>
                                    ) : (
                                        <RadioGroup
                                            value={filters.provinceId}
                                            onChange={(e) => handleFilterChange("provinceId", e.target.value)}
                                        >
                                            <FormControlLabel
                                                value=""
                                                control={<Radio size="small" />}
                                                label={<Typography variant="body2">Tất cả</Typography>}
                                            />
                                            {(showAllProvinces ? provinces : provinces?.slice(0, 5))?.map((province) => (
                                                <FormControlLabel
                                                    key={province.Id}
                                                    value={province.Id}
                                                    control={<Radio size="small" />}
                                                    label={<Typography variant="body2">{province.Name}</Typography>}
                                                />
                                            ))}
                                        </RadioGroup>
                                    )}
                                    {provinces && provinces.length > 5 && (
                                        <Button
                                            size="small"
                                            onClick={() => setShowAllProvinces(!showAllProvinces)}
                                            sx={{
                                                mt: 1,
                                                fontSize: "0.75rem",
                                                textTransform: "none",
                                                color: "primary.main"
                                            }}
                                        >
                                            {showAllProvinces ? "Thu gọn" : "Xem thêm"}
                                        </Button>
                                    )}
                                </Box>
                            </FormControl>
                        </Paper>
                    </Box>

                    {/* Job Listings */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        {isLoading ? (
                            <Box sx={{ textAlign: 'center', py: 8 }}>
                                <CircularProgress size={48} />
                                <Typography sx={{ mt: 2 }}>Đang tải...</Typography>
                            </Box>
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
                                            onClick={() => navigate(`/chuong-trinh-tuyen-sinh/${post.SeoUrl}`)}
                                            sx={{
                                                p: 2.5,
                                                borderRadius: 2,
                                                border: "1px solid",
                                                borderColor: post.IsTop ? '#faa11b' : 'transparent',
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
                                                                <LocationOn sx={{ fontSize: 14, color: "#faa11b" }} />
                                                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.72rem" }}>
                                                                    {post.Province}
                                                                </Typography>
                                                            </Stack>

                                                            <Stack direction="row" spacing={0.4} alignItems="center">
                                                                <PeopleAlt sx={{ fontSize: 14, color: "#faa11b" }} />
                                                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.72rem" }}>
                                                                    {post.Quantity} Chỉ tiêu
                                                                </Typography>
                                                            </Stack>

                                                            {post.RecruitmentToDate && (
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
                                                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem", display: "flex", alignItems: "center", gap: 0.5 }}>
                                                                    {post.Requirement.Gender === "Male" ? (<Male sx={{ fontSize: "0.8rem" }} />) : post.Requirement.Gender === "Female" ? (<Female sx={{ fontSize: "0.8rem" }} />) : (<Transgender sx={{ fontSize: "0.8rem" }} />)}
                                                                    {post.Requirement.Gender === "Male" ? "Nam" : post.Requirement.Gender === "Female" ? "Nữ" : "Không yêu cầu"}
                                                                </Typography>
                                                            )}
                                                            {post.Requirement.FromAge && post.Requirement.ToAge && (
                                                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem", display: "flex", alignItems: "center", gap: 0.5 }}>
                                                                    <Cake sx={{ fontSize: "0.8rem" }} />Từ: {post.Requirement.FromAge} đến {post.Requirement.ToAge}
                                                                </Typography>
                                                            )}
                                                            {post.Requirement.Experience && (
                                                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem", display: "flex", alignItems: "center", gap: 0.5 }}>
                                                                    <Work sx={{ fontSize: "0.8rem" }} /> {ConvertService.convertJobExperience(ConvertService.convertJobExperienceFromString(post.Requirement.Experience))}
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
                                                                navigate(`/chuong-trinh-tuyen-sinh/${post.SeoUrl}`);
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
                    </Box>
                </Box>
            </Container>
        </Box >
    );
};

export default RecruitmentPostSearchPage;