/**
 *
 *  Server emissions
 *
 */
export const serverInitialState = ({ client, room }) => {
  client.emit('server.initialState', {
    id: client.id,
    text: room.get('text'),
  });
};

export const serverChanged = ({ io, room }) => {
  const roomId = room.get('id');
  const text = room.get('text');
  io
    .in(roomId)
    .emit('server.changed', { text });
};

export const serverLeave = ({ io, room }) => {
  io
    .in(room.get('id'))
    .emit('server.leave');
};

export const serverRun = ({ io, room }, stdout) => {
  io
    .in(room.get('id'))
    .emit('server.run', { stdout });
};

export const serverMessage = ({ io, room }, message) => {
  io
    .to(room.get('id'))
    .emit('server.message', message);
};

export const serverVideo = ({ io, client, room }, data) => {
  console.log('in serverEvent socket', data)
  client
    .broadcast.to(room.get('id'))
    .emit('server.video', data)
 };