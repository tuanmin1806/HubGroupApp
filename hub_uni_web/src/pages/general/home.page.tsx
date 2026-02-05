import { Box, Button, createTheme, FormControl, IconButton, InputLabel, MenuItem, Select, Stack, ThemeProvider } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../components/searchs/search-bar.search";
import SearchTabs from "../../components/searchs/search-tab.search";
import ArticleCard from "../../components/cards/article-card.card";
import { useOrganizationsFullTextSearchQuery } from "../../app/features/organization.api";
import OrganizationSelectActionCard from "../../components/cards/organization-card.card";
import { DEFAULT_PAGE, PAGE_SIZE } from "../../constants/common.constant";
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


const HomePage = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(DEFAULT_PAGE);
    const { data: provinces = [] } = useGetAllProvinceNoAuthenQuery();
    const { data: professions = [] } = useGetAllProfessionNoAuthenQuery();
    type FilterType = "province" | "profession";

    const [filterType, setFilterType] = useState<FilterType>("province");

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
        if (!provinceListRef.current) return;

        const scrollAmount = 300;
        provinceListRef.current.scrollBy({
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

    const { data: organizationData } = useOrganizationsFullTextSearchQuery({ page: page, size: PAGE_SIZE, });
    const { data: articleData } = useGetArticlesByPageNoAuthenQuery({ page: page, size: PAGE_SIZE, });
    const { data: recruitmentPostData } = useGetRecruitmentPostsByPageQuery({ page: page, size: PAGE_SIZE, });

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
                        bgcolor: '#ee6a28',
                        py: 3
                    }}
                >
                    <Box sx={{
                        color: 'white',
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


                <Grid
                    container
                    direction="column"
                    alignItems="center"
                    sx={{
                        py: 3
                    }}
                >
                    <Box
                        sx={{
                            width: "100%",
                            maxWidth: 1200,
                            color: "#ff5722",
                            fontSize: 28,
                            fontWeight: "bold",
                            mb: 2,
                            textAlign: "left",
                        }}
                    >
                        Tin tuyển sinh
                    </Box>
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
                                    onChange={(e) => setFilterType(e.target.value as FilterType)}
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
                                                    "&:hover": {
                                                        backgroundColor: "#ff5722",
                                                        color: "white",
                                                        borderColor: "#ff5722",
                                                    },
                                                }}
                                                onClick={() => {
                                                    console.log("Selected province:", province.Id);
                                                }}
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
                                                    "&:hover": {
                                                        backgroundColor: "#ff5722",
                                                        color: "white",
                                                        borderColor: "#ff5722",
                                                    },
                                                }}
                                                onClick={() => {
                                                    console.log("Selected province:", profession.Id);
                                                }}
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
                    <Box
                        sx={{
                            width: "100%",
                            maxWidth: 1200,
                            mx: "auto",
                            overflow: "hidden",
                        }}>
                        <RecruitmentPostSelectActionCard recruitmentPosts={recruitmentPosts} />
                        <OrganizationPagination
                            page={page}
                            totalPages={totalRecruitmentPostPages}
                            onPrev={() => setPage((p) => p - 1)}
                            onNext={() => setPage((p) => p + 1)}
                        />
                    </Box>
                </Grid>

                <Grid
                    container
                    direction="column"
                    alignItems="center"
                    sx={{ py: 3 }}
                >
                    {/* Title */}
                    <Box
                        sx={{
                            width: "100%",
                            maxWidth: 1200,
                            color: "#ff5722",
                            fontSize: 28,
                            fontWeight: "bold",
                            mb: 1,
                            textAlign: "left",
                        }}
                    >
                        Tổ chức
                    </Box>

                    {/* Content */}
                    <Box
                        sx={{
                            width: "100%",
                            maxWidth: 1200,
                        }}
                    >

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
                                    minWidth: 0,
                                    "&::-webkit-scrollbar": { display: "none" },
                                    msOverflowStyle: "none",
                                    scrollbarWidth: "none",
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
                                            transition: "all .2s",
                                            "&:hover": {
                                                backgroundColor: "#ff5722",
                                                color: "white",
                                                borderColor: "#ff5722",
                                            },
                                        }}
                                        onClick={() => {
                                            console.log("Selected profession:", profession.Id);
                                        }}
                                    >
                                        <School fontSize="small" />
                                        {profession.Name}
                                    </Box>
                                ))}
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
                        <OrganizationSelectActionCard organizations={organizationts} />
                        <OrganizationPagination
                            page={page}
                            totalPages={totalOrganizationPages}
                            onPrev={() => setPage((p) => p - 1)}
                            onNext={() => setPage((p) => p + 1)}
                        />
                    </Box>
                </Grid>

                <Grid container direction="column" alignItems="center" sx={{ py: 3 }}>
                    <Box
                        sx={{
                            width: "100%",
                            maxWidth: 1200,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            mb: 2,
                        }}
                    >
                        {/* Title */}
                        <Box
                            sx={{
                                color: "#ff5722",
                                fontSize: 28,
                                fontWeight: "bold",
                            }}
                        >
                            Bài viết
                        </Box>

                        {/* Button */}
                        <Button
                            variant="outlined"
                            endIcon={<ArrowForward />}
                            onClick={() => navigate("/danh-sach-bai-viet")}
                            sx={{
                                borderColor: "#ff5722",
                                color: "#ff5722",
                                fontWeight: 500,
                                "&:hover": {
                                    backgroundColor: "#ff5722",
                                    color: "#fff",
                                    borderColor: "#ff5722",
                                },
                            }}
                        >
                            Xem tất cả
                        </Button>
                    </Box>

                    <Box
                        sx={{
                            width: "100%",
                            maxWidth: 1200,
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                            gap: 3,
                        }}
                    >
                        {articles.map((article) => (
                            <ArticleCard key={article.Id} article={article} />
                        ))}
                    </Box>
                </Grid>
            </ThemeProvider>
        </>
    );
};

export default HomePage;