



const onload = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const room = urlParams.get('room');
  console.log('this is the room', room)

  const socketUrl = 'http://localhost:3000'
  const sokcetBuilder = new SocketBuilder({ socketUrl })

  const peerConfig = Object.values({
    id: undefined,
    config: {
      port: 9000,
      host: 'localhost',
      path: '/'
    }
  })
  console.log(peerConfig)

  const peerBuilder = new PeerBuilder( peerConfig )
  const view = new View()
  const media = new Media()

  const deps = {
    view,
    media,
    room,
    sokcetBuilder,
    peerBuilder
  }

  Business.initialize(deps)

}

window.onload = onload