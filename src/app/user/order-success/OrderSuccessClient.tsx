"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function OrderSuccessClient({
  orderId,
  sessionId,
}: {
  orderId?: string;
  sessionId?: string;
}) {
  const [verifying, setVerifying] = useState(Boolean(orderId && sessionId));
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!orderId || !sessionId) {
        setVerifying(false);
        return;
      }

      try {
        await axios.get(
          `/api/user/payment/verify?orderId=${orderId}&session_id=${sessionId}`
        );
        setVerified(true);
      } catch (error) {
        console.error(error);
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [orderId, sessionId]);

  return (
    <>
      <p className="mt-4 text-sm text-gray-500">
        {verifying
          ? "Verifying payment with Stripe..."
          : verified
          ? "Payment confirmed and order updated."
          : "If payment status is still pending, make sure your Stripe webhook or success verification is reachable."}
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/user/my-orders"
          className="rounded-full bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
        >
          View My Orders
        </Link>
        <Link
          href="/"
          className="rounded-full border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          Continue Shopping
        </Link>
      </div>
    </>
  );
}
