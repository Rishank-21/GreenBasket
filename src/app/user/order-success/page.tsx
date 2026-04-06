import OrderSuccessClient from "./OrderSuccessClient";

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string; session_id?: string }>;
}) {
  const params = await searchParams;
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="w-full max-w-xl rounded-3xl border border-green-100 bg-white p-8 text-center shadow-lg">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-green-600">
          Payment Successful
        </p>
        <h1 className="mt-3 text-3xl font-bold text-gray-900">
          Your order has been placed.
        </h1>
        <p className="mt-4 text-gray-600">
          Stripe completed the payment flow successfully. You can track the
          order status from your orders page.
        </p>
        <OrderSuccessClient
          orderId={params.orderId}
          sessionId={params.session_id}
        />
      </div>
    </div>
  );
}
