import { getSocket } from "@/lib/socket";
import { IMassage } from "@/models/message.model";
import axios from "axios";
import { Send, SparklesIcon } from "lucide-react";
import { AnimatePresence } from "motion/react";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
type props = {
  orderId: string;
  deliveryBoyId: string;
};

const isSameMessage = (a: IMassage, b: IMassage) => {
  if (a._id && b._id) return String(a._id) === String(b._id);
  return (
    String(a.roomId) === String(b.roomId) &&
    String(a.senderId) === String(b.senderId) &&
    a.text === b.text &&
    a.time === b.time
  );
};

const DeliveryChat = ({ orderId, deliveryBoyId }: props) => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<IMassage[]>([]);
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading , setLoading] = useState(false);
  const [suggestionError, setSuggestionError] = useState("");
  useEffect(() => {
    const socket = getSocket();
    socket.emit("join-room", orderId);
    return () => {
      socket.emit("leave-room", orderId);
    };
  }, [orderId]);

  useEffect((): any => {
    const socket = getSocket();
    const handleIncomingMessage = (message: IMassage) => {
      if (String(message.roomId) === String(orderId)) {
        setMessages((prev) =>
          prev.some((m) => isSameMessage(m, message))
            ? prev
            : [...prev, message],
        );
      }
    };
    socket.on("send-message", handleIncomingMessage);
    return () => socket.off("send-message", handleIncomingMessage);
  }, [orderId]);

  useEffect(() => {
    chatBoxRef.current?.scrollTo({
      top: chatBoxRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    const socket = getSocket();
    const message: IMassage = {
      roomId: orderId,
      text: newMessage.trim(),
      senderId: deliveryBoyId,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    socket.emit("send-message", message);
    setMessages((prev) =>
      prev.some((m) => isSameMessage(m, message)) ? prev : [...prev, message],
    );

    setNewMessage("");
  };

  useEffect(() => {
    const getAllMessages = async () => {
      try {
        const result = await axios.post("/api/chat/messages", {
          roomId: orderId,
        });
        setMessages(result.data);
      } catch (error) {
        console.log(error);
      }
    };

    getAllMessages();
  }, [orderId]);



  const generateSuggestions = async () => {
    setSuggestionError("");
    setLoading(true);
    try {
      const lastIncomingMessage = messages
        ?.filter((m) => m.senderId.toString() !== deliveryBoyId)
        .at(-1);
      const fallbackMessage = messages.at(-1);
      const messageText = lastIncomingMessage?.text || fallbackMessage?.text || newMessage.trim();

      if (!messageText) {
        setSuggestions([]);
        setSuggestionError("Send or receive at least one message first.");
        setLoading(false);
        return;
      }

      const result = await axios.post("/api/chat/ai-suggestions", {
        message: messageText,
        role: "delivery_boy",
      });
      setSuggestions(result.data?.suggestions || []);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setSuggestions([]);
      if (axios.isAxiosError(error)) {
        setSuggestionError(
          error.response?.data?.error || "Unable to generate suggestions right now."
        );
      } else {
        setSuggestionError("Unable to generate suggestions right now.");
      }
      setLoading(false);
    }
  };
  return (
    <div className="bg-white rounded-3xl shadow-lg border p-4 h-75 md:h-107.5 flex flex-col">


    <div className="flex justify-between items-center mb-3">
      <span className="font-semibold text-gray-700 text-sm">Quick Replies</span>
      <motion.button whileTap={{ scale : 0.9 }} onClick={generateSuggestions} disabled={loading} className="px-3 py-1 text-xs flex items-center gap-1 bg-purple-100 text-purple-700 rounded-full shadow-sm border border-purple-200 cursor-pointer">
        <SparklesIcon size={14} />{loading? "Generating..." : "AI Suggest"}
      </motion.button>
    </div>

    <div className="flex gap-2 flex-wrap mb-3">
      {suggestions.map((s, idx) => (
        <motion.div key={idx} whileTap={{scale : 0.92}} className="px-3 py-1 text-xs bg-green-50 border border-green-200 text-green-700 rounded-full cursor-pointer" onClick={()=>setNewMessage(s)}>
          {s}
        </motion.div>
      ))}
    </div>
    {suggestionError && (
      <p className="mb-3 text-xs text-red-600">{suggestionError}</p>
    )}

      <div className="flex-1 overflow-y-auto p-2 space-y-3" ref={chatBoxRef}>
        <AnimatePresence>
          {messages?.map((msg, idx) => (
            <motion.div
              key={
                msg?._id?.toString() ||
                `${String(msg.senderId)}-${msg.time}-${idx}`
              }
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex ${String(msg.senderId) === String(deliveryBoyId) ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 max-w-[75%] rounded-2xl shadow 
                        ${
                          String(msg.senderId) === String(deliveryBoyId)
                            ? "bg-green-600 text-white rounded-br-none"
                            : "bg-gray-100 text-gray-800 rounded-bl-none"
                        }
                        `}
              >
                <p className="">{msg.text}</p>
                <p className="text-[10px] opacity-70 mt-1 text-right">
                  {msg.time}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex gap-2 mt-3 border-t pt-3">
        <input
          type="text"
          name=""
          id=""
          placeholder="Type a message"
          className="flex-1 bg-gray-100 px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="bg-green-600 hover:bg-green-700 p-3 rounded-xl text-white"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default DeliveryChat;
