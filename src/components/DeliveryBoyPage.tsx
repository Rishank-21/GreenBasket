import React from 'react'
import DeliveryBoyDashboard from './DeliveryBoyDashboard'
import { auth } from '@/auth'
import connectDB from '@/lib/db'
import Order from '@/models/order.model'

const DeliveryBoyPage = async () => {
  await connectDB();
  const session = await auth();
  const deliveryBoyId = session?.user?.id;
  const orders = await Order.find({
    assignedDeliveryBoy:deliveryBoyId,
    deliveryOtpVerification:true
  })

  const today = new Date().toDateString();
  const todayOrders = orders.filter((o) => new Date(o.deliveredAt).toDateString() === today).length;
  const todaysEarning = todayOrders * 50;
  return (
    <>
      <DeliveryBoyDashboard earnings={todaysEarning} />
    </>
  )
}

export default DeliveryBoyPage
