import { useEffect, useState } from "react";
import { createTheme, ThemeProvider, Tooltip, Drawer } from "@mui/material";
import { lazy } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Collapse from "@mui/material/Collapse";
import TextField from "@mui/material/TextField";
import WorkOutline from "@mui/icons-material/WorkOutline";
import LocationOn from "@mui/icons-material/LocationOn";
import Business from "@mui/icons-material/Business";
import FilterList from "@mui/icons-material/FilterList";
import Clear from "@mui/icons-material/Clear";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import PeopleAlt from "@mui/icons-material/PeopleAlt";
import Male from "@mui/icons-material/Male";
import Transgender from "@mui/icons-material/Transgender";
import Cake from "@mui/icons-material/Cake";
import Work from "@mui/icons-material/Work";
import Female from "@mui/icons-material/Female";
import Category from "@mui/icons-material/Category";
import LocationCity from "@mui/icons-material/LocationCity";
import AccessTime from "@mui/icons-material/AccessTime";
import AttachMoney from "@mui/icons-material/AttachMoney";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetAllProvinceNoAuthenQuery } from "../../../app/features/province.api";
import { useGetRecruitmentPostsByPageQuery } from "../../../app/features/recruitment-post.api";
import { BACK_GROUND_BUTTON_COLOR, DEFAULT_PAGE, PAGE_SIZE } from "../../../constants/common.constant";
import { useGetProfessionsByPageQuery } from "../../../app/features/professtion.api";
import { formatCurrency, formatNumberDisplay, getRecruitmentStatus, parseNumberInput } from "../../../utils/recruitment-post.utils";
import { ConvertService } from "../../../app/services/convert.service";
import { RecruitmentPostFilterParams } from "../../../app/models/recruitment-post.model";
import { useGetVisaTypesByPageQuery } from "../../../app/features/visa-type.api";
import { ProfessionResponse } from "../../../app/models/profession.model";
import { VisaTypeResponse } from "../../../app/models/visa-type.model";
import { AccountType, Gender } from "../../../app/models/enums.model";
import { hasAccountType } from "../../../utils/auth.utils";
const OrganizationPagination = lazy(() => import("../../../components/pagination/organization-pagination"));
const SearchBar = lazy(() => import("../../../components/searchs/search-bar.search"));

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
    const location = useLocation();
    const FILTER_PAGE_SIZE = 10;
    const [page, setPage] = useState(DEFAULT_PAGE);
    const [professionPage, setProfessionPage] = useState(1);
    const [visaTypePage, setVisaTypePage] = useState(1);

    const [showAllProfessions, setShowAllProfessions] = useState(false);
    const [showAllProvinces, setShowAllProvinces] = useState(false);
    const [showAllVisaTypes, setShowAllVisaTypes] = useState(false);
    const [showCostFilter] = useState(true);
    const [openFilter, setOpenFilter] = useState(false);

    const searchParams = new URLSearchParams(location.search);
    const initialProvinceSeo = searchParams.get('provinceSeo') || '';
    const initialProfessionId = location.state?.professionId || '';
    const [selectedProvinceSeo, setSelectedProvinceSeo] = useState(initialProvinceSeo);
    const handleLoadMoreProfessions = () => { setProfessionPage(prev => prev + 1); setShowAllProfessions(true); };
    const handleLoadMoreVisaTypes = () => { setVisaTypePage(prev => prev + 1); setShowAllVisaTypes(true); };
    const isAdminOrStaff = hasAccountType(AccountType.Manager) || hasAccountType(AccountType.Collaborator);


    const [filters, setFilters] = useState({
        searchValue: "",
        provinceId: "",
        professionId: initialProfessionId,
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
            setSelectedProvinceSeo(province?.SeoUrl || '');
            setFilters(prev => ({ ...prev, provinceId: value }));
        } else {
            setFilters(prev => ({ ...prev, [field]: value }));
        }
        setPage(DEFAULT_PAGE);
    };

    const handleCostInputChange = (field: "fromCost" | "toCost", value: string) => {
        const numericValue = value.replace(/\D/g, "");
        setCostInput(prev => ({ ...prev, [field]: numericValue }));
        setCostError("");
    };

    const handleApplyCost = () => {
        const from = costInput.fromCost ? Number(parseNumberInput(costInput.fromCost)) : undefined;
        const to = costInput.toCost ? Number(parseNumberInput(costInput.toCost)) : undefined;

        if (from !== undefined && to !== undefined && from > to) {
            setCostError("Học phí từ không được lớn hơn học phí đến");
            return;
        }
        setCostError("");
        setFilters(prev => ({
            ...prev,
            fromCost: costInput.fromCost ? parseNumberInput(costInput.fromCost) : "",
            toCost: costInput.toCost ? parseNumberInput(costInput.toCost) : "",
        }));
        setPage(DEFAULT_PAGE);
    };

    const handleSearch = (query?: string, provinceSeo?: string) => {
        if (query !== undefined) {
            setFilters(prev => ({ ...prev, searchValue: query }));
        }
        if (provinceSeo !== undefined && provinceSeo !== selectedProvinceSeo) {
            setSelectedProvinceSeo(provinceSeo);
            const province = provinces?.find(p => p.SeoUrl === provinceSeo);
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
        setOpenFilter(false);
    };

    const handleToggleProfessions = () => {
        if (showAllProfessions && !hasMoreProfessions) {
            setShowAllProfessions(false);
        } else if (hasMoreProfessions) {
            handleLoadMoreProfessions();
        } else {
            setShowAllProfessions(true);
        }
    };

    const handleToggleVisaTypes = () => {
        if (showAllVisaTypes && !hasMoreVisaTypes) {
            setShowAllVisaTypes(false);
        } else if (hasMoreVisaTypes) {
            handleLoadMoreVisaTypes();
        } else {
            setShowAllVisaTypes(true);
        }
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
        if (initialProfessionId && allProfessions.length > 0) {
            const index = allProfessions.findIndex(t => t.Id === initialProfessionId);
            if (index >= 5) setShowAllProfessions(true);
        }
    }, [allProfessions, initialProfessionId]);

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
            const province = provinces.find(p => p.SeoUrl === initialProvinceSeo);
            if (province) setFilters(prev => ({ ...prev, provinceId: province.Id }));
        }
    }, [provinces]);

    useEffect(() => {
        document.title = "Tìm kiếm chương trình du học Hàn Quốc | duhochan.hubgroup.vn";
    }, [navigate]);

    const hasMoreProfessions = professionsData && (allProfessions.length < professionsData.Total);
    const hasMoreVisaTypes = visaTypesData && (allVisaTypes.length < visaTypesData.Total);
    const hasActiveFilters = !!filters.provinceId || !!filters.professionId || !!filters.searchValue || !!filters.fromCost || !!filters.toCost || !!filters.visaTypeId;

    const costInputDirty = costInput.fromCost !== filters.fromCost || costInput.toCost !== filters.toCost;
    const currency = recruitmentPosts.find(p => p.Currency)?.Currency ?? "";

    const filterContent = (
        <>
            <Paper
                elevation={0}
                sx={{
                    p: 1.5,
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

                <FormControl component="fieldset" fullWidth sx={{ mb: 1 }}>
                    <FormLabel sx={{ fontWeight: 600, fontSize: "0.9rem", color: "text.primary", mb: 1, display: "flex", alignItems: "center" }}>
                        <Category sx={{ fontSize: 16, mr: 0.5 }} />
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
                                <FormControlLabel sx={{ ml: 0 }} value="" control={<Radio size="small" />} label={<Typography variant="body2">Tất cả</Typography>} />
                                {(showAllVisaTypes ? allVisaTypes : allVisaTypes.slice(0, 5)).map((visaType) => (
                                    <FormControlLabel
                                        sx={{ ml: 0 }}
                                        key={visaType.Id}
                                        value={visaType.Id}
                                        control={<Radio size="small" />}
                                        label={<Tooltip title={visaType.Name} arrow>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 1,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                }}
                                            >
                                                {visaType.Name}
                                            </Typography>
                                        </Tooltip>}
                                    />
                                ))}
                            </RadioGroup>
                        )}
                        {(hasMoreVisaTypes || allVisaTypes.length > 5) && (
                            <Button
                                size="small"
                                onClick={handleToggleVisaTypes}
                                disabled={isLoadingVisaTypes}
                                sx={{ mt: 1, fontSize: "0.75rem", textTransform: "none", color: "primary.main" }}
                            >
                                {isLoadingVisaTypes
                                    ? <CircularProgress size={16} />
                                    : (showAllVisaTypes && !hasMoreVisaTypes) ? "Thu gọn" : "Xem thêm"
                                }
                            </Button>
                        )}
                    </Box>
                </FormControl>

                <Divider sx={{ mb: 2 }} />

                {/* Ngành nghề */}
                <FormControl component="fieldset" fullWidth sx={{ mb: 1 }}>
                    <FormLabel sx={{ fontWeight: 600, fontSize: "0.9rem", color: "text.primary", mb: 1, display: "flex", alignItems: "center" }}>
                        <Category sx={{ fontSize: 16, mr: 0.5 }} />
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
                                <FormControlLabel sx={{ ml: 0 }} value="" control={<Radio size="small" />} label={<Typography variant="body2">Tất cả</Typography>} />
                                {(showAllProfessions ? allProfessions : allProfessions.slice(0, 5)).map((profession) => (
                                    <FormControlLabel
                                        sx={{ ml: 0 }}
                                        key={profession.Id}
                                        value={profession.Id}
                                        control={<Radio size="small" />}
                                        label={<Tooltip title={profession.Name} arrow>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 1,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                }}
                                            >
                                                {profession.Name}
                                            </Typography>
                                        </Tooltip>}
                                    />
                                ))}
                            </RadioGroup>
                        )}
                        {(hasMoreProfessions || allProfessions.length > 5) && (
                            <Button
                                size="small"
                                onClick={handleToggleProfessions}
                                disabled={isLoadingProfessions}
                                sx={{ mt: 1, fontSize: "0.75rem", textTransform: "none", color: "primary.main" }}
                            >
                                {isLoadingProfessions ? <CircularProgress size={16} /> : (showAllProfessions && !hasMoreProfessions) ? "Thu gọn" : "Xem thêm"}
                            </Button>
                        )}
                    </Box>
                </FormControl>

                <Divider sx={{ mb: 2 }} />

                {/* Tỉnh / Thành phố */}
                <FormControl component="fieldset" fullWidth sx={{ mb: 1 }}>
                    <FormLabel sx={{ fontWeight: 600, fontSize: "0.9rem", color: "text.primary", mb: 1, display: "flex", alignItems: "center" }}>
                        <LocationCity sx={{ fontSize: 16, mr: 0.5 }} />
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
                                <FormControlLabel sx={{ ml: 0 }} value="" control={<Radio size="small" />} label={<Typography variant="body2">Tất cả</Typography>} />
                                {(showAllProvinces ? provinces : provinces?.slice(0, 5))?.map((province) => (
                                    <FormControlLabel
                                        sx={{ ml: 0 }}
                                        key={province.Id}
                                        value={province.Id}
                                        control={<Radio size="small" />}
                                        label={<Tooltip title={province.Name} arrow>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 1,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                }}
                                            >
                                                {province.Name}
                                            </Typography>
                                        </Tooltip>}
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

                <Box sx={{ mb: 1 }}>
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <FormLabel sx={{ fontWeight: 600, fontSize: "0.9rem", color: "text.primary", mb: 1, display: "flex", alignItems: "center" }}>
                            <AttachMoney sx={{ fontSize: 16, mr: 0.5 }} />
                            Khoảng học phí ({currency})
                        </FormLabel>
                    </Stack>

                    <Collapse in={showCostFilter}>
                        <Stack spacing={1}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <TextField
                                    size="small"
                                    placeholder="Từ"
                                    value={formatNumberDisplay(costInput.fromCost)}
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
                                    value={formatNumberDisplay(costInput.toCost)}
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
        </>
    );

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 2, display: 'flex', justifyContent: 'center' }}>
                <Box sx={{ maxWidth: 1200, width: '100%', px: { xs: 1, md: 3 } }}>
                    <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                        <SearchBar
                            key={selectedProvinceSeo}
                            onSearch={handleSearch}
                            initialQuery={filters.searchValue}
                            initialProvinceSeo={selectedProvinceSeo}
                        />
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            gap: 1,
                            flexDirection: { xs: "column", md: "row" }
                        }}
                    >
                        <Box
                            sx={{
                                display: { xs: "none", md: "block" },
                                width: 300,
                                flexShrink: 0,
                            }}
                        >
                            {filterContent}
                        </Box>

                        <Box
                            sx={{
                                display: { xs: "flex", md: "none" },
                                justifyContent: "space-between",
                                alignItems: "center",
                                mb: 1,
                                px: 1
                            }}
                        >
                            <Typography variant="body2">
                                {recruitmentData?.Total || 0} kết quả
                            </Typography>

                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<FilterList />}
                                onClick={() => setOpenFilter(true)}
                            >
                                Bộ lọc
                            </Button>
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
                                                                    <Chip label="HOT" size="small"
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
                                                                {(post.MinCost || post.MaxCost) && (
                                                                    <Stack direction="row" spacing={0.4} alignItems="center">
                                                                        <AttachMoney sx={{ fontSize: 14, color: "#faa11b" }} />
                                                                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.72rem", whiteSpace: "nowrap" }}>
                                                                            {post.MinCost && post.MaxCost && post.MinCost !== post.MaxCost ? `${formatCurrency(post.MinCost)} - ${formatCurrency(post.MaxCost)} ${post.Currency ?? ""}` : `${formatCurrency(post.MinCost || post.MaxCost)} ${post.Currency ?? ""}`}
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
                                                                        {post.Requirement.Gender === Gender.Male ? <Male sx={{ fontSize: "0.8rem" }} /> : post.Requirement.Gender === Gender.Female ? <Female sx={{ fontSize: "0.8rem" }} /> : <Transgender sx={{ fontSize: "0.8rem" }} />}
                                                                        {post.Requirement.Gender === Gender.Male ? "Nam" : post.Requirement.Gender === Gender.Female ? "Nữ" : "Không yêu cầu"}
                                                                    </Typography>
                                                                )}
                                                                {post.Requirement.FromAge != null && post.Requirement.ToAge != null && (
                                                                    <Typography variant="caption" color="text.secondary"
                                                                        sx={{ fontSize: "0.7rem", display: "flex", alignItems: "center", gap: 0.5 }}>
                                                                        <Cake sx={{ fontSize: "0.8rem" }} />  {post.Requirement.FromAge === post.Requirement.ToAge
                                                                            ? `${post.Requirement.FromAge} tuổi`
                                                                            : `${post.Requirement.FromAge} đến ${post.Requirement.ToAge} tuổi`}
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
                                                            {!isAdminOrStaff && (
                                                                <Button variant="contained" size="small"
                                                                    onClick={(e) => { e.stopPropagation(); navigate(`/chuong-trinh-tuyen-sinh/${post.SeoUrl}`); }}
                                                                    sx={{
                                                                        backgroundColor: BACK_GROUND_BUTTON_COLOR, borderRadius: 1.5, fontSize: "0.72rem",
                                                                        px: 1.5, height: 30, textTransform: "none", fontWeight: 600
                                                                    }}>
                                                                    Ứng tuyển
                                                                </Button>
                                                            )}
                                                            {!isAdminOrStaff && (
                                                                <IconButton size="small" color="primary"
                                                                    onClick={(e) => { e.stopPropagation(); }}
                                                                    sx={{ border: "1px solid", borderColor: "primary.light", borderRadius: 1.5, width: 30, height: 30 }}>
                                                                    <FavoriteBorder sx={{ fontSize: 16 }} />
                                                                </IconButton>
                                                            )}
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
                </Box>
            </Box>
            <Drawer
                anchor="left"
                open={openFilter}
                onClose={() => setOpenFilter(false)}
                PaperProps={{
                    sx: {
                        width: "80%",
                        maxWidth: 320,
                        p: 1
                    }
                }}
            >
                {filterContent}
            </Drawer>
        </ThemeProvider>
    );
};

export default RecruitmentPostSearchPage;