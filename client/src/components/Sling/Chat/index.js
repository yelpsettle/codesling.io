import React from 'react';

import Input from '../../globals/forms/Input';
import Button from '../../globals/Button/';

import './Chat.css';

class Chat extends React.Component {
    constructor(props) {
      super(props);
    }

    state = {
        username: '',
        messages: [], 
        message: ''
    }

    handleChange = (event) => {
        const { name } = event.target;
        this.setState({ [name]: event.target.value });
    }

    handleMessageSubmit = async (e) => {
        e.preventDefault();
        this.props.socket.emit('client.message', {message: this.state.message})
        this.props.socket.on('server.message', (data) => this.state.messages.push(data))
    }

    render(){
        return (
            <div className="chat-container">
                {console.log('this is the message page')}
                <ul id="messages" className="list-group">
                This is where the messages go
                </ul>
                <div className="chat-messages">
             
                </div>
                <div className="chat-input">
                <form className="chat-form" onSubmit= {this.handleMessageSubmit }  >
                <Input
                type="text"
                name="message"
                // value={this.state.value}
                placeholder="message"
                onChange={this.handleChange}
                />
                <Button
                backgroundColor="red"
                color="white"
                text="Send"
                onClick={this.handleMessageSubmit}
        
                 />
            </form>
                </div>
            </div>
        )
    }
}

export default Chat;
