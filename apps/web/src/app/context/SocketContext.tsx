import React, { useEffect, useState } from "react";
import io from 'socket.io-client';
import * as socketio from 'socket.io-client';
import {WsPayload} from "@pld/shared";
import {toast} from "react-toastify";

const ENDPOINT = process.env['NX_SERVER_HOST'];

const socket = io(ENDPOINT?.valueOf() ?? 'abc', {path: '/ws', transports: ['websocket'], timeout: 30000});

export const SocketContext = React.createContext<socketio.Socket>(socket);

export const emitBody = (auth: string, ...data) => {
  return ([authoriseWs(auth), data])
}

export const authoriseWs = (accessToken: string): WsPayload => {
  return {
    accessToken,
  }
}

export const SocketContextProvider = ({children}: React.PropsWithChildren) => {

  const [socketV] = useState<socketio.Socket>(socket);

  useEffect(() => {
    socketV.on('connect_error', (error) => {
      console.log(error);
    });
    socketV.on('disconnect', (a) => {
      if (a === 'transport close') {
        toast('Connexion perdu 😶', {type: 'error'});
      }
    });
    socketV.on('exception', (error) => {
      console.log(error);
      toast(`Socket exception: ${error.message}`, {type: 'error'})
    });
    return () => {
      socketV.disconnect();
    };
  }, [])

  return (
    <SocketContext.Provider value={socketV}>
      {children}
    </SocketContext.Provider>
  );
};
