import { useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Slider from "@mui/material/Slider";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import { styled, keyframes } from "@mui/material/styles";
import CalculateIcon from "@mui/icons-material/Calculate";
import SchoolIcon from "@mui/icons-material/School";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import StarIcon from "@mui/icons-material/Star";
import { useLazyGetVisaTypesByPageQuery } from "../../app/features/visa-type.api";
import { useLazyGetLanguageLevelsByPageQuery } from "../../app/features/language-level.api";
import { useLazyGetRecommendScholarshipsQuery } from "../../app/features/scholarship.api";
import { createAsyncLoader } from "../../helper/asyncLoaders";
import { Scholarship } from "../../app/models/organization.model";
import AsyncAutocomplete, { SelectOption } from "../../components/base/AsyncAutocomplete";

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const floatOrb = keyframes`
  0%, 100% { transform: translate(0, 0) scale(1); }
  33%       { transform: translate(30px, -20px) scale(1.05); }
  66%       { transform: translate(-20px, 15px) scale(0.97); }
`;

const pulseRing = keyframes`
  0%   { box-shadow: 0 0 0 0 rgba(250, 161, 27, 0.4); }
  70%  { box-shadow: 0 0 0 12px rgba(250, 161, 27, 0); }
  100% { box-shadow: 0 0 0 0 rgba(250, 161, 27, 0); }
`;

const staggerIn = keyframes`
  from { opacity: 0; transform: translateY(20px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`;


const PageWrapper = styled(Box)({
    minHeight: "100vh",
    background: "#fafaf8",
    paddingBottom: 80,
    fontFamily: "'DM Sans', sans-serif",
});

const HeroSection = styled(Box)(({ theme }) => ({
    position: "relative",
    overflow: "hidden",
    background: "linear-gradient(145deg, #1a1208 0%, #2d1f06 50%, #1a1208 100%)",
    padding: "56px 20px 120px",

    [theme.breakpoints.down("md")]: { padding: "44px 16px 104px" },
    [theme.breakpoints.down("sm")]: { padding: "36px 12px 96px" },
}));

const Orb = styled(Box)<{ size: number; top: string; left: string; delay: string }>(
    ({ size, top, left, delay }) => ({
        position: "absolute",
        width: size,
        height: size,
        top,
        left,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(250,161,27,0.25) 0%, transparent 70%)",
        animation: `${floatOrb} 8s ease-in-out infinite`,
        animationDelay: delay,
        pointerEvents: "none",
    })
);

const HeroBadge = styled(Box)({
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    background: "rgba(250,161,27,0.15)",
    border: "1px solid rgba(250,161,27,0.35)",
    borderRadius: 100,
    padding: "6px 18px",
    marginBottom: 20,
    backdropFilter: "blur(8px)",
});

const FormCard = styled(Card)(({ theme }) => ({
    borderRadius: 24,
    padding: "36px 32px",
    marginTop: -80,
    position: "relative",
    zIndex: 10,
    background: "#ffffff",
    border: "1px solid rgba(0,0,0,0.06)",
    boxShadow: "0 24px 64px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.04)",

    [theme.breakpoints.down("sm")]: {
        padding: "24px 20px",
        borderRadius: 20,
        marginTop: -60,
    },
}));

const FormSectionLabel = styled(Typography)({
    fontSize: "0.7rem",
    fontWeight: 700,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: "#aaa",
    marginBottom: 20,
});

const SubmitButton = styled(Button)(({ theme }) => ({
    marginTop: 28,
    height: 52,
    borderRadius: 12,
    background: "linear-gradient(135deg, #faa11b 0%, #ff8c00 100%)",
    fontSize: "0.95rem",
    fontWeight: 700,
    textTransform: "none",
    letterSpacing: 0.3,
    color: "#fff",
    boxShadow: "0 6px 20px rgba(250,161,27,0.35)",
    transition: "all 0.25s ease",
    animation: `${pulseRing} 2.5s infinite`,

    "&:hover": {
        background: "linear-gradient(135deg, #ff9500 0%, #e67c00 100%)",
        boxShadow: "0 8px 28px rgba(250,161,27,0.45)",
        transform: "translateY(-1px)",
    },

    "&.Mui-disabled": {
        background: "#e8e8e8",
        color: "#bbb",
        boxShadow: "none",
        animation: "none",
    },

    [theme.breakpoints.down("sm")]: { height: 48, fontSize: "0.875rem" },
}));

const ResultsHeader = styled(Box)({
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
});

const SchoolCardStyled = styled(Card)<{ index: number }>(({ theme, index }) => ({
    borderRadius: 20,
    overflow: "hidden",
    background: "#fff",
    border: "1px solid rgba(0,0,0,0.06)",
    boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
    transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
    animation: `${staggerIn} 0.5s ease both`,
    animationDelay: `${index * 0.08}s`,
    display: "flex",
    flexDirection: "column",

    "&:hover": {
        transform: "translateY(-6px)",
        boxShadow: "0 16px 40px rgba(250,161,27,0.18), 0 4px 12px rgba(0,0,0,0.08)",
        borderColor: "rgba(250,161,27,0.3)",
    },
}));

const SchoolCardAccent = styled(Box)({
    height: 4,
    background: "linear-gradient(90deg, #faa11b 0%, #ff8c00 60%, #ffcd70 100%)",
});

const SchoolCardBody = styled(Box)(({ theme }) => ({
    padding: "20px 20px 16px",
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    gap: 16,

    [theme.breakpoints.down("sm")]: { padding: "16px 16px 12px" },
}));

const SchoolLogo = styled("img")({
    width: 64,
    height: 64,
    borderRadius: 12,
    objectFit: "cover",
    border: "1px solid #f0f0f0",
    flexShrink: 0,
});

const PercentageBadge = styled(Box)({
    display: "inline-flex",
    alignItems: "baseline",
    gap: 2,
    background: "linear-gradient(135deg, #fff7e6, #fff3d6)",
    border: "1px solid rgba(250,161,27,0.2)",
    borderRadius: 12,
    padding: "10px 14px",
});

const GpaTag = styled(Box)({
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    background: "#f5f5f5",
    borderRadius: 8,
    padding: "4px 10px",
});

const ViewButton = styled(Button)({
    borderRadius: 12,
    padding: "10px 16px",
    textTransform: "none",
    fontWeight: 700,
    fontSize: "0.85rem",
    background: "linear-gradient(135deg, #faa11b, #ff8c00)",
    color: "#fff",
    boxShadow: "none",
    transition: "all 0.2s ease",

    "&:hover": {
        background: "linear-gradient(135deg, #f59000, #e67c00)",
        boxShadow: "0 4px 14px rgba(250,161,27,0.3)",
    },
});

interface CalculatorInputs {
    gpa: string;
    visaTypeId: string;
    languageLevelId: string;
}


const PAGE_SIZE = 10;

const ScholarshipCalculator = () => {
    const [gpaValue, setGpaValue] = useState<number>(7.0);
    const [inputs, setInputs] = useState<CalculatorInputs>({
        gpa: "7.00",
        visaTypeId: "",
        languageLevelId: "",
    });
    const [selectedVisaOption, setSelectedVisaOption] = useState<SelectOption | null>(null);
    const [selectedLangOption, setSelectedLangOption] = useState<SelectOption | null>(null);
    const [recommendedSchools, setRecommendedSchools] = useState<Scholarship[]>([]);
    const [currentSize, setCurrentSize] = useState<number>(PAGE_SIZE);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

    const [getVisaTypes] = useLazyGetVisaTypesByPageQuery();
    const [getLanguageLevels] = useLazyGetLanguageLevelsByPageQuery();
    const [getRecommendScholarships, { isLoading }] = useLazyGetRecommendScholarshipsQuery();

    const loadVisaOptions = useMemo(() => createAsyncLoader(getVisaTypes), [getVisaTypes]);
    const loadLanguageOptions = useMemo(() => createAsyncLoader(getLanguageLevels), [getLanguageLevels]);

    const hasMore = recommendedSchools.length < totalCount;

    const fetchScholarships = async (size: number) => {
        const res = await getRecommendScholarships({
            gpa: parseFloat(inputs.gpa),
            visaTypeId: inputs.visaTypeId,
            languageLevelId: inputs.languageLevelId,
            page: 1,
            size,
        }).unwrap();
        return res;
    };

    const handleGpaChange = (_: Event, value: number | number[]) => {
        const v = Array.isArray(value) ? value[0] : value;
        setGpaValue(v);
        setInputs((p) => ({ ...p, gpa: v.toFixed(2) }));
    };

    const handleVisaChange = (option: SelectOption | null) => {
        setSelectedVisaOption(option);
        setInputs((p) => ({ ...p, visaTypeId: option?.value ?? "" }));
    };

    const handleLangChange = (option: SelectOption | null) => {
        setSelectedLangOption(option);
        setInputs((p) => ({ ...p, languageLevelId: option?.value ?? "" }));
    };

    const handleCalculate = async () => {
        try {
            const res = await fetchScholarships(PAGE_SIZE);
            setRecommendedSchools(res.Items ?? []);
            setTotalCount(res.Total ?? 0);
            setCurrentSize(PAGE_SIZE);
        } catch {
            setRecommendedSchools([]);
            setTotalCount(0);
        }
    };

    const handleLoadMore = async () => {
        const nextSize = currentSize + PAGE_SIZE;
        setIsLoadingMore(true);
        try {
            const res = await fetchScholarships(nextSize);
            setRecommendedSchools(res.Items ?? []);
            setTotalCount(res.Total ?? 0);
            setCurrentSize(nextSize);
        } catch {
        } finally {
            setIsLoadingMore(false);
        }
    };

    return (
        <PageWrapper>
            <HeroSection>
                <Orb size={300} top="-80px" left="-60px" delay="0s" />
                <Orb size={200} top="20px" left="60%" delay="2s" />
                <Orb size={150} top="50px" left="80%" delay="4s" />

                <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1, textAlign: "center" }}>
                    <HeroBadge>
                        <CalculateIcon sx={{ fontSize: 16, color: "#faa11b" }} />
                        <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, color: "#faa11b", letterSpacing: 1.2, textTransform: "uppercase" }}>
                            Công cụ hỗ trợ
                        </Typography>
                    </HeroBadge>

                    <Typography
                        sx={{
                            fontFamily: "'DM Serif Display', serif",
                            fontSize: { xs: "2rem", sm: "2.6rem", md: "3.2rem" },
                            fontWeight: 400,
                            color: "#fff",
                            lineHeight: 1.15,
                            mb: 2,
                            letterSpacing: -0.5,
                        }}
                    >
                        Tính Học Bổng &{" "}
                        <Box component="span" sx={{ color: "#faa11b" }}>
                            Chi Phí
                        </Box>
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: { xs: "0.875rem", sm: "1rem" },
                            color: "rgba(255,255,255,0.55)",
                            maxWidth: 520,
                            mx: "auto",
                            lineHeight: 1.65,
                        }}
                    >
                        Ước tính tỷ lệ học bổng phù hợp với hồ sơ của bạn chỉ trong vài giây.
                    </Typography>
                </Container>
            </HeroSection>

            <Container maxWidth="lg">
                <FormCard>
                    <FormSectionLabel>Thông tin hồ sơ</FormSectionLabel>

                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                            gap: { xs: 2.5, md: 3 },
                        }}
                    >
                        <Box sx={{ gridColumn: { xs: "1", md: "1 / -1" } }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                                <Typography sx={{ fontWeight: 600, color: "#1a1a1a", fontSize: "0.9rem" }}>
                                    Điểm GPA
                                </Typography>
                                <Chip
                                    label={gpaValue.toFixed(2)}
                                    size="small"
                                    sx={{
                                        fontWeight: 800,
                                        fontSize: "0.8rem",
                                        bgcolor: "#faa11b",
                                        color: "#fff",
                                        height: 26,
                                        borderRadius: "8px",
                                        px: 0.5,
                                    }}
                                />
                                <Typography sx={{ fontSize: "0.8rem", color: "#aaa" }}>/ 10</Typography>
                            </Box>

                            <Slider
                                value={gpaValue}
                                onChange={handleGpaChange}
                                min={0}
                                max={10}
                                step={0.1}
                                marks={[0, 2, 4, 6, 8, 10].map((v) => ({ value: v, label: String(v) }))}
                                sx={{
                                    color: "#faa11b",
                                    "& .MuiSlider-thumb": {
                                        width: 24,
                                        height: 24,
                                        background: "#fff",
                                        border: "3px solid #faa11b",
                                        boxShadow: "0 2px 10px rgba(250,161,27,0.4)",
                                        "&:hover": { boxShadow: "0 0 0 8px rgba(250,161,27,0.12)" },
                                    },
                                    "& .MuiSlider-track": {
                                        height: 6,
                                        background: "linear-gradient(90deg, #faa11b, #ffcd70)",
                                        border: "none",
                                    },
                                    "& .MuiSlider-rail": { height: 6, background: "#e8e8e8" },
                                    "& .MuiSlider-markLabel": { fontSize: "0.72rem", color: "#bbb" },
                                }}
                            />
                        </Box>

                        <AsyncAutocomplete
                            label="Loại visa"
                            loadOptions={loadVisaOptions}
                            isDisabled={false}
                            value={selectedVisaOption}
                            onChange={handleVisaChange}
                        />

                        <AsyncAutocomplete
                            label="Cấp độ ngôn ngữ"
                            loadOptions={loadLanguageOptions}
                            isDisabled={false}
                            value={selectedLangOption}
                            onChange={handleLangChange}
                        />
                    </Box>

                    <SubmitButton
                        fullWidth
                        variant="contained"
                        disabled={isLoading}
                        startIcon={
                            isLoading ? (
                                <CircularProgress size={18} color="inherit" />
                            ) : (
                                <CalculateIcon sx={{ fontSize: 20 }} />
                            )
                        }
                        onClick={handleCalculate}
                    >
                        {isLoading ? "Đang tính toán..." : "Tính toán ngay"}
                    </SubmitButton>
                </FormCard>

                {recommendedSchools.length > 0 && (
                    <Box sx={{ mt: 6, animation: `${fadeUp} 0.5s ease` }}>
                        <ResultsHeader>
                            <Box
                                sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: "10px",
                                    background: "linear-gradient(135deg, #faa11b, #ff8c00)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                }}
                            >
                                <TrendingUpIcon sx={{ fontSize: 20, color: "#fff" }} />
                            </Box>
                            <Box>
                                <Typography sx={{ fontWeight: 800, fontSize: { xs: "1.2rem", sm: "1.4rem" }, color: "#1a1a1a", lineHeight: 1.2 }}>
                                    Trường được gợi ý
                                </Typography>
                                <Typography sx={{ fontSize: "0.82rem", color: "#888", mt: 0.25 }}>
                                    Tìm thấy {totalCount} trường phù hợp với hồ sơ của bạn
                                </Typography>
                            </Box>
                        </ResultsHeader>

                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: { xs: "1fr", sm: "repeat(2,1fr)", xl: "repeat(3,1fr)" },
                                gap: { xs: 2, sm: 2.5, md: 3 },
                            }}
                        >
                            {recommendedSchools.map((school, index) => (
                                <SchoolCardStyled key={school.Id} index={index}>
                                    <SchoolCardAccent />
                                    <SchoolCardBody>
                                        <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                                            <SchoolLogo src={school.OrganizationLogoUrl} alt={school.OrganizationName} />
                                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                                <Typography
                                                    sx={{ fontWeight: 800, fontSize: "0.95rem", color: "#1a1a1a", lineHeight: 1.35, mb: 0.5 }}
                                                >
                                                    {school.OrganizationName}
                                                </Typography>
                                                <Typography sx={{ fontSize: "0.78rem", color: "#aaa", lineHeight: 1.3 }}>
                                                    {school.OrganizationEnglishName}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                            <PercentageBadge>
                                                <StarIcon sx={{ fontSize: 14, color: "#faa11b", mr: 0.5 }} />
                                                <Typography
                                                    sx={{
                                                        fontWeight: 900,
                                                        fontSize: "1.6rem",
                                                        lineHeight: 1,
                                                        background: "linear-gradient(135deg, #faa11b, #ff7b00)",
                                                        WebkitBackgroundClip: "text",
                                                        WebkitTextFillColor: "transparent",
                                                    }}
                                                >
                                                    {school.Percentage}
                                                </Typography>
                                                <Typography sx={{ fontWeight: 700, fontSize: "1rem", color: "#faa11b" }}>%</Typography>
                                            </PercentageBadge>

                                            <Box>
                                                <Typography sx={{ fontWeight: 700, fontSize: "0.88rem", color: "#2d2d2d" }}>
                                                    {school.Name}
                                                </Typography>
                                                <Typography sx={{ fontSize: "0.75rem", color: "#aaa" }}>Học bổng đề xuất</Typography>
                                            </Box>
                                        </Box>

                                        <Typography
                                            sx={{
                                                fontSize: "0.82rem",
                                                color: "#666",
                                                lineHeight: 1.7,
                                                flexGrow: 1,
                                                display: "-webkit-box",
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: "vertical",
                                                overflow: "hidden",
                                            }}
                                        >
                                            {school.Description}
                                        </Typography>

                                        <Divider sx={{ borderColor: "#f0f0f0" }} />

                                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                            <GpaTag>
                                                <SchoolIcon sx={{ fontSize: 13, color: "#888" }} />
                                                <Typography sx={{ fontSize: "0.78rem", fontWeight: 700, color: "#444" }}>
                                                    GPA {school.Gpa}/10
                                                </Typography>
                                            </GpaTag>

                                            <ViewButton
                                                variant="contained"
                                                endIcon={<OpenInNewIcon sx={{ fontSize: 15 }} />}
                                                onClick={() => window.open(`/thong-tin-truong/${school.OrganizationCode}`, "_blank")}
                                            >
                                                Xem trường
                                            </ViewButton>
                                        </Box>
                                    </SchoolCardBody>
                                </SchoolCardStyled>
                            ))}
                        </Box>

                        {hasMore && (
                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 5, gap: 1.5 }}>
                                <Typography sx={{ fontSize: "0.8rem", color: "#aaa" }}>
                                    Đang hiển thị {recommendedSchools.length} / {totalCount} trường
                                </Typography>
                                <Button
                                    variant="outlined"
                                    disabled={isLoadingMore}
                                    startIcon={isLoadingMore ? <CircularProgress size={16} color="inherit" /> : null}
                                    onClick={handleLoadMore}
                                    sx={{
                                        borderRadius: 12,
                                        px: 4,
                                        py: 1.2,
                                        textTransform: "none",
                                        fontWeight: 700,
                                        fontSize: "0.9rem",
                                        borderColor: "#faa11b",
                                        color: "#faa11b",
                                        transition: "all 0.2s ease",
                                        "&:hover": {
                                            background: "rgba(250,161,27,0.06)",
                                            borderColor: "#ff8c00",
                                            color: "#ff8c00",
                                        },
                                        "&.Mui-disabled": {
                                            borderColor: "#e0e0e0",
                                            color: "#bbb",
                                        },
                                    }}
                                >
                                    {isLoadingMore ? "Đang tải..." : "Xem thêm"}
                                </Button>
                            </Box>
                        )}
                    </Box>
                )}
            </Container>
        </PageWrapper>
    );
};

export default ScholarshipCalculator;