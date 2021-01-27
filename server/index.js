const server = require("http").createServer((request, response) => {
    response.writeHead(204, {
        'Acess-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
    })
    response.end('hey there!')
})

const socketIo = require('socket.io')

const io = socketIo(server, {
    cors: {
        origin: '*',
        credentials: false
    }
})

io.on('connection', socket => {
    console.log("connection: ", socket.id)

    socket.on('join-room', (roomId, userId) => {
        //Adiciona os usuários na mesma sala através do roomId
        socket.join(roomId)
        //Envia uma mensagem para todos que estão na sala que o usuário com userId entrou
        socket.to(roomId).broadcast.emit("user-connected", userId)

        socket.on('disconnect', () => {
            console.log('disconnected!', roomId, userId)
            socket.to(roomId).broadcast.emit('user-disconnected', userId)
        })
    })
})

const startServer = () => {
    const {address,port} = server.address()
    console.log(`server running at ${address}:${port}`)
}

server.listen(process.env.PORT || 3000, startServer)