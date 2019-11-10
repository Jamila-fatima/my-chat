
import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Send from '@material-ui/icons/Send';
import Styles from './Styles';
import { withStyles } from '@material-ui/core/styles';
// import { TextField } from '@material-ui/core';


class ChatTextBox extends Component {
    constructor() {
        super();
        this.state = {
            chatText: ''
        };

    }

    render() {

        const { classes } = this.props;
        return (
            <div className={classes.chatTextBoxContainer}>

                <TextField
                    placeholder='Type your message...'
                    onKeyUp={(e) => this.userTyping(e)}
                    id='chattextbox'
                    onFocus={this.userClickedInput}
                    className={classes.chatTextBox}>

                </TextField>
                <Send onClick={this.submitMessage} className={classes.sendBtn}></Send>
            </div>
        );


    }
   

    userTyping = (e) => e.keyCode === 13 ? this.submitMessage() : this.setState({ chatText: e.target.value });
    messageValid = (txt) => txt && txt.replace(/\s/g, '').length;

    submitMessage = () => {
        console.log('submit');
        if (this.messageValid(this.state.chatText)) {
            this.props.submitMessageFn(this.state.chatText);
            document.getElementById('chattextbox').value = '';

        }

    }
    userClickedInput = () => this.props.messageReadFn();
}
export default withStyles(Styles)(ChatTextBox);