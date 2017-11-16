import express from 'express';
import sio from 'socket.io';

io.sockets.on('connection', socket => {
  let room = '';
  const create = err => {
    if (err) {
      return console.log('err', err);
    }
    socket.join(room);
    socket.emit('room created');
  }
})
