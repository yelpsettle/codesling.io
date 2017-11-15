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
    window.open();
  }

  render() {
    return (
      <Sling slingId={this.props.match.params.slingId} openWindow={this.openWindow}/>
    );
  }
}

export default ProtectedSling;
