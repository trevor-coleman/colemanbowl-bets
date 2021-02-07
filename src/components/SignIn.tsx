import React, { FunctionComponent, useState, useEffect } from 'react';
import { makeStyles, Theme } from "@material-ui/core/styles";
import GoogleButton from 'react-google-button'
import{auth, signInWithGoogle} from '../fb';
import { Redirect } from 'react-router-dom';

interface ISignInProps {}

type SignInProps = ISignInProps;

const SignIn: FunctionComponent<ISignInProps> = (props: ISignInProps) => {
  const {} = props;
  const classes = useStyles();

  const [signedIn, setSignedIn] = useState(false);

  useEffect(()=> {
    const unsub = auth.onAuthStateChanged(user => setSignedIn(Boolean(user)));
    return unsub;
  }, [])

  console.log(auth.currentUser);

  return (
      auth.currentUser ? <Redirect to={"/"}/> :
      <div className={classes.SignIn}>
        <GoogleButton onClick={signInWithGoogle}/> </div>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      SignIn: {},
    }));

export default SignIn;
