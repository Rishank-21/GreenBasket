"use client";
import React from "react";
import { motion } from "motion/react";
import { ShoppingBasket, ArrowRight } from "lucide-react";
type propType = {
  nextStep: (s : number) => void
}
const Welcome = ({ nextStep } : propType) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="flex items-center gap-3"
      >
        <ShoppingBasket className="w-10 h-10 text-green-600"/>
        <h1 className="text-4xl font-extrabold text-green-700 md:text-5xl">
          Welcome to GreenBasket
        </h1>
      </motion.div>


      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
        className="mt-4 text-gray-700 text-lg md:text-xl max-w-lg"
      >
        Your one-stop shop for 100% organic products delivered fresh to your
        door in just 10 minutes.
      </motion.p>


      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="mt-8"
      >
        <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full text-lg cursor-pointer transition duration-300 flex items-center gap-2" onClick={() => nextStep(2)}>
          Next 
          <ArrowRight />
        </button>
      </motion.div>
    </div>
  );
};

export default Welcome;
