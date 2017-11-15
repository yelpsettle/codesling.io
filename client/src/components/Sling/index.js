import React, { Component } from 'react';
import axios from 'axios';

import Sling from './Sling';

class ProtectedSling extends Component {
  state = { }

  async componentDidMount() {
    const slingExists = await this.slingExistsinDB();
    if (!slingExists) {
      this.props.history.push({
        pathname: '/slingError',
      });
    }
  }
  
  slingExistsinDB = async () => {
    const slingId = this.props.match.params.slingId
    const { data } = await axios.get(`${process.env.REACT_APP_REST_SERVER_URL}/api/slings/${slingId}`);
    const { sling } = data
    return !!sling;
  }

  openWindow = () => {
    'use strict';
    
    navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    
    var constraints = {
      audio: true,
      video: true
    };
    var video = document.querySelector('video');
    
    function successCallback(stream) {
      window.stream = stream; // stream available to console
      if (window.URL) {
        video.src = window.URL.createObjectURL(stream);
      } else {
        video.src = stream;
      }
    }
    
    function errorCallback(error) {
      console.log('navigator.getUserMedia error: ', error);
    }
    
    navigator.getUserMedia(constraints, successCallback, errorCallback);
    window.open(
      <video autoplay></video>
    );
  }

  render() {
    return (
      <Sling slingId={this.props.match.params.slingId} openWindow={this.openWindow}/>
    );
  }
}

export default ProtectedSling;
