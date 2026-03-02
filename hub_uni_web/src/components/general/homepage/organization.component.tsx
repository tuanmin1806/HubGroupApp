import { ArrowForward, School, ChevronLeft, ChevronRight, FilterAlt, Work, PeopleAlt, House } from "@mui/icons-material";
import { Box, Button, FormControl, IconButton, InputLabel, MenuItem, Select, Stack } from "@mui/material";
import { DEFAULT_PAGE, PAGE_SIZE } from "../../../constants/common.constant";
import OrganizationSelectActionCard from "../../cards/organization-card.card";
import OrganizationPagination from "../../pagination/organization-pagination";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { useGetAllProfessionNoAuthenQuery } from "../../../app/features/profession.api";
import { useOrganizationsFullTextSearchQuery, useOrganizationsGetByPageNoAuthenQuery } from "../../../app/features/organization.api";
import { useGetAllOrganizationTypesNoAuthenQuery } from "../../../app/features/organization-type.api";

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

const OrganizationComponent = () => {
    const navigate = useNavigate();
    type FilterType = "organizationType" | "profession";
    const [page, setPage] = useState(DEFAULT_PAGE);
    const [filterType, setFilterType] = useState<FilterType>("profession");
    const [selectedOrganizationTypeId, setSelectedOrganizationTypeId] = useState<string>("");
    const [selectedProfessionId, setSelectedProfessionId] = useState<string>("");
    const { data: professions = [] } = useGetAllProfessionNoAuthenQuery();
    const { data: organizationTypes = [] } = useGetAllOrganizationTypesNoAuthenQuery();
    const { data: organizationData } = useOrganizationsGetByPageNoAuthenQuery({
        page: page,
        size: PAGE_SIZE,
        professionId: selectedProfessionId || undefined,
        organizationTypeId: selectedOrganizationTypeId || undefined
    });
    const organizationts = organizationData?.Items || [];
    const totalOrganizationPages = organizationData ? Math.ceil(organizationData.Total / PAGE_SIZE) : 1;

    // Handle organization type selection
    const handleOrganizationTypeSelect = (organizationTypeId: string) => {
        setSelectedOrganizationTypeId(organizationTypeId);
        setPage(DEFAULT_PAGE);
    };

    // Handle profession selection
    const handleProfessionSelect = (professionId: string) => {
        setSelectedProfessionId(professionId);
        setPage(DEFAULT_PAGE);
    };
    const organizationTypeListRef = useRef<HTMLDivElement>(null);
    const professionListRef = useRef<HTMLDivElement>(null);
    const scrollProfession = (direction: "left" | "right") => {
        if (!professionListRef.current) return;

        const scrollAmount = 300;
        professionListRef.current.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth",
        });
    };

    const scrollOrganizationType = (direction: "left" | "right") => {
        if (!organizationTypeListRef.current) return;

        const scrollAmount = 300;
        organizationTypeListRef.current.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth",
        });
    };

    const handleFilterTypeChange = (newFilterType: FilterType) => {
        setFilterType(newFilterType);
        setSelectedOrganizationTypeId("");
        setSelectedProfessionId("");
        setPage(DEFAULT_PAGE);
    };
    return (
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
                    Danh sách trường
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
                    onClick={() => navigate("/tim-kiem-truong")}
                >
                    Xem tất cả
                </Button>
            </Box>

            {/* Filter ngang */}
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
                                <MenuItem value="profession">
                                    <Work fontSize="small" sx={{ mr: 1 }} />
                                    Lọc theo ngành nghề
                                </MenuItem>
                                <MenuItem value="organizationType">
                                    <PeopleAlt fontSize="small" sx={{ mr: 1 }} />
                                    Lọc theo loại hình
                                </MenuItem>
                            </Select>
                        </FormControl>

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
                                            <Work fontSize="small" />
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

                        {filterType === "organizationType" && (
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
                                <IconButton onClick={() => scrollOrganizationType("left")}>
                                    <ChevronLeft />
                                </IconButton>

                                {/* Organization type list */}
                                <Box
                                    ref={organizationTypeListRef}
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
                                    {organizationTypes.map((organizationType) => (
                                        <Box
                                            key={organizationType.Id}
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
                                                backgroundColor: selectedOrganizationTypeId === organizationType.Id ? "#ff5722" : "transparent",
                                                color: selectedOrganizationTypeId === organizationType.Id ? "white" : "inherit",
                                                borderColor: selectedOrganizationTypeId === organizationType.Id ? "#ff5722" : "#ddd",
                                                "&:hover": {
                                                    backgroundColor: "#ff5722",
                                                    color: "white",
                                                    borderColor: "#ff5722",
                                                },
                                            }}
                                            onClick={() => handleOrganizationTypeSelect(organizationType.Id)}
                                        >
                                            <PeopleAlt fontSize="small" />
                                            {organizationType.Name}
                                        </Box>
                                    ))}
                                </Box>

                                {/* Arrow Right */}
                                <IconButton onClick={() => scrollOrganizationType("right")}>
                                    <ChevronRight />
                                </IconButton>
                            </Box>
                        )}
                    </Stack>
                </Box>
            </Box>

            {/* Active Filters Display */}
            {(selectedOrganizationTypeId || selectedProfessionId) && (
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Box sx={{ fontSize: 14, color: 'text.secondary' }}>
                        Đang lọc:
                    </Box>
                    {selectedOrganizationTypeId && (
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
                            <House fontSize="small" />
                            {organizationTypes.find(p => p.Id === selectedOrganizationTypeId)?.Name}
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
                            setSelectedOrganizationTypeId("");
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
    );
};

export default OrganizationComponent;