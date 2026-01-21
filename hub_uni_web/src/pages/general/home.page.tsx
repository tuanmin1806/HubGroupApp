import { Box, Button, createTheme, Divider, Grid, ThemeProvider, Typography } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import defaultOrganization from "../../assets/default_organization_card.jpg";

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
    // const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    useEffect(() => {
        document.title = "Trang Chủ | HUB UNI";
    }, [navigate]);

    return (
        <>
            <Grid container>
                <Grid size={12}>
                </Grid>
            </Grid>

            <Grid
                container
                sx={{
                    mx: { xs: 2, md: 12 },
                    my: { xs: 4, md: 9 },
                }}
                spacing={{ xs: 2, md: 10 }}
            >
                <ThemeProvider theme={theme}>
                    <Grid size={{ xs: 12, md: 7 }} order={{ xs: 2, md: 1 }}>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: "bold",
                                fontSize: { xs: "1.5rem", md: "2.125rem" },
                            }}
                        >
                            Chi tiết tổ chức
                        </Typography>
                        <Typography
                            variant="h4"
                            sx={{
                                mt: 1,
                                fontWeight: "bold",
                                fontSize: { xs: "1.5rem", md: "2.125rem" },
                            }}
                        >
                            Chi tiết tổ chức
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                mt: 3,
                                fontWeight: "medium",
                                fontSize: { xs: "0.875rem", md: "1rem" },
                            }}
                        >
                            Chi tiết tổ chức
                        </Typography>
                        <Box sx={{ mt: 3 }}>
                            {/* Slider: 2 slides for md (matches original), 1 for xs */}

                        </Box>
                        <Box
                            sx={{ mt: 3 }}
                            onClick={() => navigate("/restaurant")}
                        >
                            <Button
                                variant="contained"
                                sx={{ color: "#ffff", bgcolor: "#d02028" }}
                            >
                                Danh sách tổ chức
                            </Button>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 5 }} order={{ xs: 1, md: 2 }}>
                        {/* Image: height 550px for md (matches original), auto for xs */}
                        <Box
                            component="img"
                            src={defaultOrganization}
                            alt="Restaurant"
                            sx={{
                                borderRadius: "5%",
                                width: "100%",
                                height: { xs: "auto", md: "550px" },
                                objectFit: "cover",
                            }}
                        />
                    </Grid>
                </ThemeProvider>
            </Grid>

            <Grid container sx={{ m: { xs: 2, md: 6 } }}>
                <Grid size={12}>
                    <Divider sx={{ width: "100%", bgcolor: "#ffff" }} />
                </Grid>
            </Grid>

            <Grid
                container
                sx={{
                    mx: { xs: 2, md: 12 },
                    my: { xs: 4, md: 9 },
                }}
                spacing={{ xs: 2, md: 10 }}
            >
                <ThemeProvider theme={theme}>
                    <Grid size={{ xs: 12, md: 5 }} order={{ xs: 1, md: 1 }}>
                        {/* Image: height 550px for md (matches original), auto for xs */}
                        <Box
                            component="img"
                            src={defaultOrganization}
                            alt="Dish"
                            sx={{
                                borderRadius: "5%",
                                width: "100%",
                                height: { xs: "auto", md: "550px" },
                                objectFit: "cover",
                            }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 7 }} order={{ xs: 2, md: 2 }}>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: "bold",
                                fontSize: { xs: "1.5rem", md: "2.125rem" },
                            }}
                        >
                            Chi tiết tổ chức
                        </Typography>
                        <Typography
                            variant="h4"
                            sx={{
                                mt: 1,
                                fontWeight: "bold",
                                fontSize: { xs: "1.5rem", md: "2.125rem" },
                            }}
                        >
                            Chi tiết tổ chức
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                mt: 3,
                                fontWeight: "medium",
                                fontSize: { xs: "0.875rem", md: "1rem" },
                            }}
                        >
                            Chi tiết tổ chức
                        </Typography>
                        <Box sx={{ mt: 3 }}>
                            {/* Slider: 2 slides for md (matches original), 1 for xs */}

                        </Box>
                        <Box sx={{ mt: 3 }} onClick={() => navigate("/dish")}>
                            <Button
                                variant="contained"
                                sx={{ color: "#ffff", bgcolor: "#d02028" }}
                            >
                                Danh sách tổ chức
                            </Button>
                        </Box>
                    </Grid>
                </ThemeProvider>
            </Grid>
        </>
    );
};

export default HomePage;