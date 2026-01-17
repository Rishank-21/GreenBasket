import { auth } from '@/auth';
import EditRoleMobile from '@/components/EditRoleMobile';
import connectDB from '@/lib/db'
import User from '@/models/user.model';
import { redirect } from 'next/navigation';
import React from 'react'
import Nav from '@/components/Nav';
import UserDashboard from '@/components/UserDashboard';
import AdminDashboard from '@/components/AdminDashboard';
import DeliveryBoyDashboard from '@/components/DeliveryBoyDashboard';

const Home = async () => {
  await connectDB();
  const session = await auth()
 
  const user = await User.findById(session?.user?.id);
  if(!user){
    redirect('/login');
  }
  const Incomplete = !user.mobile || !user.role || (!user.mobile && user.role === "user");
  if(Incomplete){
    return <EditRoleMobile />
  }

  const plainUser = JSON.parse(JSON.stringify(user));
  return (
    <>
      <Nav user={plainUser} />
      {user.role === "user" ? <UserDashboard /> : user.role === "admin" ? <AdminDashboard /> : <DeliveryBoyDashboard />}
    </>
  )
}

export default Home
