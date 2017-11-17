import React from 'react';

import Button from '../../globals/Button/';
import Peer from 'peerjs';
import './Video.css';


class VideoChat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      otherPeerId: ''
    }
  }
  
  peer = new Peer({key: 'zj3k034g2d67p66r'});
  
  // servers = {'iceServers': [{'urls': 'stun:stun.services.mozilla.com'}, {'urls': 'stun:stun.l.google.com:19302'}, {'urls': 'turn:numb.viagenie.ca','credential': 'webrtc','username': 'websitebeaver@mail.com'}]};
  // pc = new RTCPeerConnection(this.servers);

  componentDidMount() {
    // this.pc.onicecandidate = (event => {console.log("Sent All Ice", event.candidate)});
    // this.pc.onaddstream = (event => this.otherVideo.srcObject = event.stream);
    // this.props.socket.on('server.message', this.onMessage);
    this.peer.on('open', function(id) {
      // send the id to other client via socket io
      console.log('My peer ID is: ' + id);
    });

    var conn = this.peer.connect(this.state.otherPeerId);
    conn.on('open', function(){
      conn.send('hi!');
    });

    this.peer.on('connection', function(conn) {
      conn.on('data', function(data){
        // Will print 'hi!'
        console.log(data);
      });
    });

    this.peer.on('call', this.onReceiveCall.bind(this));
  }
  
  callPeer = () => {
    console.log('im clicking')
    // var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    // getUserMedia({video: true, audio: true}, function(stream) {
    //   var call = this.peer.call('another-peers-id', stream);
    //   call.on('stream', function(remoteStream) {
    //     // Show stream in some video/canvas element.
    //   });
    // }, function(err) {
    //   console.log('Failed to get local stream' ,err);
    // });
  }

  // onMessage = message => {
  //   if (message.type === 'offer') {
  //       // set remote description and answer
  //       this.pc.setRemoteDescription(new RTCSessionDescription(message));
  //       this.pc.createAnswer()
  //         .then(this.setDescription)
  //         .then(this.sendDescription)
  //         .catch(this.handleError); // An error occurred, so handle the failure to connect

  //   } else if (message.type === 'answer') {
  //       // set remote description
  //       this.pc.setRemoteDescription(new RTCSessionDescription(message));
  //   } else if (message.type === 'candidate') {
  //       // add ice candidate
  //       this.pc.addIceCandidate(
  //           new RTCIceCandidate({
  //               sdpMLineIndex: message.mlineindex,
  //               candidate: message.candidate
  //           })
  //       );
  //   }
  // }
  
  // readMessage = (data) => {
  //   const msg = JSON.parse(data.val().message);
  //   const sender = data.val().sender;

  //   if (sender !== yourId) {
  //     if (msg.ice !== undefined)
  //       this.pc.addIceCandidate(new RTCIceCandidate(msg.ice));
  //     else if (msg.sdp.type === "offer")
  //       this.pc.setRemoteDescription(new RTCSessionDescription(msg.sdp))
  //         .then(() => pc.createAnswer())
  //         .then(answer => pc.setLocalDescription(answer))
  //         .then(() => this.sendMessage(yourId, JSON.stringify({'sdp': pc.localDescription})));
  //     else if (msg.sdp.type === "answer")
  //       this.pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
  //   }
  // };
  
  showMyFace = () => {
    let yourVideo = document.getElementById("yourVideo");
    navigator.mediaDevices.getUserMedia({audio:true, video:true})
    .then(stream => {
      yourVideo.srcObject = stream
    })
  }
  
  // showFriendsFace = () => {
  //   this.pc.createOffer()
  //   .then(offer => this.pc.setLocalDescription(offer) )
  //   .then(() => this.sendMessage(JSON.stringify({'sdp': this.pc.localDescription})) );
  // }

  render(){
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
