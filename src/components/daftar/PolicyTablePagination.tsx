'use client';
import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function PolicyTablePagination({
    currentPage,
    totalPages,
    onPageChange,
}: PaginationProps) {
    return (
        <div className="flex justify-center items-center mt-6 space-x-1 sm:space-x-2">
            <button
                onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1.5 rounded-md text-sm font-semibold ${currentPage === 1 ? 'text-gray-400 bg-gray-100 cursor-not-allowed' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
            >
                &laquo; Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-3 py-1.5 rounded-md text-sm font-semibold ${
                        currentPage === page
                            ? "bg-blue-600 text-white shadow-sm"
                            : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                >
                    {page}
                </button>
            ))}

            <button
                onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1.5 rounded-md text-sm font-semibold ${currentPage === totalPages ? 'text-gray-400 bg-gray-100 cursor-not-allowed' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
            >
                Next &raquo;
            </button>
        </div>
    );
}