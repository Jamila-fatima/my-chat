import ChatList from '../ChatList/ChatList';
import React, { Component } from 'react';
import Styles from './Styles';
import { Button, withStyles } from '@material-ui/core';
import ChatView from '../ChatView/ChatView';
import ChatTextBox from '../ChatTextBox/ChatTextBox';
// import { async } from 'q';
import NewChat from '../NewChat/NewChat';



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
            <div >


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
                            chat={this.state.chats[this.state.selectedChat]}>
                        </ChatView>
                }
                {
                    this.state.selectedChat !== null && !this.state.newChatFormVisible ?
                        <ChatTextBox messageReadFn={this.messageRead} submitMessageFn={this.submitMessage}></ChatTextBox> : null
                }
                {
                  this.state.newChatFormVisible ? <NewChat goToChatFn={this.goToChat} newChatSubmitFn={this.newChatSubmit}></NewChat> : null
                }

                <Button className={classes.signOutBtn} onClick={this.signOut}> Sign Out</Button>

            </div>
        );
    }

    signOut = () => firebase.auth().signOut();
    submitMessage = (msg) => {
        const docKey = this.buildDocKey(this.state.chats[this.state.selectedChat].users.filter(_usr => _usr !== this.state.email)[0]);
        console.log({ docKey });
        
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
           console.log(docKey);

    }
    buildDocKey = (friend) => [this.state.email, friend].sort().join(':');

    newChatBtnClicked = () => this.setState({ newChatFormVisible: true, selectedChat: null });

    newChatSubmit = async (chatObj) => {
        const docKey = this.buildDocKey(chatObj.sendTo);
        await 
          firebase
            .firestore()
            .collection('chats')
            .doc(docKey)
            .set({
              messages: [{
                message: chatObj.message,
                sender: this.state.email
              }],
              users: [this.state.email, chatObj.sendTo],
              receiverHasRead: false
            })
        this.setState({ newChatFormVisible: false });
        this.selectChat(this.state.chats.length - 1);
      }




    selectChat = async (chatIndex) => {
        await this.setState({ selectedChat: chatIndex, newChatFormVisible: false });
        this.messageRead();
      }

    

      goToChat = async (docKey, msg) => {
        const usersInChat = docKey.split(':');
        const chat = this.state.chats.find(_chat => usersInChat.every(_user => _chat.users.includes(_user)));
        this.setState({ newChatFormVisible: false });
        await this.selectChat(this.state.chats.indexOf(chat));
        this.submitMessage(msg);
      }
   




    messageRead = () => {
        const docKey = this.buildDocKey(this.state.chats[this.state.selectedChat].users.filter(_usr => _usr !== this.state.email)[0]);
        if (this.clickedChatWhereNotSender(this.state.selectedChat)) {
            firebase
                .firestore()
                .collection('chats')
                .doc(docKey)
                .update({ receiverHasRead: true });
        } else {
            console.log('clicked msg where the user was the sender');
        }
    }

   
    
   
    clickedChatWhereNotSender = (chatIndex) => this.state.chats[chatIndex].messages[this.state.chats[chatIndex].messages.length - 1].sender !== this.state.email;

   
   

    componentWillMount = () => {
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