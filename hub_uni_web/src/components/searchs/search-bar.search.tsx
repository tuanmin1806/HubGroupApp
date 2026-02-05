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

interface SearchBarProps {
    onSearch?: (query: string, provinceId: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
    const [province, setProvince] = React.useState("");
    const [searchValue, setSearchValue] = React.useState("");

    const { data: provinces = [], isLoading } =
        useGetAllProvinceNoAuthenQuery();

    const handleSearch = () => {
        onSearch?.(searchValue.trim(), province);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleSearch();
    };

    return (
        <Paper
            sx={{
                p: 1,
                display: "flex",
                alignItems: "center",
                width: "100%",
                maxWidth: 1200,
                gap: 1,
                borderRadius: 10,
                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            }}
        >
            {/* Input tìm kiếm */}
            <InputBase
                sx={{ flex: 1, ml: 1 }}
                placeholder="Nhập tên tổ chức, ngành nghề, mã số thuế..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleKeyPress}
            />

            {/* Select tỉnh thành */}
            <FormControl size="small" sx={{ minWidth: 220 }}>
                <Select
                    displayEmpty
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    startAdornment={
                        <LocationOn sx={{ mr: 1, color: "text.secondary" }} />
                    }
                    sx={{
                        height: 40,
                        borderRadius: 6,
                        "& .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                        },
                    }}
                    MenuProps={{
                        PaperProps: {
                            sx: {
                                maxHeight: 280, // ⭐ giới hạn chiều cao dropdown
                            },
                        },
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
                            <MenuItem key={p.Id} value={p.Id}>
                                {p.Name}
                            </MenuItem>
                        ))
                    )}
                </Select>
            </FormControl>

            {/* Button search */}
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
                    "&:hover": {
                        backgroundColor: "#d43f1a",
                    },
                }}
            >
                Tìm kiếm
            </Button>
        </Paper>
    );
}