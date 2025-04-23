const socketIo = require("socket.io");
const userModel = require("./model/user.model");
const captainModel = require("./model/captain.model");

let io;

function initializeSocket(server) {
  io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on("join", async (data) => {
      const { userId, userType } = data;

      if (userType === "user") {
        console.log(`User connected: ${socket.id}`);
        await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
      } else if (userType === "captain") {
        console.log(`Captain connected: ${socket.id}`);
        await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
      }
    });

    socket.on("disconnect-captain", () => {
      console.log(`Captain disconnected: ${socket.id}`);
    });

    socket.on("update-location-captain", async (data) => {
      const { userId, location } = data;

      if (!location || !location.ltd || !location.lng) {
        return socket.emit("error", { message: "Invalid location data" });
      }

      await captainModel.findByIdAndUpdate(userId, {
        location: {
          ltd: location.ltd,
          lng: location.lng,
        },
      });
    });

    //chat socket
    socket.on('joinChat', ({ roomId }) => {
      socket.join(roomId);
      console.log(`${socket.id} joined room: ${roomId}`);
    });

    socket.on('isTyping', ({ roomId, userType, isTyping }) => {
      socket.to(roomId).emit('typingStatus', { userType, isTyping });
      // console.log(`${userType} is ${isTyping ? 'typing' : 'not typing'} in room: ${roomId}`);
    });

    socket.on('isOnline', ({ roomId, userType, isOnline }) => {
      socket.to(roomId).emit('onlineStatus', { userType, isOnline });
      // console.log(`${userType} is ${isOnline ? 'Online' : 'Offline'} in room: ${roomId}`);
    });

    socket.on('sendMessage', ({ roomId, sender, message, timeStamp }) => {
      // console.log(roomId, sender, message, timeStamp);  
      io.to(roomId).emit('receiveMessage', { sender, message, timeStamp });
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
}

const sendMessageToSocketId = (socketId, messageObject) => {
  console.log("sendMessage", messageObject);

  if (io) {
    io.to(socketId).emit(messageObject.event, messageObject.data);
  } else {
    console.log("Socket.io not initialized.");
  }
};

const sendMessageToBothSocketId = (
  userSocketId,
  captainSocketId,
  messageObject
) => {
  console.log("sendMessageBoth", messageObject);

  if (io) {
    io.to(userSocketId)
      .to(captainSocketId)
      .emit(messageObject.event, messageObject.data);
  } else {
    console.log("Socket.io not initialized.");
  }
};

module.exports = {
  initializeSocket,
  sendMessageToSocketId,
  sendMessageToBothSocketId,
};
