import { Injectable } from '@nestjs/common';
import {OrganizationService} from "../organization/organization.service";
import {UserDocument} from "../user/user.schema";
import {OrganizationDocument} from "../organization/organization.schema";
import {WsException} from "@nestjs/websockets";

type OnlineMembers = {
  connected: boolean;
  memberUuid: string;
  lastConnectionDate: Date;
}

@Injectable()
export class GatewayService {

  private onlineMembers: OnlineMembers[] = [];

  constructor(private orgService: OrganizationService, /*private userService: UserService*/) {}

  public connectedUser(user: UserDocument) {
    const member = this.onlineMembers.find((member) => member.memberUuid === user._id.valueOf());
    if (!member) {
      this.onlineMembers.push({
        connected: true,
        lastConnectionDate: new Date(),
        memberUuid: user._id.valueOf(),
      });
    } else {
      member.lastConnectionDate = new Date();
      member.connected = true;
    }
  }

  public disconnectedUser(user: UserDocument) {
    const member = this.onlineMembers.find((member) => member.memberUuid === user._id.valueOf());
    if (!member) {
      return;
    }
    member.connected = false;
  }

  public async getMembers(orgId: string) {
    const org: OrganizationDocument = await this.orgService.find(orgId);
    if (org === null)
      throw new WsException('Invalid Organization id !');

    const orgMembers = [...org.members, org.owner] as UserDocument[];
    return this.onlineMembers.map((members) => {
      return orgMembers.find((member) => member._id.valueOf() === members.memberUuid) ? members : undefined;
    }).filter((a) => a !== undefined);
  }

}
