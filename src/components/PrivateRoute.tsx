import React, { FunctionComponent, PropsWithChildren } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import {
  BrowserRouter, Switch, Route, Redirect
} from 'react-router-dom';
import {auth} from '../fb'
interface PrivateRouteProps {
  path: string,
  restricted?: boolean,
}



//COMPONENT
const PrivateRoute: FunctionComponent<PropsWithChildren<PrivateRouteProps>> = ({
                                                                                 children,
                                                                                 restricted,
                                                                                 ...rest
                                                                               }: PropsWithChildren<PrivateRouteProps>) => {



  return (
      <Route
          {...rest} render={({location}) => auth.currentUser
                                            ? (
                                                children)
                                            : (
                                                <Redirect to={{
                                                  pathname: "/sign-in",
                                                  state   : {from: location}
                                                }} />)} />);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      root: {},
    }));

export default PrivateRoute;
