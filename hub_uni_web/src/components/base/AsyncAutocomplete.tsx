import React, { useState, useEffect, useCallback, useRef } from "react";
import { Autocomplete, TextField, CircularProgress, } from "@mui/material";
import { DEFAULT_PAGE_SIZE } from "../../constants/common.constant";

interface AsyncAutocompleteProps {
    label: string;
    loadOptions: (params: { search: string; page: number; size: number }) => Promise<any[]>;
    value: any | null;
    onChange: (option: any | null) => void;
    placeholder?: string;
    size?: "small" | "medium";
}

const AsyncAutocomplete: React.FC<AsyncAutocompleteProps> = ({
    label,
    loadOptions,
    value,
    onChange,
    placeholder = "Tìm kiếm...",
    size = "small",
}) => {
    const [options, setOptions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [inputValue, setInputValue] = useState("");
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");

    const observerRef = useRef<IntersectionObserver | null>(null);
    const timeoutRef = useRef<number | null>(null);

    const loadData = useCallback(async (search: string, currentPage: number, isLoadMore = false) => {
        if (isLoadMore) {
            setLoadingMore(true);
        } else {
            setLoading(true);
            setOptions([]);
        }

        try {
            const result = await loadOptions({
                search: search.trim(),
                page: currentPage,
                size: DEFAULT_PAGE_SIZE,
            });

            if (isLoadMore) {
                setOptions((prev) => [...prev, ...result]);
            } else {
                setOptions(result);
                setPage(1);
            }

            setHasMore(result.length === DEFAULT_PAGE_SIZE);
        } catch (error) {
            setHasMore(false);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [loadOptions]);

    useEffect(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = window.setTimeout(() => {
            setSearchTerm(inputValue);
            loadData(inputValue, 1, false);
        }, 1500);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [inputValue, loadData]);

    const lastOptionRef = useCallback(
        (node: HTMLLIElement | null) => {
            if (loadingMore || !hasMore) return;

            if (observerRef.current) observerRef.current.disconnect();

            observerRef.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    const nextPage = page + 1;
                    setPage(nextPage);
                    loadData(searchTerm, nextPage, true);
                }
            });

            if (node) observerRef.current.observe(node);
        },
        [loadingMore, hasMore, page, searchTerm, loadData]
    );

    useEffect(() => {
        return () => {
            if (observerRef.current) observerRef.current.disconnect();
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    return (
        <Autocomplete
            size={size}
            options={options}
            loading={loading}
            value={value}
            onChange={(_, newValue) => onChange(newValue)}
            inputValue={inputValue}
            onInputChange={(_, newValue) => setInputValue(newValue)}
            getOptionLabel={(option) => option?.label || ""}
            isOptionEqualToValue={(option, val) => option?.value === val?.value}
            filterOptions={(x) => x}
            loadingText="Đang tải..."
            noOptionsText="Không tìm thấy kết quả"
            renderOption={(props, option, { index }) => {
                const isLast = index === options.length - 1;
                return (
                    <li
                        ref={isLast ? lastOptionRef : undefined}
                        {...props}
                        key={option.value}
                    >
                        {option.label}
                    </li>
                );
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    placeholder={placeholder}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {(loading || loadingMore) && <CircularProgress color="inherit" size={18} sx={{ mr: 1 }} />}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
        />
    );
};

export default AsyncAutocomplete;