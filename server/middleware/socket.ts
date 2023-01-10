// server/middleware/socket.ts
import { Server } from 'socket.io'

declare global {
  var io: Server | undefined
}

export default defineEventHandler(({ node }) => {
  if (!global.io) {
    global.io = new Server(node.res.socket?.server);

    global.io.on('connection', (socket) => { })
  }
})