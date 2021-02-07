import React, { FunctionComponent } from 'react';
import { makeStyles, Theme } from "@material-ui/core/styles";
import { TextField, Grid, Button, Typography } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import JoinRoom from './JoinRoom';

interface IHomeProps {}

type HomeProps = IHomeProps;

const Home: FunctionComponent<IHomeProps> = (props: IHomeProps) => {
  const {} = props;
  const classes = useStyles();

  const isInRoom = false

  return (
      <div className={classes.Home}>
        {isInRoom ? <div/> : <JoinRoom/>}
        </div>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      Home: {},
    }));

export default Home;
