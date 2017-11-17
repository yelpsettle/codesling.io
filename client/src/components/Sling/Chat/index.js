import React from 'react';

import Input from '../../globals/forms/Input';
import Button from '../../globals/Button/';
import jwtDecode from 'jwt-decode';

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

    componentDidMount()  {
    this.props.socket.on('server.message', 
        (data) =>

        this.setState({
                messages: [...this.state.messages,data],
                username: data.username
            })
        )
    }

    handleChange = (event) => {
        const { name } = event.target;
        this.setState({ [name]: event.target.value });
    }

    handleMessageSubmit = (e) => {
        e.preventDefault();
        this.props.socket.emit('client.message', {message: this.state.message, username: jwtDecode(localStorage.token).username})
    }

    render(){
        return (
            <div className="chat-container">
                <div id="messages" className="list-group">
                This is where the messages go
                {this.state.messages.map((item) => (
                    <div>{item.username +': ' + item.message}</div>)
                )}
                </div>
                <div className="chat-messages">
             
                </div>
                <div className="chat-input">
                <form className="chat-form" onSubmit={this.handleMessageSubmit} >
                <Input
                type="text"
                name="message"
                placeholder="message"
                onChange={this.handleChange}
                />
                <Button
                backgroundColor="red"
                color="white"
                text="Send"
                 />
            </form>
                </div>
            </div>
        )
    }
}

export default Chat;
