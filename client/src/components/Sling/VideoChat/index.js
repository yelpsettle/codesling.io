import React from 'react';

import Button from '../../globals/Button/';
import Peer from 'peerjs';

import './Video.css';


class VideoChat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ownId: '',
      otherPeerId: ''
    }
  }
  
  peer = new Peer({key: 'zj3k034g2d67p66r'});
  nGetUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
  getUserMedia = this.nGetUserMedia.bind(navigator);

  componentDidMount() {
    this.peer.on('open', (id) => {
      this.setState({
        ownId: id
      })
      console.log('my id', this.state.ownId)
    });

    this.props.socket.on('server.video', (data) => {
      this.setState({ 
        otherPeerId: data.id
      })
      console.log('receiving', this.state.otherPeerId)
    })
  }

  connection = () => {
    let conn = this.peer.connect(this.state.otherPeerId);
  }
  
  callPeer = (e) => {
    
    e.preventDefault(); 
    let otherVideo = document.getElementById("otherVideo");
    this.connection();

    this.getUserMedia({video: true, audio: true}, (stream) => {
      console.log('checking otherPeerId', this.state.otherPeerId)
      let call = this.peer.call(this.state.otherPeerId, stream);
      call.on('stream', (remoteStream) => {
        console.log('please call', remoteStream)
        // Show stream in some video/canvas element.
        otherVideo.srcObject = remoteStream
      });
    }, (err) => {
      console.log('Failed to get local stream' ,err);
    });

  }
  
  showMyFace = () => {
    console.log('in showmyface')
    this.props.socket.emit('client.video', {
      id: this.state.ownId
    })

    let yourVideo = document.getElementById("yourVideo");
    this.getUserMedia({audio:true, video:true}, (stream) => {
      yourVideo.srcObject = stream
    }, err => {
      console.log('Fail to get stream')
    })
  }

  render() {
    // let conn = this.peer.connect(this.state.otherPeerId);
    // console.log(conn)
    // conn.on('open', () => {
    //   conn.send('hi!');
    // });

    this.peer.on('connection', (conn) => {
      conn.on('data', (data) => {
        // Will print 'hi!'
        console.log(data);
      });
    });

    this.peer.on('call', (call) => {
      this.getUserMedia({video: true, audio: true}, (stream) => {
        let otherVideo = document.getElementById("otherVideo");
        console.log('im in peer.on.call')
        call.answer(stream); // Answer the call with an A/V stream.
        call.on('stream', (remoteStream) => {
          // Show stream in some video/canvas element.
          otherVideo.srcObject = remoteStream;
        });
      }, (err) => {
        console.log('Failed to get local stream' ,err);
      });
    });

    return (
      <div>
        <video id="yourVideo" autoPlay muted ></video>
        <video id="otherVideo" autoPlay></video>
        <Button
          backgroundColor="red"
          color="white"
          text="Start" 
          onClick={this.showMyFace} />
        <Button
          backgroundColor="red"
          color="white"
          text="Call" 
          onClick={this.callPeer} />
      </div>
    )
  }
}

export default VideoChat;
