import React from 'react'
import HeroSection from './HeroSection'
import CategorySlider from './CategorySlider'
import connectDB from '@/lib/db'
import Grocery, { IGrocery } from '@/models/grocery.model'
import ItemCard from './ItemCard'
const UserDashboard = async ({ groceryList }: { groceryList: IGrocery[] }) => {
await connectDB()

const plainGrocery = JSON.parse(JSON.stringify(groceryList))

  return (
    <>
      <HeroSection />
      <CategorySlider/>
      <div className='w-[90%] md:w-[80%] mx-auto mt-10'>
        <h2 className='text-2xl md:text-3xl font-bold text-green-700 mb-6 text-center'>Popular Grocery Items</h2>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6'>
          {plainGrocery.map((item:any, index:number) => (
        <ItemCard key={index} item = {item}/>
      ))}
        </div>
      </div>
    </>
  )
}

export default UserDashboard
