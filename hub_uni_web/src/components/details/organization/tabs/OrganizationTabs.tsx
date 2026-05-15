import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Info from "@mui/icons-material/Info";
import NotificationsActive from "@mui/icons-material/NotificationsActive";
import School from "@mui/icons-material/School";
import CardGiftcard from "@mui/icons-material/CardGiftcard";
import { IntroductionTab } from "./IntroductionTab";
import { RecruitmentTab } from "./RecruitmentTab";
import { TuitionTab } from "./TuitionTab";
import { ScholarshipTab } from "./ScholarshipTab";
import { OrganizationDetailResponse } from "../../../../app/models/organization.model";

interface OrganizationTabsProps {
    tabValue: number;
    setTabValue: (value: number) => void;
    organization: OrganizationDetailResponse;
    recruitmentPosts: any;
    loadingPosts: boolean;
    onShare: () => void;
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const tabs = [
    { label: "Giới thiệu", icon: <Info sx={{ fontSize: 17 }} />, index: 0 },
    { label: "Chương trình tuyển sinh", icon: <NotificationsActive sx={{ fontSize: 17 }} />, index: 1 },
    { label: "Học phí", icon: <School sx={{ fontSize: 17 }} />, index: 2 },
    { label: "Học bổng", icon: <CardGiftcard sx={{ fontSize: 17 }} />, index: 3 },
];

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`organization-tabpanel-${index}`}
            aria-labelledby={`organization-tab-${index}`}
            {...other}
        >
            {value === index && <Box>{children}</Box>}
        </div>
    );
}

export const OrganizationTabs = ({ tabValue, setTabValue, organization, recruitmentPosts, loadingPosts, onShare }: OrganizationTabsProps) => {
    return (
        <Box>
            <Box sx={{ px: 2, pt: 1, pb: 0, bgcolor: '#fff' }}>
                <Stack direction="row" sx={{ overflowX: 'auto', '&::-webkit-scrollbar': { display: 'none' } }}>
                    {tabs.map((tab) => {
                        const isSelected = tabValue === tab.index;
                        return (
                            <Box
                                key={tab.index}
                                onClick={() => setTabValue(tab.index)}
                                sx={{ display: "flex", alignItems: "center", gap: 0.75, px: 2, py: 1, borderRadius: "5px 5px 0 0", cursor: "pointer", position: "relative", bgcolor: isSelected ? "#fff" : "transparent", border: "1px solid #e0e0e0", color: isSelected ? "primary.main" : "text.secondary", fontWeight: isSelected ? 700 : 500, "&:hover": { bgcolor: isSelected ? "#fff" : "rgba(21,101,192,0.04)", color: "primary.main", }, }}
                            >
                                <Box sx={{ display: "flex", alignItems: "center", color: isSelected ? "primary.main" : "text.disabled", transition: "color 0.2s", }}>
                                    {tab.icon}
                                </Box>
                                <Typography sx={{ fontSize: { xs: "0.78rem", sm: "0.875rem" }, fontWeight: "inherit", lineHeight: 1, whiteSpace: "nowrap", }}>
                                    {tab.label}
                                </Typography>
                            </Box>
                        );
                    })}
                </Stack>
                <Divider />
            </Box>

            <Box sx={{ bgcolor: '#fff', borderRadius: '0 0 8px 8px' }}>
                <TabPanel value={tabValue} index={0}>
                    <IntroductionTab organization={organization} onShare={onShare} />
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                    <RecruitmentTab recruitmentPosts={recruitmentPosts} loadingPosts={loadingPosts} />
                </TabPanel>
                <TabPanel value={tabValue} index={2}>
                    <TuitionTab organization={organization} />
                </TabPanel>
                <TabPanel value={tabValue} index={3}>
                    <ScholarshipTab organization={organization} />
                </TabPanel>
            </Box>
        </Box>
    );
};