const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const app = express()

const Filter = require('bad-words')

const server = http.createServer(app);
const io = socketio(server)
const port = 3000

const {generateMessage,generateLocationMessage} = require('./utils/messages')

const {getUser,getUsersInRoom,addUser,removeUser} = require('./utils/users')

const publicDirectoryPath = path.join('__dirname', '../public')

app.use(express.static(publicDirectoryPath))


io.on('connection',(socket)=>{
    console.log('new web socket connection!')


    socket.on('join', (options, callback)=> {

        const {error, user} = addUser({ id: socket.id, ...options})

        if(error){
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('message', generateMessage('Admin',"Welcome!"))
        socket.broadcast.to(user.room).emit('message',generateMessage('Admin',`${user.username} has joined!`))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        callback()

        //socket.emit, io.emit, socket.broadcast.emit
        //io.to.emit, socket.broadcse.to.emit
    })



    socket.on('sendMessage', (msg, callback)=>{
        const user = getUser(socket.id)
        const filter = new Filter()
        if(filter.isProfane(msg))
        {
            return callback('Profanity is not allowed')
        }
        io.to(user.room).emit('message',generateMessage(user.username,msg))
        callback();
    })

    socket.on('disconnect', ()=> {
        const user = removeUser(socket.id)

        if(user){
             io.to(user.room).emit('message',generateMessage('Admin',`${user.username}  has left!`))
             io.to(user.room).emit('roomData', {
                room:user.room,
                users: getUsersInRoom(user.room)
             })
        }

       
    })

    socket.on('sendLocation', (coords, callback)=>{
        const user =getUser(socket.id)
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })

    // socket.emit('countUpdated', count)
    // socket.on('increment', ()=>{
    //     count++;
       
    //    io.emit('countUpdated',count)
    // })
})

server.listen(port, ()=>{
    console.log("Server is up on port !")
})