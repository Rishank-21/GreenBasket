import Link from "next/link";

export default function OrderCancelPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="w-full max-w-xl rounded-3xl border border-orange-100 bg-white p-8 text-center shadow-lg">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">
          Payment Cancelled
        </p>
        <h1 className="mt-3 text-3xl font-bold text-gray-900">
          The payment was not completed.
        </h1>
        <p className="mt-4 text-gray-600">
          No worries. You can go back to checkout and try the Stripe payment
          again whenever you are ready.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/user/checkout"
            className="rounded-full bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
          >
            Return To Checkout
          </Link>
          <Link
            href="/user/cart"
            className="rounded-full border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Back To Cart
          </Link>
        </div>
      </div>
    </div>
  );
}
