import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import {UseGuards} from "@nestjs/common";
import {AuthWsGuard} from "../auth/socket/authws.guard";
import {User} from "../user/user.schema";
import {Socket} from "net";
import {OnEvent} from "@nestjs/event-emitter";

@WebSocketGateway({transports: 'websocket', path: '/ws', pingInterval: 4000})
export class Gateway {
  @WebSocketServer()
  server: Server;

  private registerListeners(client: Socket) {
    client.on('packet', function (packet) {
      if (packet.type === 'ping') console.log('received ping');
    });

    client.on('packetCreate', function (packet) {
      if (packet.type === 'pong') console.log('sending pong');
    });
    client.on('disconnect', () => {
      console.log('Disconnected !');
    })
  }

  @SubscribeMessage('connection')
  @UseGuards(AuthWsGuard)
  onConnection(@MessageBody() data: string) {
    console.log('Connection', data);
  }

  @UseGuards(AuthWsGuard)
  @SubscribeMessage('LoggedUser:New')
  public onNewUserLogged(@MessageBody('0') user: User, @ConnectedSocket() client: Socket) {
    this.registerListeners(client);
    console.log('New:LoggedUser: user:');
  }

  @UseGuards(AuthWsGuard)
  @SubscribeMessage('LoggedUser:Logout')
  public onUserLogout(@MessageBody('0') user: User) {

  }

  @OnEvent('Pld:Update')
  public onUpdatePld(pldId: string) {
    this.server.emit('Pld:Update', {pldId});
  }

  @OnEvent('Org:Update')
  public onUpdateOrg(orgId: string) {
    this.server.emit('Org:Update', {orgId});
  }

  @OnEvent('Dod:Update')
  public onUpdateDod(pldId: string) {
    this.server.emit('Dod:Update', {pldId});
  }

  @UseGuards(AuthWsGuard)
  @SubscribeMessage('Pld:GetOnlineMembers')
  public getOnlineMembers() {

  }

}
