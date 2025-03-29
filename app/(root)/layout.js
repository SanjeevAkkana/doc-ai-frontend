"use client";
import { useEffect } from "react";
import useAuthStore from "@/store/useUserStore";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import ChatButton from "@/components/shared/ChatButton";

export default function Layout({ children }) {
  const { user, isLoading, fetchUser, logout } = useAuthStore();

  useEffect(() => {
    fetchUser();
  }, []);

  if (isLoading) return <div className="w-screen h-screen flex justify-center items-center">
    <p className="w-12 h-12 border-x-4 rounded-full animate-spin border-teal-950 flex justify-center items-center"></p>
  </div>

  return (
    <div>
      {/* Navbar */}
      <div className="sticky top-2 z-50 bg-opacity-10 bg-white border rounded-3xl mt-2 mx-4 md:mx-6 border-gray-500 shadow-md">
        <Navbar />
      </div>

      {/* Main Content */}
      {children}

      {/* Footer */}
      <Footer />

      {/* Chatbot */}
      <ChatButton />
    </div>
  );
}