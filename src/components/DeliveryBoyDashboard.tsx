"use client";
import { getSocket } from "@/lib/socket";
import { RootState } from "@/redux/store";
import axios from "axios";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DeliveryChat from "./DeliveryChat";
import {  Loader } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, Legend } from 'recharts' 


const LiveMap = dynamic(() => import("./LiveMap"), { ssr: false });

interface ILocation {
  latitude: number;
  longitude: number;
}

const DeliveryBoyDashboard = ({ earnings }: { earnings: number }) => {
  const [assignments, setAssignments] = useState<any[]>([]);
  const { userData } = useSelector((state: RootState) => state.user);
  const [activeOrder, setActiveOrder] = useState<any>(null);
  const [acceptingAssignmentId, setAcceptingAssignmentId] = useState<string | null>(null);
  const [assignmentError, setAssignmentError] = useState("");
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [otpError , setOtpError] = useState("");
  const [sendOtpLoading , setSendOtpLoading] = useState(false);
  const [verifyOtpLoading , setVerifyOtpLoading] = useState(false);
  const [otp , setOtp] = useState("");
  const [userLocation, setUserLocation] = useState<ILocation>({
    latitude: 0,
    longitude: 0,
  });
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<ILocation>({
    latitude: 0,
    longitude: 0,
  });

  useEffect(() => {
    const socket = getSocket();
    if (!userData?._id) return;
    if (!navigator.geolocation)
      return console.error("Geolocation not supported");
    const watcher = navigator.geolocation.watchPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setDeliveryBoyLocation({
          latitude: lat,
          longitude: lon,
        });
        socket?.emit("updateLocation", {
          userId: userData?._id,
          latitude: lat,
          longitude: lon,
        });
      },
      (error) => {
        console.error("Error getting location:", error);
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 },
    );
    return () => navigator.geolocation.clearWatch(watcher);
  }, [userData?._id]);

  const fetchAssignement = async () => {
    try {
      const res = await axios.get("/api/delivery/get-assignments");
      setAssignments(res.data.assignments || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect((): any => {
    const socket = getSocket();
    socket.on("new-assignment", (deliveryAssignment) => {
      setAssignments((prev) => [...prev, deliveryAssignment]);
    });
    return () => socket.off("new-assignment");
  }, []);

  const acceptAssignment = async (assignmentId: string) => {
    setAssignmentError("");
    setAcceptingAssignmentId(assignmentId);
    try {
      await axios.post(
        `/api/delivery/assignment/${assignmentId}/accept-assignment`,
      );
      await fetchCurrentOrder();
      setAssignments((prev) => prev.filter((a) => a?._id !== assignmentId));
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        setAssignmentError(
          error.response?.data?.message || "Unable to accept assignment.",
        );
      } else {
        setAssignmentError("Unable to accept assignment.");
      }
    } finally {
      setAcceptingAssignmentId(null);
    }
  };

  const fetchCurrentOrder = async () => {
    try {
      const res = await axios.get("/api/delivery/current-order");
      if (res.data.active) {
        setActiveOrder(res.data.assignment);
        setUserLocation({
          latitude: res.data.assignment.order.address.latitude,
          longitude: res.data.assignment.order.address.longitude,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(():any=>{
    const socket = getSocket();
    socket.on("update-deliveryBoy-location",({userId, location})=>{
      setDeliveryBoyLocation({
        latitude : location.coordinates[1] ?? location.latitude,
        longitude : location.coordinates[0] ?? location.longitude
      })
    })

    return socket.off("update-deliveryBoy-location");
  },[])

  useEffect(() => {
    fetchCurrentOrder();
    fetchAssignement();
  }, [userData]);



  const sendOtp = async () => {
    setSendOtpLoading(true);
    try {
      const res = await axios.post("/api/delivery/otp/send", {
        orderId : activeOrder.order._id
      });
      setShowOtpBox(true);
      setSendOtpLoading(false);
    } catch (error) {
      console.log(error);
      setSendOtpLoading(false);
    }
  }

  const verifyOtp = async () => {
    setVerifyOtpLoading(true);
    try{
      const res = await axios.post("/api/delivery/otp/verify", {
        orderId : activeOrder.order._id,
        otp
      });
      setActiveOrder(null);
      setVerifyOtpLoading(false);
      await fetchCurrentOrder();
      window.location.reload();
    }catch (error) {
      setOtpError("Invalid OTP. Please try again.");
      setVerifyOtpLoading(false);
    }
  }


  if(!activeOrder && assignments.length === 0){
    const todayEarning = [
      {
        name: "Today",
        earning: earnings,
        deliveries:Math.floor(earnings/50)
      }
    ]
    return(
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-white to-green-50 p-6 pt-30">
        <div className="max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-800">No Active Deliveries </h2>
          <p className="text-gray-500 mb-5">Stay Online to Receive Delivery Assignments</p>

          <div className="bg-white border rounded-xl shadow-xl p-6">
            <h2 className="font-medium text-green-700 mb-2">Today's Earnings</h2>

            <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={todayEarning} >
                    <XAxis dataKey="name" />
                    <Tooltip/>
                    <Legend /> 
                    <Bar dataKey="earnings" fill="#4ade80" radius={[6,6,0,0]} name="Earnings"/>
                    <Bar dataKey="deliveries" fill="#86efac" radius={[6,6,0,0]} name="Deliveries"/>
                    </BarChart>
                  </ResponsiveContainer>


            <p className="text-2xl font-bold text-green-700 mt-4">
              ₹{todayEarning[0].earning.toFixed(2)}
            </p>
            <p className="text-gray-500">
              Deliveries: {todayEarning[0].deliveries}
            </p>
            <button className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg" onClick={()=>window.location.reload
              ()
            }>Refresh Earning</button>
          </div>
        </div>

      </div>
    )
  }

  if (activeOrder && userLocation) {
    return (
      <div className="p-4 pt-30 min-h-screen bg-gray-50">
        {/* centre everything in a max width wrapper so large screens don\'t stretch content */}
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold text-green-700 mb-2">
            Active Delivery
          </h1>
          <p className="text-gray-600 text-sm mb-4">
            Order#{activeOrder?.order._id.slice(-6)}
          </p>

          <div className="rounded-xl border shadow-lg overflow-hidden mb-6">
            {/* LiveMap handles its own responsive height */}
            <LiveMap
              userLocation={userLocation}
              deliveryBoyLocation={deliveryBoyLocation}
            />
          </div>

          {/* chat sits inside same wrapper so it doesn\'t span full width */}
          <DeliveryChat
            orderId={activeOrder.order?._id}
            deliveryBoyId={userData?._id?.toString()!}
          />

          <div className="mt-6 bg-white rounded-xl border shadow p-6">
            {!activeOrder.deliveryOtpVerification && !showOtpBox && (
              <button
              onClick={sendOtp}
              className="w-full py-4 bg-green-600 text-white text-center rounded-lg flex items-center justify-center gap-2">{sendOtpLoading ? <Loader size={18} className="animate-spin text-center text-white"/> : "Mark as Delivered"}</button>
            )}

            {
              showOtpBox && (
                <div className="mt-4">
                  <input type="number" className="w-full border rounded-lg text-center p-4" placeholder="Enter OTP" maxLength={6} onChange={(e) => setOtp(e.target.value)} value={otp}/>
                  <button className="w-full mt-4 bg-blue-600 text-white text-center py-3 rounded-lg flex items-center justify-center gap-2" onClick={verifyOtp}>{verifyOtpLoading ? <Loader size={18} className="animate-spin text-center text-white"/> : "Verify OTP"}</button>
                  {otpError && <p className="text-red-600 mt-2 text-center">{otpError}</p>}
                </div>
              )
            }


            {
              activeOrder.order.deliveryOtpVerification &&  (
                <div className="text-green-700 text-center font-bold">Delivery Completed!</div>
              )
            }

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 pt-30 relative">
      {/* padding matches active‑order view so scrolling never shows navbar behind content */}
      <div className="max-w-3xl mx-auto ">
        <h2 className="text-2xl font-bold mt-25 text-gray-800 mb-7.5">
          Delivery Assignments
        </h2>
        {assignmentError && (
          <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {assignmentError}
          </p>
        )}
        {assignments.map((a) => (
          <div
            key={a._id}
            className="p-5 bg-white rounded-xl shadow mb-4 border"
          >
            <p>
              <b>Order ID:</b>#{a.order?._id.slice(-6)}
            </p>
            <p className="text-gray-600">{a.order?.address.fullAddress}</p>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => acceptAssignment(a?._id)}
                disabled={acceptingAssignmentId === a?._id}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
              >
                {acceptingAssignmentId === a?._id ? "Accepting..." : "Accept"}
              </button>
              <button className="flex-1 bg-red-600 text-white py-2 rounded-lg cursor-pointer">
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliveryBoyDashboard;
