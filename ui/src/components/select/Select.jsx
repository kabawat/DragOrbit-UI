"use client";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "../../utils/cn";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const Select = ({
  options = [],
  value,
  onChange,
  placeholder = "Select an option",
  label,
  error = false,
  errorMessage,
  helperText,
  disabled = false,
  required = false,
  searchable = false,
  multiple = false,
  clearable = false,
  className = "",
  size = "sm",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const selectRef = useRef(null);
  const searchRef = useRef(null);

  // Filter options based on search term
  const filteredOptions = searchable
    ? options.filter(
        (option) =>
          option.isAddOption ||
          option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  // Separate regular options from add options
  const regularOptions = filteredOptions.filter(
    (option) => !option.isAddOption
  );
  const addOptions = filteredOptions.filter((option) => option.isAddOption);

  // Get selected option(s)
  const selectedOption = multiple
    ? options.filter((option) => value?.includes(option.value))
    : options.find((option) => option.value === value);

  // Handle option selection
  const handleSelect = (option) => {
    if (multiple) {
      const newValue = value || [];
      const isSelected = newValue.includes(option.value);
      const updatedValue = isSelected
        ? newValue.filter((v) => v !== option.value)
        : [...newValue, option.value];
      onChange?.(updatedValue);
    } else {
      onChange?.(option.value);
      setIsOpen(false);
      setSearchTerm("");
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (searchable && isOpen) {
      searchRef.current?.focus();
    }

    if (!isOpen) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (
          highlightedIndex >= 0 &&
          highlightedIndex < filteredOptions.length
        ) {
          handleSelect(filteredOptions[highlightedIndex]);
        }
        break;
      case "Escape":
        if (isOpen) { e.preventDefault(); e.stopPropagation(); }
        setIsOpen(false);
        setSearchTerm("");
        setHighlightedIndex(-1);
        break;
    }
  };

  // Handle clear
  const handleClear = (e) => {
    e.stopPropagation();
    onChange?.(multiple ? [] : "");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isClickInsideSelect = selectRef.current?.contains(event.target);
      const isClickInsideDropdown = event.target.closest(
        ".select-dropdown-portal"
      );

      if (!isClickInsideSelect && !isClickInsideDropdown) {
        setIsOpen(false);
        setSearchTerm("");
        setHighlightedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen]);

  // Reset highlighted index when options or search term changes
  useEffect(() => {
    setHighlightedIndex(-1);
  }, []);

  // Calculate dropdown position for portal
  const getDropdownPosition = () => {
    if (!isOpen || !selectRef.current) return null;

    const rect = selectRef.current.getBoundingClientRect();
    return {
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width,
    };
  };

  const dropdownPosition = getDropdownPosition();

  return (
    <div className={cn("relative select-container", className)}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-2">
          <span className="flex items-center gap-2">
            <span>{label}</span>
            {required && (
              <span className="text-[rgb(var(--color-danger))]">*</span>
            )}
          </span>
        </label>
      )}

      {/* Select Container */}
      <div
        ref={selectRef}
        className={cn(
          "relative cursor-pointer border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent",
          error
            ? "border-[rgb(var(--color-danger))] bg-[rgba(var(--color-danger)/0.05)] focus:ring-[rgb(var(--color-danger))]"
            : "border-[rgb(var(--color-border-primary))]",
          isOpen && !error ? "border-[rgb(var(--color-primary))]" : "",
          disabled
            ? "bg-[rgb(var(--color-bg-tertiary))] cursor-not-allowed"
            : "bg-[rgb(var(--color-bg-primary))] hover:bg-[rgb(var(--color-bg-secondary))]"
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {/* Selected Value Display with responsive sizing */}
        <div
          className={`flex items-center px-4 ${size === "sm" ? "py-1.5 h-10" : size === "lg" ? "py-3 h-14" : "py-2.5 h-12"}`}
        >
          <div className="flex-1 min-w-0 overflow-hidden pr-3">
            {multiple ? (
              <div className="flex flex-wrap gap-1 overflow-hidden">
                {selectedOption?.length > 0 ? (
                  selectedOption.map((option) => (
                    <span
                      key={option.value}
                      className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-[rgba(var(--color-primary)/0.08)] text-[rgb(var(--color-primary))]"
                    >
                      {option.label}
                    </span>
                  ))
                ) : (
                  <span className="text-[rgb(var(--color-text-tertiary))] truncate">
                    {placeholder}
                  </span>
                )}
              </div>
            ) : (
              <span
                className={`${selectedOption ? "text-[rgb(var(--color-text-primary))]" : "text-[rgb(var(--color-text-tertiary))]"} ${size === "sm" ? "text-xs" : size === "lg" ? "text-base" : "text-sm"} truncate`}
              >
                {selectedOption?.label || placeholder}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            {/* Clear Button */}
            {clearable && (multiple ? value?.length > 0 : value) && (
              <button
                type="button"
                onClick={handleClear}
                className="text-[rgb(var(--color-text-tertiary))] hover:text-[rgb(var(--color-text-primary))] transition-colors duration-200"
                tabIndex={-1}
              >
                ×
              </button>
            )}

            {/* Dropdown Arrow */}
            <ChevronDown
              className={`${size === "sm" ? "w-4 h-4" : size === "lg" ? "w-6 h-6" : "w-5 h-5"} text-[rgb(var(--color-text-tertiary))] transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>

        {/* Dropdown Options - Portal */}
        {isOpen &&
          dropdownPosition &&
          createPortal(
            <div
              style={{
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                width: dropdownPosition.width,
              }}
              data-dragorbit-dialog-owner={selectRef.current?.closest("[role=dialog]")?.id}
              className="select-dropdown-portal fixed z-[999999] bg-[rgb(var(--color-bg-primary))] border border-[rgb(var(--color-border-primary))] rounded-xl shadow-lg overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search Input */}
              {searchable && (
                <div
                  className="p-2 border-b border-[rgb(var(--color-border-primary))]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="relative">
                    <Search
                      className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${size === "sm" ? "w-4 h-4" : size === "lg" ? "w-6 h-6" : "w-4 h-4"} text-[rgb(var(--color-text-tertiary))]`}
                    />
                    <input
                      ref={searchRef}
                      type="text"
                      placeholder="Search options..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => {
                        e.stopPropagation();
                        if (e.key === "Escape") {
                          setIsOpen(false);
                          setSearchTerm("");
                          setHighlightedIndex(-1);
                        }
                      }}
                      className={`w-full pl-10 pr-3 ${size === "sm" ? "py-2 text-xs" : size === "lg" ? "py-3 text-base" : "py-2 text-sm"} border border-[rgb(var(--color-border-primary))] rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-[rgb(var(--color-primary))] bg-[rgb(var(--color-bg-primary))] text-[rgb(var(--color-text-primary))]`}
                    />
                  </div>
                </div>
              )}

              {/* Options List */}
              <div className="flex flex-col max-h-[240px]">
                {/* Scrollable Regular Options */}
                <div
                  className="flex-1 overflow-y-auto min-h-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  {regularOptions.length > 0 ? (
                    regularOptions.map((option, index) => {
                      const isSelected = multiple
                        ? value?.includes(option.value)
                        : value === option.value;
                      const isHighlighted = index === highlightedIndex;

                      return (
                        <div
                          key={`${String(option.value)}-${index}`}
                          className={`group px-4 py-2 cursor-pointer transition-colors duration-150 flex items-center justify-between ${
                            isHighlighted || isSelected
                              ? "bg-[rgba(var(--color-primary)/0.12)]"
                              : ""
                          } hover:bg-[rgba(var(--color-primary)/0.12)]`}
                          onClick={() => handleSelect(option)}
                          onMouseEnter={() => setHighlightedIndex(index)}
                          onMouseLeave={() => setHighlightedIndex(-1)}
                        >
                          <span
                            className={`${isHighlighted || isSelected ? "text-[rgb(var(--color-primary))]" : "text-[rgb(var(--color-text-primary))]"} group-hover:text-[rgb(var(--color-primary))] transition-colors duration-150`}
                          >
                            {option.label}
                          </span>
                          {(isHighlighted || isSelected) && (
                            <Check className="w-4 h-4 text-[rgb(var(--color-primary))] transition-transform duration-200" />
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="px-4 py-3 text-sm text-[rgb(var(--color-text-secondary))] text-center">
                      No options found
                    </div>
                  )}
                </div>

                {/* Fixed Add Options at Bottom */}
                {addOptions.length > 0 && (
                  <div
                    className="flex-shrink-0 border-t border-[rgb(var(--color-border-primary))] bg-[rgb(var(--color-bg-primary))] sticky bottom-0 z-10"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {addOptions.map((option, index) => {
                      const addOptionIndex = regularOptions.length + index;
                      const isHighlighted = addOptionIndex === highlightedIndex;

                      return (
                        <div
                          key={option.value || `add-option-${index}`}
                          className={`group px-4 py-2 cursor-pointer transition-colors duration-150 ${
                            isHighlighted
                              ? "bg-[rgba(var(--color-primary)/0.12)]"
                              : ""
                          } hover:bg-[rgba(var(--color-primary)/0.12)]`}
                          onClick={() => handleSelect(option)}
                          onMouseEnter={() =>
                            setHighlightedIndex(addOptionIndex)
                          }
                          onMouseLeave={() => setHighlightedIndex(-1)}
                        >
                          <span className="text-[rgb(var(--color-primary))] group-hover:text-[rgb(var(--color-primary))] text-sm transition-colors duration-150">
                            {option.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>,
            document.body
          )}
      </div>

      {/* Helper Text / Error Message */}
      {(helperText || errorMessage) && (
        <div className="mt-2">
          {error && errorMessage && (
            <p className="text-sm text-[rgb(var(--color-danger))] animate-fade-in">
              {errorMessage}
            </p>
          )}
          {!error && helperText && (
            <p className="text-sm text-[rgb(var(--color-text-secondary))]">
              {helperText}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Select;
