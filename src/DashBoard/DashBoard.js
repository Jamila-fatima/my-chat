import ChatList from '../ChatList/ChatList';
import React, { Component } from 'react';


// import Styles from './Styles';


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

            </div>
        );
    }

selectChat = (chatIndex) => {
    console.log('selected a chat', chatIndex);
}


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

export default DashBoard;