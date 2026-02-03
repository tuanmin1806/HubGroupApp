import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";

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
                mt: 3,
            }}
        >
            <IconButton
                onClick={onPrev}
                disabled={page <= 1}
            >
                <ArrowBackIosNew fontSize="small" />
            </IconButton>

            <Typography>
                <strong>{page}</strong> / {totalPages}
            </Typography>

            <IconButton
                onClick={onNext}
                disabled={page >= totalPages}
            >
                <ArrowForwardIos fontSize="small" />
            </IconButton>
        </Box>
    );
};

export default OrganizationPagination