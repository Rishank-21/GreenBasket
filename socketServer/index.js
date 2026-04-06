import express from "express";
import dotenv from "dotenv";
dotenv.config();
const app = express();

app.use(express.json());
import http from "http";
const server = http.createServer(app);
import { Server } from "socket.io";
import axios from "axios";
const port = process.env.PORT || 5000;
const appBaseUrl = (process.env.NEXT_BASE_URL || "http://127.0.0.1:3000").replace(
  "http://localhost",
  "http://127.0.0.1"
);

const io = new Server(server, {
  cors: {
    origin: appBaseUrl,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  // Debug info to detect incorrect connection payloads


  if (!socket || typeof socket.on !== "function") {
    console.error(
      "[socketServer] Connection handler received non-socket object:",
      socket,
    );
    return;
  }

  socket.on("identity", async (userId) => {
    await axios
      .post(`${appBaseUrl}/api/socket/connect`, {
        userId,
        socketId: socket.id,
      })
      .then((res) => console.log("Socket ID updated:", res.data))
      .catch((err) => console.error("Failed to update socket ID:", err));
  });

  socket.on("updateLocation", async ({ userId, latitude, longitude }) => {
    const location = {
      type: "Point",
      coordinates: [longitude, latitude],
    };
    try {
      await axios.post(`${appBaseUrl}/api/socket/update-location`, {
        userId,
        location,
      });
      io.emit("update-deliveryBoy-location", { userId, location });
    } catch (error) {
      console.error("Failed to update delivery location:", error.message);
    }
  });


  socket.on("join-room",(roomId)=>{
    console.log("join room with:",roomId)
    socket.join(roomId)
  })

  socket.on("send-message",async (message)=>{
    try {
      await axios.post(`${appBaseUrl}/api/chat/save`,message)
      io.to(message.roomId).emit("send-message",message)
    } catch (error) {
      console.error("Failed to save chat message:", error.message);
    }
  })
   
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});



app.post("/notify", (req, res)=>{
  const {event, data, socketId} = req.body;
  if(socketId){
    io.to(socketId).emit(event, data);
  }else{
    io.emit(event, data);
  }
  return res.status(200).json({ success: true });
})

server.listen(port, () => {
  console.log(`server running on port: ${port}`);
  console.log(`socket server using app base url: ${appBaseUrl}`);
});
