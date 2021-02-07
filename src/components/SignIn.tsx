import React, {
  FunctionComponent, useState, useEffect, ChangeEvent,
} from 'react';
import { makeStyles, Theme } from "@material-ui/core/styles";
import GoogleButton from 'react-google-button';
import { auth, signInWithGoogle, db } from '../fb';
import { Redirect } from 'react-router-dom';
import { TextField, Button, Grid } from '@material-ui/core';

interface ISignInProps {}

type SignInProps = ISignInProps;

const SignIn: FunctionComponent<ISignInProps> = (props: ISignInProps) => {
  const {} = props;
  const classes = useStyles();

  const [signedIn, setSignedIn] = useState(false);

  const [values, setValues] = useState<any>({
                                              displayName: "",
                                              password   : "",
                                              email      : "",
                                            });
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValues({
                ...values,
                [e.target.id]: e.target.value,
              });
  };

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(user => setSignedIn(Boolean(user)));
    return unsub;
  }, []);

  if (auth.currentUser) {
    db.ref('profiles')
      .child(auth.currentUser.uid)
      .child('currentRoom')
      .set(null);
  }

  return (
      auth.currentUser
      ? <Redirect to={"/"} />
      : <div className={classes.SignIn}>
        <Grid container spacing={2} >
          <Grid item xs={12}>
            <TextField variant={"outlined"}
                   fullWidth id={"displayName"}
                   type={"name"}
                   label={"name"}
                   value={values.displayName}
                   onChange={handleChange} /></Grid><Grid item xs={12}>
        <TextField variant={"outlined"}
                   fullWidth id={"email"}
                   type={"email"}
                   label={"email"}
                   value={values.email}
                   onChange={handleChange} /></Grid><Grid item xs={12}>
        <TextField fullWidth id={"password"}
                   label={"password"}
                   type={"password"}
                   value={values.password}
                   onChange={handleChange} /></Grid><Grid item xs={12}>
        <Button fullWidth variant={"contained"}
                onClick={async () => {
                  const credential = await auth.createUserWithEmailAndPassword(
                      values.email,
                      values.password);
                  auth.currentUser?.updateProfile({displayName: values.displayName});
                }}>Sign In with Email</Button></Grid><Grid item xs={12} style={{paddingTop: 40}}>
          <GoogleButton onClick={signInWithGoogle} /></Grid></Grid></div>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      SignIn: {},
    }));

export default SignIn;
