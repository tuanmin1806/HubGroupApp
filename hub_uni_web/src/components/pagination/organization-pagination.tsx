import { Box, IconButton, Typography } from "@mui/material";
import ArrowBackIosNew from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIos from "@mui/icons-material/ArrowForwardIos";

interface OrganizationPaginationProps {
    page: number;
    totalPages: number;
    onPrev: () => void;
    onNext: () => void;
}

const OrganizationPagination = ({
    page,
    totalPages,
    onPrev,
    onNext,
}: OrganizationPaginationProps) => {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                mt: 1,
            }}
        >
            <IconButton
                onClick={onPrev}
                disabled={page <= 1}
            >
                <ArrowBackIosNew fontSize="small" sx={{ color: "#ff5722" }} />
            </IconButton>

            <Typography sx={{ color: "#ff5722" }}>
                <strong>{page}</strong> / {totalPages}
            </Typography>

            <IconButton
                onClick={onNext}
                disabled={page >= totalPages}
            >
                <ArrowForwardIos fontSize="small" sx={{ color: "#ff5722" }} />
            </IconButton>
        </Box>
    );
};

export default OrganizationPagination