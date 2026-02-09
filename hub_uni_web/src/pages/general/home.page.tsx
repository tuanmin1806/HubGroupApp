import { Box, Button, createTheme, FormControl, IconButton, InputLabel, MenuItem, Select, Stack, ThemeProvider } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../components/searchs/search-bar.search";
import SearchTabs from "../../components/searchs/search-tab.search";
import ArticleCard from "../../components/cards/article-card.card";
import { useOrganizationsFullTextSearchQuery } from "../../app/features/organization.api";
import OrganizationSelectActionCard from "../../components/cards/organization-card.card";
import { BACKGROUND_COLOR, DEFAULT_PAGE, PAGE_SIZE, TEXT_COLOR } from "../../constants/common.constant";
import OrganizationPagination from "../../components/pagination/organization-pagination";
import { useGetArticlesByPageNoAuthenQuery } from "../../app/features/article.api";
import RecruitmentPostSelectActionCard from "../../components/cards/recruitment-post.card";
import { useGetRecruitmentPostsByPageQuery } from "../../app/features/recruitment-post.api";
import Grid from "@mui/material/Grid";
import { useGetAllProvinceNoAuthenQuery } from "../../app/features/province.api";
import { ArrowForward, ChevronLeft, ChevronRight, FilterAlt, LocationOn, School } from "@mui/icons-material";
import { useGetAllProfessionNoAuthenQuery } from "../../app/features/profession.api";

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
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(","),
    },
});

const sectionWrapperSx = {
    width: "100%",
    maxWidth: 1200,
    mx: "auto",
    bgcolor: "#fff",
    borderRadius: 2,
    border: "1px solid #eee",
    boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
    p: { xs: 2, md: 2 },
};


const HomePage = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(DEFAULT_PAGE);
    const { data: provinces = [] } = useGetAllProvinceNoAuthenQuery();
    const { data: professions = [] } = useGetAllProfessionNoAuthenQuery();
    type FilterType = "province" | "profession";

    const [filterType, setFilterType] = useState<FilterType>("province");
    const [selectedProvinceId, setSelectedProvinceId] = useState<string>("");
    const [selectedProfessionId, setSelectedProfessionId] = useState<string>("");
    const [orgProfessionId, setOrgProfessionId] = useState<string>("");

    const provinceListRef = useRef<HTMLDivElement>(null);
    const professionListRef = useRef<HTMLDivElement>(null);

    const scrollProvince = (direction: "left" | "right") => {
        if (!provinceListRef.current) return;

        const scrollAmount = 300;
        provinceListRef.current.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth",
        });
    };

    const scrollProfession = (direction: "left" | "right") => {
        if (!professionListRef.current) return;

        const scrollAmount = 300;
        professionListRef.current.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth",
        });
    };

    const handleSearch = (query: string, provinceId: string) => {
        const params = new URLSearchParams();

        if (query.trim()) {
            params.append('search', query.trim());
        }

        if (provinceId) {
            params.append('provinceId', provinceId);
        }

        if (params.toString()) {
            navigate(`/tim-kiem-to-chuc?${params.toString()}`);
        }
    };

    // Handle province selection
    const handleProvinceSelect = (provinceId: string) => {
        setSelectedProvinceId(provinceId);
        setPage(DEFAULT_PAGE);
    };

    // Handle profession selection
    const handleProfessionSelect = (professionId: string) => {
        setSelectedProfessionId(professionId);
        setPage(DEFAULT_PAGE);
    };

    // Handle filter type change
    const handleFilterTypeChange = (newFilterType: FilterType) => {
        setFilterType(newFilterType);
        setSelectedProvinceId("");
        setSelectedProfessionId("");
        setPage(DEFAULT_PAGE);
    };

    const { data: articleData } = useGetArticlesByPageNoAuthenQuery({ page: page, size: PAGE_SIZE, });
    const { data: organizationData } = useOrganizationsFullTextSearchQuery({
        page: page,
        size: PAGE_SIZE,
        professionId: orgProfessionId || undefined,
    });
    const { data: recruitmentPostData } = useGetRecruitmentPostsByPageQuery({
        page: page,
        size: PAGE_SIZE,
        provinceId: selectedProvinceId || undefined,
        professionId: selectedProfessionId || undefined,
    });

    const totalOrganizationPages = organizationData ? Math.ceil(organizationData.Total / PAGE_SIZE) : 1;
    const totalRecruitmentPostPages = recruitmentPostData ? Math.ceil(recruitmentPostData.Total / PAGE_SIZE) : 1;

    const organizationts = organizationData?.Items || [];
    const articles = articleData?.Items || [];
    const recruitmentPosts = recruitmentPostData?.Items || [];

    useEffect(() => {
        document.title = "Trang Chủ | HUB UNI";
    }, [navigate]);

    return (
        <>
            <ThemeProvider theme={theme}>
                <Grid
                    container
                    direction="column"
                    alignItems="center"
                    sx={{
                        bgcolor: BACKGROUND_COLOR,
                        py: 3
                    }}
                >
                    <Box sx={{
                        color: TEXT_COLOR,
                        fontSize: 28,
                        fontWeight: 'bold',
                        mb: 2
                    }}
                    >
                        Tra cứu thông tin tuyển sinh đại học nhanh chóng và chính xác
                    </Box>

                    <Box sx={{
                        width: "100%",
                        maxWidth: 1200,
                    }}
                    >
                        <Box>
                            <SearchBar onSearch={handleSearch} />
                        </Box>

                        <Box sx={{
                            mt: 2
                        }}
                        >
                            <SearchTabs />
                        </Box>
                    </Box>
                </Grid>


                <Grid container justifyContent="center" sx={{ py: 4 }}>
                    <Box sx={sectionWrapperSx}>
                        {/* Header */}
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                mb: 3,
                            }}
                        >
                            <Box sx={{ color: "#ff5722", fontSize: 26, fontWeight: 700 }}>
                                Tin tuyển sinh
                            </Box>

                            <Button
                                variant="outlined"
                                endIcon={<ArrowForward />}
                                onClick={() => navigate("/tin-tuyen-sinh")}
                                sx={{
                                    borderColor: "#ff5722",
                                    color: "#ff5722",
                                    "&:hover": {
                                        bgcolor: "#ff5722",
                                        color: "#fff",
                                    },
                                }}
                            >
                                Xem tất cả
                            </Button>
                        </Box>

                        {/* Filter */}
                        <Box sx={{ mb: 3 }}>
                            <Box sx={{ width: "100%", maxWidth: 1200, mb: 2 }}>
                                <Stack
                                    direction={{ xs: "column", md: "row" }}
                                    spacing={2}
                                    alignItems={{ xs: "stretch", md: "center" }}
                                >
                                    <FormControl sx={{ minWidth: 260 }}>
                                        <InputLabel>
                                            <FilterAlt />
                                            Lọc
                                        </InputLabel>
                                        <Select
                                            value={filterType}
                                            label="Chọn kiểu lọc"
                                            onChange={(e) => handleFilterTypeChange(e.target.value as FilterType)}
                                        >
                                            <MenuItem value="province">
                                                <LocationOn fontSize="small" sx={{ mr: 1 }} />
                                                Lọc theo tỉnh / thành phố
                                            </MenuItem>
                                            <MenuItem value="profession">
                                                <School fontSize="small" sx={{ mr: 1 }} />
                                                Lọc theo ngành nghề
                                            </MenuItem>
                                        </Select>
                                    </FormControl>

                                    {filterType === "province" && (
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                                width: "100%",
                                                maxWidth: "100%",
                                                overflow: "hidden",
                                            }}
                                        >
                                            {/* Arrow Left */}
                                            <IconButton onClick={() => scrollProvince("left")}>
                                                <ChevronLeft />
                                            </IconButton>

                                            {/* Province list */}
                                            <Box
                                                ref={provinceListRef}
                                                sx={{
                                                    display: "flex",
                                                    gap: 1,
                                                    overflowX: "auto",
                                                    scrollBehavior: "smooth",
                                                    "&::-webkit-scrollbar": {
                                                        display: "none",
                                                    },
                                                    msOverflowStyle: "none",
                                                    scrollbarWidth: "none",
                                                    flex: 1,
                                                }}
                                            >
                                                {provinces.map((province) => (
                                                    <Box
                                                        key={province.Id}
                                                        sx={{
                                                            px: 2,
                                                            py: 1,
                                                            border: "1px solid #ddd",
                                                            borderRadius: 20,
                                                            cursor: "pointer",
                                                            fontSize: 14,
                                                            whiteSpace: "nowrap",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: 0.5,
                                                            flexShrink: 0,
                                                            backgroundColor: selectedProvinceId === province.Id ? "#ff5722" : "transparent",
                                                            color: selectedProvinceId === province.Id ? "white" : "inherit",
                                                            borderColor: selectedProvinceId === province.Id ? "#ff5722" : "#ddd",
                                                            "&:hover": {
                                                                backgroundColor: "#ff5722",
                                                                color: "white",
                                                                borderColor: "#ff5722",
                                                            },
                                                        }}
                                                        onClick={() => handleProvinceSelect(province.Id)}
                                                    >
                                                        <LocationOn fontSize="small" />
                                                        {province.Name}
                                                    </Box>
                                                ))}
                                            </Box>

                                            {/* Arrow Right */}
                                            <IconButton onClick={() => scrollProvince("right")}>
                                                <ChevronRight />
                                            </IconButton>
                                        </Box>
                                    )}

                                    {filterType === "profession" && (
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                                width: "100%",
                                                maxWidth: "100%",
                                                overflow: "hidden",
                                            }}
                                        >
                                            {/* Arrow Left */}
                                            <IconButton onClick={() => scrollProfession("left")}>
                                                <ChevronLeft />
                                            </IconButton>

                                            {/* Profession list */}
                                            <Box
                                                ref={professionListRef}
                                                sx={{
                                                    display: "flex",
                                                    gap: 1,
                                                    overflowX: "auto",
                                                    scrollBehavior: "smooth",
                                                    "&::-webkit-scrollbar": {
                                                        display: "none",
                                                    },
                                                    msOverflowStyle: "none",
                                                    scrollbarWidth: "none",
                                                    flex: 1,
                                                }}
                                            >
                                                {professions.map((profession) => (
                                                    <Box
                                                        key={profession.Id}
                                                        sx={{
                                                            px: 2,
                                                            py: 1,
                                                            border: "1px solid #ddd",
                                                            borderRadius: 20,
                                                            cursor: "pointer",
                                                            fontSize: 14,
                                                            whiteSpace: "nowrap",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: 0.5,
                                                            flexShrink: 0,
                                                            backgroundColor: selectedProfessionId === profession.Id ? "#ff5722" : "transparent",
                                                            color: selectedProfessionId === profession.Id ? "white" : "inherit",
                                                            borderColor: selectedProfessionId === profession.Id ? "#ff5722" : "#ddd",
                                                            "&:hover": {
                                                                backgroundColor: "#ff5722",
                                                                color: "white",
                                                                borderColor: "#ff5722",
                                                            },
                                                        }}
                                                        onClick={() => handleProfessionSelect(profession.Id)}
                                                    >
                                                        <School fontSize="small" />
                                                        {profession.Name}
                                                    </Box>
                                                ))}
                                            </Box>

                                            {/* Arrow Right */}
                                            <IconButton onClick={() => scrollProfession("right")}>
                                                <ChevronRight />
                                            </IconButton>
                                        </Box>
                                    )}
                                </Stack>
                            </Box>
                        </Box>

                        {/* Active Filters Display */}
                        {(selectedProvinceId || selectedProfessionId) && (
                            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                <Box sx={{ fontSize: 14, color: 'text.secondary' }}>
                                    Đang lọc:
                                </Box>
                                {selectedProvinceId && (
                                    <Box
                                        sx={{
                                            px: 2,
                                            py: 0.5,
                                            bgcolor: '#ff5722',
                                            color: 'white',
                                            borderRadius: 20,
                                            fontSize: 13,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 0.5
                                        }}
                                    >
                                        <LocationOn fontSize="small" />
                                        {provinces.find(p => p.Id === selectedProvinceId)?.Name}
                                    </Box>
                                )}
                                {selectedProfessionId && (
                                    <Box
                                        sx={{
                                            px: 2,
                                            py: 0.5,
                                            bgcolor: '#ff5722',
                                            color: 'white',
                                            borderRadius: 20,
                                            fontSize: 13,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 0.5
                                        }}
                                    >
                                        <School fontSize="small" />
                                        {professions.find(p => p.Id === selectedProfessionId)?.Name}
                                    </Box>
                                )}
                                <Button
                                    size="small"
                                    onClick={() => {
                                        setSelectedProvinceId("");
                                        setSelectedProfessionId("");
                                        setPage(DEFAULT_PAGE);
                                    }}
                                    sx={{
                                        fontSize: 12,
                                        textTransform: 'none',
                                        color: '#ff5722'
                                    }}
                                >
                                    Xóa bộ lọc
                                </Button>
                            </Box>
                        )}

                        {/* Content */}
                        <RecruitmentPostSelectActionCard recruitmentPosts={recruitmentPosts} />

                        {/* Pagination */}
                        <Box sx={{ mt: 2 }}>
                            <OrganizationPagination
                                page={page}
                                totalPages={totalRecruitmentPostPages}
                                onPrev={() => setPage((p) => p - 1)}
                                onNext={() => setPage((p) => p + 1)}
                            />
                        </Box>
                    </Box>
                </Grid>

                <Grid container justifyContent="center" sx={{ py: 4 }}>
                    <Box sx={sectionWrapperSx}>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mb: 3,
                            }}
                        >
                            <Box sx={{ color: "#ff5722", fontSize: 26, fontWeight: 700 }}>
                                Tổ chức
                            </Box>

                            <Button
                                sx={{
                                    borderColor: "#ff5722",
                                    color: "#ff5722",
                                    "&:hover": {
                                        bgcolor: "#ff5722",
                                        color: "#fff",
                                    },
                                }}
                                variant="outlined"
                                endIcon={<ArrowForward />}
                                onClick={() => navigate("/tim-kiem-to-chuc")}
                            >
                                Xem tất cả
                            </Button>
                        </Box>

                        {/* Filter ngang */}
                        <Box sx={{ mb: 3 }}>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    width: "100%",
                                    maxWidth: "100%",
                                    overflow: "hidden",
                                    mb: 2
                                }}
                            >
                                {/* Profession list */}
                                <Box
                                    ref={professionListRef}
                                    sx={{
                                        display: "flex",
                                        gap: 1,
                                        overflowX: "auto",
                                        scrollBehavior: "smooth",
                                        flex: 1,
                                        "&::-webkit-scrollbar": { display: "none" },
                                        msOverflowStyle: "none",
                                        scrollbarWidth: "none",
                                    }}
                                >
                                    {professions.map((profession) => {
                                        const active = orgProfessionId === profession.Id;

                                        return (
                                            <Box
                                                key={profession.Id}
                                                onClick={() => {
                                                    setOrgProfessionId(profession.Id);
                                                    setPage(DEFAULT_PAGE);
                                                }}
                                                sx={{
                                                    px: 2,
                                                    py: 1,
                                                    border: "1px solid",
                                                    borderColor: active ? "#ff5722" : "#ddd",
                                                    borderRadius: 20,
                                                    cursor: "pointer",
                                                    fontSize: 14,
                                                    whiteSpace: "nowrap",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 0.5,
                                                    flexShrink: 0,
                                                    backgroundColor: active ? "#ff5722" : "transparent",
                                                    color: active ? "white" : "inherit",
                                                    transition: "all .2s",
                                                    "&:hover": {
                                                        backgroundColor: "#ff5722",
                                                        color: "white",
                                                        borderColor: "#ff5722",
                                                    },
                                                }}
                                            >
                                                <School fontSize="small" />
                                                {profession.Name}
                                            </Box>
                                        );
                                    })}
                                </Box>
                                {/* Arrow Left */}
                                <IconButton sx={{
                                    border: "1px solid #ddd",
                                    borderRadius: 10,
                                }} onClick={() => scrollProfession("left")}>
                                    <ChevronLeft />
                                </IconButton>
                                {/* Arrow Right */}
                                <IconButton sx={{
                                    border: "1px solid #ddd",
                                    borderRadius: 10,
                                }} onClick={() => scrollProfession("right")}>
                                    <ChevronRight />
                                </IconButton>
                            </Box>
                            {/* Active filter */}
                            {orgProfessionId && (
                                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                    <Box sx={{ fontSize: 14, color: 'text.secondary' }}>
                                        Đang lọc:
                                    </Box>
                                    <Box
                                        sx={{
                                            px: 2,
                                            py: 0.5,
                                            bgcolor: "#ff5722",
                                            color: "white",
                                            borderRadius: 20,
                                            fontSize: 13,
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 0.5,
                                        }}
                                    >
                                        <School fontSize="small" />
                                        {professions.find(p => p.Id === orgProfessionId)?.Name}
                                    </Box>

                                    <Button
                                        size="small"
                                        onClick={() => {
                                            setOrgProfessionId("");
                                            setPage(DEFAULT_PAGE);
                                        }}
                                        sx={{ fontSize: 12, textTransform: "none", color: "#ff5722" }}
                                    >
                                        Xóa bộ lọc
                                    </Button>
                                </Box>
                            )}
                        </Box>

                        <OrganizationSelectActionCard organizations={organizationts} />

                        <Box>
                            <OrganizationPagination
                                page={page}
                                totalPages={totalOrganizationPages}
                                onPrev={() => setPage((p) => p - 1)}
                                onNext={() => setPage((p) => p + 1)}
                            />
                        </Box>
                    </Box>
                </Grid>

                <Grid container justifyContent="center" sx={{ py: 2 }}>
                    <Box sx={sectionWrapperSx}>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mb: 2,
                            }}
                        >
                            <Box sx={{ color: "#ff5722", fontSize: 26, fontWeight: 700 }}>
                                Bài viết
                            </Box>

                            <Button
                                sx={{
                                    borderColor: "#ff5722",
                                    color: "#ff5722",
                                    "&:hover": {
                                        bgcolor: "#ff5722",
                                        color: "#fff",
                                    },
                                }}
                                variant="outlined"
                                endIcon={<ArrowForward />}
                                onClick={() => navigate("/danh-sach-bai-viet")}
                            >
                                Xem tất cả
                            </Button>
                        </Box>

                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                                gap: 3,
                            }}
                        >
                            {articles.map((article) => (
                                <ArticleCard key={article.Id} article={article} />
                            ))}
                        </Box>
                    </Box>
                </Grid>
            </ThemeProvider>
        </>
    );
};

export default HomePage;