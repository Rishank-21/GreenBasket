'use client'
import { getSocket } from '@/lib/socket'
import React, { useEffect } from 'react'

const GeoUpdater =  ({userId}:{userId: string}) => {
    let socket = getSocket()
    socket?.emit("identity",userId)
    useEffect(()=>{
        if(!userId) return
        if(!navigator.geolocation) return console.error("Geolocation not supported");
        const watcher = navigator.geolocation.watchPosition((position)=>{
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            socket?.emit("updateLocation", {userId, latitude: lat, longitude: lon})

        },(error)=>{
            console.error("Error getting location:", error);
        },{enableHighAccuracy: true, maximumAge: 10000, timeout: 5000})
        return ()=> navigator.geolocation.clearWatch(watcher)
    },[userId])
  return null
}

export default GeoUpdater
