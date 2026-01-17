"use client";

// "user", "deliveryBoy", "admin"
import React, { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Bike, User, UserCog } from "lucide-react";
import axios from "axios";
import { redirect, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
const EditRoleMobile = () => {
  const [role, setRole] = useState([
    { id: "admin", label: "Admin", icon: UserCog },
    { id: "user", label: "User", icon: User },
    { id: "deliveryBoy", label: "Delivery Boy", icon: Bike },
  ]);

  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [mobile, setMobile] = useState("");
  const { update }  = useSession()
  const router = useRouter()
  const handleEdit = async (e: React.FormEvent) => {
    try {
        const res = await axios.post('/api/user/edit-role-mobile', {
            role: selectedRole,
            mobile
        });
        await update({role: selectedRole})
      router.push("/")
    } catch (error) {
        console.log(error)
    }
  }

  return (
    <div className="flex flex-col min-h-screen p-6 w-full bg-linear-to-b from-green-100 to-white">
      <motion.h1
        initial={{ opacity: 0, y: -30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
          type: "spring",
          stiffness: 100,
        }}
        className="text-3xl md:text-4xl font-extrabold text-green-700 text-center mt-8"
      >
        Select Your Role
      </motion.h1>

      <div className="flex flex-col md:flex-row justify-center items-center gap-6 mt-10">
        {role.map((r, index) => {
          const Icon = r.icon;
          const isSelected = selectedRole === r.id;
          return (
            <motion.div
              key={r.id}
              whileHover={{
                scale: 1.05,
                y: -5,
                transition: { duration: 0.2 },
              }}
              whileTap={{
                scale: 0.95,
                transition: { duration: 0.1 },
              }}
              initial={{
                opacity: 0,
                y: 50,
                scale: 0.8,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              transition={{
                duration: 0.6,
                delay: 0.3 + index * 0.1,
                type: "spring",
                stiffness: 120,
              }}
              onClick={() => setSelectedRole(r.id)}
              className={`flex flex-col items-center justify-center w-48 h-44 rounded-2xl border-2 cursor-pointer transition-all duration-300 p-6 ${
                isSelected
                  ? "border-green-600 bg-green-100 shadow-xl shadow-green-200"
                  : "border-gray-300 hover:border-green-500 bg-white hover:shadow-lg"
              }`}
            >
              <motion.div
                animate={{
                  rotate: isSelected ? 360 : 0,
                  scale: isSelected ? 1.1 : 1,
                }}
                transition={{
                  duration: 0.5,
                  type: "spring",
                  stiffness: 200,
                }}
              >
                <Icon
                  className={`w-12 h-12 mb-3 ${
                    isSelected ? "text-green-700" : "text-green-600"
                  }`}
                />
              </motion.div>
              <motion.span
                className={`text-lg font-semibold ${
                  isSelected ? "text-green-800" : "text-gray-700"
                }`}
                animate={{ scale: isSelected ? 1.05 : 1 }}
                transition={{ duration: 0.2 }}
              >
                {r.label}
              </motion.span>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.7,
          delay: 0.8,
          type: "spring",
          stiffness: 100,
        }}
        className="flex flex-col items-center mt-10"
      >
        <label htmlFor="mobile" className="text-gray-700 font-medium mb-2">
          Mobile Number
        </label>
        <motion.input
          type="tel"
          id="mobile"
          placeholder="Mobile Number"
          className="w-64 md:w-80 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-800 transition-all duration-300"
          onChange={(e) => setMobile(e.target.value)}
          value={mobile}
          whileFocus={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
          suppressHydrationWarning
        />
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.7,
          delay: 1.0,
          type: "spring",
          stiffness: 100,
        }}
        whileHover={{
          scale: 1.05,
          boxShadow: "0 10px 25px rgba(34, 197, 94, 0.3)",
        }}
        whileTap={{ scale: 0.95 }}
        className={`inline-flex items-center gap-2 font-semibold py-3 px-8 rounded-2xl shadow-md transition-all duration-300 ${
          selectedRole && mobile.length === 10
            ? "bg-green-600 text-white hover:bg-green-700 cursor-pointer"
            : "bg-gray-300 text-gray-600 cursor-not-allowed"
        } mt-10 self-center`}
        disabled={!(selectedRole && mobile.length === 10)}
        onClick={handleEdit}
      >
        Go To Home
        <ArrowRight/>
      </motion.button>
    </div>
  );
};

export default EditRoleMobile;
