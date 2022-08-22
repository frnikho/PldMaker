import React from "react";
import {LoginState, UserContext, UserContextProps} from "../context/UserContext";
import {Navigate} from "react-router-dom";
import {formatLongDate} from "@pld/utils";
import {Button, ClickableTile, Link} from "carbon-components-react";
import {Stack} from '@carbon/react';
import Lottie from "lottie-react";
import {UserApiController} from "../controller/UserApiController";
import {toast} from "react-toastify";

export type DevicePageProps = unknown;

export type DevicePageState = {
  redirect?: string;
}

export class DevicePage extends React.Component<DevicePageProps, DevicePageState> {

  constructor(props: DevicePageProps) {
    super(props);
    this.state = {
      redirect: undefined,
    }
  }

  private showState(auth: UserContextProps) {
    if (auth.isLogged === LoginState.not_logged) {
      this.setState({redirect: '/'})
      return null;
    } else if (auth.isLogged === LoginState.loading) {
      return 'Loading';
    } else {
      return this.showComponent(auth);
    }
  }

  private showComponent(auth) {
    const devices = auth.user.devices.length;
    return (
      <Stack gap={4}>
        <h1>Mes Appareils :</h1>
        {devices > 0 ? this.showDevices(auth) : this.showNoDevices()}
        <Button disabled={devices <= 0} kind={"danger"} onClick={() => {
          UserApiController.deleteAllDevice (auth.accessToken, (user, error) => {
            auth.refreshUser();
            toast('Vos appareils récents on été supprimer !', {type: 'success'});
          });
        }}>Supprimer tout les appareils récents</Button>
      </Stack>
    )
  }

  private showNoDevices() {
    return (
      <Stack>
        <h4>Vous n'avez pas de devices récents</h4>
        <Lottie animationData={require('../../assets/animations/devices.json')} loop={true} style={{width: '200px'}}/>
      </Stack>
    )
  }

  private showDevices(authContext: UserContextProps) {
    return authContext.user?.devices.map((d, index) => {
      return (
        <ClickableTile key={index}>
          <Link>{[d.os, d.agent].join(', ').substring(0, 100)}...</Link>
          <p>{d.ip}</p>
          <p>Première connexion: le {formatLongDate(new Date(d.firstConnection))}</p>
          <p>Dernière connexion: le {formatLongDate(new Date(d.lastConnection))}</p>
        </ClickableTile>
      )
    });
  }

  override render() {
    return (
      <>
        {this.state.redirect ? <Navigate to={this.state.redirect}/> : null}
        <UserContext.Consumer>
          {(auth) => this.showState(auth)}
        </UserContext.Consumer>
      </>
    )
  }

}
