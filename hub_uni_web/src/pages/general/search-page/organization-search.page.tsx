import { ThemeProvider } from "@emotion/react";
import { createTheme, Box, TextField, Button, Card, CardContent, Typography, FormControl, InputLabel, Select, MenuItem, Chip } from "@mui/material";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useOrganizationsFullTextSearchQuery } from "../../../app/features/organization.api";
import OrganizationPagination from "../../../components/pagination/organization-pagination";
import { DEFAULT_PAGE, PAGE_SIZE } from "../../../constants/common.constant";
import { Apartment, Category, Code, FilterAltOff, LocationCity, LocationOn, Numbers, Place, School } from "@mui/icons-material";
import SearchBar from "../../../components/searchs/search-bar.search";

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
    nameSearch?: string;
    organizationTypeId?: string;
    professionId?: string;
    provinceId?: string;
    communeId?: string;
    taxCode?: string;
}

const OrganizationSearchPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const initialSearch = searchParams.get('search') || '';

    const [page, setPage] = useState(DEFAULT_PAGE);
    const [filters, setFilters] = useState<OrganizationFilterParams>({
        nameSearch: initialSearch,
        organizationTypeId: '',
        professionId: '',
        provinceId: '',
        communeId: '',
        taxCode: '',
        page: DEFAULT_PAGE,
        size: PAGE_SIZE,
    });

    const { data: organizationData, isLoading } = useOrganizationsFullTextSearchQuery({
        ...filters,
        page: page,
        size: PAGE_SIZE,
    });

    const totalPages = organizationData ? Math.ceil(organizationData.Total / PAGE_SIZE) : 1;
    const organizations = organizationData?.Items || [];

    useEffect(() => {
        document.title = "Tìm kiếm Tổ chức | HUB UNI";
    }, []);

    const handleFilterChange = (field: keyof OrganizationFilterParams, value: string) => {
        setFilters({ ...filters, [field]: value });
        setPage(DEFAULT_PAGE);
    };

    const handleSearch = () => {
        setPage(DEFAULT_PAGE);
    };

    const handleClearFilters = () => {
        setFilters({
            nameSearch: '',
            organizationTypeId: '',
            professionId: '',
            provinceId: '',
            communeId: '',
            taxCode: '',
            page: DEFAULT_PAGE,
            size: PAGE_SIZE,
        });
        setPage(DEFAULT_PAGE);
    };

    const handleViewDetail = (organizationId: string) => {
        navigate(`/to-chuc/${organizationId}`);
    };

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 4, display: 'flex', justifyContent: 'center' }}>
                <Box sx={{ maxWidth: 1200, width: '100%', px: 3 }}>
                    {/* Search Bar */}
                    <Box sx={{
                        width: "100%",
                        maxWidth: 1200,
                        mb: 2,
                        mx: 'auto'
                    }}
                    >
                        <Box>
                            <SearchBar onSearch={handleSearch} />
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 3, flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
                        {/* Left Sidebar - Filters */}
                        <Box
                            sx={{
                                width: { xs: "100%", md: 280 },
                                flexShrink: 0,
                            }}
                        >
                            <Card
                                sx={{
                                    borderRadius: 3,
                                    position: { md: "sticky" },
                                    top: 24,
                                    boxShadow: "0 12px 32px rgba(0,0,0,0.08)",
                                }}
                            >
                                <CardContent >
                                    {/* Header */}
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            mb: 2,
                                        }}
                                    >
                                        <Typography
                                            variant="h6"
                                            sx={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 1 }}
                                        >
                                            <Category color="primary" />
                                            Lọc nâng cao
                                        </Typography>

                                        <Button
                                            size="small"
                                            color="error"
                                            startIcon={<FilterAltOff />}
                                            onClick={handleClearFilters}
                                            sx={{ textTransform: "none" }}
                                        >
                                            Xóa
                                        </Button>
                                    </Box>

                                    {/* Filters */}
                                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                        {/* Loại tổ chức */}
                                        <FormControl fullWidth size="small">
                                            <InputLabel>Loại tổ chức</InputLabel>
                                            <Select
                                                value={filters.organizationTypeId}
                                                label="Loại tổ chức"
                                                startAdornment={<Apartment sx={{ mr: 1, color: "text.secondary" }} />}
                                                onChange={(e) =>
                                                    handleFilterChange("organizationTypeId", e.target.value)
                                                }
                                            >
                                                <MenuItem value="">Tất cả</MenuItem>
                                                <MenuItem value="1">Đại học</MenuItem>
                                                <MenuItem value="2">Cao đẳng</MenuItem>
                                                <MenuItem value="3">Trung cấp</MenuItem>
                                            </Select>
                                        </FormControl>

                                        {/* Ngành nghề */}
                                        <FormControl fullWidth size="small">
                                            <InputLabel>Ngành nghề</InputLabel>
                                            <Select
                                                value={filters.professionId}
                                                label="Ngành nghề"
                                                startAdornment={<Category sx={{ mr: 1, color: "text.secondary" }} />}
                                                onChange={(e) =>
                                                    handleFilterChange("professionId", e.target.value)
                                                }
                                            >
                                                <MenuItem value="">Tất cả</MenuItem>
                                                <MenuItem value="1">Công nghệ thông tin</MenuItem>
                                                <MenuItem value="2">Kinh tế</MenuItem>
                                                <MenuItem value="3">Y khoa</MenuItem>
                                                <MenuItem value="4">Kỹ thuật</MenuItem>
                                            </Select>
                                        </FormControl>

                                        {/* Tỉnh / Thành */}
                                        <FormControl fullWidth size="small">
                                            <InputLabel>Tỉnh / Thành phố</InputLabel>
                                            <Select
                                                value={filters.provinceId}
                                                label="Tỉnh / Thành phố"
                                                startAdornment={
                                                    <LocationCity sx={{ mr: 1, color: "text.secondary" }} />
                                                }
                                                onChange={(e) =>
                                                    handleFilterChange("provinceId", e.target.value)
                                                }
                                            >
                                                <MenuItem value="">Tất cả</MenuItem>
                                                <MenuItem value="1">Hà Nội</MenuItem>
                                                <MenuItem value="2">TP. Hồ Chí Minh</MenuItem>
                                                <MenuItem value="3">Đà Nẵng</MenuItem>
                                                <MenuItem value="4">Hải Phòng</MenuItem>
                                            </Select>
                                        </FormControl>

                                        {/* Quận / Huyện */}
                                        <FormControl fullWidth size="small">
                                            <InputLabel>Quận / Huyện</InputLabel>
                                            <Select
                                                value={filters.communeId}
                                                label="Quận / Huyện"
                                                disabled={!filters.provinceId}
                                                startAdornment={<Place sx={{ mr: 1, color: "text.secondary" }} />}
                                                onChange={(e) =>
                                                    handleFilterChange("communeId", e.target.value)
                                                }
                                            >
                                                <MenuItem value="">Tất cả</MenuItem>
                                                <MenuItem value="1">Quận 1</MenuItem>
                                                <MenuItem value="2">Quận 2</MenuItem>
                                                <MenuItem value="3">Quận 3</MenuItem>
                                            </Select>
                                        </FormControl>

                                        {/* Mã số thuế */}
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="Mã số thuế"
                                            value={filters.taxCode}
                                            onChange={(e) => handleFilterChange("taxCode", e.target.value)}
                                            InputProps={{
                                                startAdornment: (
                                                    <Numbers sx={{ mr: 1, color: "text.secondary" }} />
                                                ),
                                            }}
                                        />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Box>

                        {/* Right Side - Results */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            {isLoading ? (
                                <Box sx={{ textAlign: 'center', py: 8 }}>
                                    <Typography>Đang tải...</Typography>
                                </Box>
                            ) : organizations.length === 0 ? (
                                <Card sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
                                    <Typography variant="h6" color="text.secondary">
                                        Không tìm thấy tổ chức nào
                                    </Typography>
                                    <Typography color="text.secondary" sx={{ mt: 1 }}>
                                        Vui lòng thử điều chỉnh bộ lọc của bạn
                                    </Typography>
                                </Card>
                            ) : (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    {organizations.map((org: any) => (
                                        <Card
                                            key={org.SeoUrl}
                                            sx={{
                                                borderRadius: 3,
                                                boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                                                transition: '0.25s',
                                                '&:hover': {
                                                    transform: 'translateY(-4px)',
                                                    boxShadow: '0 16px 40px rgba(0,0,0,0.12)',
                                                },
                                            }}
                                        >
                                            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', position: 'relative' }}>

                                                    {/* Logo */}
                                                    <Box
                                                        sx={{
                                                            width: { xs: 72, md: 100 },
                                                            height: { xs: 72, md: 100 },
                                                            borderRadius: 2,
                                                            overflow: 'hidden',
                                                            bgcolor: '#f5f5f5',
                                                            flexShrink: 0,
                                                        }}
                                                    >
                                                        {org.LogoFullUrl ? (
                                                            <img
                                                                src={org.LogoFullUrl}
                                                                alt={org.Name}
                                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                            />
                                                        ) : (
                                                            <School sx={{ fontSize: 48, color: '#ccc', m: 'auto' }} />
                                                        )}
                                                    </Box>

                                                    {/* Content */}
                                                    <Box sx={{ flex: 1 }}>
                                                        {/* Title + TOP */}
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <Typography
                                                                variant="h6"
                                                                sx={{
                                                                    fontWeight: 700,
                                                                    cursor: 'pointer',
                                                                    '&:hover': { color: 'primary.main' },
                                                                }}
                                                                onClick={() => handleViewDetail(org.SeoUrl)}
                                                            >
                                                                {org.Name}
                                                            </Typography>

                                                            {org.IsTop && (
                                                                <Chip
                                                                    label="TOP"
                                                                    color="primary"
                                                                    size="small"
                                                                    sx={{ fontWeight: 600 }}
                                                                />
                                                            )}
                                                        </Box>

                                                        {/* Ngành */}
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                                            <School sx={{ fontSize: 18, color: 'text.secondary' }} />
                                                            <Typography variant="body2" color="text.secondary">
                                                                {org.MainProfession || 'Chưa cập nhật ngành nghề'}
                                                            </Typography>
                                                        </Box>

                                                        {/* Địa chỉ */}
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                                            <LocationOn sx={{ fontSize: 18, color: 'text.secondary' }} />
                                                            <Typography variant="body2" color="text.secondary">
                                                                {`${org.Address}, ${org.Commune}, ${org.Province}`}
                                                            </Typography>
                                                        </Box>

                                                        {/* MST */}
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                                            <Code sx={{ fontSize: 18, color: 'text.secondary' }} />
                                                            <Typography variant="body2" color="text.secondary">
                                                                {org.TaxCode || 'Chưa cập nhật MST'}
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
        </ThemeProvider>
    );
};

export default OrganizationSearchPage;