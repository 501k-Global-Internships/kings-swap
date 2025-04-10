"use client";

import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  showItemCount = true,
  maxPageButtons = 5,
  className = "", // Added className prop for additional styling
}) => {
  // Generate page numbers to display
  const generatePageNumbers = () => {
    const pages = [];

    // Logic to show limited page buttons with ellipsis for large page counts
    if (totalPages <= maxPageButtons) {
      // Show all pages if total pages is less than or equal to maxPageButtons
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate start and end for the middle section
      let startPage = Math.max(
        2,
        currentPage - Math.floor(maxPageButtons / 2) + 1
      );
      let endPage = Math.min(totalPages - 1, startPage + maxPageButtons - 3);

      // Adjust if we're near the beginning
      if (currentPage <= Math.ceil(maxPageButtons / 2)) {
        startPage = 2;
        endPage = maxPageButtons - 2;
      }

      // Adjust if we're near the end
      if (currentPage > totalPages - Math.ceil(maxPageButtons / 2)) {
        endPage = totalPages - 1;
        startPage = totalPages - maxPageButtons + 2;
      }

      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pages.push("...");
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pages.push("...");
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pages = generatePageNumbers();

  if (totalPages <= 1) {
    return null; // Don't render pagination if there's only one page
  }

  return (
    <div className={`flex flex-col items-center space-y-2 ${className}`}>
      {showItemCount && totalItems !== undefined && (
        <div className="text-sm text-gray-500">
          Showing page {currentPage} of {totalPages} ({totalItems} items)
        </div>
      )}

      <div className="flex justify-center items-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className={`px-3 py-1.5 rounded-md text-sm flex items-center transition-colors ${
            currentPage <= 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "border border-gray-300 hover:bg-gray-50 text-gray-700"
          }`}
        >
          <FiChevronLeft className="mr-1" size={16} />
          Prev
        </button>

        {pages.map((page, index) => (
          <React.Fragment key={index}>
            {page === "..." ? (
              <span className="px-2">...</span>
            ) : (
              <button
                onClick={() => onPageChange(page)}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                  currentPage === page
                    ? "bg-blue-500 text-white"
                    : "border border-gray-300 hover:bg-gray-50 text-gray-700"
                }`}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={`px-3 py-1.5 rounded-md text-sm flex items-center transition-colors ${
            currentPage >= totalPages
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "border border-gray-300 hover:bg-gray-50 text-gray-700"
          }`}
        >
          Next
          <FiChevronRight className="ml-1" size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
