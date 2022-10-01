const express = require("express");
const app = express();
const server = require("http").Server(app);

const io = require("socket.io")(server)

const port = 3004;

 
app.get("/", (req, res) => {
    res.send("Hello world")
})

const addUser = (userName,roomId) => {
    users.push({
        userName: userName,
        roomId: roomId
    })
}

const userLeave = (userName) => {
    users =  users.filter(user => user.userName != userName)
} 

const getRoomUsers = (roomId) => {
    return users.filter(user => (user.roomId == roomId))
}

io.on("connection", socket => {
    console.log(`Someone connected`);
    socket.on("join-room", ({roomId, userName}) => {

        console.log("User joined room");
        console.log(roomId);
        console.log(userName);

        socket.join(roomId);

        addUser(userName, roomId)

        socket.to(roomId).emit("user-connected", userName)

        io.to(roomId).emit("all-users",getRoomUsers(roomId));

        socket.on("disconnect", () => {
            console.log("disconnected");
            socket.leave(roomId)
            userLeave(userName)
            io.to(roomId).emit("all-users",getRoomUsers(roomId));

        })
    })
})

server.listen(process.env.PORT || port, () => {
    console.log(`Zoom clone api listening on localhost:3004`)
})
