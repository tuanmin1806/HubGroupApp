import { lazy, useEffect } from "react";
import Person from "@mui/icons-material/Person";
import Lock from "@mui/icons-material/Lock";
import WorkOutline from "@mui/icons-material/WorkOutline";
import CameraAlt from "@mui/icons-material/CameraAlt";
import Logout from "@mui/icons-material/Logout";
import TurnedInNot from "@mui/icons-material/TurnedInNot";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import FeedIcon from '@mui/icons-material/Feed';
import Divider from "@mui/material/Divider";
const AccountInfoPanel = lazy(() => import("../../components/panel/account-info.panel"));
const ApplicationListPanel = lazy(() => import("../../components/panel/application-list.panel"));
const ChangePasswordPanel = lazy(() => import("../../components/panel/change-password.panel"));
const StudentLogoUploadDialog = lazy(() => import("../../components/dialogs/student/student-logo-upload.dialog"));
const FavouriteRecruitPostListPanel = lazy(() => import("../../components/panel/favourite-recruitposts.panel"));
const BookMarkPanel = lazy(() => import("../../components/panel/book-mark.panel"));
import { hasAccountType } from "../../utils/auth.utils";
import { AccountType } from "../../app/models/enums.model";
import { useNavigate } from "react-router-dom";
import { useGetCustomerByIdQuery } from "../../app/features/customer.api";
import { useState } from "react";
import { getUserInfo, saveUserInfo } from "../../app/services/auth.service";
import { AuthInfo } from "../../app/models/auth.model";
import { restoreCredentials } from "../../app/features/auth/auth.slice";
import { useDispatch } from "react-redux";


type TabKey = "info" | "password" | "applications" | "logout" | "favourite-recruitposts" | "saved-organizations" | "book-mark";

export default function AccountInfoPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [logoDialogOpen, setLogoDialogOpen] = useState(false);
    const userInfo = getUserInfo();
    const [activeTab, setActiveTab] = useState<TabKey>("info");

    const handleSignOut = async () => { navigate("/sign-out"); };
    const { data: account, isLoading } = useGetCustomerByIdQuery(userInfo?.Id ?? "", { skip: !userInfo?.Id });

    useEffect(() => {
        if (!account) return;
        const current = getUserInfo();
        if (!current) return;

        const updated: AuthInfo = {
            ...current,
            FullName: account.FullName ?? current.FullName,
            AvatarFullUrl: account.AvatarFullUrl ?? current.AvatarFullUrl,
        };

        if (
            current.FullName === updated.FullName &&
            current.AvatarFullUrl === updated.AvatarFullUrl
        ) return;

        saveUserInfo(updated);
        dispatch(restoreCredentials(updated));
    }, [account, dispatch]);

    return (
        <Box sx={{ bgcolor: "#f9fafb", minHeight: "100vh", pt: { xs: 2, md: 4 }, pb: { xs: 2, md: 3 } }}>
            <Container maxWidth="xl">
                <Typography variant="h5" fontWeight={700} sx={{ mb: 1, fontSize: { xs: "1.2rem", md: "1.4rem" } }}> Thông tin tài khoản </Typography>

                <Stack direction={{ xs: "column", md: "row" }} spacing={1} alignItems="flex-start">
                    <Box sx={{ width: { xs: "100%", md: 320 }, flexShrink: 0 }}>
                        <Paper elevation={0} sx={{
                            borderRadius: 2, border: "1px solid #e5e7eb",
                            overflow: "hidden", position: { md: "sticky" }, top: 80,
                        }}>
                            <Box sx={{
                                background: "linear-gradient(135deg, #f36730 0%, #ffa040 100%)",
                                p: 3, textAlign: "center",
                            }}>
                                <Box sx={{ position: "relative", display: "inline-block" }}>
                                    {isLoading ? (
                                        <Box sx={{
                                            width: 100, height: 100, borderRadius: "50%",
                                            bgcolor: "rgba(255,255,255,0.3)",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                        }}>
                                            <CircularProgress size={28} sx={{ color: "white" }} />
                                        </Box>
                                    ) : (
                                        <Avatar
                                            src={account?.AvatarFullUrl || undefined}
                                            sx={{
                                                width: 100, height: 100, mx: "auto",
                                                border: "3px solid rgba(255,255,255,0.8)",
                                                fontSize: "1.8rem", fontWeight: 700,
                                                bgcolor: "rgba(255,255,255,0.25)", color: "white",
                                            }}
                                        >
                                            {account?.FullName?.charAt(0) ?? userInfo?.FullName?.charAt(0) ?? "?"}
                                        </Avatar>
                                    )}
                                    {hasAccountType(AccountType.Student) && (
                                        <Box sx={{
                                            position: "absolute", bottom: 0, right: 0,
                                            width: 26, height: 26, borderRadius: "50%",
                                            bgcolor: "white", display: "flex", alignItems: "center",
                                            justifyContent: "center", cursor: "pointer",
                                            boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                                            "&:hover": { bgcolor: "#f5f5f5" },
                                        }} onClick={() => setLogoDialogOpen(true)}>
                                            <CameraAlt sx={{ fontSize: 14, color: "#f36730" }} />
                                        </Box>
                                    )}
                                </Box>
                                <Typography fontWeight={700} color="white" sx={{ mt: 1.5, fontSize: "0.95rem", lineHeight: 1.3 }}>
                                    {account?.FullName ?? userInfo?.FullName ?? "—"}
                                </Typography>
                                <Typography sx={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.8)", mt: 0.25 }}>
                                    {account?.UserName ?? ""}
                                </Typography>
                            </Box>

                            <Divider />

                            <Box sx={{ p: 1 }}>
                                {/* Thông tin tài khoản */}
                                <Stack
                                    direction="row"
                                    spacing={1.25}
                                    alignItems="center"
                                    onClick={() => setActiveTab("info")}
                                    sx={{
                                        px: 1,
                                        py: 1.25,
                                        borderRadius: 1.5,
                                        cursor: "pointer",
                                        bgcolor: activeTab === "info" ? "#fff3e0" : "transparent",
                                        color: activeTab === "info" ? "#f36730" : "text.secondary",
                                        fontWeight: activeTab === "info" ? 700 : 400,
                                        transition: "all .15s ease",
                                        "&:hover": {
                                            bgcolor: activeTab === "info" ? "#fff3e0" : "#f5f5f5",
                                        },
                                    }}
                                >
                                    <Box sx={{ color: activeTab === "info" ? "#f36730" : "#9e9e9e", display: "flex" }}>
                                        <Person sx={{ fontSize: 18 }} />
                                    </Box>
                                    <Typography variant="body2" fontWeight={activeTab === "info" ? 700 : 500} sx={{ fontSize: "0.85rem" }}>
                                        Thông tin tài khoản
                                    </Typography>
                                </Stack>

                                {/* Đổi mật khẩu */}
                                {hasAccountType(AccountType.Student) && (
                                    <Stack
                                        direction="row"
                                        spacing={1.25}
                                        alignItems="center"
                                        onClick={() => setActiveTab("password")}
                                        sx={{
                                            px: 1,
                                            py: 1.25,
                                            borderRadius: 1.5,
                                            cursor: "pointer",
                                            bgcolor: activeTab === "password" ? "#fff3e0" : "transparent",
                                            color: activeTab === "password" ? "#f36730" : "text.secondary",
                                            fontWeight: activeTab === "password" ? 700 : 400,
                                            transition: "all .15s ease",
                                            "&:hover": {
                                                bgcolor: activeTab === "password" ? "#fff3e0" : "#f5f5f5",
                                            },
                                        }}
                                    >
                                        <Box sx={{ color: activeTab === "password" ? "#f36730" : "#9e9e9e", display: "flex" }}>
                                            <Lock sx={{ fontSize: 18 }} />
                                        </Box>
                                        <Typography variant="body2" fontWeight={activeTab === "password" ? 700 : 500} sx={{ fontSize: "0.85rem" }}>
                                            Thay đổi mật khẩu
                                        </Typography>
                                    </Stack>
                                )}

                                {/* Đã ứng tuyển */}
                                {hasAccountType(AccountType.Student) && (
                                    <Stack
                                        direction="row"
                                        spacing={1.25}
                                        alignItems="center"
                                        onClick={() => setActiveTab("applications")}
                                        sx={{
                                            px: 1,
                                            py: 1.25,
                                            borderRadius: 1.5,
                                            cursor: "pointer",
                                            bgcolor: activeTab === "applications" ? "#fff3e0" : "transparent",
                                            color: activeTab === "applications" ? "#f36730" : "text.secondary",
                                            fontWeight: activeTab === "applications" ? 700 : 400,
                                            transition: "all .15s ease",
                                            "&:hover": {
                                                bgcolor: activeTab === "applications" ? "#fff3e0" : "#f5f5f5",
                                            },
                                        }}
                                    >
                                        <Box sx={{ color: activeTab === "applications" ? "#f36730" : "#9e9e9e", display: "flex" }}>
                                            <WorkOutline sx={{ fontSize: 18 }} />
                                        </Box>
                                        <Typography variant="body2" fontWeight={activeTab === "applications" ? 700 : 500} sx={{ fontSize: "0.85rem" }}>
                                            Chương trình đã ứng tuyển
                                        </Typography>
                                    </Stack>
                                )}


                                {/* Đã lưu */}
                                {hasAccountType(AccountType.Student) && (
                                    <Stack
                                        direction="row"
                                        spacing={1.25}
                                        alignItems="center"
                                        onClick={() => setActiveTab("favourite-recruitposts")}
                                        sx={{
                                            px: 1,
                                            py: 1.25,
                                            borderRadius: 1.5,
                                            cursor: "pointer",
                                            bgcolor: activeTab === "favourite-recruitposts" ? "#fff3e0" : "transparent",
                                            color: activeTab === "favourite-recruitposts" ? "#f36730" : "text.secondary",
                                            fontWeight: activeTab === "favourite-recruitposts" ? 700 : 400,
                                            transition: "all .15s ease",
                                            "&:hover": {
                                                bgcolor: activeTab === "favourite-recruitposts" ? "#fff3e0" : "#f5f5f5",
                                            },
                                        }}
                                    >
                                        <Box sx={{ color: activeTab === "favourite-recruitposts" ? "#f36730" : "#9e9e9e", display: "flex" }}>
                                            <TurnedInNot sx={{ fontSize: 18 }} />
                                        </Box>
                                        <Typography variant="body2" fontWeight={activeTab === "favourite-recruitposts" ? 700 : 500} sx={{ fontSize: "0.85rem" }}>
                                            Chương trình đã lưu
                                        </Typography>
                                    </Stack>
                                )}

                                {hasAccountType(AccountType.Student) && (
                                    <Stack
                                        direction="row"
                                        spacing={1.25}
                                        alignItems="center"
                                        onClick={() => setActiveTab("book-mark")}
                                        sx={{
                                            px: 1,
                                            py: 1.25,
                                            borderRadius: 1.5,
                                            cursor: "pointer",
                                            bgcolor: activeTab === "book-mark" ? "#fff3e0" : "transparent",
                                            color: activeTab === "book-mark" ? "#f36730" : "text.secondary",
                                            fontWeight: activeTab === "book-mark" ? 700 : 400,
                                            transition: "all .15s ease",
                                            "&:hover": {
                                                bgcolor: activeTab === "book-mark" ? "#fff3e0" : "#f5f5f5",
                                            },
                                        }}
                                    >
                                        <Box sx={{ color: activeTab === "book-mark" ? "#f36730" : "#9e9e9e", display: "flex" }}>
                                            <FeedIcon sx={{ fontSize: 18 }} />
                                        </Box>
                                        <Typography variant="body2" fontWeight={activeTab === "book-mark" ? 700 : 500} sx={{ fontSize: "0.85rem" }}>
                                            Bài viết đã lưu
                                        </Typography>
                                    </Stack>
                                )}
                            </Box>
                            <Box sx={{ p: 1, borderTop: "1px solid #e5e7eb" }}>
                                <Stack
                                    direction="row"
                                    spacing={1.25}
                                    alignItems="center"
                                    onClick={handleSignOut}
                                    sx={{
                                        px: 1, py: 1,
                                        cursor: "pointer", mb: 0.25,
                                        bgcolor: activeTab === "logout" ? "#fff3e0" : "transparent",
                                        color: "#f36730",
                                        fontWeight: activeTab === "logout" ? 700 : 400,
                                        "&:hover": { bgcolor: activeTab === "logout" ? "#fff3e0" : "#f5f5f5" },
                                    }}
                                >
                                    <Box sx={{ color: "#f36730", alignItems: "center", display: "flex", flexShrink: 0, }}><Logout sx={{ fontSize: 18 }} /></Box>
                                    <Typography variant="body2" fontWeight={activeTab === "logout" ? 700 : 500} sx={{ fontSize: "0.85rem" }}>Đăng xuất</Typography>
                                    {activeTab === "logout" && (<Box sx={{ ml: "auto", width: 4, height: 4, borderRadius: "50%", bgcolor: "#f36730" }} />)}
                                </Stack>
                            </Box>
                        </Paper>
                    </Box>

                    {/* Right */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Paper elevation={0} sx={{ borderRadius: 2, border: "1px solid #e5e7eb", p: { xs: 1, md: 2 }, }}>
                            {activeTab === "info" && (<AccountInfoPanel account={account} isLoading={isLoading} />)}
                            {activeTab === "password" && <ChangePasswordPanel />}
                            {activeTab === "applications" && <ApplicationListPanel />}
                            {activeTab === "favourite-recruitposts" && <FavouriteRecruitPostListPanel />}
                            {activeTab === "book-mark" && <BookMarkPanel />}
                        </Paper>
                    </Box>
                </Stack>
            </Container>
            <StudentLogoUploadDialog open={logoDialogOpen} onClose={() => setLogoDialogOpen(false)} currentLogoUrl={account?.AvatarFullUrl ?? ""} />
        </Box>
    );
}