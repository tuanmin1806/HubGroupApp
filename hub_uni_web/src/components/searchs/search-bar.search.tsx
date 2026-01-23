import { SearchOutlined } from "@mui/icons-material";
import { Button, FormControl, InputBase, MenuItem, Paper, Select } from "@mui/material";
import React from "react";

export default function SearchBar() {
    const [province, setProvince] = React.useState("");

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
            <InputBase sx={{ flex: 1, ml: 1 }} placeholder="Nhập từ khóa..." />

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
                    <MenuItem value="hcm">TP. Hồ Chí Minh</MenuItem>
                    <MenuItem value="hn">Hà Nội</MenuItem>
                    <MenuItem value="dn">Đà Nẵng</MenuItem>
                </Select>
            </FormControl>

            <Button 
                variant="contained" 
                startIcon={<SearchOutlined />}
                sx={{
                    borderRadius: 10,
                    backgroundColor: '#f3522a',
                }}
                >
                Tìm kiếm
            </Button>
        </Paper>
    );
}
