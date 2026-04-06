import React from 'react'
import AdminDashboardClient from './AdminDashboardClient'
import connectDB from '@/lib/db'
import Order from '@/models/order.model';
import User from '@/models/user.model';
import Grocery from '@/models/grocery.model';

const AdminDashboard =async () => {
  await connectDB();
  const orders = await Order.find({});
  const users = await User.find({role:"user"});
  const groceries = await Grocery.find({});

  const totalOrders = orders.length;
  const totalUsers = users.length;
  const pendingDeliveries = orders.filter(order => order.status === "pending").length;
  const totalRevenue = orders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);
  const totalGroceries = groceries.length;


  const today = new Date();
  const startOfToday = new Date(today);
  startOfToday.setHours(0,0,0,0);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 7);
  sevenDaysAgo.setHours(0,0,0,0);


  const todayOrdersList = orders.filter((o)=> new Date(o.createdAt) >= startOfToday);
  const todayOrders = todayOrdersList.length;
  const todayRevenue = todayOrdersList.reduce((sum,order)=> sum + (order.totalAmount || 0) , 0);

  const sevenDaysOrdersList = orders.filter((o)=> new Date(o.createdAt) >= sevenDaysAgo);
  const sevenDaysOrders = sevenDaysOrdersList.length;
  const sevenDaysRevenue = sevenDaysOrdersList.reduce((acc,order)=> acc + (order.totalAmount || 0) , 0);

  const stats = [
    {title : "Today's Orders", value: todayOrders},
    {title : "Total Customers", value : totalUsers},
    {title : "Pending Deliveries", value : pendingDeliveries},
    {title : "Total Revenue", value : totalRevenue},
  ]


  const chartData = [];

  for(let i = 6; i >= 0; i--){

    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0,0,0,0);

    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);

    const ordersCount = orders.filter((o) => new Date(o.createdAt) >= date && new Date(o.createdAt) < nextDate).length;

    chartData.push({
      day:date.toLocaleDateString('en-US', { weekday: 'short' }),
      orders:ordersCount
    })
  }
  return (
    <>
      <AdminDashboardClient earning={
       {
        today:todayRevenue,
       sevenDays:sevenDaysRevenue,
       total:totalRevenue
      }
      }
      stats={stats}
      chartData = {chartData}
      />
    </>
  )
}

export default AdminDashboard
