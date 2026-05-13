import { ThemeProvider } from "@emotion/react";
import { lazy } from "react";
import { createTheme } from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import Drawer from "@mui/material/Drawer";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DEFAULT_PAGE, PAGE_SIZE } from "../../../constants/common.constant";
import Apartment from "@mui/icons-material/Apartment";
import Category from "@mui/icons-material/Category";
import LocationCity from "@mui/icons-material/LocationCity";
import LocationOn from "@mui/icons-material/LocationOn";
import Numbers from "@mui/icons-material/Numbers";
import Place from "@mui/icons-material/Place";
import School from "@mui/icons-material/School";
import Clear from "@mui/icons-material/Clear";
import FilterList from "@mui/icons-material/FilterList";
import { useGetCommunesByProvinceQuery } from "../../../app/features/commune.api";
import { useGetOrganizationTypesByPageQuery } from "../../../app/features/organization-type.api";
import { useOrganizationsGetByPageNoAuthenQuery } from "../../../app/features/organization.api";
import { useGetProfessionsByPageQuery } from "../../../app/features/professtion.api";
import { useGetAllProvinceNoAuthenQuery } from "../../../app/features/province.api";
import { OrganizationResponse } from "../../../app/models/organization.model";
const SearchBar = lazy(() => import("../../../components/searchs/search-bar.search"));
const OrganizationPagination = lazy(() => import("../../../components/pagination/organization-pagination"));

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

export interface OrganizationFilterParams {
    page?: number;
    size?: number;
    searchValue?: string;
    organizationTypeId?: string;
    professionId?: string;
    provinceId?: string;
    communeId?: string;
    taxSearch?: string;
}

const FILTER_PAGE_SIZE = 10;

const OrganizationSearchPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const initialProvinceSeo = searchParams.get('provinceSeo') || '';
    const initialSearchValue = searchParams.get('search') || '';
    const initialOrgTypeId = location.state?.organizationTypeId || '';
    const [openFilter, setOpenFilter] = useState(false);

    const [page, setPage] = useState(DEFAULT_PAGE);
    const [filters, setFilters] = useState<OrganizationFilterParams>({
        searchValue: initialSearchValue,
        organizationTypeId: initialOrgTypeId,
        professionId: '',
        provinceId: '',
        communeId: '',
        taxSearch: '',
        page: DEFAULT_PAGE,
        size: PAGE_SIZE,
    });

    const [orgTypePage, setOrgTypePage] = useState(1);
    const [professionPage, setProfessionPage] = useState(1);
    const [selectedProvinceSeo, setSelectedProvinceSeo] = useState(initialProvinceSeo);

    const [showAllOrgTypes, setShowAllOrgTypes] = useState(false);
    const [showAllProfessions, setShowAllProfessions] = useState(false);
    const [showAllProvinces, setShowAllProvinces] = useState(false);
    const [showAllCommunes, setShowAllCommunes] = useState(false);

    const { data: organizationData, isLoading } = useOrganizationsGetByPageNoAuthenQuery({ ...filters, page: page, size: PAGE_SIZE, });
    const { data: orgTypesData, isLoading: isLoadingOrgTypes } = useGetOrganizationTypesByPageQuery({ page: orgTypePage, size: FILTER_PAGE_SIZE, });
    const { data: professionsData, isLoading: isLoadingProfessions } = useGetProfessionsByPageQuery({ page: professionPage, size: FILTER_PAGE_SIZE, });
    const { data: provinces, isLoading: isLoadingProvinces } = useGetAllProvinceNoAuthenQuery();
    const { data: communes, isLoading: isLoadingCommunes } = useGetCommunesByProvinceQuery(selectedProvinceSeo, { skip: !selectedProvinceSeo });

    const totalPages = organizationData ? Math.ceil(organizationData.Total / PAGE_SIZE) : 1;
    const organizations = organizationData?.Items || [];

    const [allOrgTypes, setAllOrgTypes] = useState<any[]>([]);
    const [allProfessions, setAllProfessions] = useState<any[]>([]);

    useEffect(() => { document.title = "Tìm kiếm trường Đại học/Cao đẳng tại Hàn Quốc | duhochan.hubgroup.vn"; }, []);

    useEffect(() => {
        if (orgTypesData?.Items) {
            setAllOrgTypes(prev => {
                const existingIds = new Set(prev.map(item => item.Id));
                const newItems = orgTypesData.Items.filter(item => !existingIds.has(item.Id));
                return [...prev, ...newItems];
            });
        }
    }, [orgTypesData]);

    useEffect(() => {
        if (initialOrgTypeId && allOrgTypes.length > 0) {
            const index = allOrgTypes.findIndex(t => t.Id === initialOrgTypeId);
            if (index >= 5) setShowAllOrgTypes(true);
        }
    }, [allOrgTypes, initialOrgTypeId]);

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
            const province = provinces.find(p => p.SeoUrl === initialProvinceSeo);
            if (province) {
                setFilters(prev => ({ ...prev, provinceId: province.Id }));
            }
        }
    }, [provinces]);

    useEffect(() => {
        document.title = "Tìm kiếm trường Đại học/Cao đẳng tại Hàn Quốc | duhochan.hubgroup.vn";
    }, [navigate]);

    const handleFilterChange = (field: keyof OrganizationFilterParams, value: string) => {
        if (field === 'provinceId' && value !== filters.provinceId) {
            const province = provinces?.find(p => p.Id === value);
            setSelectedProvinceSeo(province?.SeoUrl || '');
            setFilters({ ...filters, [field]: value, communeId: '' });
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
            const province = provinces?.find(p => p.SeoUrl === provinceSeo);
            setFilters(prev => ({
                ...prev,
                provinceId: province?.Id || '',
                communeId: '',
            }));
        }
        setPage(DEFAULT_PAGE);
    };

    const handleClearFilters = () => {
        setFilters({
            searchValue: '',
            organizationTypeId: '',
            professionId: '',
            provinceId: '',
            communeId: '',
            taxSearch: '',
            page: DEFAULT_PAGE,
            size: PAGE_SIZE,
        });
        setSelectedProvinceSeo('');
        setPage(DEFAULT_PAGE);
    };

    const handleViewDetail = (organizationId: string) => { navigate(`/thong-tin-truong/${organizationId}`); };
    const handleLoadMoreOrgTypes = () => { setOrgTypePage(prev => prev + 1); setShowAllOrgTypes(true); };
    const handleLoadMoreProfessions = () => { setProfessionPage(prev => prev + 1); setShowAllProfessions(true); };

    const hasMoreOrgTypes = orgTypesData && (allOrgTypes.length < orgTypesData.Total);
    const hasMoreProfessions = professionsData && (allProfessions.length < professionsData.Total);
    const hasActiveFilters = Boolean(filters.organizationTypeId || filters.professionId || filters.provinceId || filters.communeId || filters.taxSearch);

    const handleToggleProfessions = () => {
        if (showAllProfessions && !hasMoreProfessions) {
            setShowAllProfessions(false);
        } else if (hasMoreProfessions) {
            handleLoadMoreProfessions();
        } else {
            setShowAllProfessions(true);
        }
    };

    const handleToggleOrgTypes = () => {
        if (showAllOrgTypes && !hasMoreOrgTypes) {
            setShowAllOrgTypes(false);
        } else if (hasMoreOrgTypes) {
            handleLoadMoreOrgTypes();
        } else {
            setShowAllOrgTypes(true);
        }
    };

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

                {/* Loại hình*/}
                <FormControl component="fieldset" fullWidth sx={{ mb: 1 }}>
                    <FormLabel
                        sx={{
                            fontWeight: 600,
                            fontSize: "0.9rem",
                            color: "text.primary",
                            mb: 1,
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <Apartment sx={{ fontSize: 16, mr: 0.5 }} />
                        Loại hình
                    </FormLabel>
                    <Box sx={{ maxHeight: showAllOrgTypes ? 400 : 'auto', overflowY: "auto", pr: 1 }}>
                        {isLoadingOrgTypes && allOrgTypes.length === 0 ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', py: 2 }}>
                                <CircularProgress size={20} sx={{ mr: 1 }} />
                                <Typography variant="body2" color="text.secondary">Đang tải...</Typography>
                            </Box>
                        ) : (
                            <RadioGroup
                                value={filters.organizationTypeId}
                                onChange={(e) => handleFilterChange("organizationTypeId", e.target.value)}
                            >
                                <FormControlLabel
                                    sx={{ ml: 0 }}
                                    value=""
                                    control={<Radio size="small" />}
                                    label={<Typography variant="body2">Tất cả</Typography>}
                                />
                                {(showAllOrgTypes ? allOrgTypes : allOrgTypes.slice(0, 5)).map((type) => (
                                    <FormControlLabel
                                        sx={{ ml: 0 }}
                                        key={type.Id}
                                        value={type.Id}
                                        control={<Radio size="small" />}
                                        label={<Tooltip title={type.Name} arrow>
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
                                                {type.Name}
                                            </Typography>
                                        </Tooltip>}
                                    />
                                ))}
                            </RadioGroup>
                        )}
                        {(hasMoreOrgTypes || allOrgTypes.length > 5) && (
                            <Button
                                size="small"
                                onClick={handleToggleOrgTypes}
                                disabled={isLoadingOrgTypes}
                                sx={{ mt: 1, fontSize: "0.75rem", textTransform: "none", color: "primary.main" }}
                            >
                                {isLoadingOrgTypes ? <CircularProgress size={16} /> : (showAllOrgTypes && !hasMoreOrgTypes) ? "Thu gọn" : "Xem thêm"}
                            </Button>
                        )}
                    </Box>
                </FormControl>

                <Divider sx={{ mb: 2 }} />

                {/* Ngành nghề */}
                <FormControl component="fieldset" fullWidth sx={{ mb: 1 }}>
                    <FormLabel
                        sx={{
                            fontWeight: 600,
                            fontSize: "0.9rem",
                            color: "text.primary",
                            mb: 1,
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
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
                                <FormControlLabel
                                    sx={{ ml: 0 }}
                                    value=""
                                    control={<Radio size="small" />}
                                    label={<Typography variant="body2">Tất cả</Typography>}
                                />
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
                    <FormLabel
                        sx={{
                            fontWeight: 600,
                            fontSize: "0.9rem",
                            color: "text.primary",
                            mb: 1,
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
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
                                <FormControlLabel
                                    sx={{ ml: 0 }}
                                    value=""
                                    control={<Radio size="small" />}
                                    label={<Typography variant="body2">Tất cả</Typography>}
                                />
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

                <Divider sx={{ mb: 2 }} />

                {/* Quận / Huyện */}
                <FormControl component="fieldset" fullWidth sx={{ mb: 1 }}>
                    <FormLabel
                        sx={{
                            fontWeight: 600,
                            fontSize: "0.9rem",
                            color: "text.primary",
                            mb: 1,
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <Place sx={{ fontSize: 16, mr: 0.5 }} />
                        Quận / Huyện
                    </FormLabel>
                    <Box sx={{ maxHeight: showAllCommunes ? 400 : 'auto', overflowY: "auto", pr: 1 }}>
                        {!filters.provinceId ? (
                            <Typography variant="body2" color="text.secondary" sx={{ py: 1, fontStyle: 'italic' }}>
                                Vui lòng chọn Tỉnh/Thành phố trước
                            </Typography>
                        ) : isLoadingCommunes ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', py: 2 }}>
                                <CircularProgress size={20} sx={{ mr: 1 }} />
                                <Typography variant="body2" color="text.secondary">Đang tải...</Typography>
                            </Box>
                        ) : (
                            <>
                                <RadioGroup
                                    value={filters.communeId}
                                    onChange={(e) => handleFilterChange("communeId", e.target.value)}
                                >
                                    <FormControlLabel
                                        sx={{ ml: 0 }}
                                        value=""
                                        control={<Radio size="small" />}
                                        label={<Typography variant="body2">Tất cả</Typography>}
                                    />
                                    {(showAllCommunes ? communes : communes?.slice(0, 5))?.map((commune) => (
                                        <FormControlLabel
                                            sx={{ ml: 0 }}
                                            key={commune.Id}
                                            value={commune.Id}
                                            control={<Radio size="small" />}
                                            label={<Tooltip title={commune.Name} arrow>
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
                                                    {commune.Name}
                                                </Typography>
                                            </Tooltip>}
                                        />
                                    ))}
                                </RadioGroup>
                                {communes && communes.length > 5 && (
                                    <Button
                                        size="small"
                                        onClick={() => setShowAllCommunes(!showAllCommunes)}
                                        sx={{
                                            mt: 1,
                                            fontSize: "0.75rem",
                                            textTransform: "none",
                                            color: "primary.main"
                                        }}
                                    >
                                        {showAllCommunes ? "Thu gọn" : "Xem thêm"}
                                    </Button>
                                )}
                            </>
                        )}
                    </Box>
                </FormControl>

                <Divider sx={{ mb: 2 }} />

                {/* Mã số thuế */}
                <FormControl fullWidth>
                    <FormLabel
                        sx={{
                            fontWeight: 600,
                            fontSize: "0.9rem",
                            color: "text.primary",
                            mb: 1,
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <Numbers sx={{ fontSize: 16, mr: 0.5 }} />
                        Mã số thuế
                    </FormLabel>
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="Nhập mã số thuế"
                        value={filters.taxSearch}
                        onChange={(e) => handleFilterChange("taxSearch", e.target.value)}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                fontSize: '0.875rem'
                            }
                        }}
                    />
                </FormControl>
            </Paper>
        </>
    );

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 2, display: 'flex', justifyContent: 'center' }}>
                <Box sx={{ maxWidth: 1200, width: '100%', px: { xs: 1, md: 3 } }}>
                    <Box sx={{
                        width: "100%",
                        maxWidth: 1200,
                        mb: 2,
                        mx: 'auto'
                    }}>
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
                        {/* Left Sidebar - Filters */}
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
                                {organizationData?.Total || 0} kết quả
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

                        {/* Right Side - Results */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            {isLoading ? (
                                <Box sx={{ textAlign: 'center', py: 8 }}>
                                    <CircularProgress size={48} />
                                    <Typography sx={{ mt: 2 }}>Đang tải...</Typography>
                                </Box>
                            ) : organizations.length === 0 ? (
                                <Card sx={{ p: 6, textAlign: 'center', borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}>
                                    <School sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                                    <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 600 }}>
                                        Không tìm thấy trường nào
                                    </Typography>
                                    <Typography color="text.secondary" sx={{ mt: 1 }}>
                                        Vui lòng thử điều chỉnh bộ lọc của bạn
                                    </Typography>
                                </Card>
                            ) : (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    {/* Results count */}
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        px: 1
                                    }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Tìm thấy <strong>{organizationData?.Total || 0}</strong> trường phù hợp
                                        </Typography>
                                    </Box>

                                    {organizations.map((org: OrganizationResponse) => (
                                        <Card
                                            key={org.SeoUrl}
                                            sx={{
                                                borderRadius: 2,
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                                                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                                border: '1px solid',
                                                borderColor: org.IsTop ? '#faa11b' : '#dbd8d8',
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    transform: 'translateY(-3px)',
                                                },
                                            }}
                                            onClick={() => handleViewDetail(org.SeoUrl || '')}
                                        >
                                            <CardContent sx={{ p: { xs: 1, md: 1.5 }, '&:last-child': { pb: { xs: 1.5, md: 2 } } }}>
                                                <Box sx={{ display: 'flex', gap: { xs: 1.5, md: 2 }, alignItems: 'stretch' }}>

                                                    {/* Logo */}
                                                    <Box
                                                        sx={{
                                                            width: { xs: 68, sm: 84, md: 96 },
                                                            height: { xs: 68, sm: 84, md: 96 },
                                                            borderRadius: 2,
                                                            overflow: 'hidden',
                                                            bgcolor: '#f8f9fa',
                                                            flexShrink: 0,
                                                            border: '1px solid',
                                                            borderColor: 'divider',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            alignSelf: 'flex-start',
                                                        }}
                                                    >
                                                        {org.LogoFullUrl ? (
                                                            <img
                                                                src={org.LogoFullUrl}
                                                                loading="lazy"
                                                                alt={org.Name}
                                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                            />
                                                        ) : (
                                                            <School sx={{ fontSize: { xs: 30, md: 44 }, color: '#ccc' }} />
                                                        )}
                                                    </Box>

                                                    {/* Content */}
                                                    <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 0.4 }}>

                                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, flexWrap: 'wrap' }}>
                                                            <Typography
                                                                variant="subtitle1"
                                                                sx={{
                                                                    fontWeight: 700,
                                                                    fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                                                                    lineHeight: 1.35,
                                                                    '&:hover': { color: 'primary.main' },
                                                                    transition: 'color 0.2s',
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis',
                                                                    display: '-webkit-box',
                                                                    WebkitLineClamp: 2,
                                                                    WebkitBoxOrient: 'vertical',
                                                                    flex: 1,
                                                                    minWidth: 0,
                                                                }}
                                                            >
                                                                {org.Name}
                                                            </Typography>

                                                            {org.IsTop && (
                                                                <Chip
                                                                    label="Nổi bật"
                                                                    color="primary"
                                                                    size="small"
                                                                    sx={{
                                                                        fontWeight: 700,
                                                                        fontSize: '0.65rem',
                                                                        height: 20,
                                                                        flexShrink: 0,
                                                                        alignSelf: 'flex-start',
                                                                        mt: 0.1,
                                                                    }}
                                                                />
                                                            )}
                                                        </Box>

                                                        {org.OrganizationType && (
                                                            <Box>
                                                                <Chip
                                                                    label={org.OrganizationType}
                                                                    size="small"
                                                                    variant="outlined"
                                                                    sx={{
                                                                        fontSize: { xs: '0.62rem', sm: '0.68rem' },
                                                                        height: 20,
                                                                        borderColor: 'primary.light',
                                                                        color: 'primary.main',
                                                                        fontWeight: 500,
                                                                        maxWidth: '100%',
                                                                        '& .MuiChip-label': {
                                                                            px: 0.75,
                                                                            overflow: 'hidden',
                                                                            textOverflow: 'ellipsis',
                                                                            whiteSpace: 'nowrap',
                                                                        },
                                                                    }}
                                                                />
                                                            </Box>
                                                        )}

                                                        <Box sx={{ mt: 0.25 }} />

                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                                            <School sx={{ fontSize: 15, color: 'text.disabled', flexShrink: 0 }} />
                                                            <Typography
                                                                variant="body2"
                                                                color="text.secondary"
                                                                sx={{
                                                                    fontSize: { xs: '0.75rem', md: '0.8rem' },
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis',
                                                                    whiteSpace: 'nowrap',
                                                                    flex: 1,
                                                                    minWidth: 0,
                                                                    fontStyle: org.MainProfession?.ProfessionName ? 'normal' : 'italic'
                                                                }}
                                                            >
                                                                {org.MainProfession?.ProfessionName || 'Chưa có thông tin'}
                                                            </Typography>
                                                        </Box>

                                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.75 }}>
                                                            <LocationOn sx={{ fontSize: 15, color: 'text.disabled', mt: 0.15, flexShrink: 0 }} />
                                                            <Typography
                                                                variant="body2"
                                                                color="text.secondary"
                                                                sx={{
                                                                    fontSize: { xs: '0.75rem', md: '0.8rem' },
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis',
                                                                    display: '-webkit-box',
                                                                    WebkitLineClamp: 2,
                                                                    WebkitBoxOrient: 'vertical',
                                                                    lineHeight: 1.4,
                                                                }}
                                                            >
                                                                {[org.Address, org.Commune, org.Province].filter(Boolean).join(', ')}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </Box>
                            )}

                            {/* Pagination */}
                            {organizations.length > 0 && (
                                <Box sx={{ mt: 4 }}>
                                    <OrganizationPagination
                                        page={page}
                                        totalPages={totalPages}
                                        onPrev={() => setPage((p) => Math.max(1, p - 1))}
                                        onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    />
                                </Box>
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

export default OrganizationSearchPage;