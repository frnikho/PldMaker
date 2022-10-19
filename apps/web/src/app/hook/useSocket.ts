import {useContext} from "react";
import {SocketContext} from "../context/SocketContext";
import * as socketio from 'socket.io-client';

export function useSocket() {

  const socket = useContext<socketio.Socket>(SocketContext);

  return {
    socket: socket,
  };

}
