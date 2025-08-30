export default function registerSockets(io) {
  io.on('connection', (socket) => {
    socket.on('join', ({ designId, user }) => {
      socket.join(designId);
      socket.to(designId).emit('presence', { user, joined: true });
    });

    socket.on('cursor', ({ designId, cursor }) => {
      socket.to(designId).emit('cursor', { id: socket.id, cursor });
    });

    socket.on('patch', ({ designId, ops }) => {
      socket.to(designId).emit('patch', ops);
    });

    socket.on('disconnect', () => {});
  });
}
