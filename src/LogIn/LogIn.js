import React, { Component } from 'react';
import { Link } from 'react-router-dom';
// import React from 'react';
// import Styles from './Styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import styles from '../SignUp/Styles';
// import { typography } from '@material-ui/system';

const firebase = require("firebase");


class LogIn extends Component {
    constructor() {
        super();
        this.state = {
            email: null,
            password: null,
            loginError: ''
        }
    }
    render() {

        const { classes } = this.props;



        return (
            <main className={classes.main}>

                <CssBaseline></CssBaseline>
                <Paper className={classes.paper}>
                    <Typography component='h1' variant='h5'>
                        Log In!
                    </Typography>
                    <form className={classes.name} onSubmit={(e) => this.submitLogIn(e)}>
                        <FormControl required fullWidth margin='normal'>
                            <InputLabel htmlFor='login-email-input'> Enter your Email</InputLabel>
                            <Input autoComplete='email' autoFocus id='login-email-input' onChange={(e) => this.userTyping('email', e)}></Input>
                        </FormControl>

                        <FormControl required fullWidth margin='normal'>
                            <InputLabel htmlFor='login-password-input'> Enter your Password</InputLabel>
                            <Input type='password' id='login-password-input' onChange={(e) => this.userTyping('password', e)}></Input>
                        </FormControl>
                        <Button type='submit' fullWidth variant='contained' color='primary' className={classes.submit}>LOG IN!</Button>
                    </form>

                    {
                        this.state.loginError ?
                            <Typography className={classes.errorText} component='h5' variant='h6' >
                                incorrect login information
                            </Typography> : null



                    }
                    <Typography component='h5' variant='h6' className={classes.noAccountHeader}>Don't have an Account?</Typography>
                    <Link className={classes.signUpLink} to='/SignUP'>Sign Up!</Link>
                </Paper>
            </main>
        );
    }
    userTyping = (type, e) => {
        switch (type) {
            case 'email':
                this.setState({ email: e.target.value });
                break;

            case 'password':
                this.setState({ password: e.target.value });
                break;
            default:
                break;

        }
    }

    submitLogIn = (e) => {
        e.preventDefault();
        firebase
            .auth()
            .signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(() => {
                this.props.history.push('/DashBoard');
            },err => {
                this.setState({loginError:'server error'});
                console.log(err);
            })
    }
}

export default withStyles(styles)(LogIn);