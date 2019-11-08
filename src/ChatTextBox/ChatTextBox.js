
import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Send from '@material-ui/icons/Send';
import Styles from './Styles';
import { withStyles } from '@material-ui/core/styles';
// import { TextField } from '@material-ui/core';


 class ChatTextBox extends Component {
 constructor(){
     super();
     this.state = {
         chatText: ''
     };

 }

    render() {

        const { classes } = this.props;
        return(
            <div className={classes.chatTextBoxContainer}>

            <TextField 
            placeholder='Type your message...'
            onKeyUp={(e) => this.userTyping(e)}
            id='chattextbox'
            onFocus={this.userClickedInput}
            className={classes.chatTextBox}>
            
            </TextField>
            <Send onClick={this.SubmitMessage} className={classes.sendBtn}></Send>
            </div>
        );

      
    }
    SubmitMessage = () => {
        console.log('submit');
        if(this.messagevalid(this.state.chatText)){
            this.props.submitMessageFn(this.state.chatText);
            document.getElementById('chattextbox').value=';'
            
        }

    }

    userTyping =(e) => e.keyCode===13 ? this.SubmitMessage(): this.setState({chatText:e.target.value})
    messagevalid= (txt) => txt && txt.replace(/\s/g,'').length;
    userClickedInput= () => {
        console.log('clicked input')
    }
}
export default withStyles(Styles)(ChatTextBox);