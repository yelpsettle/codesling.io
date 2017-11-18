import React, { Component } from 'react';
import CodeMirror from 'react-codemirror2';
import io from 'socket.io-client/dist/socket.io.js';
import { throttle } from 'lodash';

import Button from '../globals/Button';
import StdOut from './StdOut';
import EditorHeader from './EditorHeader';
import Chat from './Chat';
import Video from './VideoChat';

import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/base16-dark.css';
import './Sling.css';

class Sling extends Component {
  state = {
    text: '',
    stdout: '',
    socket: io(process.env.REACT_APP_SOCKET_SERVER_URL, {
      query: {  
        roomId: this.props.slingId,
      }
    })
  }

  runCode = () => {
    this.state.socket.emit('client.run');
  }
      
  componentDidMount() {
    this.state.socket.on('connect', () => {
      this.state.socket.emit('client.ready');
    });

    this.state.socket.on('server.initialState', ({ id, text }) => {
      this.setState({ id, text });
    });

    this.state.socket.on('server.changed', ({ text }) => {
      this.setState({ text });
    });

    this.state.socket.on('server.run', ({ stdout }) => {
      this.setState({ stdout });
    });

    window.addEventListener('resize', this.setEditorSize);
  }
  
  componentWillUnmount() {
    window.removeEventListener('resize', this.setEditorSize);
  }

  handleChange = throttle((editor, metadata, value) => {
    this.state.socket.emit('client.update', { text: value });
  }, 250)

  setEditorSize = throttle(() => {
    this.editor.setSize(null, `${window.innerHeight - 80}px`);
  }, 100);

  initializeEditor = (editor) => {
    // give the component a reference to the CodeMirror instance
    this.editor = editor;
    this.setEditorSize();
  }



  render() {
    return (
      <div className="sling-container">
        <EditorHeader openWindow={this.props.openWindow}/>
        <div className="code-editor-container">
          <CodeMirror
            editorDidMount={this.initializeEditor}
            value={this.state.text}
            options={{
              mode: 'javascript',
              lineNumbers: true,
              theme: 'base16-dark',
            }}
            onChange={this.handleChange}
          />
        </div>
        <div className="stdout-container">
          <Button
            className="run-btn"
            text="Run Code"
            backgroundColor="red"
            color="white"
            onClick={this.runCode}
          />
          <StdOut 
            text={this.state.stdout}
          />
        </div>
        <div className="chat-container">
            <Chat socket = {this.state.socket} />
        </div>

        <div className="video-container">
          <Video socket = {this.state.socket} />
        </div>


      </div>
    );
  }
}

export default Sling;
