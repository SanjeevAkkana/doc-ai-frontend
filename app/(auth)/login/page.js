"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { KeyIcon, Mail, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Schema for form validation
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const LoginAccount = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  // Function to handle login
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, data);
      const { msg, token, user } = response.data;

      if (msg === "User not found."){
        toast.error("User not found.");
        return;
      }

      if (msg === "New OTP has been sent to your email.") {
        toast.success("New OTP has been sent to your email.");
        router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
        return;
      }

      if (token && user) {
        toast.success("Login successful!");
        localStorage.setItem("token", token);
        router.push("/");
        return;
      }

      throw new Error(msg || "Login failed. Try again.");
    } catch (error) {
      toast.error(error.response?.data?.msg || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      toast.error("You are already logged in. Redirecting...");
      setTimeout(() => {
        router.push("/");
      }, 2000); // Redirect after 2 seconds
    }
  }, [router]);

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="space-y-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-x-2">
          <div className="w-6 h-6 rounded-full bg-teal-900"></div>
          <p className="font-semibold text-xl tracking-wide font-sans">DocAI</p>
        </Link>
        <Toaster position="top-right" reverseOrder={false} />
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Input */}
          <div className="border rounded-2xl flex gap-x-2 items-center p-3 w-80">
            <Mail size={18} />
            <input
              type="email"
              placeholder="Email Address"
              {...register("email")}
              className="outline-none text-sm w-full"
            />
          </div>
          {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}

          {/* Password Input */}
          <div className="border rounded-2xl flex gap-x-2 items-center p-3 w-80 relative">
            <KeyIcon size={18} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password")}
              className="outline-none text-sm w-full"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}

          {/* Links */}
          <div className="flex justify-end w-80 text-sm">
            <Link href="/create-account" className="text-blue-500 hover:underline">
              Create an account
            </Link>
          </div>

          {/* Submit Button */}
          <div className="w-80">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-950 cursor-pointer mt-4 py-3 text-white text-center text-sm rounded-2xl transition disabled:bg-gray-500"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginAccount;