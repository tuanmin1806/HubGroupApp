import { Person, Lock, WorkOutline, CameraAlt, Logout, Save, TurnedInNot, School } from "@mui/icons-material";
import { Avatar, Box, CircularProgress, Container, Paper, Stack, Typography, Divider } from "@mui/material";
import { useState } from "react";
import { getUserInfo } from "../../app/services/auth.service";
import AccountInfoPanel from "../../components/panel/account-info.panel";
import ApplicationListPanel from "../../components/panel/application-list.panel";
import ChangePasswordPanel from "../../components/panel/change-password.panel";
import { useGetCustomerByIdQuery } from "../../app/features/customer.api";
import StudentLogoUploadDialog from "../../components/dialogs/student/student-logo-upload.dialog";
import { useNavigate } from "react-router-dom";
import FavouriteRecruitPostListPanel from "../../components/panel/favourite-recruitposts.panel";

type TabKey = "info" | "password" | "applications" | "logout" | "favourite-recruitposts" | "saved-organizations";

const MENU_ITEMS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: "info", label: "Thông tin tài khoản", icon: <Person sx={{ fontSize: 18 }} /> },
    { key: "password", label: "Thay đổi mật khẩu", icon: <Lock sx={{ fontSize: 18 }} /> },
    { key: "applications", label: "Chương trình đã ứng tuyển", icon: <WorkOutline sx={{ fontSize: 18 }} /> },
    { key: "favourite-recruitposts", label: "Chương trình đã lưu", icon: <TurnedInNot sx={{ fontSize: 18 }} /> },
];

export default function AccountInfoPage() {
    const navigate = useNavigate();
    const [logoDialogOpen, setLogoDialogOpen] = useState(false);
    const userInfo = getUserInfo();
    const [activeTab, setActiveTab] = useState<TabKey>("info");

    const handleSignOut = async () => { navigate("/sign-out"); };
    const { data: account, isLoading } = useGetCustomerByIdQuery(userInfo?.Id ?? "", { skip: !userInfo?.Id });

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
                                {MENU_ITEMS.map((item) => (
                                    <Stack
                                        key={item.key}
                                        direction="row"
                                        spacing={1.25}
                                        alignItems="center"
                                        onClick={() => setActiveTab(item.key)}
                                        sx={{
                                            px: 1, py: 1.25, borderRadius: 1.5,
                                            cursor: "pointer",
                                            bgcolor: activeTab === item.key ? "#fff3e0" : "transparent",
                                            color: activeTab === item.key ? "#f36730" : "text.secondary",
                                            fontWeight: activeTab === item.key ? 700 : 400,
                                            transition: "all .15s ease",
                                            "&:hover": { bgcolor: activeTab === item.key ? "#fff3e0" : "#f5f5f5" },
                                        }}
                                    >
                                        <Box sx={{ color: activeTab === item.key ? "#f36730" : "#9e9e9e", alignItems: "center", display: "flex", flexShrink: 0, }}>{item.icon}</Box>
                                        <Typography variant="body2" fontWeight={activeTab === item.key ? 700 : 500} sx={{ fontSize: "0.85rem" }}>{item.label}</Typography>
                                    </Stack>
                                ))}
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
                            {activeTab === "info" && (
                                isLoading ? (
                                    <Box sx={{ textAlign: "center", py: 8 }}>
                                        <CircularProgress size={36} sx={{ color: "#f36730" }} />
                                    </Box>
                                ) : account ? (
                                    <AccountInfoPanel account={account} />
                                ) : null
                            )}
                            {activeTab === "password" && <ChangePasswordPanel />}
                            {activeTab === "applications" && <ApplicationListPanel />}
                            {activeTab === "favourite-recruitposts" && <FavouriteRecruitPostListPanel />}
                        </Paper>
                    </Box>
                </Stack>
            </Container>
            <StudentLogoUploadDialog open={logoDialogOpen} onClose={() => setLogoDialogOpen(false)} currentLogoUrl={account?.AvatarFullUrl ?? ""} />
        </Box>
    );
}