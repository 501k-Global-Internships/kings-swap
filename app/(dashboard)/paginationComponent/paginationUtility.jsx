/**
 * Utility functions for pagination
 */

/**
 * Builds the API URL with pagination parameters
 * @param {string} baseUrl - Base API URL
 * @param {number} page - Current page number
 * @param {number} perPage - Items per page
 * @param {Object} filters - Additional filter parameters
 * @returns {string} - Complete URL with query parameters
 */
export const buildPaginatedUrl = (baseUrl, page, perPage, filters = {}) => {
  const params = new URLSearchParams();

  // Add pagination parameters
  params.append("page", page);
  if (perPage) params.append("per_page", perPage);

  // Add any additional filters
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, value);
    }
  });

  return `${baseUrl}?${params.toString()}`;
};

/**
 * Calculates the range of items being displayed
 * @param {number} currentPage - Current page number
 * @param {number} perPage - Items per page
 * @param {number} totalItems - Total number of items
 * @returns {Object} - Object containing start, end, and text representation
 */
export const getDisplayedItemsRange = (currentPage, perPage, totalItems) => {
  const start = (currentPage - 1) * perPage + 1;
  const end = Math.min(start + perPage - 1, totalItems);

  return {
    start,
    end,
    text: `${start}-${end} of ${totalItems}`,
  };
};

/**
 * Creates an array of page numbers to display
 * @param {number} currentPage - Current page number
 * @param {number} totalPages - Total number of pages
 * @param {number} maxButtons - Maximum number of page buttons to show
 * @returns {Array} - Array of page numbers and ellipsis indicators
 */
export const createPageNumbers = (currentPage, totalPages, maxButtons = 5) => {
  if (totalPages <= maxButtons) {
    // Return all pages if total is less than max buttons
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = [];
  const halfButtons = Math.floor(maxButtons / 2);

  // Always show first page
  pages.push(1);

  // Calculate middle pages
  let startPage = Math.max(2, currentPage - halfButtons);
  let endPage = Math.min(totalPages - 1, currentPage + halfButtons);

  // Adjust if we're near boundaries
  if (currentPage <= halfButtons + 1) {
    // Near start
    endPage = maxButtons - 1;
  } else if (currentPage >= totalPages - halfButtons) {
    // Near end
    startPage = totalPages - maxButtons + 2;
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

  return pages;
};

/**
 * Handles keyboard navigation for accessibility
 * @param {Object} event - Keyboard event
 * @param {number} currentPage - Current page number
 * @param {number} totalPages - Total number of pages
 * @param {Function} onPageChange - Function to call when page changes
 */
export const handlePaginationKeyboardNavigation = (
  event,
  currentPage,
  totalPages,
  onPageChange
) => {
  if (event.key === "ArrowLeft" && currentPage > 1) {
    onPageChange(currentPage - 1);
  } else if (event.key === "ArrowRight" && currentPage < totalPages) {
    onPageChange(currentPage + 1);
  }
};

/**
 * Creates a data structure with information for all pages
 * @param {number} totalItems - Total number of items
 * @param {number} perPage - Items per page
 * @returns {Array} - Array of page information objects
 */
export const generatePagesInfo = (totalItems, perPage) => {
  const totalPages = Math.ceil(totalItems / perPage);
  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    const start = (i - 1) * perPage + 1;
    const end = Math.min(start + perPage - 1, totalItems);

    pages.push({
      pageNumber: i,
      start,
      end,
      itemCount: end - start + 1,
    });
  }

  return pages;
};
