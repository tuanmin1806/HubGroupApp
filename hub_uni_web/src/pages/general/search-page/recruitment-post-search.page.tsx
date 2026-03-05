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
    IconButton,
    CircularProgress,
    Collapse,
    TextField,
    createTheme,
    ThemeProvider,
} from "@mui/material";
import {
    WorkOutline,
    LocationOn,
    Business,
    FilterList,
    Clear,
    FavoriteBorder,
    PeopleAlt,
    Male,
    Transgender,
    Cake,
    Work,
    Female,
    Category,
    LocationCity,
    AccessTime,
    AttachMoney,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useGetAllProvinceNoAuthenQuery } from "../../../app/features/province.api";
import { useGetRecruitmentPostsByPageQuery } from "../../../app/features/recruitment-post.api";
import OrganizationPagination from "../../../components/pagination/organization-pagination";
import SearchBar from "../../../components/searchs/search-bar.search";
import { BACK_GROUND_BUTTON_COLOR, DEFAULT_PAGE, PAGE_SIZE } from "../../../constants/common.constant";
import { useGetProfessionsByPageQuery } from "../../../app/features/professtion.api";
import { formatCurrency, getRecruitmentStatus } from "../../../utils/recruitment-post.utils";
import { ConvertService } from "../../../app/services/convert.service";
import { RecruitmentPostFilterParams } from "../../../app/models/recruitment-post.model";
import { useGetVisaTypesByPageQuery } from "../../../app/features/visa-type.api";
import { ProfessionResponse } from "../../../app/models/profession.model";
import { VisaTypeResponse } from "../../../app/models/visa-type.model";

const theme = createTheme({
    palette: {
        primary: {
            main: "#ec3b05",
            dark: "#ec3b05",
        },
    },
    typography: {
        fontFamily: [
            "-apple-system",
            "BlinkMacSystemFont",
            '"Segoe UI"',
            "Roboto",
            '"Helvetica Neue"',
            "Arial",
            "sans-serif",
        ].join(","),
    },
});

const RecruitmentPostSearchPage = () => {
    const navigate = useNavigate();
    const FILTER_PAGE_SIZE = 10;
    const [page, setPage] = useState(DEFAULT_PAGE);
    const [professionPage, setProfessionPage] = useState(1);
    const [visaTypePage, setVisaTypePage] = useState(1);

    const [showAllProfessions, setShowAllProfessions] = useState(false);
    const [showAllProvinces, setShowAllProvinces] = useState(false);
    const [showAllVisaTypes, setShowAllVisaTypes] = useState(false);
    const [showCostFilter] = useState(true);

    const searchParams = new URLSearchParams(location.search);
    const initialProvinceSeo = searchParams.get('provinceSeo') || '';
    const [selectedProvinceSeo, setSelectedProvinceSeo] = useState(initialProvinceSeo);
    const handleLoadMoreProfessions = () => { setProfessionPage(prev => prev + 1); };
    const handleLoadMoreVisaTypes = () => { setVisaTypePage(prev => prev + 1); };

    const [filters, setFilters] = useState({
        searchValue: "",
        provinceId: "",
        professionId: "",
        visaTypeId: "",
        fromCost: "",
        toCost: "",
    });

    const [costInput, setCostInput] = useState({ fromCost: "", toCost: "" });
    const [costError, setCostError] = useState("");

    const { data: recruitmentData, isLoading } = useGetRecruitmentPostsByPageQuery({
        page,
        size: PAGE_SIZE,
        searchValue: filters.searchValue,
        provinceId: filters.provinceId,
        professionId: filters.professionId,
        visaTypeId: filters.visaTypeId,
        fromCost: filters.fromCost ? Number(filters.fromCost) : undefined,
        toCost: filters.toCost ? Number(filters.toCost) : undefined,
    });

    const { data: professionsData, isLoading: isLoadingProfessions } = useGetProfessionsByPageQuery({ page: professionPage, size: FILTER_PAGE_SIZE });
    const { data: provinces, isLoading: isLoadingProvinces } = useGetAllProvinceNoAuthenQuery();
    const { data: visaTypesData, isLoading: isLoadingVisaTypes } = useGetVisaTypesByPageQuery({ page: visaTypePage, size: FILTER_PAGE_SIZE });

    const [allProfessions, setAllProfessions] = useState<ProfessionResponse[]>([]);
    const [allVisaTypes, setAllVisaTypes] = useState<VisaTypeResponse[]>([]);

    const totalPages = recruitmentData ? Math.ceil(recruitmentData.Total / PAGE_SIZE) : 1;
    const recruitmentPosts = recruitmentData?.Items || [];

    const handleFilterChange = (field: keyof RecruitmentPostFilterParams, value: string) => {
        if (field === 'provinceId' && value !== filters.provinceId) {
            const province = provinces?.find(p => p.Id === value);
            setSelectedProvinceSeo(province?.Seo || '');
            setFilters(prev => ({ ...prev, provinceId: value }));
        } else {
            setFilters(prev => ({ ...prev, [field]: value }));
        }
        setPage(DEFAULT_PAGE);
    };

    const handleCostInputChange = (field: "fromCost" | "toCost", value: string) => {
        if (value !== "" && !/^\d+$/.test(value)) return;
        setCostInput(prev => ({ ...prev, [field]: value }));
        setCostError("");
    };

    const handleApplyCost = () => {
        const from = costInput.fromCost ? Number(costInput.fromCost) : undefined;
        const to = costInput.toCost ? Number(costInput.toCost) : undefined;
        if (from !== undefined && to !== undefined && from > to) {
            setCostError("Học phí từ không được lớn hơn học phí đến");
            return;
        }
        setCostError("");
        setFilters(prev => ({
            ...prev,
            fromCost: costInput.fromCost,
            toCost: costInput.toCost,
        }));
        setPage(DEFAULT_PAGE);
    };

    const handleSearch = (query?: string, provinceSeo?: string) => {
        if (query !== undefined) {
            setFilters(prev => ({ ...prev, searchValue: query }));
        }
        if (provinceSeo !== undefined && provinceSeo !== selectedProvinceSeo) {
            setSelectedProvinceSeo(provinceSeo);
            const province = provinces?.find(p => p.Seo === provinceSeo);
            setFilters(prev => ({ ...prev, provinceId: province?.Id || '' }));
        }
        setPage(DEFAULT_PAGE);
    };

    const handleClearFilters = () => {
        setFilters({ searchValue: "", provinceId: "", professionId: "", visaTypeId: "", fromCost: "", toCost: "" });
        setCostInput({ fromCost: "", toCost: "" });
        setCostError("");
        setSelectedProvinceSeo('');
        setPage(DEFAULT_PAGE);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
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
        if (visaTypesData?.Items) {
            setAllVisaTypes(prev => {
                const existingIds = new Set(prev.map(item => item.Id));
                const newItems = visaTypesData.Items.filter(item => !existingIds.has(item.Id));
                return [...prev, ...newItems];
            });
        }
    }, [visaTypesData]);

    useEffect(() => {
        if (initialProvinceSeo && provinces && provinces.length > 0 && !filters.provinceId) {
            const province = provinces.find(p => p.Seo === initialProvinceSeo);
            if (province) setFilters(prev => ({ ...prev, provinceId: province.Id }));
        }
    }, [provinces]);

    useEffect(() => {
        document.title = "Tìm kiếm chương trình du học Hàn Quốc | duhochan.hubgroup.vn";
    }, [navigate]);

    const hasMoreProfessions = professionsData && (allProfessions.length < professionsData.Total);
    const hasMoreVisaTypes = visaTypesData && (allVisaTypes.length < visaTypesData.Total);
    const hasActiveFilters = filters.provinceId || filters.professionId || filters.searchValue || filters.fromCost || filters.toCost;

    const costInputDirty = costInput.fromCost !== filters.fromCost || costInput.toCost !== filters.toCost;

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ backgroundColor: "#f8f9fa", minHeight: "100vh", py: 2 }}>
                <Container maxWidth="lg">
                    {/* Search Bar */}
                    <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                        <SearchBar
                            onSearch={handleSearch}
                            initialQuery={filters.searchValue}
                            initialProvinceSeo={selectedProvinceSeo}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
                        {/* Sidebar Filter */}
                        <Box sx={{ width: { xs: "100%", md: 300 }, flexShrink: 0 }}>
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
                                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
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
                                <FormControl component="fieldset" fullWidth sx={{ mb: 1 }}>
                                    <FormLabel sx={{ fontWeight: 600, fontSize: "0.9rem", color: "text.primary", mb: 1 }}>
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
                                                <FormControlLabel value="" control={<Radio size="small" />} label={<Typography variant="body2">Tất cả</Typography>} />
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
                                        {hasMoreProfessions && !showAllProfessions && (
                                            <Button size="small" onClick={handleLoadMoreProfessions} disabled={isLoadingProfessions}
                                                sx={{ mt: 1, fontSize: "0.75rem", textTransform: "none", color: "primary.main" }}>
                                                {isLoadingProfessions ? <CircularProgress size={16} /> : "Xem thêm"}
                                            </Button>
                                        )}

                                        {!hasMoreProfessions && allProfessions.length > 5 && (
                                            <Button size="small" onClick={() => setShowAllProfessions(!showAllProfessions)}
                                                sx={{ mt: 1, fontSize: "0.75rem", textTransform: "none", color: "primary.main" }}>
                                                {showAllProfessions ? "Thu gọn" : "Xem thêm"}
                                            </Button>
                                        )}
                                    </Box>
                                </FormControl>

                                <Divider sx={{ mb: 2 }} />

                                {/* Tỉnh / Thành phố */}
                                <FormControl component="fieldset" fullWidth sx={{ mb: 1 }}>
                                    <FormLabel sx={{ fontWeight: 600, fontSize: "0.9rem", color: "text.primary", mb: 1 }}>
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
                                                <FormControlLabel value="" control={<Radio size="small" />} label={<Typography variant="body2">Tất cả</Typography>} />
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
                                            <Button size="small" onClick={() => setShowAllProvinces(!showAllProvinces)}
                                                sx={{ mt: 1, fontSize: "0.75rem", textTransform: "none", color: "primary.main" }}>
                                                {showAllProvinces ? "Thu gọn" : "Xem thêm"}
                                            </Button>
                                        )}
                                    </Box>
                                </FormControl>

                                <Divider sx={{ mb: 2 }} />

                                <FormControl component="fieldset" fullWidth sx={{ mb: 1 }}>
                                    <FormLabel sx={{ fontWeight: 600, fontSize: "0.9rem", color: "text.primary", mb: 1 }}>
                                        <Category sx={{ fontSize: 16, mr: 0.5, verticalAlign: "middle" }} />
                                        Loại hình Visa
                                    </FormLabel>
                                    <Box sx={{ maxHeight: showAllVisaTypes ? 400 : 'auto', overflowY: "auto", pr: 1 }}>
                                        {isLoadingVisaTypes && allVisaTypes.length === 0 ? (
                                            <Box sx={{ display: 'flex', alignItems: 'center', py: 2 }}>
                                                <CircularProgress size={20} sx={{ mr: 1 }} />
                                                <Typography variant="body2" color="text.secondary">Đang tải...</Typography>
                                            </Box>
                                        ) : (
                                            <RadioGroup
                                                value={filters.visaTypeId}
                                                onChange={(e) => handleFilterChange("visaTypeId", e.target.value)}
                                            >
                                                <FormControlLabel value="" control={<Radio size="small" />} label={<Typography variant="body2">Tất cả</Typography>} />
                                                {(showAllVisaTypes ? allVisaTypes : allVisaTypes.slice(0, 5)).map((visaType) => (
                                                    <FormControlLabel
                                                        key={visaType.Id}
                                                        value={visaType.Id}
                                                        control={<Radio size="small" />}
                                                        label={<Typography variant="body2">{visaType.Name}</Typography>}
                                                    />
                                                ))}
                                            </RadioGroup>
                                        )}
                                        {hasMoreVisaTypes && !showAllVisaTypes && (
                                            <Button size="small" onClick={handleLoadMoreVisaTypes} disabled={isLoadingVisaTypes}
                                                sx={{ mt: 1, fontSize: "0.75rem", textTransform: "none", color: "primary.main" }}>
                                                {isLoadingVisaTypes ? <CircularProgress size={16} /> : "Xem thêm"}
                                            </Button>
                                        )}
                                        {!hasMoreVisaTypes && allVisaTypes.length > 5 && (
                                            <Button size="small" onClick={() => setShowAllVisaTypes(!showAllVisaTypes)}
                                                sx={{ mt: 1, fontSize: "0.75rem", textTransform: "none", color: "primary.main" }}>
                                                {showAllVisaTypes ? "Thu gọn" : "Xem thêm"}
                                            </Button>
                                        )}
                                    </Box>
                                </FormControl>

                                <Divider sx={{ mb: 2 }} />

                                <Box sx={{ mb: 1 }}>
                                    <Stack
                                        direction="row"
                                        alignItems="center"
                                        justifyContent="space-between"
                                    >
                                        <FormLabel sx={{ fontWeight: 600, fontSize: "0.9rem", color: "text.primary", cursor: "pointer" }}>
                                            <AttachMoney sx={{ fontSize: 16, mr: 0.5, verticalAlign: "middle" }} />
                                            Khoảng học phí
                                        </FormLabel>
                                    </Stack>

                                    <Collapse in={showCostFilter}>
                                        <Stack spacing={1}>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <TextField
                                                    size="small"
                                                    placeholder="Từ"
                                                    value={costInput.fromCost}
                                                    onChange={(e) => handleCostInputChange("fromCost", e.target.value)}
                                                    sx={{
                                                        flex: 1,
                                                        "& .MuiInputBase-input": { fontSize: "0.8rem", py: "6px" },
                                                    }}
                                                />
                                                <Typography variant="body2" color="text.secondary" sx={{ flexShrink: 0 }}>—</Typography>
                                                <TextField
                                                    size="small"
                                                    placeholder="Đến"
                                                    value={costInput.toCost}
                                                    onChange={(e) => handleCostInputChange("toCost", e.target.value)}
                                                    sx={{
                                                        flex: 1,
                                                        "& .MuiInputBase-input": { fontSize: "0.8rem", py: "6px" },
                                                    }}
                                                />
                                            </Stack>

                                            {costError && (
                                                <Typography variant="caption" color="error" sx={{ fontSize: "0.7rem" }}>
                                                    {costError}
                                                </Typography>
                                            )}

                                            {(filters.fromCost || filters.toCost) && !costInputDirty && (
                                                <Stack direction="row" alignItems="center" spacing={0.5}>
                                                    <Chip
                                                        label={`${filters.fromCost ? Number(filters.fromCost).toLocaleString("vi-VN") : "0"} — ${filters.toCost ? Number(filters.toCost).toLocaleString("vi-VN") : "∞"}`}
                                                        size="small"
                                                        onDelete={() => {
                                                            setCostInput({ fromCost: "", toCost: "" });
                                                            setFilters(prev => ({ ...prev, fromCost: "", toCost: "" }));
                                                            setCostError("");
                                                        }}
                                                        sx={{
                                                            fontSize: "0.68rem",
                                                            height: 22,
                                                            bgcolor: "rgba(243,103,48,0.1)",
                                                            color: "primary.main",
                                                            border: "1px solid",
                                                            borderColor: "primary.light",
                                                            "& .MuiChip-label": { px: 1 },
                                                            "& .MuiChip-deleteIcon": { fontSize: 14 },
                                                        }}
                                                    />
                                                </Stack>
                                            )}

                                            <Button
                                                size="small"
                                                variant="contained"
                                                onClick={handleApplyCost}
                                                disableElevation
                                                sx={{
                                                    fontSize: "0.75rem",
                                                    textTransform: "none",
                                                    fontWeight: 600,
                                                    bgcolor: BACK_GROUND_BUTTON_COLOR,
                                                    "&:hover": { bgcolor: "#f59d19" },
                                                    borderRadius: 1,
                                                    py: 0.5,
                                                }}
                                            >
                                                Áp dụng
                                            </Button>

                                        </Stack>
                                    </Collapse>
                                </Box>
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
                                    sx={{ p: 2, textAlign: "center", borderRadius: 2, border: "1px solid", borderColor: "divider" }}
                                >
                                    <WorkOutline sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
                                    <Typography variant="h6" color="text.secondary" gutterBottom>
                                        Không tìm thấy chương trình tuyển sinh
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" mb={2}>
                                        Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm
                                    </Typography>
                                    {hasActiveFilters && (
                                        <Button variant="outlined" startIcon={<Clear />} onClick={handleClearFilters} sx={{ mt: 1 }}>
                                            Xóa bộ lọc
                                        </Button>
                                    )}
                                </Paper>
                            ) : (
                                <>
                                    <Stack spacing={1} mb={2}>
                                        {recruitmentPosts.map((post) => (
                                            <Paper
                                                key={post.Id}
                                                elevation={0}
                                                onClick={() => navigate(`/chuong-trinh-tuyen-sinh/${post.SeoUrl}`)}
                                                sx={{
                                                    p: 2,
                                                    borderRadius: 2,
                                                    border: "1px solid",
                                                    borderColor: post.IsTop ? '#faa11b' : '#dbd8d8',
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
                                                            {post.Organization.LogoFullUrl ? (
                                                                <Box component="img" src={post.Organization.LogoFullUrl} alt={post.Organization.Name}
                                                                    sx={{ width: "100%", height: "100%", objectFit: "contain" }} />
                                                            ) : (
                                                                <Business sx={{ fontSize: 26, color: "text.secondary" }} />
                                                            )}
                                                        </Box>

                                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                                            <Stack direction="row" alignItems="flex-start" gap={1} flexWrap="wrap">
                                                                <Typography variant="subtitle1" fontWeight={700}
                                                                    sx={{
                                                                        fontSize: { xs: "0.9rem", sm: "1rem" }, lineHeight: 1.35, flex: 1, minWidth: 0,
                                                                        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden"
                                                                    }}>
                                                                    {post.Name}
                                                                </Typography>
                                                                {post.IsTop && (
                                                                    <Chip label="Nổi bật" size="small"
                                                                        sx={{
                                                                            height: 20, fontSize: "0.62rem", fontWeight: 700, flexShrink: 0,
                                                                            alignSelf: "flex-start", bgcolor: "#f3522a", color: "#ffffff", border: "none"
                                                                        }} />
                                                                )}
                                                            </Stack>

                                                            <Typography variant="body2" color="text.secondary" fontWeight={500}
                                                                sx={{
                                                                    fontSize: { xs: "0.78rem", sm: "0.82rem" }, mt: 0.25,
                                                                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
                                                                }}>
                                                                {post.Organization.Name}
                                                            </Typography>

                                                            <Stack direction="row" flexWrap="wrap" gap={{ xs: 0.75, sm: 1.5 }} mt={0.5}>
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
                                                                {(post.MinCost || post.MaxCost || post.MinCost != 0 || post.MaxCost != 0) && (
                                                                    <Stack direction="row" spacing={0.4} alignItems="center">
                                                                        <AttachMoney sx={{ fontSize: 14, color: "#faa11b" }} />
                                                                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.72rem", whiteSpace: "nowrap" }}>
                                                                            {post.MinCost && post.MaxCost ? `${formatCurrency(post.MinCost)} - ${formatCurrency(post.MaxCost)} ${post.Currency ?? ""}` : formatCurrency(post.MinCost)}
                                                                        </Typography>
                                                                    </Stack>
                                                                )}
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

                                                    {post.Professions && post.Professions.length > 0 && (
                                                        <Stack direction="row" flexWrap="wrap" gap={0.5}>
                                                            {post.Professions.slice(0, 3).map((profession) => (
                                                                <Chip key={profession.Id} label={profession.Name} size="small" variant="outlined"
                                                                    sx={{
                                                                        height: 20, fontSize: "0.65rem", borderColor: "primary.light", color: "primary.main",
                                                                        "& .MuiChip-label": { px: 0.75 }
                                                                    }} />
                                                            ))}
                                                            {post.Professions.length > 3 && (
                                                                <Chip label={`+${post.Professions.length - 3}`} size="small" variant="outlined"
                                                                    sx={{ height: 20, fontSize: "0.65rem", "& .MuiChip-label": { px: 0.75 } }} />
                                                            )}
                                                        </Stack>
                                                    )}

                                                    <Stack direction="row" alignItems="center" justifyContent="space-between"
                                                        flexWrap={{ xs: "wrap", sm: "nowrap" }} gap={1}>
                                                        {post.Requirement && (
                                                            <Stack direction="row" flexWrap="wrap" gap={{ xs: 0.5, sm: 1.5 }}>
                                                                {post.Requirement.Gender && (
                                                                    <Typography variant="caption" color="text.secondary"
                                                                        sx={{ fontSize: "0.7rem", display: "flex", alignItems: "center", gap: 0.5 }}>
                                                                        {post.Requirement.Gender === "Male" ? <Male sx={{ fontSize: "0.8rem" }} /> : post.Requirement.Gender === "Female" ? <Female sx={{ fontSize: "0.8rem" }} /> : <Transgender sx={{ fontSize: "0.8rem" }} />}
                                                                        {post.Requirement.Gender === "Male" ? "Nam" : post.Requirement.Gender === "Female" ? "Nữ" : "Không yêu cầu"}
                                                                    </Typography>
                                                                )}
                                                                {post.Requirement.FromAge && post.Requirement.ToAge && (
                                                                    <Typography variant="caption" color="text.secondary"
                                                                        sx={{ fontSize: "0.7rem", display: "flex", alignItems: "center", gap: 0.5 }}>
                                                                        <Cake sx={{ fontSize: "0.8rem" }} /> {post.Requirement.FromAge} đến {post.Requirement.ToAge} tuổi
                                                                    </Typography>
                                                                )}
                                                                {post.Requirement.Experience && (
                                                                    <Typography variant="caption" color="text.secondary"
                                                                        sx={{ fontSize: "0.7rem", display: "flex", alignItems: "center", gap: 0.5 }}>
                                                                        <Work sx={{ fontSize: "0.8rem" }} /> {ConvertService.convertJobExperience(ConvertService.convertJobExperienceFromString(post.Requirement.Experience))}
                                                                    </Typography>
                                                                )}
                                                            </Stack>
                                                        )}
                                                        <Stack direction="row" spacing={0.75} flexShrink={0} sx={{ ml: "auto" }}>
                                                            <Button variant="contained" size="small"
                                                                onClick={(e) => { e.stopPropagation(); navigate(`/chuong-trinh-tuyen-sinh/${post.SeoUrl}`); }}
                                                                sx={{
                                                                    backgroundColor: BACK_GROUND_BUTTON_COLOR, borderRadius: 1.5, fontSize: "0.72rem",
                                                                    px: 1.5, height: 30, textTransform: "none", fontWeight: 600
                                                                }}>
                                                                Ứng tuyển
                                                            </Button>
                                                            <IconButton size="small" color="primary"
                                                                onClick={(e) => { e.stopPropagation(); }}
                                                                sx={{ border: "1px solid", borderColor: "primary.light", borderRadius: 1.5, width: 30, height: 30 }}>
                                                                <FavoriteBorder sx={{ fontSize: 16 }} />
                                                            </IconButton>
                                                        </Stack>
                                                    </Stack>
                                                </Stack>
                                            </Paper>
                                        ))}
                                    </Stack>

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
            </Box>
        </ThemeProvider>
    );
};

export default RecruitmentPostSearchPage;