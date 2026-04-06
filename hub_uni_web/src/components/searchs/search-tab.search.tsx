import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import LocationOn from "@mui/icons-material/LocationOn";
import AccessTime from "@mui/icons-material/AccessTime";
import PeopleAlt from "@mui/icons-material/PeopleAlt";
import NavigateNext from "@mui/icons-material/NavigateNext";
import { useGetAllProfessionNoAuthenQuery } from "../../app/features/profession.api";
import { useGetRecruitmentPostsByPageQuery } from "../../app/features/recruitment-post.api";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utils/date.utils";
import { getRecruitmentStatus } from "../../utils/recruitment-post.utils";

const PAGE_SIZE = 10;

export default function ProfessionRecruitmentTabs() {
    const [selected, setSelected] = React.useState(0);
    const listRef = React.useRef<HTMLDivElement | null>(null);
    const [page, setPage] = React.useState(1);
    const [allPosts, setAllPosts] = React.useState<any[]>([]);
    const [total, setTotal] = React.useState(0);
    const navigate = useNavigate();

    const { data: professions = [], isLoading: loadingProfession } = useGetAllProfessionNoAuthenQuery();
    const selectedProfessionId = professions[selected]?.Id;

    const { data: postsResponse, isLoading: loadingPosts, isFetching } = useGetRecruitmentPostsByPageQuery(
        { professionId: selectedProfessionId, page, size: PAGE_SIZE },
        { skip: !selectedProfessionId }
    );

    React.useEffect(() => { setPage(1); setAllPosts([]); setTotal(0); }, [selected]);

    React.useEffect(() => {
        if (!postsResponse) return;
        if (page === 1) { setAllPosts(postsResponse.Items ?? []); }
        else { setAllPosts((prev) => [...prev, ...(postsResponse.Items ?? [])]); }
        setTotal(postsResponse.Total ?? 0);
    }, [postsResponse]);

    const hasMore = allPosts.length < total;

    React.useEffect(() => {
        const el = listRef.current;
        if (!el) return;
        const handleScroll = () => {
            if (el.scrollTop + el.clientHeight >= el.scrollHeight - 50 && hasMore && !isFetching)
                setPage((p) => p + 1);
        };
        el.addEventListener("scroll", handleScroll);
        return () => el.removeEventListener("scroll", handleScroll);
    }, [hasMore, isFetching]);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                height: { xs: "auto", sm: 360, md: 320 },
                bgcolor: "background.paper",
                borderRadius: 1.5,
                overflow: "hidden",
                border: "1px solid #e8e8e8",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
        >
            <Box
                sx={{
                    width: { xs: "100%", sm: 160, md: 220 },
                    height: { xs: 44, sm: "100%" },
                    flexShrink: 0,
                    borderRight: { xs: "none", sm: "1px solid #e8e8e8" },
                    borderBottom: { xs: "1px solid #e8e8e8", sm: "none" },
                    bgcolor: "#fafafa",
                    overflowX: { xs: "auto", sm: "hidden" },
                    overflowY: { xs: "hidden", sm: "auto" },
                    display: "flex",
                    flexDirection: { xs: "row", sm: "column" },
                    "&::-webkit-scrollbar": { display: "none" },
                }}
            >
                {loadingProfession ? (
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", p: 1 }}>
                        <CircularProgress size={16} />
                    </Box>
                ) : (
                    professions.map((p, i) => (
                        <Box
                            key={p.Id}
                            onClick={() => setSelected(i)}
                            sx={{
                                px: { xs: 1.5, sm: 1.2, md: 1.5 },
                                py: { xs: 0, sm: 1.25 },
                                height: { xs: "100%", sm: "auto" },
                                display: "flex",
                                alignItems: "center",
                                whiteSpace: "nowrap",
                                flexShrink: 0,
                                fontSize: { xs: 11, sm: 12, md: 13 },
                                fontWeight: selected === i ? 700 : 500,
                                color: selected === i ? "#faa11b" : "text.secondary",
                                bgcolor: selected === i ? "#fff8e1" : "transparent",
                                borderLeft: { xs: "none", sm: "3px solid" },
                                borderBottom: { xs: "2px solid", sm: "none" },
                                borderLeftColor: { sm: selected === i ? "#faa11b" : "transparent" },
                                borderBottomColor: { xs: selected === i ? "#faa11b" : "transparent" },
                                cursor: "pointer",
                                transition: "all 0.15s",
                                lineHeight: 1.4,
                                "&:hover": { bgcolor: "#fff8e1", color: "#faa11b" },
                            }}
                        >
                            {p.Name}
                        </Box>
                    ))
                )}
            </Box>

            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, minWidth: 0 }}>
                <Box
                    ref={listRef}
                    sx={{
                        flex: 1,
                        overflowY: "auto",
                        p: { xs: 0.75, sm: 1 },
                        pb: 0.5,
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.75,
                        "&::-webkit-scrollbar": { width: 3 },
                        "&::-webkit-scrollbar-thumb": { bgcolor: "#e0e0e0", borderRadius: 4 },
                    }}
                >
                    {loadingPosts && page === 1 ? (
                        <Box sx={{ display: "flex", justifyContent: "center", pt: 4 }}>
                            <CircularProgress size={20} sx={{ color: "#faa11b" }} />
                        </Box>
                    ) : allPosts.length === 0 ? (
                        <Box sx={{ textAlign: "center", pt: 4 }}>
                            <Typography sx={{ fontSize: 12, color: "text.secondary" }}>Chưa có chương trình tuyển sinh</Typography>
                        </Box>
                    ) : (
                        allPosts.map((post) => (
                            <Box
                                key={post.Id}
                                onClick={() => navigate(`/chuong-trinh-tuyen-sinh/${post.SeoUrl}`)}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: { xs: 0.75, sm: 1 },
                                    p: { xs: 0.75, sm: 1 },
                                    borderRadius: 1.5,
                                    border: "1px solid #f0f0f0",
                                    cursor: "pointer",
                                    transition: "all 0.15s",
                                    "&:hover": { borderColor: "#faa11b", bgcolor: "#fffbf2", transform: "translateX(2px)" },
                                }}
                            >
                                <Avatar
                                    src={post.Organization?.LogoFullUrl || undefined}
                                    slotProps={{
                                        img: {
                                            loading: "lazy",
                                            decoding: "async",
                                        }
                                    }}
                                    sx={{
                                        display: { xs: "none", sm: "flex" },
                                        width: { sm: 32, md: 36 },
                                        height: { sm: 32, md: 36 },
                                        borderRadius: 1,
                                        flexShrink: 0,
                                        border: "1px solid #f0f0f0",
                                        fontSize: 13,
                                    }}
                                >
                                    {post.Organization?.Name?.charAt(0)}
                                </Avatar>

                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Stack direction="row" alignItems="center" spacing={0.5} mb={0.25}>
                                        {post.IsTop && (
                                            <Box component="span" sx={{
                                                bgcolor: "#f3522a", color: "white",
                                                fontSize: { xs: 6, sm: 7 }, fontWeight: 700,
                                                px: 0.3, py: 0.12, borderRadius: 0.8, flexShrink: 0,
                                                animation: "hotShake 1.8s ease-in-out infinite",
                                                "@keyframes hotShake": {
                                                    "0%": { transform: "rotate(0deg) scale(1)" },
                                                    "10%": { transform: "rotate(-12deg) scale(1.15)" },
                                                    "20%": { transform: "rotate(12deg) scale(1.15)" },
                                                    "50%": { transform: "rotate(-6deg) scale(1.08)" },
                                                    "100%": { transform: "rotate(0deg) scale(1)" },
                                                },
                                            }}>HOT</Box>
                                        )}
                                        <Typography sx={{
                                            fontSize: { xs: 12, sm: 13, md: 14 },
                                            fontWeight: 600,
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                            flex: 1,
                                        }}>
                                            {post.Name}
                                        </Typography>
                                    </Stack>

                                    <Stack direction="row" spacing={{ xs: 1, sm: 1.5 }} alignItems="center" flexWrap="wrap">
                                        <Stack direction="row" spacing={0.3} alignItems="center">
                                            <LocationOn sx={{ fontSize: { xs: 10, sm: 11 }, color: "#faa11b" }} />
                                            <Typography sx={{ fontSize: { xs: 9, sm: 10 }, color: "text.secondary" }}>
                                                {post.Province || "—"}
                                            </Typography>
                                        </Stack>
                                        <Stack direction="row" spacing={0.3} alignItems="center">
                                            <PeopleAlt sx={{ fontSize: { xs: 10, sm: 11 }, color: "#faa11b" }} />
                                            <Typography sx={{ fontSize: { xs: 9, sm: 10 }, color: "text.secondary" }}>
                                                {post.Quantity}
                                            </Typography>
                                        </Stack>
                                        <Stack direction="row" spacing={0.3} alignItems="center">
                                            <AccessTime sx={{ fontSize: { xs: 10, sm: 11 }, color: getRecruitmentStatus(post.RecruitmentToDate).color }} />
                                            <Typography sx={{ fontSize: { xs: 9, sm: 10 }, color: getRecruitmentStatus(post.RecruitmentToDate).color }}>
                                                {formatDate(post.RecruitmentToDate)}
                                            </Typography>
                                        </Stack>
                                        {post.Cost > 0 && (
                                            <Typography sx={{ fontSize: { xs: 9, sm: 10 }, color: "#4caf50", fontWeight: 600 }}>
                                                {post.Cost.toLocaleString()} {post.Currency}
                                            </Typography>
                                        )}
                                    </Stack>
                                </Box>

                                <NavigateNext sx={{ fontSize: { xs: 14, sm: 16 }, color: "text.disabled", flexShrink: 0 }} />
                            </Box>
                        ))
                    )}
                </Box>

                <Box sx={{
                    height: 30,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    px: 1,
                    borderTop: "1px solid #f0f0f0",
                    bgcolor: "background.paper",
                    flexShrink: 0,
                }}>
                    <Button
                        size="small"
                        onClick={() => navigate("/chuong-trinh-tuyen-sinh")}
                        sx={{ fontSize: 11, color: "#ff5722", textTransform: "none", minWidth: 0, "&:hover": { bgcolor: "#f7e7e2" } }}
                    >
                        Xem tất cả →
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}