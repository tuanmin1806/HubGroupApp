import { FilterList } from "@mui/icons-material";
import { Button, FormControl, Grid, InputLabel, Menu, MenuItem, Select } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface FilterValues {
    gender?: string;
    status?: string;
}

interface AccountFilterProps {
    onApply: (filters: FilterValues) => void;
}

const AccountFilter = ({ onApply }: AccountFilterProps) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    const [filters, setFilters] = useState({});

    const isMenuOpen = useMemo(() => Boolean(anchorEl), [anchorEl]);

    const handleClick = useCallback((event) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const handleClose = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const handleFilterChange = useCallback(
        (field) => (event) => {
            const value = event.target.value;
            setFilters((prev) => {
                const newFilters = { ...prev, [field]: value || undefined };
                return newFilters;
            });
        },
        []
    );

    const handleApplyFilter = useCallback(() => {
        onApply(filters);
        handleClose();
    }, [filters, onApply, handleClose]);

    const handleClearFilter = useCallback(() => {
        setFilters((prev) => ({
            ...prev,
            gender: undefined,
            status: undefined,
        }));

        const searchParams = new URLSearchParams(location.search);
        searchParams.delete('gender');
        searchParams.delete('status');

        navigate({ search: searchParams.toString() });
        handleClose();
    }, [navigate, handleClose, location.search]);

    const renderSelect = (label, field, options) => (
        <Grid size={field === "orderBy" || field === "orderDirection" ? 6 : 12}>
            <FormControl fullWidth size="small">
                <InputLabel>{label}</InputLabel>
                <Select
                    value={filters[field] || ""}
                    label={label}
                    onChange={handleFilterChange(field)}
                >
                    <MenuItem value="">
                        <em>Bất kỳ</em>
                    </MenuItem>
                    {options.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.key}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Grid>
    );

    return (
        <div>
            <Button
                variant="text"
                startIcon={<FilterList />}
                onClick={handleClick}
                sx={{ textTransform: "none" }}
            >
                Bộ lọc
            </Button>

            <Menu
                anchorEl={anchorEl}
                open={isMenuOpen}
                onClose={handleClose}
            >
                <Grid container spacing={2} sx={{ p: 2 }}>
                    {renderSelect("Giới tính", "gender", [
                        { key: "Nam", value: "male" },
                        { key: "Nữ", value: "female" },
                        { key: "Khác", value: "other" },
                    ])}
                    {renderSelect("Trạng thái", "status", [
                        { key: "Kích hoạt", value: "active" },
                        { key: "Khóa", value: "locked" },
                    ])}
                    <Grid size={6}>
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={handleClearFilter}
                        >
                            Đặt lại
                        </Button>
                    </Grid>
                    <Grid size={6}>
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={handleApplyFilter}
                        >
                            Áp dụng lọc
                        </Button>
                    </Grid>
                </Grid>
            </Menu>
        </div>
    );
};

export default AccountFilter;