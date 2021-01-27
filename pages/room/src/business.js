class Business {

    constructor({ room, media, view, sokcetBuilder, peerBuilder }) {
        this.room = room
        this.media = media
        this.view = view
        this.sokcetBuilder = sokcetBuilder
        this.peerBuilder = peerBuilder
        this.currentStream = {}
        this.socket = {}
        this.currentPeer = {}
        this.peers = new Map()
    }

    static initialize(deps) {
        const instance = new Business(deps)
        return instance._init()
    }

    async _init() {

        this.currentStream = await this.media.getCamera()

        this.socket = this.sokcetBuilder
            .setOnUserConnected(this.onUserConnected())
            .setOnUserDisconnected(this.onUserDisconnected())
            .build()


        this.currentPeer = await this.peerBuilder
            .setOnError(this.onPeerError())
            .setOnConnectionOpened(this.onPeerConnectionOpened())
            .setOnCallReceived(this.onPeerCallReceived())
            .setOnPeerStreamReceived(this.onPeerStreamReceived())
            .build()


        this.addViewStream('teste01')
    }

    addViewStream(userId, stream = this.currentStream) {
        const isCurrentId = false
        this.view.renderVideo({
            userId,
            muted: false,
            stream,
            isCurrentId
        })
    }

    onUserConnected = function () {
        return userId => {
            console.log(`user connected: ${userId}`)
            this.currentPeer.call(userId, this.currentStream)
        }
    }
    onUserDisconnected = function () {
        return userId => {
            console.log(`user disconnected: ${userId}`)
        }
    }
    onPeerError = function () {
        return error => {
            console.error(`error on peer ${error}`)
        }
    }
    onPeerConnectionOpened = function () {
        return (peer) => {
            const id = peer.id
            console.log('Peer', peer)
            this.socket.emit('join-room', this.room, id)
        }
    }
    onPeerCallReceived = function () {
        return call => {
            console.log('ansering call', call)
            call.answer(this.currentStream)
        }
    }
    onPeerStreamReceived = function () {
        return (call, stream) => {
            const callerId = call.peer
            this.addViewStream(callerId, stream)
            this.peers.set(callerId, { call })
            this.view.setParticipants(this.peers.size)
        }
    }
}