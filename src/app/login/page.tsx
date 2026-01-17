"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  EyeIcon,
  EyeOff,
  Leaf,
  Loader2,
  Lock,
  LogIn,
  Mail,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import googleImage from "../../assets/google.png";
import axios from "axios";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const sesssion = useSession();
  console.log(sesssion);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await signIn("credentials", {
        email,
        password,
        callbackUrl: "/",
      });
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-10 bg-white relative">
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="text-4xl font-extrabold text-green-700 mb-2"
      >
        Sign In Account
      </motion.h1>
      <p className="text-gray-700 mb-8 flex items-center gap-2">
        Join GreenBasket today <Leaf className="w-5 h-5 text-green-800" />
      </p>
      <motion.form
        onSubmit={handleLogin}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="flex flex-col gap-5 w-full max-w-sm"
        suppressHydrationWarning
      >
        <div className="relative">
          <Mail className="absolute left-3 top-3.5 w-5 h-5 transform  text-gray-500" />
          <input
            type="email"
            placeholder="Email Address"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent focus:outline-none"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            suppressHydrationWarning
          />
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-3.5 w-5 h-5 transform  text-gray-500" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent focus:outline-none"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            suppressHydrationWarning
          />
          {showPassword ? (
            <EyeOff
              className="absolute right-3 top-3.5 w-5 h-5 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <EyeIcon
              className="absolute right-3 top-3.5 w-5 h-5 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword(true)}
            />
          )}
        </div>

        {(() => {
          const formValidation = email !== "" && password.length >= 6;
          return (
            <button
              disabled={!formValidation || loading}
              className={`w-full font-semibold py-3 rounded-xl transition-all duration-200 shadow-md inline-flex items-center justify-center gap-2 ${
                formValidation
                  ? "bg-green-600 hover:bg-green-700 cursor-pointer"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>
          );
        })()}

        <div className="flex items-center justify-center gap-3 text-gray-400 mt-2">
          <hr className="flex-1 border-t border-gray-400" />
          <span>OR</span>
          <hr className="flex-1 border-t border-gray-400" />
        </div>

        <div
          className="w-full flex items-center justify-center gap-3 border border-gray-300 hover:bg-gray-50 py-3 rounded-xl text-gray-700 font-medium transition-all duration-200 cursor-pointer"
          onClick={() => signIn("google", { callbackUrl: "/" })}
          suppressHydrationWarning
        >
          <Image src={googleImage} width={20} height={20} alt="google" />
          Continue with Google
        </div>
      </motion.form>
      <p
        className="text-gray-600 mt-6 text-sm flex items-center gap-1 cursor-pointer"
        onClick={() => router.push("/register")}
      >
        Don't have an account? <LogIn className="w-4 h-4" />
        <span className="font-bold text-green-700">Sign Up</span>
      </p>
    </div>
  );
};

export default Login;
