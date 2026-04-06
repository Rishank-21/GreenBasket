import { auth } from '@/auth';
import EditRoleMobile from '@/components/EditRoleMobile';
import connectDB from '@/lib/db'
import User from '@/models/user.model';
import { redirect } from 'next/navigation';
import React from 'react'
import Nav from '@/components/Nav';
import UserDashboard from '@/components/UserDashboard';
import AdminDashboard from '@/components/AdminDashboard';
import DeliveryBoyPage from '@/components/DeliveryBoyPage';
import GeoUpdater from '@/components/GeoUpdater';
import Grocery, { IGrocery } from '@/models/grocery.model';
import Footer from '@/components/Footer';

const Home = async (props:{
  searchParams:Promise<{
    q:string
  }>
}) => {


  const searchParams = await props.searchParams;
 
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

  let groceryList:IGrocery[]=[]
  if(user.role === "user"){
    if(searchParams.q){
      groceryList = await Grocery.find({
        $or:[
          {name: {$regex: searchParams?.q || "", $options: 'i'}},
          {description: {$regex: searchParams?.q || "", $options: 'i'}},
          {category: {$regex: searchParams?.q || "", $options: 'i'}}
        ]
      })
    }else{
      groceryList = await Grocery.find({}).lean();
    }
  }
  return (
    <>
      <Nav user={plainUser} />
      <GeoUpdater userId={plainUser._id} />
      {user.role === "user" ? <UserDashboard groceryList={groceryList} /> : user.role === "admin" ? <AdminDashboard /> : <DeliveryBoyPage />}
      <Footer/>
    </>
  )
}

export default Home
