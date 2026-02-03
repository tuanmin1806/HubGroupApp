import { SearchOutlined } from "@mui/icons-material";
import { Button, FormControl, InputBase, MenuItem, Paper, Select } from "@mui/material";
import React from "react";

interface SearchBarProps {
    onSearch?: (query: string, provinceId: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
    const [province, setProvince] = React.useState("");
    const [searchValue, setSearchValue] = React.useState("");

    const handleSearch = () => {
        if (onSearch) {
            onSearch(searchValue.trim(), province);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
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
            }}
        >
            <InputBase 
                sx={{ flex: 1, ml: 1 }} 
                placeholder="Nhập từ khóa..." 
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyPress={handleKeyPress}
            />

            <FormControl size="small" sx={{ minWidth: 180 }}>
                <Select
                    displayEmpty
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    sx={{
                        height: 40,
                        '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
                    }}
                >
                    <MenuItem value=""><em>Chọn tỉnh / thành</em></MenuItem>
                    <MenuItem value="1">Hà Nội</MenuItem>
                    <MenuItem value="2">TP. Hồ Chí Minh</MenuItem>
                    <MenuItem value="3">Đà Nẵng</MenuItem>
                    <MenuItem value="4">Hải Phòng</MenuItem>
                    <MenuItem value="5">Cần Thơ</MenuItem>
                </Select>
            </FormControl>

            <Button 
                variant="contained" 
                startIcon={<SearchOutlined />}
                onClick={handleSearch}
                sx={{
                    borderRadius: 10,
                    backgroundColor: '#f3522a',
                    '&:hover': {
                        backgroundColor: '#d43f1a',
                    }
                }}
            >
                Tìm kiếm
            </Button>
        </Paper>
    );
}