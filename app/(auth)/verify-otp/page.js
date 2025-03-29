"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { Mail, KeyIcon } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const otpSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export default function VerifyOtpComponent() {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const emailFromQuery = searchParams.get("email") ?? "";

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: { email: emailFromQuery },
  });

  useEffect(() => {
    if (emailFromQuery) {
      setValue("email", emailFromQuery);
    }
  }, [emailFromQuery, setValue]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      toast.error("You are already logged in. Redirecting...");
      setTimeout(() => {
        router.push("/");
      }, 2000);
    }
  }, [router]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify`, data);

      if (response.data.msg === "Invalid OTP.") {
        toast.error("Invalid OTP. Please check and enter again.");
        return;
      }

      if (response.data.msg === "User not found.") {
        toast.error("No account found with this email.");
        return;
      }

      if (response.data.msg === "Account verified successfully.") {
        toast.success("Account verified! Redirecting to login...");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
        return;
      }

      throw new Error(response.data.msg || "Verification failed. Try again.");
    } catch (error) {
      toast.error(error.response?.data?.msg || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 h-screen flex justify-center items-center">
      <div className="space-y-4">
        <Link href="/" className="flex items-center gap-x-2">
          <div className="w-6 h-6 rounded-full bg-teal-900"></div>
          <p className="font-semibold text-xl tracking-wide font-sans">DocAI</p>
        </Link>
        <Toaster position="top-right" reverseOrder={false} />
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="border rounded-2xl flex gap-x-2 items-center p-3 w-80">
            <Mail size={18} />
            <input
              type="email"
              placeholder="Email Address"
              {...register("email")}
              className="outline-none text-sm w-full cursor-not-allowed"
              readOnly
            />
          </div>
          {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}

          <div className="border rounded-2xl flex gap-x-2 items-center p-3 w-80">
            <KeyIcon size={18} />
            <input
              type="text"
              placeholder="Enter OTP"
              {...register("otp")}
              className="outline-none text-sm w-full"
            />
          </div>
          {errors.otp && <p className="text-red-500 text-xs">{errors.otp.message}</p>}

          <div className="flex justify-end w-80">
            <Link href="/login" className="text-sm">
              Back to <span className="text-blue-500 hover:underline">Login</span>
            </Link>
          </div>

          <div className="w-80">
            <button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer bg-teal-950 mt-4 py-3 text-white text-center text-sm rounded-2xl transition disabled:bg-gray-500"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}