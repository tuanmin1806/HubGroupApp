import { ThemeProvider } from "@emotion/react";
import { createTheme, Box, TextField, Button, Card, CardContent, Typography, FormControl, InputLabel, Select, MenuItem, Chip } from "@mui/material";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useOrganizationsFullTextSearchQuery } from "../../../app/features/organization.api";
import OrganizationPagination from "../../../components/pagination/organization-pagination";
import { DEFAULT_PAGE, PAGE_SIZE } from "../../../constants/common.constant";
import { CalendarToday, LocationOn, School, Search, Visibility } from "@mui/icons-material";

const theme = createTheme({
    palette: {
        primary: {
            main: "#007FFF",
            dark: "#0066CC",
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

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters({ ...filters, nameSearch: e.target.value });
    };

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
        navigate(`/chi-tiet-to-chuc/${organizationId}`);
    };

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
                <Box sx={{ maxWidth: 1400, margin: '0 auto', px: 3 }}>
                    {/* Search Bar */}
                    <Box sx={{ mb: 4, bgcolor: 'white', p: 3, borderRadius: 2, boxShadow: 1 }}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                fullWidth
                                placeholder="Tìm kiếm tổ chức..."
                                value={filters.nameSearch}
                                onChange={handleSearchChange}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                InputProps={{
                                    startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />,
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                    }
                                }}
                            />
                            <Button
                                variant="contained"
                                onClick={handleSearch}
                                sx={{
                                    minWidth: 120,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontSize: 16
                                }}
                            >
                                Tìm kiếm
                            </Button>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 3, flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
                        {/* Left Sidebar - Filters */}
                        <Box sx={{ width: { xs: '100%', md: '300px' }, flexShrink: 0 }}>
                            <Card sx={{ borderRadius: 2, position: { md: 'sticky' }, top: 20 }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#ff5722' }}>
                                        Lọc nâng cao
                                    </Typography>

                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                        <FormControl fullWidth size="small">
                                            <InputLabel>Loại tổ chức</InputLabel>
                                            <Select
                                                value={filters.organizationTypeId}
                                                label="Loại tổ chức"
                                                onChange={(e) => handleFilterChange('organizationTypeId', e.target.value)}
                                            >
                                                <MenuItem value="">Tất cả</MenuItem>
                                                <MenuItem value="1">Đại học</MenuItem>
                                                <MenuItem value="2">Cao đẳng</MenuItem>
                                                <MenuItem value="3">Trung cấp</MenuItem>
                                            </Select>
                                        </FormControl>

                                        <FormControl fullWidth size="small">
                                            <InputLabel>Ngành nghề</InputLabel>
                                            <Select
                                                value={filters.professionId}
                                                label="Ngành nghề"
                                                onChange={(e) => handleFilterChange('professionId', e.target.value)}
                                            >
                                                <MenuItem value="">Tất cả</MenuItem>
                                                <MenuItem value="1">Công nghệ thông tin</MenuItem>
                                                <MenuItem value="2">Kinh tế</MenuItem>
                                                <MenuItem value="3">Y khoa</MenuItem>
                                                <MenuItem value="4">Kỹ thuật</MenuItem>
                                            </Select>
                                        </FormControl>

                                        <FormControl fullWidth size="small">
                                            <InputLabel>Tỉnh/Thành phố</InputLabel>
                                            <Select
                                                value={filters.provinceId}
                                                label="Tỉnh/Thành phố"
                                                onChange={(e) => handleFilterChange('provinceId', e.target.value)}
                                            >
                                                <MenuItem value="">Tất cả</MenuItem>
                                                <MenuItem value="1">Hà Nội</MenuItem>
                                                <MenuItem value="2">TP. Hồ Chí Minh</MenuItem>
                                                <MenuItem value="3">Đà Nẵng</MenuItem>
                                                <MenuItem value="4">Hải Phòng</MenuItem>
                                            </Select>
                                        </FormControl>

                                        <FormControl fullWidth size="small">
                                            <InputLabel>Quận/Huyện</InputLabel>
                                            <Select
                                                value={filters.communeId}
                                                label="Quận/Huyện"
                                                onChange={(e) => handleFilterChange('communeId', e.target.value)}
                                                disabled={!filters.provinceId}
                                            >
                                                <MenuItem value="">Tất cả</MenuItem>
                                                <MenuItem value="1">Quận 1</MenuItem>
                                                <MenuItem value="2">Quận 2</MenuItem>
                                                <MenuItem value="3">Quận 3</MenuItem>
                                            </Select>
                                        </FormControl>

                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="Mã số thuế"
                                            value={filters.taxCode}
                                            onChange={(e) => handleFilterChange('taxCode', e.target.value)}
                                        />

                                        <Button
                                            variant="outlined"
                                            onClick={handleClearFilters}
                                            sx={{
                                                mt: 1,
                                                borderRadius: 2,
                                                textTransform: 'none'
                                            }}
                                        >
                                            Xóa bộ lọc
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Box>

                        {/* Right Side - Results */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                                    Tìm thấy <strong>{organizationData?.Total || 0}</strong> tổ chức
                                </Typography>
                            </Box>

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
                                            key={org.Id}
                                            sx={{
                                                borderRadius: 2,
                                                transition: 'all 0.3s',
                                                '&:hover': {
                                                    boxShadow: 4,
                                                    transform: 'translateY(-2px)'
                                                }
                                            }}
                                        >
                                            <CardContent>
                                                <Box sx={{ display: 'flex', gap: 2 }}>
                                                    {/* Organization Image */}
                                                    <Box
                                                        sx={{
                                                            width: 120,
                                                            height: 120,
                                                            borderRadius: 2,
                                                            overflow: 'hidden',
                                                            flexShrink: 0,
                                                            bgcolor: '#f0f0f0',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}
                                                    >
                                                        {org.Logo || org.Image ? (
                                                            <img
                                                                src={org.Logo || org.Image}
                                                                alt={org.Name}
                                                                style={{
                                                                    width: '100%',
                                                                    height: '100%',
                                                                    objectFit: 'cover'
                                                                }}
                                                            />
                                                        ) : (
                                                            <School sx={{ fontSize: 48, color: '#ccc' }} />
                                                        )}
                                                    </Box>

                                                    {/* Organization Info */}
                                                    <Box sx={{ flex: 1 }}>
                                                        <Typography
                                                            variant="h6"
                                                            sx={{
                                                                fontWeight: 'bold',
                                                                color: '#007FFF',
                                                                mb: 1,
                                                                cursor: 'pointer',
                                                                '&:hover': {
                                                                    textDecoration: 'underline'
                                                                }
                                                            }}
                                                            onClick={() => handleViewDetail(org.Id)}
                                                        >
                                                            {org.Name || 'Tên tổ chức'}
                                                        </Typography>

                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                            <School sx={{ fontSize: 18, color: 'text.secondary' }} />
                                                            <Typography variant="body2" color="text.secondary">
                                                                {org.Profession || org.ProfessionName || 'Chưa cập nhật ngành nghề'}
                                                            </Typography>
                                                        </Box>

                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                            <LocationOn sx={{ fontSize: 18, color: 'text.secondary' }} />
                                                            <Typography variant="body2" color="text.secondary">
                                                                {org.Address || org.Province || 'Chưa cập nhật địa chỉ'}
                                                            </Typography>
                                                        </Box>

                                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
                                                                <Typography variant="caption" color="text.secondary">
                                                                    {org.CreatedAt ? new Date(org.CreatedAt).toLocaleDateString('vi-VN') : 'N/A'}
                                                                </Typography>
                                                            </Box>

                                                            <Button
                                                                variant="contained"
                                                                size="small"
                                                                startIcon={<Visibility />}
                                                                onClick={() => handleViewDetail(org.Id)}
                                                                sx={{
                                                                    textTransform: 'none',
                                                                    borderRadius: 2
                                                                }}
                                                            >
                                                                Xem chi tiết
                                                            </Button>
                                                        </Box>

                                                        {org.Tags && (
                                                            <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                                {org.Tags.map((tag: string, index: number) => (
                                                                    <Chip
                                                                        key={index}
                                                                        label={tag}
                                                                        size="small"
                                                                        sx={{ borderRadius: 1 }}
                                                                    />
                                                                ))}
                                                            </Box>
                                                        )}
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