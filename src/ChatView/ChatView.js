import React, { Component } from 'react';
import Styles from './Styles';
import { withStyles } from '@material-ui/core/styles';






class ChatView extends Component {
    render() {

        const { classes, chat, user } = this.props;

        if (chat === undefined) {
            return (
                <main className={classes.content}></main>
            );
        }else{
            return(
                <div>
                <div className={classes.chatHeadr}></div>
                <main className={classes.content}>
                {
                    chat.messages.map((_msg,_index) => {
                    return (
                        <div key={_index} className={_msg.sender === user ? classes.userSent: classes.friendSent}>
                        {_msg.message}
                        </div>
                    )
                    })
                }
                </main>
                </div>
            );
        }

    }
}
export default withStyles(Styles)(ChatView);


