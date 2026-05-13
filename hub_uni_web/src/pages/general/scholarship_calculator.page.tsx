import { useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Slider from "@mui/material/Slider";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Alert from "@mui/material/Alert";
import { styled, keyframes } from "@mui/material/styles";
import CalculateIcon from "@mui/icons-material/Calculate";
import SchoolIcon from "@mui/icons-material/School";
import HomeIcon from "@mui/icons-material/Home";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import WifiIcon from "@mui/icons-material/Wifi";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import StarIcon from "@mui/icons-material/Star";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LocationOnIcon from "@mui/icons-material/LocationOn";

// Animations
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

// Styled Components
const PageContainer = styled(Box)({
    background: "linear-gradient(180deg, #fff5e6 0%, #ffffff 100%)",
    minHeight: "100vh",
    paddingBottom: "60px",
});

const HeaderSection = styled(Box)(({ theme }) => ({
    background: "linear-gradient(135deg, #faa11b 0%, #f5b95e 100%)",
    padding: "48px 20px 110px",
    position: "relative",
    overflow: "hidden",

    [theme.breakpoints.down('md')]: {
        padding: "40px 16px 100px",
    },

    [theme.breakpoints.down('sm')]: {
        padding: "32px 12px 90px",
    },

    "&::before": {
        content: '""',
        position: "absolute",
        top: "-50%",
        left: "-10%",
        width: "120%",
        height: "200%",
        background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
        animation: `${shimmer} 3s infinite linear`,
    },
}));

const Badge = styled(Box)(({ theme }) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    background: "rgba(255,255,255,0.25)",
    padding: "4px 16px",
    borderRadius: "20px",
    marginBottom: "16px",
    border: "1px solid rgba(255,255,255,0.3)",
    backdropFilter: "blur(10px)",

    [theme.breakpoints.down('sm')]: {
        padding: "3px 12px",
        gap: "4px",
    },
}));

const CalculatorCard = styled(Card)(({ theme }) => ({
    borderRadius: "20px",
    padding: "28px",
    marginTop: "-70px",
    position: "relative",
    zIndex: 2,
    boxShadow: "0 8px 32px rgba(250, 161, 27, 0.12)",
    border: "1px solid rgba(250, 161, 27, 0.1)",
    animation: `${fadeUp} 0.6s ease`,
    background: "#ffffff",

    [theme.breakpoints.down('md')]: {
        padding: "24px",
        marginTop: "-60px",
    },

    [theme.breakpoints.down('sm')]: {
        padding: "20px",
        marginTop: "-50px",
        borderRadius: "16px",
    },
}));

const ResultCard = styled(Card)(({ theme }) => ({
    borderRadius: "16px",
    padding: "24px",
    background: "linear-gradient(135deg, #ffffff 0%, #fef9f0 100%)",
    border: "1px solid rgba(250, 161, 27, 0.1)",
    transition: "all 0.3s ease",

    "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 8px 24px rgba(250, 161, 27, 0.15)",
    },

    [theme.breakpoints.down('sm')]: {
        padding: "20px",
        borderRadius: "14px",
    },
}));

const CostItem = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "14px",
    borderRadius: "10px",
    background: "#ffffff",
    marginBottom: "10px",
    transition: "all 0.2s ease",
    border: "1px solid #f5f5f5",

    "&:hover": {
        background: "#fef9f0",
        borderColor: "rgba(250, 161, 27, 0.2)",
    },

    [theme.breakpoints.down('sm')]: {
        padding: "12px",
        gap: "12px",
    },
}));

const SchoolCard = styled(Card)(({ theme }) => ({
    borderRadius: "16px",
    padding: "20px",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    border: "1px solid rgba(250, 161, 27, 0.12)",
    position: "relative",
    overflow: "hidden",
    background: "#ffffff",

    "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "3px",
        background: "linear-gradient(90deg, #faa11b, #f5b95e)",
        transform: "scaleX(0)",
        transition: "transform 0.35s ease",
    },

    "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: "0 12px 28px rgba(250, 161, 27, 0.18)",
        borderColor: "rgba(250, 161, 27, 0.3)",
        "&::before": { transform: "scaleX(1)" },
    },

    [theme.breakpoints.down('sm')]: {
        padding: "16px",
        borderRadius: "14px",
    },
}));

// Interfaces
interface CalculatorInputs {
    gpa: string;
    visaType: string;
    languageLevel: string;
    housingType: string;
}

interface CostBreakdown {
    housing: { min: number; max: number };
    food: { min: number; max: number };
    transport: { min: number; max: number };
    books: { min: number; max: number };
    internet: { min: number; max: number };
}

interface SchoolRecommendation {
    id: string;
    name: string;
    englishName: string;
    location: string;
    tuitionMin: number;
    tuitionMax: number;
    scholarshipRate: number;
    matchScore: number;
}

// Mock data
const VISA_TYPES = [
    { value: "D2", label: "D-2 (Visa du học)" },
    { value: "D4", label: "D-4 (Visa ngôn ngữ)" },
    { value: "D10", label: "D-10 (Visa tìm việc)" },
];

const LANGUAGE_LEVELS = [
    { value: "topik1", label: "TOPIK 1 (Sơ cấp 1-2)" },
    { value: "topik2", label: "TOPIK 2 (Sơ cấp 3-4)" },
    { value: "topik3", label: "TOPIK 3 (Trung cấp 1-2)" },
    { value: "topik4", label: "TOPIK 4 (Trung cấp 3-4)" },
    { value: "topik5", label: "TOPIK 5 (Cao cấp 1)" },
    { value: "topik6", label: "TOPIK 6 (Cao cấp 2)" },
];

const HOUSING_TYPES = [
    { value: "dorm", label: "Ký túc xá trường" },
    { value: "goshiwon", label: "Goshiwon (Phòng mini)" },
    { value: "homestay", label: "Homestay" },
    { value: "apartment", label: "Phòng trọ/Apartment" },
];

const MOCK_SCHOOLS: SchoolRecommendation[] = [
    {
        id: "1",
        name: "Đại học Quốc gia Seoul",
        englishName: "Seoul National University",
        location: "Seoul",
        tuitionMin: 60000000,
        tuitionMax: 90000000,
        scholarshipRate: 50,
        matchScore: 95,
    },
    {
        id: "2",
        name: "Đại học Yonsei",
        englishName: "Yonsei University",
        location: "Seoul",
        tuitionMin: 70000000,
        tuitionMax: 100000000,
        scholarshipRate: 40,
        matchScore: 92,
    },
    {
        id: "3",
        name: "Đại học Korea",
        englishName: "Korea University",
        location: "Seoul",
        tuitionMin: 65000000,
        tuitionMax: 95000000,
        scholarshipRate: 45,
        matchScore: 90,
    },
    {
        id: "4",
        name: "Đại học Sungkyunkwan",
        englishName: "Sungkyunkwan University",
        location: "Seoul",
        tuitionMin: 60000000,
        tuitionMax: 85000000,
        scholarshipRate: 50,
        matchScore: 88,
    },
    {
        id: "5",
        name: "Đại học Hanyang",
        englishName: "Hanyang University",
        location: "Seoul",
        tuitionMin: 55000000,
        tuitionMax: 80000000,
        scholarshipRate: 45,
        matchScore: 86,
    },
    {
        id: "6",
        name: "Đại học Ewha",
        englishName: "Ewha Womans University",
        location: "Seoul",
        tuitionMin: 58000000,
        tuitionMax: 82000000,
        scholarshipRate: 40,
        matchScore: 85,
    },
];

const ScholarshipCalculator = () => {
    const [inputs, setInputs] = useState<CalculatorInputs>({
        gpa: "",
        visaType: "",
        languageLevel: "",
        housingType: "",
    });

    const [gpaValue, setGpaValue] = useState<number>(3.0);

    const handleInputChange = (field: keyof CalculatorInputs, value: string) => {
        setInputs(prev => ({ ...prev, [field]: value }));
    };

    const handleGpaChange = (_: Event, value: number | number[]) => {
        const newValue = Array.isArray(value) ? value[0] : value;
        setGpaValue(newValue);
        setInputs(prev => ({ ...prev, gpa: newValue.toFixed(2) }));
    };

    const calculateCosts = (): CostBreakdown => {
        const housingCosts = {
            dorm: { min: 2000000, max: 4000000 },
            goshiwon: { min: 3000000, max: 5000000 },
            homestay: { min: 4000000, max: 6000000 },
            apartment: { min: 5000000, max: 8000000 },
        };

        return {
            housing: inputs.housingType
                ? housingCosts[inputs.housingType as keyof typeof housingCosts]
                : { min: 2000000, max: 8000000 },
            food: { min: 3000000, max: 6000000 },
            transport: { min: 800000, max: 1000000 },
            books: { min: 2000000, max: 4000000 },
            internet: { min: 650000, max: 750000 },
        };
    };

    const calculateScholarship = () => {
        let baseRate = 0;

        // GPA-based scholarship
        if (gpaValue >= 3.7) baseRate = 50;
        else if (gpaValue >= 3.5) baseRate = 40;
        else if (gpaValue >= 3.2) baseRate = 30;
        else if (gpaValue >= 3.0) baseRate = 20;
        else if (gpaValue >= 2.5) baseRate = 10;

        // Language level bonus
        const languageLevelNum = parseInt(inputs.languageLevel.replace('topik', ''));
        if (languageLevelNum >= 5) baseRate += 15;
        else if (languageLevelNum >= 4) baseRate += 10;
        else if (languageLevelNum >= 3) baseRate += 5;

        return Math.min(baseRate, 100);
    };

    const costs = calculateCosts();
    const scholarshipRate = calculateScholarship();
    const totalMonthlyMin = costs.housing.min + costs.food.min + costs.transport.min + costs.internet.min;
    const totalMonthlyMax = costs.housing.max + costs.food.max + costs.transport.max + costs.internet.max;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    const isFormValid = inputs.gpa && inputs.visaType && inputs.languageLevel && inputs.housingType;

    return (
        <PageContainer>
            {/* Header Section */}
            <HeaderSection>
                <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
                    <Box sx={{ textAlign: "center" }}>
                        <Badge>
                            <CalculateIcon sx={{ fontSize: { xs: 18, sm: 20 }, color: "#ffffff" }} />
                            <Typography
                                sx={{
                                    fontSize: { xs: "0.7rem", sm: "0.75rem" },
                                    fontWeight: 700,
                                    color: "#ffffff",
                                    letterSpacing: { xs: 0.8, sm: 1 },
                                    textTransform: "uppercase"
                                }}
                            >
                                Công cụ hỗ trợ
                            </Typography>
                        </Badge>

                        <Typography
                            sx={{
                                fontSize: { xs: "1.75rem", sm: "2.25rem", md: "2.75rem" },
                                fontWeight: 800,
                                color: "#ffffff",
                                lineHeight: 1.2,
                                mb: { xs: 1.5, sm: 2 },
                                textShadow: "0 2px 20px rgba(0,0,0,0.1)",
                            }}
                        >
                            Tính Học Bổng & Chi Phí
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: { xs: "0.875rem", sm: "0.95rem", md: "1rem" },
                                color: "rgba(255,255,255,0.95)",
                                maxWidth: 600,
                                mx: "auto",
                                lineHeight: 1.5,
                                px: { xs: 2, sm: 0 },
                            }}
                        >
                            Ước tính chi phí sinh hoạt và tỷ lệ học bổng phù hợp
                        </Typography>
                    </Box>
                </Container>
            </HeaderSection>

            <Container maxWidth="lg">
                {/* Calculator Card */}
                <CalculatorCard>
                    <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1.5, sm: 2 }, mb: 3 }}>
                        <Box
                            sx={{
                                width: { xs: 44, sm: 48 },
                                height: { xs: 44, sm: 48 },
                                borderRadius: "12px",
                                background: "linear-gradient(135deg, #faa11b, #f5b95e)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                            }}
                        >
                            <SchoolIcon sx={{ fontSize: { xs: 24, sm: 28 }, color: "#ffffff" }} />
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                                sx={{
                                    fontWeight: 700,
                                    color: "#1a1a1a",
                                    mb: 0.5,
                                    fontSize: { xs: "1.1rem", sm: "1.25rem" },
                                }}
                            >
                                Thông tin hồ sơ
                            </Typography>
                            <Typography sx={{ color: "#666", fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>
                                Điền thông tin để nhận kết quả chính xác
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: { xs: 2.5, sm: 3 } }}>
                        {/* GPA Slider */}
                        <Box sx={{ gridColumn: { xs: "1", md: "1 / -1" } }}>
                            <Typography sx={{ fontWeight: 600, color: "#1a1a1a", mb: 1.5, fontSize: { xs: "0.9rem", sm: "0.95rem" } }}>
                                Điểm GPA:{" "}
                                <Chip
                                    label={gpaValue.toFixed(2)}
                                    size="small"
                                    sx={{
                                        ml: 0.5,
                                        fontWeight: 700,
                                        bgcolor: "#faa11b",
                                        color: "#ffffff",
                                        height: { xs: 22, sm: 24 },
                                        fontSize: { xs: "0.75rem", sm: "0.8125rem" },
                                    }}
                                />
                            </Typography>
                            <Slider
                                value={gpaValue}
                                onChange={handleGpaChange}
                                min={0}
                                max={4.0}
                                step={0.01}
                                marks={[
                                    { value: 0, label: '0.0' },
                                    { value: 1, label: '1.0' },
                                    { value: 2, label: '2.0' },
                                    { value: 3, label: '3.0' },
                                    { value: 4, label: '4.0' },
                                ]}
                                sx={{
                                    color: "#faa11b",
                                    "& .MuiSlider-thumb": {
                                        width: 20,
                                        height: 20,
                                        boxShadow: "0 2px 8px rgba(250, 161, 27, 0.4)",
                                    },
                                    "& .MuiSlider-track": {
                                        height: 5,
                                    },
                                    "& .MuiSlider-rail": {
                                        height: 5,
                                        opacity: 0.3,
                                    },
                                    "& .MuiSlider-markLabel": {
                                        fontSize: { xs: "0.7rem", sm: "0.75rem" },
                                    },
                                }}
                            />
                        </Box>

                        <TextField
                            select
                            label="Loại visa"
                            value={inputs.visaType}
                            onChange={(e) => handleInputChange('visaType', e.target.value)}
                            fullWidth
                            size="small"
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "10px",
                                    "&.Mui-focused fieldset": {
                                        borderColor: "#faa11b",
                                    },
                                },
                                "& .MuiInputLabel-root": {
                                    fontSize: { xs: "0.875rem", sm: "1rem" },
                                    "&.Mui-focused": {
                                        color: "#faa11b",
                                    },
                                },
                            }}
                        >
                            {VISA_TYPES.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select
                            label="Cấp độ ngôn ngữ"
                            value={inputs.languageLevel}
                            onChange={(e) => handleInputChange('languageLevel', e.target.value)}
                            fullWidth
                            size="small"
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "10px",
                                    "&.Mui-focused fieldset": {
                                        borderColor: "#faa11b",
                                    },
                                },
                                "& .MuiInputLabel-root": {
                                    fontSize: { xs: "0.875rem", sm: "1rem" },
                                    "&.Mui-focused": {
                                        color: "#faa11b",
                                    },
                                },
                            }}
                        >
                            {LANGUAGE_LEVELS.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select
                            label="Loại hình nhà ở"
                            value={inputs.housingType}
                            onChange={(e) => handleInputChange('housingType', e.target.value)}
                            fullWidth
                            size="small"
                            sx={{
                                gridColumn: { xs: "1", md: "1 / -1" },
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "10px",
                                    "&.Mui-focused fieldset": {
                                        borderColor: "#faa11b",
                                    },
                                },
                                "& .MuiInputLabel-root": {
                                    fontSize: { xs: "0.875rem", sm: "1rem" },
                                    "&.Mui-focused": {
                                        color: "#faa11b",
                                    },
                                },
                            }}
                        >
                            {HOUSING_TYPES.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>

                    <Button
                        variant="contained"
                        fullWidth
                        disabled={!isFormValid}
                        startIcon={<CalculateIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />}
                        sx={{
                            mt: 3,
                            py: { xs: 1.2, sm: 1.4 },
                            borderRadius: "10px",
                            background: "linear-gradient(135deg, #faa11b, #f5b95e)",
                            fontSize: { xs: "0.9rem", sm: "0.95rem" },
                            fontWeight: 600,
                            textTransform: "none",
                            boxShadow: "0 4px 14px rgba(250, 161, 27, 0.25)",
                            "&:hover": {
                                background: "linear-gradient(135deg, #f59510, #faa11b)",
                                boxShadow: "0 6px 20px rgba(250, 161, 27, 0.35)",
                            },
                            "&:disabled": {
                                background: "#e0e0e0",
                                color: "#999",
                            },
                        }}
                    >
                        Tính toán ngay
                    </Button>
                </CalculatorCard>

                <Box sx={{ mt: 4, animation: `${fadeUp} 0.6s ease` }}>
                    {/* Scholarship Result */}
                    <ResultCard sx={{ mb: 3 }}>
                        <Box sx={{
                            display: "flex",
                            alignItems: { xs: "flex-start", sm: "center" },
                            justifyContent: "space-between",
                            flexDirection: { xs: "column", sm: "row" },
                            gap: 2
                        }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Box
                                    sx={{
                                        width: { xs: 52, sm: 56 },
                                        height: { xs: 52, sm: 56 },
                                        borderRadius: "14px",
                                        background: "linear-gradient(135deg, #4caf50, #66bb6a)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0,
                                    }}
                                >
                                    <StarIcon sx={{ fontSize: { xs: 28, sm: 32 }, color: "#ffffff" }} />
                                </Box>
                                <Box>
                                    <Typography sx={{ color: "#666", fontSize: { xs: "0.8rem", sm: "0.85rem" }, mb: 0.5 }}>
                                        Tỷ lệ học bổng ước tính
                                    </Typography>
                                    <Typography sx={{
                                        fontWeight: 800,
                                        color: "#4caf50",
                                        fontSize: { xs: "1.75rem", sm: "2rem" },
                                    }}>
                                        {scholarshipRate}%
                                    </Typography>
                                </Box>
                            </Box>
                            <Alert
                                severity="success"
                                icon={<CheckCircleIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />}
                                sx={{
                                    borderRadius: "10px",
                                    fontSize: { xs: "0.8rem", sm: "0.875rem" },
                                    width: { xs: "100%", sm: "auto" },
                                }}
                            >
                                {scholarshipRate >= 50
                                    ? "Hồ sơ xuất sắc! Cơ hội học bổng cao"
                                    : scholarshipRate >= 30
                                        ? "Hồ sơ tốt! Có thể nhận học bổng"
                                        : "Cải thiện GPA và TOPIK để tăng cơ hội"}
                            </Alert>
                        </Box>
                    </ResultCard>

                    {/* Cost Breakdown */}
                    <ResultCard>
                        <Typography sx={{
                            fontWeight: 700,
                            color: "#1a1a1a",
                            mb: 2.5,
                            fontSize: { xs: "1.05rem", sm: "1.15rem" },
                        }}>
                            Chi phí sinh hoạt ước tính (tháng)
                        </Typography>

                        <CostItem>
                            <Box
                                sx={{
                                    width: { xs: 40, sm: 44 },
                                    height: { xs: 40, sm: 44 },
                                    borderRadius: "10px",
                                    background: "linear-gradient(135deg, #faa11b15, #faa11b25)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                }}
                            >
                                <HomeIcon sx={{ fontSize: { xs: 20, sm: 22 }, color: "#faa11b" }} />
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography sx={{
                                    fontWeight: 600,
                                    color: "#1a1a1a",
                                    fontSize: { xs: "0.85rem", sm: "0.9rem" },
                                    mb: 0.3,
                                }}>
                                    Tiền nhà ({HOUSING_TYPES.find(h => h.value === inputs.housingType)?.label})
                                </Typography>
                                <Typography sx={{ color: "#666", fontSize: { xs: "0.75rem", sm: "0.8rem" } }}>
                                    {formatCurrency(costs.housing.min)} - {formatCurrency(costs.housing.max)}
                                </Typography>
                            </Box>
                        </CostItem>

                        <CostItem>
                            <Box
                                sx={{
                                    width: { xs: 40, sm: 44 },
                                    height: { xs: 40, sm: 44 },
                                    borderRadius: "10px",
                                    background: "linear-gradient(135deg, #ff572215, #ff572225)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                }}
                            >
                                <RestaurantIcon sx={{ fontSize: { xs: 20, sm: 22 }, color: "#ff5722" }} />
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography sx={{
                                    fontWeight: 600,
                                    color: "#1a1a1a",
                                    fontSize: { xs: "0.85rem", sm: "0.9rem" },
                                    mb: 0.3,
                                }}>
                                    Tiền ăn uống
                                </Typography>
                                <Typography sx={{ color: "#666", fontSize: { xs: "0.75rem", sm: "0.8rem" } }}>
                                    {formatCurrency(costs.food.min)} - {formatCurrency(costs.food.max)}
                                </Typography>
                            </Box>
                        </CostItem>

                        <CostItem>
                            <Box
                                sx={{
                                    width: { xs: 40, sm: 44 },
                                    height: { xs: 40, sm: 44 },
                                    borderRadius: "10px",
                                    background: "linear-gradient(135deg, #2196f315, #2196f325)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                }}
                            >
                                <DirectionsBusIcon sx={{ fontSize: { xs: 20, sm: 22 }, color: "#2196f3" }} />
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography sx={{
                                    fontWeight: 600,
                                    color: "#1a1a1a",
                                    fontSize: { xs: "0.85rem", sm: "0.9rem" },
                                    mb: 0.3,
                                }}>
                                    Tiền di chuyển
                                </Typography>
                                <Typography sx={{ color: "#666", fontSize: { xs: "0.75rem", sm: "0.8rem" } }}>
                                    {formatCurrency(costs.transport.min)} - {formatCurrency(costs.transport.max)}
                                </Typography>
                            </Box>
                        </CostItem>

                        <CostItem>
                            <Box
                                sx={{
                                    width: { xs: 40, sm: 44 },
                                    height: { xs: 40, sm: 44 },
                                    borderRadius: "10px",
                                    background: "linear-gradient(135deg, #9c27b015, #9c27b025)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                }}
                            >
                                <MenuBookIcon sx={{ fontSize: { xs: 20, sm: 22 }, color: "#9c27b0" }} />
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography sx={{
                                    fontWeight: 600,
                                    color: "#1a1a1a",
                                    fontSize: { xs: "0.85rem", sm: "0.9rem" },
                                    mb: 0.3,
                                }}>
                                    Sách vở, tài liệu
                                </Typography>
                                <Typography sx={{ color: "#666", fontSize: { xs: "0.75rem", sm: "0.8rem" } }}>
                                    {formatCurrency(costs.books.min)} - {formatCurrency(costs.books.max)} (học kỳ)
                                </Typography>
                            </Box>
                        </CostItem>

                        <CostItem>
                            <Box
                                sx={{
                                    width: { xs: 40, sm: 44 },
                                    height: { xs: 40, sm: 44 },
                                    borderRadius: "10px",
                                    background: "linear-gradient(135deg, #00968815, #00968825)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                }}
                            >
                                <WifiIcon sx={{ fontSize: { xs: 20, sm: 22 }, color: "#009688" }} />
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography sx={{
                                    fontWeight: 600,
                                    color: "#1a1a1a",
                                    fontSize: { xs: "0.85rem", sm: "0.9rem" },
                                    mb: 0.3,
                                }}>
                                    Internet, điện thoại
                                </Typography>
                                <Typography sx={{ color: "#666", fontSize: { xs: "0.75rem", sm: "0.8rem" } }}>
                                    {formatCurrency(costs.internet.min)} - {formatCurrency(costs.internet.max)}
                                </Typography>
                            </Box>
                        </CostItem>

                        <Divider sx={{ my: 2.5 }} />

                        <Box sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            px: { xs: 1, sm: 2 },
                            flexWrap: "wrap",
                            gap: 1,
                        }}>
                            <Typography sx={{
                                fontWeight: 700,
                                color: "#1a1a1a",
                                fontSize: { xs: "1rem", sm: "1.1rem" },
                            }}>
                                Tổng chi phí/tháng
                            </Typography>
                            <Typography sx={{
                                fontWeight: 800,
                                color: "#faa11b",
                                fontSize: { xs: "1.1rem", sm: "1.25rem" },
                            }}>
                                {formatCurrency(totalMonthlyMin)} - {formatCurrency(totalMonthlyMax)}
                            </Typography>
                        </Box>
                    </ResultCard>

                    {/* Recommended Schools */}
                    <Box sx={{ mt: 4 }}>
                        <Box sx={{ textAlign: "center", mb: 3 }}>
                            <Badge sx={{ background: "linear-gradient(135deg, #faa11b, #f5b95e)" }}>
                                <TrendingUpIcon sx={{ fontSize: { xs: 16, sm: 18 }, color: "#ffffff" }} />
                                <Typography
                                    sx={{
                                        fontSize: { xs: "0.7rem", sm: "0.75rem" },
                                        fontWeight: 700,
                                        color: "#ffffff",
                                        letterSpacing: { xs: 0.8, sm: 1 },
                                        textTransform: "uppercase"
                                    }}
                                >
                                    Phù hợp với bạn
                                </Typography>
                            </Badge>

                            <Typography
                                sx={{
                                    fontWeight: 800,
                                    color: "#1a1a1a",
                                    mb: 1,
                                    fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
                                }}
                            >
                                Trường được gợi ý
                            </Typography>

                            <Typography sx={{
                                color: "#666",
                                fontSize: { xs: "0.85rem", sm: "0.9rem" },
                                px: { xs: 2, sm: 0 },
                            }}>
                                Dựa trên hồ sơ của bạn, các trường sau phù hợp nhất
                            </Typography>
                        </Box>

                        <Box sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                sm: "repeat(2, 1fr)",
                                lg: "repeat(3, 1fr)"
                            },
                            gap: { xs: 2, sm: 2.5, md: 3 }
                        }}>
                            {MOCK_SCHOOLS.map((school, index) => (
                                <SchoolCard
                                    key={school.id}
                                    sx={{
                                        animationDelay: `${index * 80}ms`,
                                        animation: `${fadeUp} 0.5s ease both`
                                    }}
                                >
                                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, mb: 1.5 }}>
                                        <Box
                                            sx={{
                                                width: { xs: 44, sm: 48 },
                                                height: { xs: 44, sm: 48 },
                                                borderRadius: "12px",
                                                background: "linear-gradient(135deg, #fff5e6, #ffffff)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                border: "1px solid rgba(250, 161, 27, 0.2)",
                                                flexShrink: 0,
                                            }}
                                        >
                                            <SchoolIcon sx={{ fontSize: { xs: 22, sm: 24 }, color: "#faa11b" }} />
                                        </Box>
                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                            <Typography sx={{
                                                fontWeight: 700,
                                                color: "#1a1a1a",
                                                fontSize: { xs: "0.95rem", sm: "1rem" },
                                                mb: 0.5,
                                                lineHeight: 1.3,
                                            }}>
                                                {school.name}
                                            </Typography>
                                            <Typography sx={{
                                                color: "#666",
                                                fontSize: { xs: "0.75rem", sm: "0.8rem" },
                                                mb: 0.8,
                                                lineHeight: 1.3,
                                            }}>
                                                {school.englishName}
                                            </Typography>
                                            <Chip
                                                icon={<LocationOnIcon sx={{ fontSize: 14 }} />}
                                                label={school.location}
                                                size="small"
                                                sx={{
                                                    height: 22,
                                                    fontWeight: 600,
                                                    fontSize: "0.7rem",
                                                    bgcolor: "#faa11b15",
                                                    color: "#faa11b",
                                                }}
                                            />
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: "flex", gap: 0.8, mb: 1.5, flexWrap: "wrap" }}>
                                        <Chip
                                            icon={<StarIcon sx={{ fontSize: 14 }} />}
                                            label={`${school.matchScore}%`}
                                            size="small"
                                            sx={{
                                                height: 24,
                                                fontWeight: 600,
                                                fontSize: "0.7rem",
                                                bgcolor: school.matchScore >= 90 ? "#4caf5015" : "#2196f315",
                                                color: school.matchScore >= 90 ? "#4caf50" : "#2196f3",
                                            }}
                                        />
                                        <Chip
                                            label={`HB ${school.scholarshipRate}%`}
                                            size="small"
                                            sx={{
                                                height: 24,
                                                fontWeight: 600,
                                                fontSize: "0.7rem",
                                                bgcolor: "#ff572215",
                                                color: "#ff5722",
                                            }}
                                        />
                                    </Box>

                                    <Typography sx={{
                                        color: "#666",
                                        fontSize: { xs: "0.75rem", sm: "0.8rem" },
                                        mb: 1.5,
                                        lineHeight: 1.4,
                                    }}>
                                        <strong style={{ color: "#1a1a1a" }}>Học phí:</strong>{" "}
                                        {formatCurrency(school.tuitionMin)} - {formatCurrency(school.tuitionMax)}/năm
                                    </Typography>

                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
                                        sx={{
                                            borderColor: "#faa11b",
                                            color: "#faa11b",
                                            fontWeight: 600,
                                            borderRadius: "8px",
                                            py: 0.8,
                                            fontSize: { xs: "0.8rem", sm: "0.85rem" },
                                            textTransform: "none",
                                            "&:hover": {
                                                borderColor: "#faa11b",
                                                background: "#faa11b",
                                                color: "#ffffff",
                                            },
                                        }}
                                    >
                                        Xem chi tiết
                                    </Button>
                                </SchoolCard>
                            ))}
                        </Box>
                    </Box>
                </Box>
            </Container>
        </PageContainer>
    );
};

export default ScholarshipCalculator;