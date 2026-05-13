import { lazy } from "react";
import ArrowForward from "@mui/icons-material/ArrowForward";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import FilterAlt from "@mui/icons-material/FilterAlt";
import LocationOn from "@mui/icons-material/LocationOn";
import School from "@mui/icons-material/School";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import { useRef, useState } from "react";
import { useGetAllProvinceNoAuthenQuery } from "../../../app/features/province.api";
import { useGetAllProfessionNoAuthenQuery } from "../../../app/features/profession.api";
import { useNavigate } from "react-router-dom";
import { useGetRecruitmentPostsByPageQuery } from "../../../app/features/recruitment-post.api";
import { DEFAULT_PAGE, PAGE_SIZE } from "../../../constants/common.constant";
import { styled, Typography } from "@mui/material";
import LoadingOverlay from "../loading-overlay";
const RecruitmentPostSelectActionCard = lazy(() => import("../../cards/recruitment-post.card"));
const OrganizationPagination = lazy(() => import("../../pagination/organization-pagination"));

const sectionWrapperSx = {
    width: "100%",
    maxWidth: 1200,
    mx: "auto",
    bgcolor: "#fff",
    borderRadius: 2,
    border: "1px solid #eee",
    boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
    p: { xs: 1, sm: 1.5, md: 2 },
};

const Badge = styled(Box)({
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    background: "linear-gradient(135deg, #faa11b, #f5b95e)",
    padding: "6px 16px",
    borderRadius: "40px",
    boxShadow: "0 4px 15px rgba(250, 161, 27, 0.2)",
});

const RecruitmentPostComponent = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(DEFAULT_PAGE);
    const [filterType, setFilterType] = useState<FilterType>("province");
    const [selectedProvinceId, setSelectedProvinceId] = useState<string>("");
    const [selectedProfessionId, setSelectedProfessionId] = useState<string>("");
    const { data: provinces = [] } = useGetAllProvinceNoAuthenQuery();
    const { data: professions = [] } = useGetAllProfessionNoAuthenQuery();
    const { data: recruitmentPostData, isLoading, isError } = useGetRecruitmentPostsByPageQuery({
        page: page,
        size: PAGE_SIZE,
        provinceId: selectedProvinceId || undefined,
        professionId: selectedProfessionId || undefined,
    });
    const recruitmentPosts = recruitmentPostData?.Items || [];
    type FilterType = "province" | "profession";

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

    // Handle filter type change
    const handleFilterTypeChange = (newFilterType: FilterType) => {
        setFilterType(newFilterType);
        setSelectedProvinceId("");
        setSelectedProfessionId("");
        setPage(DEFAULT_PAGE);
    };


    const totalRecruitmentPostPages = recruitmentPostData ? Math.ceil(recruitmentPostData.Total / PAGE_SIZE) : 1;
    return (
        <Box sx={sectionWrapperSx}>
            {/* Header */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexWrap: "wrap", gap: { xs: 1.5, sm: 2 } }}>
                <Badge sx={{ padding: { xs: "5px 12px", sm: "6px 16px" }, gap: { xs: "6px", sm: "8px" } }}>
                    <School sx={{ fontSize: { xs: 18, sm: 20 }, color: "#ffffff" }} />
                    <Typography
                        sx={{
                            fontSize: { xs: "0.7rem", sm: "0.75rem" },
                            fontWeight: 700,
                            color: "#ffffff",
                            letterSpacing: { xs: 0.5, sm: 1 },
                            textTransform: "uppercase",
                            lineHeight: 1.3,
                        }}
                    >
                        Chương trình tuyển sinh
                    </Typography>
                </Badge>

                <Button
                    variant="outlined"
                    endIcon={<ArrowForward />}
                    onClick={() => navigate("/chuong-trinh-tuyen-sinh")}
                    size="small"
                    sx={{
                        borderColor: "#ff5722",
                        color: "#ff5722",
                        fontSize: { xs: "0.7rem", sm: "0.75rem" },
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                        "&:hover": {
                            bgcolor: "#ff5722",
                            color: "#fff",
                            borderColor: "#ff5722"
                        },
                    }}
                >
                    Xem tất cả
                </Button>
            </Box>

            {/* Filter */}
            <Box sx={{ mb: 2 }}>
                <Box sx={{ width: "100%", maxWidth: 1200, mb: 2 }}>
                    <Stack
                        direction={{ xs: "column", md: "row" }}
                        spacing={1}
                        alignItems={{ xs: "stretch", md: "center" }}
                    >
                        <FormControl sx={{ minWidth: 260 }} size="small">
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
                                                px: 1.5,
                                                py: 0.5,
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
                                                px: 1.5,
                                                py: 0.5,
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
            <LoadingOverlay open={isLoading} error={isError} empty={recruitmentPosts.length === 0}>
                {/* Content */}
                <RecruitmentPostSelectActionCard recruitmentPosts={recruitmentPosts} />
            </LoadingOverlay>

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
    );
}

export default RecruitmentPostComponent;