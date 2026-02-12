import * as React from "react";
import {
    Tabs,
    Tab,
    Box,
    Typography,
    Card,
    CardContent,
    CircularProgress,
    Stack,
} from "@mui/material";
import { useGetAllProfessionNoAuthenQuery } from "../../app/features/profession.api";
import { useGetRecruitmentPostsByPageQuery } from "../../app/features/recruitment-post.api";
import { TEXT_COLOR } from "../../constants/common.constant";
import { WorkOutline } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function TabPanel({
    children,
    value,
    index,
}: {
    children: React.ReactNode;
    value: number;
    index: number;
}) {
    return (
        <Box
            role="tabpanel"
            hidden={value !== index}
            sx={{ flex: 1, height: "100%", overflow: "hidden" }}
        >
            {value === index && children}
        </Box>
    );
}

export default function ProfessionRecruitmentTabs() {
    const [value, setValue] = React.useState(0);
    const navigate = useNavigate();
    const { data: professions = [], isLoading: loadingProfession } =
        useGetAllProfessionNoAuthenQuery();

    const selectedProfessionId = professions[value]?.Id;

    const {
        data: postsResponse,
        isLoading: loadingPosts,
    } = useGetRecruitmentPostsByPageQuery(
        { professionId: selectedProfessionId },
        { skip: !selectedProfessionId }
    );

    const posts = React.useMemo(() => {
        return postsResponse?.Items ?? [];
    }, [postsResponse]);

    return (
        <Box
            sx={{
                display: "flex",
                height: 320,
                bgcolor: "background.paper",
                borderRadius: 3,
                overflow: "hidden"
            }}
        >
            {/* LEFT: ngành nghề */}
            <Tabs
                orientation="vertical"
                variant="scrollable"
                value={value}
                onChange={(_, newValue) => setValue(newValue)}
                sx={{
                    width: 240,
                    borderColor: "divider",

                    "& .MuiTab-root": {
                        minHeight: 36,
                        paddingY: 0.5,
                        paddingX: 1.5,
                        fontSize: 14,
                        fontWeight: 500,
                        textTransform: "none",
                        alignItems: "flex-start",
                        textAlign: "left",
                        color: TEXT_COLOR,

                        "&.Mui-selected": {
                            backgroundColor: "action.selected",
                            color: "primary.main"
                        }
                    }
                }}
            >
                {loadingProfession ? (
                    <Box sx={{ p: 2 }}>
                        <CircularProgress size={20} />
                    </Box>
                ) : (
                    professions.map((p) => (
                        <Tab
                            key={p.Id}
                            label={p.Name}
                            disableRipple
                            sx={{
                                alignItems: "flex-start",
                                textAlign: "left",
                                textTransform: "none",
                                fontWeight: 500,
                                minHeight: 48,
                            }}
                        />
                    ))
                )}
            </Tabs>

            {/* RIGHT: danh sách tin */}
            <TabPanel value={value} index={value}>
                <Box
                    sx={{
                        height: "100%",
                        overflowY: "auto",
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        p: 1,
                    }}
                >
                    {loadingPosts ? (
                        <Box sx={{ textAlign: "center", mt: 2 }}>
                            <CircularProgress />
                        </Box>
                    ) : posts.length === 0 ? (
                        <Typography sx={{ color: "text.secondary" }}>
                            Chưa có tin tuyển sinh
                        </Typography>
                    ) : (
                        posts.map((post) => (
                            <Card
                                key={post.Id}
                                onClick={() => navigate(`/tin-tuyen-sinh/${post.SeoUrl}`)}
                                sx={{
                                    flexShrink: 0,
                                    cursor: "pointer",
                                    borderRadius: 2,
                                    boxShadow: "none",
                                    "&:hover": {
                                        backgroundColor: "action.hover",
                                        borderColor: "primary.main"
                                    }
                                }}
                            >
                                <CardContent
                                    sx={{
                                        py: 1,
                                        px: 1,
                                        "&:last-child": { pb: 1 },
                                        alignItems: 'center'
                                    }}
                                >
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <WorkOutline
                                            sx={{ fontSize: 18, color: "primary.main" }}
                                        />
                                        <Typography
                                            sx={{
                                                color: TEXT_COLOR,
                                                fontSize: 14,
                                                fontWeight: 500,
                                                lineHeight: 1.4
                                            }}
                                        >
                                            {post.Name}
                                        </Typography>
                                    </Stack>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </Box>
            </TabPanel>
        </Box>
    );
}