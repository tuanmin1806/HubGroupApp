import LocationOn from "@mui/icons-material/LocationOn";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputBase from "@mui/material/InputBase";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";

import React from "react";
import { useGetAllProvinceNoAuthenQuery } from "../../app/features/province.api";
import { TEXT_COLOR } from "../../constants/common.constant";

interface SearchBarProps {
    onSearch?: (query: string, provinceSeo: string) => void;
    initialQuery?: string;
    initialProvinceSeo?: string;
}

export default function SearchBar({ onSearch, initialQuery = "", initialProvinceSeo = "" }: SearchBarProps) {
    const [provinceSeo, setProvinceSeo] = React.useState(initialProvinceSeo);
    const [searchValue, setSearchValue] = React.useState(initialQuery);

    const { data: provinces = [], isLoading } = useGetAllProvinceNoAuthenQuery();

    React.useEffect(() => { setSearchValue(initialQuery); }, [initialQuery]);
    React.useEffect(() => { setProvinceSeo(initialProvinceSeo); }, [initialProvinceSeo]);

    const handleSearch = () => onSearch?.(searchValue.trim(), provinceSeo);
    const handleKeyPress = (e: React.KeyboardEvent) => { if (e.key === "Enter") handleSearch(); };

    return (
        <Paper
            sx={{
                p: { xs: 0.6, md: 0.8 },
                display: "flex",
                alignItems: "center",
                width: "100%",
                maxWidth: 1200,
                gap: { xs: 0.5, md: 1 },
                borderRadius: 8,
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                color: TEXT_COLOR,
            }}
        >
            {/* Search input */}
            <InputBase
                sx={{ flex: 1, ml: 1, fontSize: { xs: "0.85rem", md: "1rem" }, minWidth: 0 }}
                placeholder="Nhập từ khóa tìm kiếm..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleKeyPress}
            />

            <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", sm: "block" }, mx: 0.5 }} />

            <FormControl size="small" sx={{ display: { xs: "none", sm: "flex" }, minWidth: { sm: 160, md: 220 }, flexShrink: 0 }}>
                <Select
                    displayEmpty
                    value={provinceSeo}
                    onChange={(e) => setProvinceSeo(e.target.value)}
                    startAdornment={<LocationOn sx={{ mr: 0.5, fontSize: 18, color: "text.secondary" }} />}
                    sx={{
                        height: 36,
                        borderRadius: 6,
                        fontSize: { sm: "0.8rem", md: "0.875rem" },
                        "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                    }}
                    MenuProps={{ PaperProps: { sx: { maxHeight: 280 } } }}
                >
                    <MenuItem value="" sx={{ fontSize: "0.875rem" }}>
                        <em>Tất cả tỉnh / thành</em>
                    </MenuItem>
                    {isLoading ? (
                        <MenuItem disabled>
                            <CircularProgress size={16} sx={{ mr: 1 }} />
                            Đang tải...
                        </MenuItem>
                    ) : (
                        provinces.map((p) => (
                            <MenuItem key={p.Id} value={p.SeoUrl} sx={{ fontSize: "0.875rem" }}>
                                {p.Name}
                            </MenuItem>
                        ))
                    )}
                </Select>
            </FormControl>

            <Button
                variant="contained"
                onClick={handleSearch}
                startIcon={<SearchOutlined sx={{ display: { xs: "none", sm: "block" } }} />}
                sx={{
                    borderRadius: 10,
                    minWidth: { xs: 40, sm: "auto" },
                    width: { xs: 40, sm: "auto" },
                    height: { xs: 40, sm: "auto" },
                    px: { xs: 0, sm: 2.5, md: 3 },
                    flexShrink: 0,
                    backgroundColor: "#f3522a",
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: { sm: "0.85rem", md: "1rem" },
                    "&:hover": { backgroundColor: "#d43f1a" },
                }}
            >
                <SearchOutlined sx={{ display: { xs: "block", sm: "none" }, fontSize: 20 }} />
                <span style={{ display: "inherit" }} className="hide-xs">
                </span>
                <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                    Tìm kiếm
                </Box>
            </Button>
        </Paper>
    );
}