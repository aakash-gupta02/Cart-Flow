"use client";
import { Search } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';

const SearchBar = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const searchContainerRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (isExpanded && inputRef.current) inputRef.current.focus();
    }, [isExpanded]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setIsExpanded(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div
            ref={searchContainerRef}
            className={[
                'flex items-center rounded-full transition-all duration-300',
                isExpanded
                    ? 'w-72 bg-white border border-gray-300 shadow px-3 py-2 gap-2'
                    : 'w-10 h-10 bg-gray-100 hover:bg-gray-200 justify-center'
            ].join(' ')}
        >
            <button
                type="button"
                aria-label="Toggle search"
                onClick={() => setIsExpanded((v) => !v)}
                className="p-2 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
                <Search className="w-4 h-4" />
            </button>
            <input
                ref={inputRef}
                type="text"
                placeholder="Search..."
                className={[
                    'bg-transparent outline-none text-sm placeholder-gray-400 transition-all duration-300',
                    isExpanded ? 'w-full opacity-100' : 'w-0 opacity-0 pointer-events-none'
                ].join(' ')}
            />
        </div>
    );
};

export default SearchBar;