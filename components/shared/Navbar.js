"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import useAuthStore from "@/store/useUserStore";
import { Menu, X } from "lucide-react"; 

const Navbar = () => {
    const { user, isLoading, logout } = useAuthStore(); // Zustand store for user authentication
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    // Close menu if clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <motion.nav 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            className="w-full px-6 py-3 flex justify-between items-center z-50 relative"
        >
            {/* Logo */}
            <Link href="/" className="flex items-center gap-x-2">
                <div className="w-6 h-6 rounded-full bg-teal-900"></div>
                <p className="font-semibold text-xl tracking-wide font-sans">DocAI</p>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
                <Link href="/blog" className="font-sans text-sm tracking-wide hover:text-teal-700 transition">
                    Blog
                </Link>
                {!isLoading && (
                    <>
                        <Link href={user ? "/app" : "/login"}>
                            <button className="px-4 py-2.5 rounded-xl bg-teal-900 text-white text-sm font-semibold transition hover:bg-teal-800">
                                {user ? "Go to App" : "Get Started"}
                            </button>
                        </Link>
                        {user && (
                            <button 
                                onClick={logout}
                                className="px-4 py-2.5 rounded-xl border cursor-pointer text-sm font-semibold transition"
                            >
                                Logout
                            </button>
                        )}
                    </>
                )}
            </div>

            {/* Mobile Menu Button */}
            <button 
                className="md:hidden cursor-pointer text-gray-700 text-xl focus:outline-none" 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div ref={menuRef} className="absolute top-16 right-4 bg-white shadow-lg rounded-3xl border py-4 px-6 flex flex-col space-y-4 md:hidden">
                    <Link href="/blog" className="text-sm ml-3 tracking-wide hover:text-teal-700 transition" onClick={() => setIsMenuOpen(false)}>
                        Blog
                    </Link>
                    {!isLoading && (
                        <>
                            <Link href={user ? "/app" : "/login"}>
                                <button 
                                    className="w-full text-center px-4 py-2.5 rounded-xl bg-teal-900 text-white text-sm font-semibold transition hover:bg-teal-800"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {user ? "Go to App" : "Get Started"}
                                </button>
                            </Link>
                            {user && (
                                <button 
                                    onClick={logout}
                                    className="w-full text-center px-4 py-2.5 rounded-xl border cursor-pointer text-sm font-semibold transition"
                                >
                                    Logout
                                </button>
                            )}
                        </>
                    )}
                </div>
            )}
        </motion.nav>
    );
};

export default Navbar;