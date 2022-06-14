import React from "react";
import io from 'socket.io-client';
import * as socketio from 'socket.io-client';
import {WsPayload} from "../../../../../libs/data-access/auth/WsPayload";
import {toast} from "react-toastify";

const ENDPOINT = process.env['NX_SERVER_HOST'];

const socket = io(ENDPOINT?.valueOf() ?? 'abc', {path: '/ws', transports: ['websocket']});

export const SocketContext = React.createContext<socketio.Socket>(socket);

export const emitBody = (auth: string, ...data) => {
  return ([authoriseWs(auth), data])
}

export const authoriseWs = (accessToken: string): WsPayload => {
  return {
    accessToken,
  }
}

export class SocketContextProvider extends React.Component<React.PropsWithChildren<unknown>, unknown> {

  private readonly socket: socketio.Socket;

  constructor(props) {
    super(props);
    this.socket = socket;

    this.socket.on('connect_error', (error) => {
      console.log(error);
    });

    this.socket.on('disconnect', (a) => {
      if (a === 'transport close') {
        toast('Connexion perdu 😶', {type: 'error'});
      }
    });

    this.socket.on('exception', (error) => {
      console.log(error);
      toast(`Socket exception: ${error.message}`, {type: 'error'})
    });
  }


  override render() {
    return (
      <SocketContext.Provider value={this.socket}>
        {this.props.children}
      </SocketContext.Provider>
    );
  }

}
