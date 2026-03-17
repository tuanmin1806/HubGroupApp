import * as React from "react";
import { Box, Typography, CircularProgress, Stack, Avatar, Button, } from "@mui/material";
import { useGetAllProfessionNoAuthenQuery } from "../../app/features/profession.api";
import { useGetRecruitmentPostsByPageQuery } from "../../app/features/recruitment-post.api";
import { LocationOn, AccessTime, PeopleAlt, NavigateNext } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utils/date.utils";
import { getRecruitmentStatus } from "../../utils/recruitment-post.utils";

const PAGE_SIZE = 5;

export default function ProfessionRecruitmentTabs() {
    const [selected, setSelected] = React.useState(0);
    const [page, setPage] = React.useState(1);
    const [allPosts, setAllPosts] = React.useState<any[]>([]);
    const [total, setTotal] = React.useState(0);
    const navigate = useNavigate();

    const { data: professions = [], isLoading: loadingProfession } = useGetAllProfessionNoAuthenQuery();
    const selectedProfessionId = professions[selected]?.Id;

    const { data: postsResponse, isLoading: loadingPosts, isFetching } = useGetRecruitmentPostsByPageQuery({ professionId: selectedProfessionId, page, size: PAGE_SIZE }, { skip: !selectedProfessionId });

    React.useEffect(() => {
        setPage(1);
        setAllPosts([]);
        setTotal(0);
    }, [selected]);

    React.useEffect(() => {
        if (!postsResponse) return;
        if (page === 1) { setAllPosts(postsResponse.Items ?? []); } else { setAllPosts((prev) => [...prev, ...(postsResponse.Items ?? [])]); }
        setTotal(postsResponse.Total ?? 0);
    }, [postsResponse]);

    const hasMore = allPosts.length < total;

    const handleLoadMore = () => { if (!isFetching && hasMore) setPage((p) => p + 1); };

    return (
        <Box
            sx={{
                display: "flex",
                height: 320,
                bgcolor: "background.paper",
                borderRadius: 1.5,
                overflow: "hidden",
                border: "1px solid #e8e8e8",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                position: "relative",
            }}
        >
            <Box
                sx={{
                    width: { xs: 160, sm: 240 },
                    flexShrink: 0,
                    borderRight: "1px solid #e8e8e8",
                    bgcolor: "#fafafa",
                    overflowY: "auto", "&::-webkit-scrollbar": { display: "none" },
                }}
            >
                {loadingProfession ? (<Box sx={{ display: "flex", justifyContent: "center", pt: 2 }}> <CircularProgress size={16} /></Box>) : (
                    professions.map((p, i) => (
                        <Box
                            key={p.Id}
                            onClick={() => setSelected(i)}
                            sx={{
                                px: { xs: 1, sm: 1.5 },
                                py: 1.25,
                                fontSize: { xs: 12, sm: 13 },
                                fontWeight: selected === i ? 700 : 500,
                                color: selected === i ? "#faa11b" : "text.secondary",
                                bgcolor: selected === i ? "#fff8e1" : "transparent",
                                borderLeft: "3px solid",
                                borderLeftColor: selected === i ? "#faa11b" : "transparent",
                                cursor: "pointer",
                                transition: "all 0.15s",
                                lineHeight: 1.4, "&:hover": { bgcolor: "#fff8e1", color: "#faa11b" },
                            }}
                        >
                            {p.Name}
                        </Box>
                    ))
                )}
            </Box>

            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
                <Box
                    sx={{
                        flex: 1,
                        overflowY: "auto",
                        p: 1,
                        pb: 0.5,
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.75, "&::-webkit-scrollbar": { width: 3 }, "&::-webkit-scrollbar-thumb": { bgcolor: "#e0e0e0", borderRadius: 4 },
                    }}
                >
                    {loadingPosts && page === 1 ? (<Box sx={{ display: "flex", justifyContent: "center", pt: 4 }}><CircularProgress size={20} sx={{ color: "#faa11b" }} /></Box>) : allPosts.length === 0 ? (
                        <Box sx={{ textAlign: "center", pt: 4 }}><Typography sx={{ fontSize: 12, color: "text.secondary" }}> Chưa có tin tuyển sinh </Typography></Box>
                    ) : (
                        allPosts.map((post) => (
                            <Box
                                key={post.Id}
                                onClick={() => navigate(`/chuong-trinh-tuyen-sinh/${post.SeoUrl}`)}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    p: 1,
                                    borderRadius: 1.5,
                                    border: "1px solid #f0f0f0",
                                    cursor: "pointer",
                                    transition: "all 0.15s",
                                    "&:hover": {
                                        borderColor: "#faa11b",
                                        bgcolor: "#fffbf2",
                                        transform: "translateX(2px)",
                                    },
                                }}
                            >
                                <Avatar src={post.Organization?.LogoFullUrl || undefined} sx={{ width: 36, height: 36, borderRadius: 1, flexShrink: 0, border: "1px solid #f0f0f0", fontSize: 14, }}>{post.Organization?.Name?.charAt(0)}</Avatar>

                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Stack direction="row" alignItems="center" spacing={0.5} mb={0.25}>
                                        {post.IsTop && (<Box component="span" sx={{ bgcolor: "#faa11b", color: "white", fontSize: 9, fontWeight: 700, px: 0.5, borderRadius: 0.5, lineHeight: 1.6, flexShrink: 0, }}> HOT </Box>)}
                                        <Typography sx={{ fontSize: 14, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, }}>{post.Name}</Typography>
                                    </Stack>

                                    <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
                                        <Stack direction="row" spacing={0.3} alignItems="center">
                                            <LocationOn sx={{ fontSize: 11, color: "#faa11b" }} />
                                            <Typography sx={{ fontSize: 10, color: "text.secondary" }}>{post.Province || "—"}</Typography>
                                        </Stack>
                                        <Stack direction="row" spacing={0.3} alignItems="center">
                                            <PeopleAlt sx={{ fontSize: 11, color: "#faa11b" }} />
                                            <Typography sx={{ fontSize: 10, color: "text.secondary" }}>{post.Quantity}</Typography>
                                        </Stack>
                                        <Stack direction="row" spacing={0.3} alignItems="center">
                                            <AccessTime sx={{ fontSize: 11, color: getRecruitmentStatus(post.RecruitmentToDate).color }} />
                                            <Typography sx={{ fontSize: 10, color: getRecruitmentStatus(post.RecruitmentToDate).color }}>{formatDate(post.RecruitmentToDate)}</Typography>
                                        </Stack>
                                        {post.Cost > 0 && (<Typography sx={{ fontSize: 10, color: "#4caf50", fontWeight: 600 }}>{post.Cost.toLocaleString()} {post.Currency}</Typography>)}
                                    </Stack>
                                </Box>

                                <NavigateNext sx={{ fontSize: 16, color: "text.disabled", flexShrink: 0 }} />
                            </Box>
                        ))
                    )}
                </Box>

                <Box
                    sx={{
                        height: 30,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        px: 1,
                        borderTop: "1px solid #f0f0f0",
                        bgcolor: "background.paper",
                        flexShrink: 0,
                    }}
                >
                    {hasMore ? (
                        <Button
                            size="small"
                            onClick={handleLoadMore}
                            disabled={isFetching}
                            sx={{
                                fontSize: 11,
                                color: "#ff5722",
                                textTransform: "none",
                                minWidth: 70,
                                "&:hover": { bgcolor: "#f7e7e2ff" },
                            }}
                        >
                            {isFetching ? (<CircularProgress size={12} sx={{ color: "#ff5722" }} />) : ("Xem thêm")}
                        </Button>
                    ) : (
                        <Box sx={{ minWidth: 70 }} />
                    )}
                    <Button
                        size="small"
                        onClick={() => navigate("/chuong-trinh-tuyen-sinh")}
                        sx={{
                            position: "absolute",
                            right: 8,
                            fontSize: 11,
                            color: "#ff5722",
                            textTransform: "none",
                            minWidth: 0,
                            "&:hover": { bgcolor: "#f7e7e2ff" },
                        }}
                    >
                        Xem tất cả →
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}