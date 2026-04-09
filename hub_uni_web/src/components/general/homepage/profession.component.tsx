import { useEffect, useState, useMemo, useCallback } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Skeleton from "@mui/material/Skeleton";
import Alert from "@mui/material/Alert";
import { styled, keyframes } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useGetAllProfessionNoAuthenQuery } from "../../../app/features/profession.api";
import ComputerIcon from "@mui/icons-material/Computer";
import BuildIcon from "@mui/icons-material/Build";
import FlightIcon from "@mui/icons-material/Flight";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import LanguageIcon from "@mui/icons-material/Language";
import HealingIcon from "@mui/icons-material/Healing";
import PaletteIcon from "@mui/icons-material/Palette";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ScienceIcon from "@mui/icons-material/Science";
import EngineeringIcon from "@mui/icons-material/Engineering";
import SchoolIcon from "@mui/icons-material/School";
import WorkIcon from '@mui/icons-material/Work';
import BusinessIcon from "@mui/icons-material/Business";
import { Button } from "@mui/material";

interface Profession {
    Id: string;
    Name: string;
    EnglishName?: string;
    Seo: string;
    SeoUrl?: string;
    SigCode?: string;
    Code?: number;
    Status?: string;
}

const VISIBLE_DEFAULT = 16;
const ANIMATION_DELAY_STEP = 40;
const ICON_SIZE = 28;

const ICON_COMPONENTS = [
    ComputerIcon, BuildIcon, FlightIcon, AccountBalanceIcon,
    LanguageIcon, HealingIcon, PaletteIcon, MenuBookIcon,
    ScienceIcon, EngineeringIcon, SchoolIcon, BusinessIcon,
] as const;

const fadeUp = keyframes`
    from { 
        opacity: 0; 
        transform: translateY(16px); 
    }
    to { 
        opacity: 1; 
        transform: translateY(0); 
    }
`;

const shimmerMove = keyframes`
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
`;

const SectionLabel = styled(Box)({
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    background: "linear-gradient(90deg, #faa11b, #f5b95eff)",
    border: "1px solid #faa11b",
    borderRadius: 99,
    padding: "4px 14px",
    marginBottom: 8,
});

const Badge = styled(Box)({
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    background: "linear-gradient(135deg, #faa11b, #f5b95e)",
    padding: "6px 16px",
    borderRadius: "40px",
    marginBottom: "20px",
    boxShadow: "0 4px 15px rgba(250, 161, 27, 0.2)",
});

const IconBubble = styled(Box)({
    width: 44,
    height: 44,
    borderRadius: "50%",
    background: "linear-gradient(135deg, rgba(247, 170, 107, 0.12) 0%, rgba(245, 217, 127, 0.25) 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "transform 0.25s ease",
});

const ProfessionCard = styled(Box)<{ $delay: number }>(({ $delay }) => ({
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "12px 16px",
    borderRadius: 14,
    background: "rgba(255,255,255,0.85)",
    backdropFilter: "blur(8px)",
    border: "1.5px solid rgba(252, 171, 50, 0.15)",
    boxShadow: "0 2px 10px rgba(252, 171, 50, 0.06)",
    cursor: "pointer",
    transition: "transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease, background 0.22s ease",
    animation: `${fadeUp} 0.42s ease both`,
    animationDelay: `${$delay}ms`,

    "&:hover": {
        transform: "translateY(-3px)",
        boxShadow: "0 8px 24px rgba(250, 219, 178, 0.18)",
        borderColor: "#faa11b",
        background: "#fff",

        "& .card-icon": {
            transform: "scale(1.18) rotate(-6deg)",
        },

        "& .card-name": {
            backgroundSize: "200% auto",
            animation: `${shimmerMove} 1.2s linear infinite`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundImage: "linear-gradient(90deg, #faa11b, #faa11b, #faa11b)",
        },
    },
}));

const CardSkeleton = () => (
    <Skeleton
        variant="rounded"
        height={68}
        sx={{ borderRadius: "14px", bgcolor: "rgba(255,87,34,0.08)" }}
    />
);

const ExpandButton = styled(Button)({
    display: "inline-flex",
    alignItems: "center",
    gap: 0.75,
    border: "1.5px solid #faa11b",
    borderRadius: 99,
    background: "transparent",
    color: "#faa11b",
    fontWeight: 700,
    fontSize: "0.84rem",
    cursor: "pointer",
    transition: "all 0.2s",
    fontFamily: "inherit",

    "&:hover": {
        background: "rgba(243, 247, 186, 0.08)",
        borderColor: "#faa11b",
    },
});

const getRandomIcon = () => {
    const randomIndex = Math.floor(Math.random() * ICON_COMPONENTS.length);
    const RandomIcon = ICON_COMPONENTS[randomIndex];
    return <RandomIcon sx={{ fontSize: ICON_SIZE, color: "#faa11b" }} />;
};

const ProfessionComponent = () => {
    const navigate = useNavigate();
    const [showAll, setShowAll] = useState(false);
    const [professionIcons, setProfessionIcons] = useState<Record<string, React.ReactNode>>({});

    const { data, isLoading, isError } = useGetAllProfessionNoAuthenQuery();
    const professions: Profession[] = data || [];

    const displayed = useMemo(() =>
        showAll ? professions : professions.slice(0, VISIBLE_DEFAULT),
        [professions, showAll]
    );

    const hasMore = professions.length > VISIBLE_DEFAULT;
    const remainingCount = professions.length - VISIBLE_DEFAULT;

    useEffect(() => {
        if (professions.length === 0) return;

        const iconsMap: Record<string, React.ReactNode> = {};
        professions.forEach((profession) => {
            iconsMap[profession.Id] = getRandomIcon();
        });

        setProfessionIcons(iconsMap);
    }, [professions]);

    const handleCardClick = useCallback(() => {
        navigate("/chuong-trinh-tuyen-sinh");
    }, [navigate]);

    const handleToggleShowAll = useCallback(() => {
        setShowAll(prev => !prev);
    }, []);

    const renderSkeletons = () => (
        Array.from({ length: VISIBLE_DEFAULT }).map((_, i) => (
            <CardSkeleton key={i} />
        ))
    );

    const renderProfessionCards = () => (
        displayed.map((profession, index) => (
            <ProfessionCard
                key={profession.Id}
                $delay={index * ANIMATION_DELAY_STEP}
                onClick={handleCardClick}
            >
                <IconBubble className="card-icon">
                    {professionIcons[profession.Id] || (
                        <MenuBookIcon sx={{ fontSize: ICON_SIZE, color: "#faa11b" }} />
                    )}
                </IconBubble>

                <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography
                        className="card-name"
                        sx={{
                            fontWeight: 700,
                            fontSize: { xs: "0.78rem", sm: "0.84rem" },
                            color: "#1a1a1a",
                            lineHeight: 1.3,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                        }}
                    >
                        {profession.Name}
                    </Typography>
                </Box>
            </ProfessionCard>
        ))
    );

    return (
        <Box sx={{
            width: "100%",
            maxWidth: 1200,
            mx: "auto",
            bgcolor: "#fff",
            borderRadius: 2,
            border: "1px solid #eee",
            boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
            p: { xs: 1.5, sm: 2, md: 2.5 },
        }}>
            <Box sx={{ mb: { xs: 2, sm: 2.5 } }}>
                <Badge>
                    <WorkIcon sx={{ fontSize: 20, color: "#ffffff" }} />
                    <Typography
                        sx={{
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            color: "#ffffff",
                            letterSpacing: 1,
                            textTransform: "uppercase"
                        }}
                    >
                        Khám phá ngành nghề
                    </Typography>
                </Badge>

                <Box sx={{
                    display: "flex",
                    alignItems: { xs: "flex-start", sm: "center" },
                    justifyContent: "space-between",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 1,
                }}>
                    <Typography sx={{
                        fontSize: { xs: "1.1rem", sm: "1.3rem", md: "1.45rem" },
                        fontWeight: 800,
                        color: "#1a1a1a",
                        lineHeight: 1.25,
                    }}>
                        Ngành nghề du học Hàn Quốc
                    </Typography>

                    {!isLoading && !isError && professions.length > 0 && (
                        <Chip
                            label={`${professions.length} ngành`}
                            size="small"
                            sx={{
                                bgcolor: "#faa11b",
                                color: "white",
                                fontWeight: 700,
                                border: "1px solid #faa11b",
                                fontSize: "0.78rem",
                                flexShrink: 0,
                            }}
                        />
                    )}
                </Box>

                <Typography sx={{
                    color: "#777",
                    fontSize: { xs: "0.82rem", sm: "0.87rem" },
                    mt: 0.5
                }}>
                    Tìm hiểu chương trình tuyển sinh theo từng ngành nghề
                </Typography>
            </Box>

            {isError && (
                <Alert severity="warning" sx={{ borderRadius: 2 }}>
                    Không thể tải danh sách ngành nghề. Vui lòng thử lại sau.
                </Alert>
            )}

            {!isError && (
                <>
                    <Box sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr 1fr",
                            sm: "1fr 1fr 1fr",
                            md: "repeat(4, 1fr)",
                        },
                        gap: { xs: 1, sm: 1.25, md: 1.5 },
                    }}>
                        {isLoading ? renderSkeletons() : renderProfessionCards()}
                    </Box>

                    {!isLoading && hasMore && (
                        <Box sx={{ textAlign: "center", mt: { xs: 2, sm: 2.5 } }}>
                            <ExpandButton onClick={handleToggleShowAll}>
                                {showAll
                                    ? "Thu gọn ↑"
                                    : `Xem thêm ${remainingCount} ngành nghề ↓`}
                            </ExpandButton>
                        </Box>
                    )}
                </>
            )}
        </Box>
    );
};

export default ProfessionComponent;