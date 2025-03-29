"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { KeyIcon, Mail, User, Calendar, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const signUpSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  dob: z.string().refine((val) => new Date(val) <= new Date(), "Invalid date of birth"),
});

const CreateAccount = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, data);

      if (response.data.msg === "User already exists!") {
        toast.error("User already exists. Redirecting to login...");
        setTimeout(() => {
          router.push("/login");
        }, 2000); // Redirect after 2 seconds
        return;
      }

      if (response.data.msg === "User registered. Verification email sent.") {
        toast.success("Account created! Verify your email.");
        router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
        return;
      }

      throw new Error(response.data.msg || "Signup failed. Try again.");
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
    <div className="p-6 h-screen flex justify-center items-center">
      <div className="space-y-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-x-2">
          <div className="w-6 h-6 rounded-full bg-teal-900"></div>
          <p className="font-semibold text-xl tracking-wide font-sans">DocAI</p>
        </Link>
        <Toaster position="top-right" reverseOrder={false} />
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="border rounded-2xl flex gap-x-2 items-center p-3 w-80">
            <User size={18} />
            <input
              type="text"
              placeholder="Username"
              {...register("name")}
              className="outline-none text-sm w-full"
            />
          </div>
          {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}

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

          <div className="border rounded-2xl flex gap-x-2 items-center p-3 w-80">
            <Calendar size={18} />
            <input
              type="date"
              placeholder="Date of Birth"
              {...register("dob")}
              className="outline-none text-sm w-full"
            />
          </div>
          {errors.dob && <p className="text-red-500 text-xs">{errors.dob.message}</p>}

          <div className="flex justify-end w-80">
            <Link href="/login" className="text-sm">
              Already have an account? <span className="text-blue-500 hover:underline">Login</span>
            </Link>
          </div>

          <div className="w-80">
            <button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer bg-teal-950 mt-4 py-3 text-white text-center text-sm rounded-2xl transition disabled:bg-gray-500"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAccount;