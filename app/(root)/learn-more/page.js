"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { FileUp, BrainCircuit, Lock, MessageSquareHeart, ShieldCheck, Users } from "lucide-react";
import useAuthStore from "@/store/useUserStore";

export default function LearnMore() {

    const { user, isLoading } = useAuthStore();

    return (
        <div className="py-12 px-6 sm:px-12 lg:px-24">
            {/* Hero Section */}
            <motion.section
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-left md:text-center"
            >
                <h1 className="text-3xl tracking-wide font-semibold text-gray-900">Learn More About DocAI</h1>
                <p className="mt-2 tracking-wide text-gray-600 md:max-w-2xl mx-auto">
                    Your AI-powered medical assistant. Upload reports, analyze insights, and chat with AI to understand your health better.
                </p>
            </motion.section>

            {/* Features Section */}
            <section className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="px-6 py-5 border rounded-3xl bg-white flex flex-col items-start transition-transform transform hover:scale-105 duration-300"
                    >
                        <div className="p-2 bg-teal-100 rounded-full">{feature.icon}</div>
                        <h3 className="font-semibold text-gray-900 mt-4">{feature.title}</h3>
                        <p className="text-gray-600 font-light text-sm mt-2 leading-relaxed">{feature.description}</p>
                    </motion.div>
                ))}
            </section>

            {/* Security & Privacy Section */}
            <section className="mt-16 bg-teal-950 p-6 md:p-12 rounded-3xl text-left md:text-center">
                <h2 className="text-3xl tracking-wide font-semibold text-white/90">Your Data, Secure & Private</h2>
                <p className="mt-2 text-white/70 md:max-w-2xl mx-auto">
                    We use industry-leading encryption and security measures to ensure your medical data remains private and confidential.
                </p>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex hover:scale-105 duration-200 border border-white/70 px-6 py-4 rounded-3xl flex-col items-start">
                        <ShieldCheck className="w-6 h-6 text-teal-100" />
                        <h3 className="mt-3 font-semibold text-white/80">End-to-End Encryption</h3>
                        <p className="text-white/70 text-sm mt-1">All medical reports and conversations are encrypted for maximum security.</p>
                    </div>
                    <div className="flex hover:scale-105 duration-200 border border-white/70 px-6 py-4 rounded-3xl flex-col items-start">
                        <Users className="w-6 h-6 text-teal-100" />
                        <h3 className="mt-3 font-semibold text-white/80">No Data Sharing</h3>
                        <p className="text-white/70 text-left text-sm mt-1">We do not share your health data with third parties. Your privacy is our priority.</p>
                    </div>
                </div>
            </section>

            {/* Call-to-Action */}
            <section className="mt-12 border p-6 rounded-3xl text-left md:text-center">
                <h2 className="text-3xl tracking-wide font-semibold text-gray-900">Ready to Get Started?</h2>
                <p className="mt-2 text-gray-600">Join thousands of users improving their health insights with DocAI.</p>
                {!isLoading && (
                    <Link href={user ? "/app" : "/login"}>
                        <button className="bg-teal-950 mt-6 cursor-pointer border border-teal-950 text-white px-3 py-2.5 rounded-2xl text-sm font-semibold shadow-md transition hover:bg-teal-900">
                            {user ? "Go to App" : "Get Started"}
                        </button>
                    </Link>
                )}
            </section>
        </div>
    );
}

const features = [
    {
        icon: <FileUp className="w-8 h-8 text-teal-600" />,
        title: "Upload Medical Reports",
        description: "Easily upload PDFs or images of medical reports for AI analysis."
    },
    {
        icon: <BrainCircuit className="w-8 h-8 text-teal-600" />,
        title: "AI-Powered Insights",
        description: "Receive detailed health insights from AI-driven analysis."
    },
    {
        icon: <MessageSquareHeart className="w-8 h-8 text-teal-600" />,
        title: "Chat with AI",
        description: "Ask health-related questions and get instant AI-generated responses."
    },
    {
        icon: <Lock className="w-8 h-8 text-teal-600" />,
        title: "Secure & Private",
        description: "Your data is encrypted and never shared with third parties."
    }
];