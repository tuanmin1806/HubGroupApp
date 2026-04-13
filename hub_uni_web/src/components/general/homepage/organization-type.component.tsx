import { useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Alert from "@mui/material/Alert";
import { styled, keyframes } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import SchoolIcon from "@mui/icons-material/School";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { useGetAllOrganizationTypesNoAuthenQuery } from "../../../app/features/organization-type.api";

interface OrganizationType {
    Id: string;
    Name: string;
    EnglishName?: string;
    SeoUrl?: string;
}

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const StyledCard = styled(Box)<{ delay: number }>(({ delay }) => ({
    flex: "1 1 auto",
    minWidth: "180px",
    maxWidth: "220px",
    background: "linear-gradient(135deg, #ffffff 0%, #fef9f0 100%)",
    borderRadius: "20px",
    padding: "12px 16px",
    cursor: "pointer",
    transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
    animation: `${fadeUp} 0.5s ease both`,
    animationDelay: `${delay}ms`,
    border: "1px solid rgba(250, 161, 27, 0.15)",
    position: "relative",
    overflow: "hidden",

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
        transform: "translateY(-8px)",
        borderColor: "#faa11b",
        boxShadow: "0 20px 35px -12px rgba(250, 161, 27, 0.25)",
        "&::before": { transform: "scaleX(1)" },
        "& .icon-wrapper": {
            transform: "scale(1.1) rotate(5deg)",
            background: "#faa11b",
        },
        "& .icon": {
            color: "#ffffff !important",
        },
    },
}));

const IconWrapper = styled(Box)({
    width: "48px",
    height: "48px",
    borderRadius: "16px",
    background: "linear-gradient(135deg, #fff5e6, #ffffff)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "14px",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    border: "1px solid rgba(250, 161, 27, 0.2)",
});

const TypeName = styled(Typography)({
    fontSize: "1rem",
    fontWeight: 700,
    color: "#1a1a1a",
    lineHeight: 1.3,
    marginBottom: "6px",
});

const TypeCount = styled(Box)({
    fontSize: "0.7rem",
    fontWeight: 600,
    color: "#faa11b",
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    padding: "2px 8px",
    borderRadius: "12px",
    background: "rgba(250, 161, 27, 0.1)",
});

const SectionHeader = styled(Box)({
    textAlign: "center",
    marginBottom: "32px",
});

const Badge = styled(Box)({
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    background: "linear-gradient(135deg, #faa11b, #f5b95e)",
    padding: "6px 20px",
    borderRadius: "40px",
    marginBottom: "20px",
    boxShadow: "0 4px 15px rgba(250, 161, 27, 0.2)",
});

const ExpandButton = styled(Box)({
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    padding: "8px 16px",
    background: "linear-gradient(135deg, #faa11b, #f5b95e)",
    borderRadius: "20px",
    color: "#ffffff",
    fontWeight: 700,
    fontSize: "0.9rem",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(250, 161, 27, 0.3)",

    "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 8px 25px rgba(250, 161, 27, 0.4)",
    },
});

const GridContainer = styled(Box)({
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "20px",
    marginBottom: "40px",

    "@media (max-width: 768px)": { gap: "14px" },
    "@media (max-width: 600px)": { gap: "12px" },
});

const CardSkeleton = () => (
    <Box sx={{ minWidth: "180px", maxWidth: "220px", flex: "1 1 auto" }}>
        <Skeleton
            variant="rounded"
            height={110}
            sx={{ borderRadius: "20px", bgcolor: "rgba(250, 161, 27, 0.06)" }}
        />
    </Box>
);

const TypeCard = ({ type, delay, onClick }: {
    type: OrganizationType;
    delay: number;
    onClick: () => void;
}) => (
    <StyledCard delay={delay} onClick={onClick}>
        <IconWrapper className="icon-wrapper">
            <SchoolIcon
                className="icon"
                sx={{ fontSize: 28, color: "#faa11b", transition: "color 0.3s ease" }}
            />
        </IconWrapper>

        <TypeName>{type.Name}</TypeName>

        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "end",
                mt: "auto",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "#faa11b",
                    transition: "all 0.25s ease",
                }}
                className="cta"
            >
                Chi tiết
                <ArrowForwardIcon sx={{ fontSize: 18 }} />
            </Box>
        </Box>
    </StyledCard>
);

const OrganizationTypeComponent = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const [showAll, setShowAll] = useState(false);

    const { data, isLoading, isError } = useGetAllOrganizationTypesNoAuthenQuery();

    const types: OrganizationType[] = data || [];

    const visibleCount = isMobile ? 6 : 8;
    const displayedTypes = useMemo(() =>
        showAll ? types : types.slice(0, visibleCount),
        [types, showAll, visibleCount]
    );
    const hasMore = types.length > visibleCount;

    const handleCardClick = (typeId: string) => {
        navigate("/tim-kiem-truong", {
            state: { organizationTypeId: typeId }
        });
    };

    const handleToggleShowAll = () => {
        setShowAll((prev) => !prev);
    };

    return (
        <Box sx={{
            width: "100%",
            maxWidth: 1200,
            mx: "auto",
            px: { xs: 1, sm: 1, md: 1 },
            py: { xs: 1, sm: 1, md: 1 }
        }}>
            <SectionHeader>
                <Badge>
                    <TrendingUpIcon sx={{ fontSize: 20, color: "#ffffff" }} />
                    <Typography
                        sx={{
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            color: "#ffffff",
                            letterSpacing: 1,
                            textTransform: "uppercase"
                        }}
                    >
                        Khám phá ngay
                    </Typography>
                </Badge>

                <Typography
                    sx={{
                        fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.5rem" },
                        fontWeight: 800,
                        color: "#1a1a1a",
                        lineHeight: 1.2,
                        mb: 1.5,
                        background: "linear-gradient(135deg, #1a1a1a, #faa11b)",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    Loại hình trường
                </Typography>

                <Typography
                    sx={{
                        fontSize: { xs: "0.9rem", sm: "1rem" },
                        color: "#666",
                        maxWidth: 600,
                        mx: "auto",
                    }}
                >
                    Chọn loại hình trường phù hợp để khám phá chương trình tuyển sinh hấp dẫn nhất
                </Typography>
            </SectionHeader>

            {isError && (
                <Alert severity="warning" sx={{ borderRadius: 3, maxWidth: 500, mx: "auto", mb: 3 }}>
                    Không thể tải danh sách loại hình trường. Vui lòng thử lại sau.
                </Alert>
            )}

            {!isError && (
                <>
                    <GridContainer>
                        {isLoading ? Array.from({ length: visibleCount }).map((_, i) => (<CardSkeleton key={i} />)) : displayedTypes.map((type, i) => (
                            <TypeCard
                                key={type.Id}
                                type={type}
                                delay={i * 50}
                                onClick={() => handleCardClick(type.Id)}
                            />
                        ))}
                    </GridContainer>

                    {!isLoading && hasMore && (
                        <Box sx={{ textAlign: "center" }}>
                            <ExpandButton onClick={handleToggleShowAll}>
                                {showAll ? (
                                    <>
                                        Thu gọn
                                        <KeyboardArrowUpIcon />
                                    </>
                                ) : (
                                    <>
                                        Xem thêm {types.length - visibleCount} loại hình
                                        <KeyboardArrowDownIcon />
                                    </>
                                )}
                            </ExpandButton>
                        </Box>
                    )}
                </>
            )}

            {!isLoading && !isError && types.length === 0 && (
                <Alert severity="info" sx={{ borderRadius: 3, maxWidth: 500, mx: "auto" }}>
                    Chưa có dữ liệu loại hình trường
                </Alert>
            )}
        </Box>
    );
};

export default OrganizationTypeComponent;