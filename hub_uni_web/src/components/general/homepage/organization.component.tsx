import { ArrowForward, School, ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Box, Button, IconButton } from "@mui/material";
import { DEFAULT_PAGE, PAGE_SIZE } from "../../../constants/common.constant";
import OrganizationSelectActionCard from "../../cards/organization-card.card";
import OrganizationPagination from "../../pagination/organization-pagination";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { useGetAllProfessionNoAuthenQuery } from "../../../app/features/profession.api";
import { useOrganizationsFullTextSearchQuery } from "../../../app/features/organization.api";

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
    const [page, setPage] = useState(DEFAULT_PAGE);
    const [orgProfessionId, setOrgProfessionId] = useState<string>("");
    const professionListRef = useRef<HTMLDivElement>(null);
    const { data: professions = [] } = useGetAllProfessionNoAuthenQuery();
    const { data: organizationData } = useOrganizationsFullTextSearchQuery({
        page: page,
        size: PAGE_SIZE,
        professionId: orgProfessionId || undefined,
    });
    const organizationts = organizationData?.Items || [];
    const totalOrganizationPages = organizationData ? Math.ceil(organizationData.Total / PAGE_SIZE) : 1;
    const scrollProfession = (direction: "left" | "right") => {
        if (!professionListRef.current) return;

        const scrollAmount = 300;
        professionListRef.current.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth",
        });
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
    );
};

export default OrganizationComponent;