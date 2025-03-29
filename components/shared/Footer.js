"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HeartPulse, Mail, Phone, Globe } from "lucide-react";

export default function Footer() {
    return (
        <motion.footer 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            className="border m-6 rounded-3xl py-10 px-6  bg-white shadow-lg"
        >
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Logo & About */}
                <div>
                    <Link href="/" className="flex items-center gap-x-2 text-xl font-semibold">
                        <p className="w-5 h-5 rounded-full bg-teal-900"></p>
                        <span className="tracking-wide">DocAI</span>
                    </Link>
                    <p className="mt-2 text-sm text-gray-600">
                        AI-powered health insights at your fingertips. Upload, analyze, and chat with our medical AI.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="font-semibold text-lg text-gray-800">Quick Links</h3>
                    <ul className="mt-2 space-y-2 text-sm text-gray-600">
                        <li><Link href="/"><span className="hover:text-teal-600 cursor-pointer">Home</span></Link></li>
                        <li><Link href="/blog"><span className="hover:text-teal-600 cursor-pointer">Blog</span></Link></li>
                        <li><Link href="/learn-more"><span className="hover:text-teal-600 cursor-pointer">Learn More</span></Link></li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div>
                    <h3 className="font-semibold text-lg text-gray-800">Contact Us</h3>
                    <ul className="mt-2 space-y-2 text-sm text-gray-600">
                        <li className="flex items-center gap-x-2">
                            <Mail className="w-4 h-4 text-teal-600" />
                            <span>support@docai.com</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="mt-10 border-t border-gray-300 pt-6 text-center text-sm text-gray-500">
                © {new Date().getFullYear()} DocAI. All rights reserved.
            </div>
        </motion.footer>
    );
}