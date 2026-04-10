import { lazy } from "react";
import ArrowForward from "@mui/icons-material/ArrowForward";
import School from "@mui/icons-material/School";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import FilterAlt from "@mui/icons-material/FilterAlt";
import Work from "@mui/icons-material/Work";
import PeopleAlt from "@mui/icons-material/PeopleAlt";
import House from "@mui/icons-material/House";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
const OrganizationSelectActionCard = lazy(() => import("../../cards/organization-card.card"));
const OrganizationPagination = lazy(() => import("../../pagination/organization-pagination"));
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { useGetAllProfessionNoAuthenQuery } from "../../../app/features/profession.api";
import { useOrganizationsGetByPageNoAuthenQuery } from "../../../app/features/organization.api";
import { useGetAllOrganizationTypesNoAuthenQuery } from "../../../app/features/organization-type.api";
import { DEFAULT_PAGE, PAGE_SIZE } from "../../../constants/common.constant";
import { styled, Typography } from "@mui/material";
import LoadingOverlay from "../loading-overlay";

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

const OrganizationComponent = () => {
    const navigate = useNavigate();
    type FilterType = "organizationType" | "profession";
    const [page, setPage] = useState(DEFAULT_PAGE);
    const [filterType, setFilterType] = useState<FilterType>("profession");
    const [selectedOrganizationTypeId, setSelectedOrganizationTypeId] = useState<string>("");
    const [selectedProfessionId, setSelectedProfessionId] = useState<string>("");
    const { data: professions = [] } = useGetAllProfessionNoAuthenQuery();
    const { data: organizationTypes = [] } = useGetAllOrganizationTypesNoAuthenQuery();
    const { data: organizationData, isLoading, isError } = useOrganizationsGetByPageNoAuthenQuery({
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
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Badge>
                    <School sx={{ fontSize: 20, color: "#ffffff" }} />
                    <Typography
                        sx={{
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            color: "#ffffff",
                            letterSpacing: 1,
                            textTransform: "uppercase"
                        }}
                    >
                        Danh sách trường
                    </Typography>
                </Badge>
                <Button
                    variant="outlined"
                    endIcon={<ArrowForward />}
                    onClick={() => navigate("/tim-kiem-truong")}
                    size="small"
                    sx={{
                        borderColor: "#ff5722",
                        color: "#ff5722",
                        fontSize: { xs: 9, sm: 11 },
                        "&:hover": { bgcolor: "#ff5722", color: "#fff", borderColor: "#ff5722" },
                    }}
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
            <LoadingOverlay open={isLoading} error={isError} empty={organizationts.length === 0}>
                <OrganizationSelectActionCard organizations={organizationts} />
            </LoadingOverlay>

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