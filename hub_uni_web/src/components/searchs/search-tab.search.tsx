import * as React from "react";
import {
    Tabs,
    Tab,
    Box,
    Typography,
    Card,
    CardContent,
    CircularProgress,
} from "@mui/material";
import { useGetAllProfessionNoAuthenQuery } from "../../app/features/profession.api";
import { useGetRecruitmentPostsByPageQuery } from "../../app/features/recruitment-post.api";

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
                overflow: "hidden",
            }}
        >
            {/* LEFT: ngành nghề */}
            <Tabs
                orientation="vertical"
                variant="scrollable"
                value={value}
                onChange={(_, newValue) => setValue(newValue)}
                sx={{
                    width: 260,
                    borderRight: 1,
                    borderColor: "divider",
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
                        p: 2,
                    }}
                >
                    {loadingPosts ? (
                        <Box sx={{ textAlign: "center", mt: 2 }}>
                            <CircularProgress />
                        </Box>
                    ) : posts.length === 0 ? (
                        <Typography color="text.secondary">
                            Chưa có tin tuyển sinh
                        </Typography>
                    ) : (
                        posts.map((post) => (
                            <Card
                                key={post.Id}
                                sx={{ flexShrink: 0 }}
                            >
                                <CardContent
                                >
                                    <Typography
                                    >
                                        {post.Name}
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </Box>
            </TabPanel>
        </Box>
    );
}