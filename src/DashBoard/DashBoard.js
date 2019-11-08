import ChatList from '../ChatList/ChatList';
import React, { Component } from 'react';
import Styles from './Styles';
import { Button, withStyles } from '@material-ui/core';
import ChatView from '../ChatView/ChatView';
import ChatTextBox from '../ChatTextBox/ChatTextBox';

// import ChatTextBoxComponent from '../ChatTextBox/chatTextBox'


const firebase = require("firebase");

class DashBoard extends Component {
    constructor() {
        super();
        this.state = {
            selectedChat: null,
            newChatFormVisible: false,
            email: null,
            chats: []
        };
    }


    render() {

        const { classes } = this.props;
        return (
            <div>


                <ChatList
                    history={this.props.history}
                    newChatBtnFn={this.newChatBtnClicked}
                    selectChatFn={this.selectChat}
                    chats={this.state.chats}
                    userEmail={this.state.email}
                    selectedChatIndex={this.state.selectedChat}>
                </ChatList>
                {
                    this.state.newChatFormVisible ? null :
                        <ChatView user={this.state.email}
                            chat={this.state.chats[this.state.selectedChat]}> </ChatView>


                }
                <ChatTextBox submitMessageFn={this.submitMessage}></ChatTextBox>


                <Button className={classes.signOutBtn} onClick={this.signOut}> Sign Out</Button>

            </div>
        );
    }

    signOut = () => firebase.auth().signOut();

    selectChat = (chatIndex) => {
        console.log('index:', chatIndex);
        this.setState({ selectedChat: chatIndex });

    }

    submitMessage = (msg) => {
        const docKey = this.buildDocKey(this.state.chats[this.state.selectedChat].users.filter(_usr => _usr !== this.state.email)[0]);
        firebase
            .firestore()
            .collection('chats')
            .doc(docKey)
            .update({
                messages: firebase.firestore.FieldValue.arrayUnion({
                    sender: this.state.email,
                    message: msg,
                    timestamp: Date.now()
                }),
                receiverHasRead: false
            });
           

    }
    buildDocKey = (friend) => [this.state.email, friend].sort().join(':');


    newChatBtnClicked = () => this.setState({
        newChatFormVisible: true, selectChat: null
    });

    componentDidMount = () => {
        firebase.auth().onAuthStateChanged(async _usr => {
            if (!_usr)
                this.props.history.push("/LogIn");
            else {
                await firebase
                    .firestore()
                    .collection('chats')
                    .where('users', 'array-contains', _usr.email)
                    .onSnapshot(async res => {
                        const chats = res.docs.map(_doc => _doc.data());
                        await this.setState({
                            email: _usr.email,
                            chats: chats
                        });
                        console.log(this.state);

                    });

            }

        }
        )
    }

}

export default withStyles(Styles)(DashBoard);