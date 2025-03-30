"use client";

import Link from "next/link";
import { FileUp, BrainCircuit, Lock, MessageSquareHeart } from "lucide-react";
import useAuthStore from "@/store/useUserStore";

const features = [
    {
        icon: <FileUp className="w-4 h-4 text-teal-600" />, 
        title: "Upload & Analyze", 
        description: "Upload medical reports in image format for AI-driven insights."
    },
    {
        icon: <BrainCircuit className="w-4 h-4 text-teal-600" />, 
        title: "AI-Powered Insights", 
        description: "Receive intelligent recommendations based on your health data."
    },
    {
        icon: <Lock className="w-4 h-4 text-teal-600" />, 
        title: "Secure & Private", 
        description: "Your data is encrypted and protected with top-tier security measures."
    },
    {
        icon: <MessageSquareHeart className="w-4 h-4 text-teal-600" />, 
        title: "Chat with Health AI", 
        description: "Ask health-related questions and receive instant AI-generated answers."
    }
];

function HeroSection() {
    const { user, isLoading } = useAuthStore(); // Get user from Zustand

    return (
        <div className="relative py-12 px-6 sm:px-12 lg:px-24 bg-gray-50 overflow-hidden">
            {/* Floating Background Elements */}
            <div className="absolute w-40 h-40 bg-amber-500 opacity-30 top-10 left-10 rounded-full blur-3xl"></div>
            <div className="absolute w-40 h-40 bg-teal-500 opacity-20 top-1/3 right-10 rounded-full blur-3xl"></div>
            <div className="absolute w-40 h-40 bg-red-500 opacity-25 bottom-10 left-1/4 rounded-full blur-3xl"></div>
            
            {/* Hero Section */}
            <section className="relative text-center flex flex-col md:items-center">
                <div className="relative inline-block w-fit px-4 py-2 rounded-full bg-teal-100 text-teal-800 text-xs font-semibold mb-3">
                    AI-Powered Medical Analysis
                </div>
                <h1 className="text-3xl text-left md:text-center font-semibold text-gray-800 tracking-wide">
                    Smarter Health Insights, Instantly
                </h1>
                <p className="mt-2 text-left md:text-center text-gray-600 md:max-w-2xl">
                    Upload your medical reports and let AI analyze them for insights, potential concerns, and expert recommendations.
                </p>
                <div className="mt-6 flex gap-4">
                    {!isLoading && (
                        <Link href={user ? "/app" : "/login"}>
                            <button className="bg-teal-950 cursor-pointer border border-teal-950 text-white px-3 py-2.5 rounded-2xl text-sm font-semibold shadow-md transition hover:bg-teal-900">
                                {user ? "Go to App" : "Get Started"}
                            </button>
                        </Link>
                    )}
                    <Link href="/learn-more">
                        <button className="border cursor-pointer border-teal-950 text-teal-900 px-3 py-2.5 rounded-2xl text-sm font-semibold hover:bg-teal-50 transition">
                            Learn More
                        </button>
                    </Link>
                </div>
            </section>

            {/* Features Section */}
            <section className="relative mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                    <div key={index} className="px-6 py-5 border rounded-3xl bg-white flex flex-col transition-transform transform hover:scale-105 hover:shadow-xl duration-300 cursor-pointer">
                        <div className="p-2 w-fit bg-teal-100 rounded-full flex items-center justify-center">{feature.icon}</div>
                        <h3 className="font-semibold text-gray-900 mt-4">{feature.title}</h3>
                        <p className="text-gray-600 font-light text-sm mt-2 leading-relaxed">{feature.description}</p>
                    </div>
                ))}
            </section>
        </div>
    );
}

export default HeroSection;
