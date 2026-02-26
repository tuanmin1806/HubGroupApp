import PropTypes from "prop-types";
import React, { useState } from "react";
import { emailValidator, phoneValidator, requiredValidator, validate } from "../../../app/services/validation.service";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormHelperText, FormLabel, Grid, IconButton, MenuItem, Radio, RadioGroup, Select, TextField } from "@mui/material";
import LoadingOverlay from "../../general/loading-overlay";
import { Save, Visibility } from "@mui/icons-material";
import ConfirmDialog from "../general/confirm.dialog";
import RichTextEditorComponent from "../../editor";

CreateUserDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
};

const daysSelect = Array.from({ length: 31 }, (_, i) =>
    String(i + 1).padStart(2, "0")
);

const monthsSelect = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0")
);

const yearsSelect = Array.from({ length: 2024 - 1905 }, (_, i) =>
    String(2024 - i)
);

const rolesSelect = [
    "MANAGER",
    "STAFF",
    "SUPERVISOR",
];

const initialState = {
    firstName: "",
    lastName: "",
    day: "",
    month: "",
    year: "",
    phoneNumber: "",
    email: "",
    gender: "",
    role: "",
    restaurant: ""
};

export default function CreateUserDialog({ open, setOpen }) {
    const [validators, setValidators] = useState({
        firstName: [requiredValidator],
        lastName: [requiredValidator],
        phoneNumber: [requiredValidator, phoneValidator],
        email: [requiredValidator, emailValidator],
        day: [requiredValidator],
        month: [requiredValidator],
        year: [requiredValidator],
        gender: [requiredValidator],
        role: [requiredValidator],
        restaurant: []
    });

    const [errors, setErrors] = useState(initialState);
    const [form, setForm] = useState(initialState);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [openViewRestaurantDetailDialog, setOpenViewRestaurantDetailDialog] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const handleConfirmCreateUserDialog = async () => {
        const padToTwoDigits = (num) => String(num).padStart(2, "0");
        const birthDate = `${padToTwoDigits(form.day)}-${padToTwoDigits(form.month)}-${form.year}`;
        const payload = {
            firstName: form.firstName,
            lastName: form.lastName,
            birthDate,
            phoneNumber: form.phoneNumber,
            email: form.email,
            gender: form.gender,
            role: form.role,
            restaurantId: form.restaurant
        };
        setOpenConfirmDialog(false);
    };

    const showRestaurantSelect = () => {
        if (form.role !== 'STAFF' && form.role !== 'SUPERVISOR') {
            return false;
        }
        return true;
    }

    const handleOnSubmit = (event) => {
        event.preventDefault();
        const isValid = handleValidate();
        if (!isValid) {
            return;
        }
        setOpenConfirmDialog(true);
    };

    const handleChange = (field) => (e) => {
        const { value } = e.target;
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({
            ...prev,
            [field]: validate(value, validators[field] || [], form),
        }));
    };

    const handleValidate = () => {
        const newErrors = {};
        Object.keys(validators).forEach((field) => {
            newErrors[field] = validate(form[field], validators[field], form);
        });
        return !Object.values(newErrors).some((error) => error);
    };

    const isFormValid = () => {
        const requiredFieldsValid = Object.keys(validators)
            .filter((field) => validators[field].includes(requiredValidator))
            .every((field) => String(form[field]).trim() !== "");

        const noValidationErrors = !Object.values(
            Object.fromEntries(
                Object.keys(validators).map((field) => [
                    field,
                    validate(form[field], validators[field], form),
                ])
            )
        ).some(Boolean);

        return requiredFieldsValid && noValidationErrors;
    };

    const handleClose = () => {
        setForm(initialState);
        setErrors(initialState);
        setOpen(false);
    };

    return (
        <React.Fragment>
            <ConfirmDialog
                open={openConfirmDialog}
                onConfirm={handleConfirmCreateUserDialog}
                onClose={() => setOpenConfirmDialog(false)}
                title={"Xác nhận tạo mới tài khoản"}
                message={"Hãy kiểm tra kỹ thông tin cá nhân trước khi tạo mới"}
            />
            <Dialog open={open} onClose={handleClose}>
                <LoadingOverlay open={isLoading}></LoadingOverlay>
                <DialogTitle
                    sx={{ bgcolor: "primary.main", color: "white", mb: 2 }}
                >
                    Tạo mới tài khoản
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ flexGrow: 1 }}>
                        <Grid container spacing={1}>
                            <Grid size={7} sx={{ mt: 1 }}>
                                <TextField
                                    size="small"
                                    fullWidth
                                    label="Họ"
                                    placeholder="ví dụ: Nguyễn Văn"
                                    value={form.lastName}
                                    onChange={handleChange("lastName")}
                                    required={true}
                                    error={!!errors?.lastName}
                                    helperText={errors?.lastName}
                                />
                            </Grid>
                            <Grid size={5} sx={{ mt: 1 }}>
                                <TextField
                                    size="small"
                                    fullWidth
                                    id="outlined-textarea"
                                    label="Tên"
                                    placeholder="ví dụ: Tiến"
                                    value={form.firstName}
                                    onChange={handleChange("firstName")}
                                    required={true}
                                    error={!!errors?.firstName}
                                    helperText={errors?.firstName}
                                />
                            </Grid>
                            <Grid size={12} sx={{ mt: 1 }}>
                                <FormControl>
                                    <FormLabel>Ngày sinh</FormLabel>
                                </FormControl>
                            </Grid>
                            <Grid size={4}>
                                <FormControl fullWidth size="small">
                                    <Select
                                        value={form.day}
                                        onChange={handleChange("day")}
                                        displayEmpty
                                        inputProps={{
                                            "aria-label": "Without label",
                                        }}
                                        error={!!errors?.day}
                                    >
                                        <MenuItem value="">
                                            <em>Ngày</em>
                                        </MenuItem>
                                        {daysSelect.map((item) => (
                                            <MenuItem key={item} value={item}>
                                                {item}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors?.day && (
                                        <FormHelperText error>
                                            {errors?.day}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid size={12} sx={{ mt: 1 }}>
                                <FormControl>
                                    <FormLabel>Chi tiết</FormLabel>
                                </FormControl>
                            </Grid>
                            <Grid size={4}>
                                <FormControl fullWidth size="small">
                                    <Select
                                        value={form.month}
                                        onChange={handleChange("month")}
                                        displayEmpty
                                        inputProps={{
                                            "aria-label": "Without label",
                                        }}
                                        error={!!errors?.month}
                                    >
                                        <MenuItem value="">
                                            <em>Tháng</em>
                                        </MenuItem>
                                        {monthsSelect.map((item) => (
                                            <MenuItem key={item} value={item}>
                                                {item}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors?.month && (
                                        <FormHelperText error>
                                            {errors?.month}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid size={4}>
                                <FormControl fullWidth size="small">
                                    <Select
                                        value={form.year}
                                        onChange={handleChange("year")}
                                        displayEmpty
                                        inputProps={{
                                            "aria-label": "Without label",
                                        }}
                                        error={!!errors?.year}
                                    >
                                        <MenuItem value="">
                                            <em>Năm</em>
                                        </MenuItem>
                                        {yearsSelect.map((item) => (
                                            <MenuItem key={item} value={item}>
                                                {item}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors?.year && (
                                        <FormHelperText error>
                                            {errors?.year}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid size={5} sx={{ mt: 1 }}>
                                <TextField
                                    size="small"
                                    fullWidth
                                    label="Số điện thoại liên hệ"
                                    placeholder="ví dụ: 123456789"
                                    type="tel"
                                    value={form.phoneNumber}
                                    onChange={handleChange("phoneNumber")}
                                    required={true}
                                    error={!!errors?.phoneNumber}
                                    helperText={errors?.phoneNumber}
                                />
                            </Grid>
                            <Grid size={7} sx={{ mt: 1 }}>
                                <TextField
                                    size="small"
                                    fullWidth
                                    label="Địa chỉ email"
                                    placeholder="ví dụ: nguyenvananh@gmail.com"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange("email")}
                                    required={true}
                                    error={!!errors?.email}
                                    helperText={errors?.email}
                                />
                            </Grid>
                            <Grid size={6}>
                                <FormControl
                                    fullWidth
                                    size="small"
                                    sx={{ pt: 1 }}
                                >
                                    <Select
                                        value={form.role}
                                        onChange={handleChange("role")}
                                        displayEmpty
                                        inputProps={{
                                            "aria-label": "Without label",
                                        }}
                                        error={!!errors?.role}
                                    >
                                        <MenuItem value="">
                                            <em>Lựa chọn phân quyền</em>
                                        </MenuItem>
                                        {rolesSelect.map((item) => (
                                            <MenuItem key={item} value={item}>
                                                {item}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors?.role && (
                                        <FormHelperText error>
                                            {errors?.role}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            {
                                showRestaurantSelect() &&
                                <>
                                    <Grid size={5}>
                                        <FormControl
                                            fullWidth
                                            size="small"
                                            sx={{ pt: 1 }}
                                        >
                                            <Select
                                                value={form.restaurant}
                                                onChange={handleChange("restaurant")}
                                                displayEmpty
                                                inputProps={{
                                                    "aria-label": "Without label",
                                                }}
                                                error={!!errors?.restaurant}
                                            >
                                                <MenuItem value="">
                                                    <em>Lựa chọn </em>
                                                </MenuItem>

                                            </Select>
                                            {errors?.restaurant && (
                                                <FormHelperText error>
                                                    {errors?.restaurant}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>
                                    <Grid size={1} sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                    }}
                                    >
                                        <IconButton
                                            color="primary"
                                            disabled={form.restaurant === ""}
                                            onClick={() => setOpenViewRestaurantDetailDialog(true)}
                                        >
                                            <Visibility />
                                        </IconButton>
                                    </Grid>
                                </>
                            }
                            <Grid size={12} mt={1}>
                                <FormLabel>Giới tính</FormLabel>
                            </Grid>
                            <Grid size={7}>
                                <FormControl>
                                    <RadioGroup
                                        row
                                        value={form.gender}
                                        onChange={handleChange("gender")}
                                    >
                                        <FormControlLabel
                                            value="FEMALE"
                                            control={<Radio />}
                                            label="Nữ giới"
                                        />
                                        <FormControlLabel
                                            value="MALE"
                                            control={<Radio />}
                                            label="Nam giới"
                                        />
                                        <FormControlLabel
                                            value="OTHER"
                                            control={<Radio />}
                                            label="Khác"
                                        />
                                    </RadioGroup>
                                    {errors?.gender && (
                                        <FormHelperText error>
                                            {errors?.gender}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Hủy bỏ</Button>
                    <Button
                        variant="contained"
                        endIcon={<Save />}
                        onClick={handleOnSubmit}
                        disabled={!isFormValid()}
                    >
                        Lưu lại
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}