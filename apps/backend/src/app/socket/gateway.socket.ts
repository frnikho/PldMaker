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
import {User, UserDocument} from "../user/user.schema";
import {Socket} from "net";
import {OnEvent} from "@nestjs/event-emitter";
import {GatewayService} from "./gateway.service";

@WebSocketGateway({transports: 'websocket', path: '/ws', pingInterval: 4000})
export class Gateway {

  constructor(private service: GatewayService) {}

  @WebSocketServer()
  server: Server;

  private registerListeners(client: Socket, user: UserDocument) {
    client.on('disconnect', () => {
      this.service.disconnectedUser(user)
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
  public onNewUserLogged(@MessageBody('0') user: UserDocument, @ConnectedSocket() client: Socket) {
    this.registerListeners(client, user);

    this.service.connectedUser(user);
    console.log('New:LoggedUser: user:');
  }

  @UseGuards(AuthWsGuard)
  @SubscribeMessage('LoggedUser:Logout')
  public onUserLogout(@MessageBody('0') user: User) {
    console.log('Logout');
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
  @SubscribeMessage('Org:GetOnlineMembers')
  public async getOnlineMembers(@MessageBody('0') user: User, @MessageBody('1',) orgId: string[]) {
    this.server.emit('Org:GetOnlineMembers', await this.service.getMembers(orgId[0]));
  }

}
