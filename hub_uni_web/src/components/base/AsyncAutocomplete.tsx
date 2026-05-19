import React, { useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import { DEFAULT_PAGE_SIZE } from "../../constants/common.constant";

export interface SelectOption {
    value: string;
    label: string;
}

interface AsyncAutocompleteProps {
    label: string;
    loadOptions: (params: {
        searchValue: string;
        page: number;
        size: number;
    }) => Promise<SelectOption[]>;
    value: SelectOption | null;
    onChange: (option: SelectOption | null) => void;
    isDisabled?: boolean;
}

const AsyncAutocomplete: React.FC<AsyncAutocompleteProps> = ({ label, loadOptions, value, onChange, isDisabled = false }) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleLoadOptions = async (
        inputValue: string,
        _loadedOptions: unknown,
        additional: { page: number } | undefined
    ) => {
        const page = additional?.page ?? 1;
        const items = await loadOptions({ searchValue: inputValue, page, size: DEFAULT_PAGE_SIZE });

        return {
            options: items,
            hasMore: items.length === DEFAULT_PAGE_SIZE,
            additional: { page: page + 1 },
        };
    };

    return (
        <div style={{ position: "relative" }}>

            <AsyncPaginate
                value={value}
                loadOptions={handleLoadOptions}
                onChange={(opt) => onChange(opt as SelectOption | null)}
                isDisabled={isDisabled}
                isClearable
                debounceTimeout={1000}
                additional={{ page: 1 }}
                loadingMessage={() => "Đang tải..."}
                noOptionsMessage={({ inputValue }) => inputValue ? "Không tìm thấy kết quả" : "Nhập để tìm kiếm"}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                styles={{
                    menu: (base) => ({
                        ...base,
                        zIndex: 9999,
                    }),

                }}
            />
        </div>
    );
};

export default AsyncAutocomplete;