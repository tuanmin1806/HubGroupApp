import { Box, Grid, Stack } from "@mui/material";
import type { PropsWithChildren } from "react";
import image from '../../../hub_uni_web/src/assets/3.webp';
import { Outlet } from "react-router-dom";
import Logo from "../components/general/logo";
import Image from "../components/base/Image";

const AuthLayout = ({ }: PropsWithChildren) => {
    return (
        <Grid
            container
            sx={{
                height: { md: '100vh' },
                minHeight: '100vh',
                flexDirection: {
                    xs: 'column',
                    md: 'row',
                },
            }}
        >
            <Grid
                sx={{
                    borderRight: { md: 1 },
                    borderColor: { md: 'divider' },
                }}
                size={{
                    xs: 12,
                    md: 6,
                }}
            >
                <Stack
                    direction="column"
                    sx={{
                        justifyContent: 'space-between',
                        height: 1,
                        p: { xs: 3, sm: 5 },
                    }}
                >
                    <Stack
                        sx={{
                            justifyContent: { xs: 'center', md: 'flex-start' },
                            mb: { xs: 5, md: 0 },
                        }}
                    >
                        <Logo />
                    </Stack>

                    <Stack
                        sx={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            display: { xs: 'none', md: 'flex', flexDirection: 'row-reverse' },
                        }}
                    >
                        <Box
                            sx={{
                                maxWidth: 600,
                                maxHeight: 390,
                            }}
                        >
                            <Image src={image} width="100%" height="100%" alt="auth" />
                        </Box>
                    </Stack>

                    <div />
                </Stack>
            </Grid>
            <Grid
                size={{ md: 6, xs: 12 }}
                sx={{
                    display: { xs: 'flex', md: 'block' },
                    flexDirection: 'column',
                    flex: 1,
                }}
            >
                <Outlet />
            </Grid>
        </Grid>
    );
};

export default AuthLayout;
