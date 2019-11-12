import React, { Component } from 'react';
import { FormControl, InputLabel, Input, Button, Paper, withStyles, CssBaseline, Typography } from '@material-ui/core';
import Styles from './Styles';
// import { switchStatement, switchCase } from '@babel/types';
// import { async } from 'q';
const firebase = require("firebase");



class NewChat extends Component {
  constructor() {
    super();
    this.state = {
      username: null,
      message: null

    };
  }

  render() {
    const { classes } = this.props;


    return (

      <main className={classes.main}>
        <CssBaseline />
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h5">Send A Message!</Typography>
          <form className={classes.form} >
            <FormControl fullWidth>
              <InputLabel htmlFor='new-chat-username'>
                Enter Your Friend's Email
          </InputLabel>
              <Input required
                className={classes.input}
                autoFocus
                onChange={(e) => this.userTyping('username', e)}
                id='new-chat-username'>
              </Input>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel htmlFor='new-chat-message'>
                Enter Your Message
          </InputLabel>
              <Input required
                className={classes.input}
                onChange={(e) => this.userTyping('message', e)}
                id='new-chat-message'>
              </Input>
            </FormControl>
            <Button fullWidth variant='contained' color='primary' className={classes.submit} onClick={(e) => this.submitNewChat(e)} type='submit'>Send</Button>
          </form>
          {
            this.state.serverError ?
              <Typography component='h5' variant='h6' className={classes.errorText}>
                Unable to locate the user
        </Typography> :
              null
          }
        </Paper>
      </main>
    );
  }

  userTyping = (inputType, e) => {
    switch (inputType) {
      case 'username':
        this.setState({ username: e.target.value });
        break;

      case 'message':
        this.setState({ message: e.target.value });
        break;
      default:
        break;
    }
  }

  submitNewChat = async (e) => {
    e.preventDefault();
    const userExists = await this.userExists();
    if (userExists) {
      const chatExists = await this.chatExists();
      chatExists ? this.goToChat() : this.createChat();
    }
    console.log('submit');
  }

  createChat = () => {
    this.props.newChatSubmitFn({
      sendTo: this.state.username,
      message: this.state.message
    });
  }

  // goToChat = () => this.props.goToChatFn(this.buildDocKey(), this.state.message);
  goToChat = () => this.props.goToChatFn(this.buildDocKey(), this.state.message);



  buildDocKey = () => {
    return [firebase.auth().currentUser.email, this.state.username].sort().join(':');
  }
  chatExists = async () => {
    const docKey = this.buildDocKey();
    const chat = await
     firebase
      .firestore()
      .collection('chats')
      .doc(docKey)
      .get();
    console.log(chat.exists);
    return chat.exists;
  }
  userExists = async () => {
    const usersSnapshot = await 
    firebase
    .firestore()
    .collection('user')
    .get();
    const exists = usersSnapshot.docs
    .map(_doc => _doc.data().email)
    .includes(this.state.username);
    console.log(usersSnapshot.docs)
    this.setState({serverError: !exists});
    return exists;
  }
}
export default withStyles(Styles)(NewChat);
