import { createTheme, useMediaQuery, Dialog, DialogTitle, Typography, IconButton, DialogContent, Grid, Box, TextField, DialogActions, Button } from "@mui/material";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { ConvertService } from "../../../app/services/convert.service";
import { roles } from "../../../constants/role.constant";
import { RootState } from "../../../app/store";
import { Close } from "@mui/icons-material";

const theme = createTheme({
    palette: {
        primary: {
            main: "#d02028",
        },
    },
});

ProfileDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
};

export default function ProfileDialog({ open, setOpen }) {
    const { user } = useSelector((state: RootState) => state.auth);
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <React.Fragment>
            <Dialog
                sx={{ width: { xs: "90vw", md: "100%" } }}
                maxWidth={isMobile ? "sm" : "md"}
                open={open}
                onClose={handleClose}
            >
                <DialogTitle
                    sx={{
                        bgcolor: "primary.main",
                        color: "white",
                        p: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 2
                    }}
                >
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        Thông tin cá nhân
                    </Typography>
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            color: "white",
                            "&:hover": { bgcolor: "primary.dark" },
                        }}
                    >
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ p: { xs: 1, md: 2 } }}>
                    <Grid container spacing={{ xs: 2, md: 3 }}>
                        <Grid size={12}>
                            <Box>
                                <Box sx={{ p: { xs: 1, md: 2 }, display: "flex" }}>
                                    <Grid container spacing={{ xs: 2, md: 4 }}>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <Box sx={{ width: "100%" }}>
                                                <Box sx={{ display: "flex" }}>
                                                    <Typography
                                                        variant="body2"
                                                        gutterBottom
                                                        sx={{
                                                            fontWeight: "bold",
                                                            color: "black",
                                                            fontSize: { xs: "0.75rem", md: "0.875rem" },
                                                        }}
                                                    >
                                                        Họ và tên
                                                    </Typography>
                                                </Box>
                                                <TextField
                                                    variant="outlined"
                                                    sx={{ width: "100%" }}
                                                    size="small"
                                                    value={user?.FullName}
                                                    slotProps={{
                                                        input: {
                                                            readOnly: true,
                                                        },
                                                    }}
                                                />
                                            </Box>
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <Box sx={{ width: "100%" }}>
                                                <Box sx={{ display: "flex" }}>
                                                    <Typography
                                                        variant="body2"
                                                        gutterBottom
                                                        sx={{
                                                            fontWeight: "bold",
                                                            color: "black",
                                                            fontSize: { xs: "0.75rem", md: "0.875rem" },
                                                        }}
                                                    >
                                                        Địa chỉ email
                                                    </Typography>
                                                </Box>
                                                <TextField
                                                    variant="outlined"
                                                    sx={{ width: "100%" }}
                                                    size="small"
                                                    value={user?.Email}
                                                    slotProps={{
                                                        input: {
                                                            readOnly: true,
                                                        },
                                                    }}
                                                />
                                            </Box>
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <Box sx={{ width: "100%" }}>
                                                <Box sx={{ display: "flex" }}>
                                                    <Typography
                                                        variant="body2"
                                                        gutterBottom
                                                        sx={{
                                                            fontWeight: "bold",
                                                            color: "black",
                                                            fontSize: { xs: "0.75rem", md: "0.875rem" },
                                                        }}
                                                    >
                                                        Số điện thoại
                                                    </Typography>
                                                </Box>
                                                <TextField
                                                    variant="outlined"
                                                    sx={{ width: "100%" }}
                                                    size="small"
                                                    value={
                                                        user?.PhoneNumber ||
                                                        "Không xác định"
                                                    }
                                                    slotProps={{
                                                        input: {
                                                            readOnly: true,
                                                        },
                                                    }}
                                                />
                                            </Box>
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 3 }}>
                                            <Box sx={{ width: "100%" }}>
                                                <Box sx={{ display: "flex" }}>
                                                    <Typography
                                                        variant="body2"
                                                        gutterBottom
                                                        sx={{
                                                            fontWeight: "bold",
                                                            color: "black",
                                                            fontSize: { xs: "0.75rem", md: "0.875rem" },
                                                        }}
                                                    >
                                                        Ngày sinh
                                                    </Typography>
                                                </Box>
                                                <TextField
                                                    variant="outlined"
                                                    sx={{ width: "100%" }}
                                                    size="small"
                                                    value={
                                                        user?.DateOfBirth || "Không xác định"
                                                    }
                                                    slotProps={{
                                                        input: {
                                                            readOnly: true,
                                                        },
                                                    }}
                                                />
                                            </Box>
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 3 }}>
                                            <Box sx={{ width: "100%" }}>
                                                <Box sx={{ display: "flex" }}>
                                                    <Typography
                                                        variant="body2"
                                                        gutterBottom
                                                        sx={{
                                                            fontWeight: "bold",
                                                            color: "black",
                                                            fontSize: { xs: "0.75rem", md: "0.875rem" },
                                                        }}
                                                    >
                                                        Giới tính
                                                    </Typography>
                                                </Box>
                                                <TextField
                                                    variant="outlined"
                                                    sx={{ width: "100%" }}
                                                    size="small"
                                                    value={
                                                        user?.Gender ? ConvertService.convertGender(ConvertService.convertGenderFromString(user?.Gender)) : "Không xác định"
                                                    }
                                                    slotProps={{
                                                        input: {
                                                            readOnly: true,
                                                        },
                                                    }}
                                                />
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Box sx={{ mx: { xs: 1, md: 2 }, mr: "auto" }}>

                        <Button
                            onClick={() => {
                                handleClose();
                            }}
                        >
                            <Typography
                                sx={{
                                    fontWeight: "bold",
                                    fontSize: { xs: "0.875rem", md: "1rem" },
                                }}
                            >
                                Cập nhập thông tin cá nhân
                            </Typography>
                        </Button>

                        <Button
                            onClick={handleClose}
                            sx={{ mx: { xs: 2, md: 4 } }}
                            onClickCapture={() => {
                                return handleClose();
                            }}
                        >
                            <Typography
                                sx={{
                                    fontWeight: "bold",
                                    fontSize: { xs: "0.875rem", md: "1rem" },
                                }}
                            >
                                Thay đổi mật khẩu
                            </Typography>
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}