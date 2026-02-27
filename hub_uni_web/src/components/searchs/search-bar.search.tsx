import { SearchOutlined, LocationOn } from "@mui/icons-material";
import {
    Button,
    FormControl,
    InputBase,
    MenuItem,
    Paper,
    Select,
    CircularProgress,
} from "@mui/material";
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

    React.useEffect(() => {
        setSearchValue(initialQuery);
    }, [initialQuery]);

    React.useEffect(() => {
        setProvinceSeo(initialProvinceSeo);
    }, [initialProvinceSeo]);

    const handleSearch = () => {
        onSearch?.(searchValue.trim(), provinceSeo);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleSearch();
    };

    return (
        <Paper
            sx={{
                p: 0.8,
                display: "flex",
                alignItems: "center",
                width: "100%",
                maxWidth: 1200,
                gap: 1,
                borderRadius: 8,
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                color: TEXT_COLOR,
            }}
        >
            <InputBase
                sx={{ flex: 1, ml: 1 }}
                placeholder="Nhập tên tổ chức, ngành nghề, mã số thuế..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleKeyPress}
            />

            <FormControl size="small" sx={{ minWidth: 220 }}>
                <Select
                    displayEmpty
                    value={provinceSeo}
                    onChange={(e) => setProvinceSeo(e.target.value)}
                    startAdornment={<LocationOn sx={{ mr: 1, color: "text.secondary" }} />}
                    sx={{
                        height: 10,
                        borderRadius: 6,
                        "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                    }}
                    MenuProps={{
                        PaperProps: { sx: { maxHeight: 280 } },
                    }}
                >
                    <MenuItem value="">
                        <em>Tất cả tỉnh / thành</em>
                    </MenuItem>
                    {isLoading ? (
                        <MenuItem disabled>
                            <CircularProgress size={18} sx={{ mr: 1 }} />
                            Đang tải...
                        </MenuItem>
                    ) : (
                        provinces.map((p) => (
                            <MenuItem key={p.Id} value={p.Seo}>
                                {p.Name}
                            </MenuItem>
                        ))
                    )}
                </Select>
            </FormControl>

            <Button
                variant="contained"
                startIcon={<SearchOutlined />}
                onClick={handleSearch}
                sx={{
                    borderRadius: 10,
                    px: 3,
                    backgroundColor: "#f3522a",
                    textTransform: "none",
                    fontWeight: 600,
                    "&:hover": { backgroundColor: "#d43f1a" },
                }}
            >
                Tìm kiếm
            </Button>
        </Paper>
    );
}