import React from "react";
import {
  StructuredListBody,
  StructuredListCell,
  StructuredListRow,
  StructuredListWrapper,
  Tile
} from "carbon-components-react";

import {Stack} from '@carbon/react';
import {User, Organization} from "@pld/shared";
import {emitBody, SocketContext} from "../../context/SocketContext";
import {PageState} from "../../util/Page";
import {RequiredUserContextProps} from "../../context/UserContext";

import {UserOnline, Asleep} from '@carbon/icons-react'
import {formatLongDate} from "@pld/utils";

export const defaultRefreshTime = 10 * 1000;

export type OnlineOrgMembersComponentProps = {
  org: Organization;
  refreshTime?: number,
} & RequiredUserContextProps;

export type OnlineOrgMembersComponentState = {
  members: OnlineUser[];
} & PageState;

type OnlineMembers = {
  connected: boolean;
  memberUuid: string;
  lastConnectionDate: Date;
}

type OnlineUser = {
  user: User;
  data: OnlineMembers;
}

export class OnlineOrgMembersComponent extends React.Component<OnlineOrgMembersComponentProps, OnlineOrgMembersComponentState> {

  static override contextType = SocketContext;
  override context!: React.ContextType<typeof SocketContext>;
  private refreshTimer?: NodeJS.Timer;

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      members: [],
    }
    this.gatherMembersInfo = this.gatherMembersInfo.bind(this);
  }

  private gatherMembersInfo() {
    this.context.emit('Org:GetOnlineMembers', ...emitBody(this.props.userContext.accessToken, this.props.org._id));
  }

  override componentDidMount() {
    const socket = this.context;
    this.refreshTimer = setInterval(this.gatherMembersInfo, defaultRefreshTime);
    this.gatherMembersInfo();
    socket.on('Org:GetOnlineMembers', (data: OnlineMembers[]) => {
      this.setState({
        members: data.map((member) => {
          return {
            user: [...this.props.org.members, this.props.org.owner].find((user) => user._id === member.memberUuid),
            data: member,
          }
        }).filter((a) => a !== undefined) as OnlineUser[]
      });
    });
  }

  override componentWillUnmount() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }
  }

  private showOfflineMembers() {
    if (this.props.org === undefined)
      return;

    const members = [...this.props.org.members, this.props.org.owner];

    return (
      <StructuredListWrapper selection>
        <StructuredListBody>
          {members.map((member, index) => {
            const user: OnlineUser | undefined = this.state.members.find((m) => m.data.memberUuid === member._id);
            if (user?.data?.connected)
              return undefined;
            return (
              <StructuredListRow key={index}>
                <StructuredListCell><Asleep/></StructuredListCell>
                <StructuredListCell>
                  {member.firstname} {member.lastname?.toUpperCase()}
                </StructuredListCell>
                <StructuredListCell>{user !== undefined ? formatLongDate(new Date(user.data.lastConnectionDate)) : null}</StructuredListCell>
              </StructuredListRow>)
          })}
        </StructuredListBody>
      </StructuredListWrapper>
    )

  }

  override render() {
    return (
      <Tile style={{borderRadius: 10}}>
        <Stack>
          <h4>Membres</h4>
          <p>En ligne</p>
          <StructuredListWrapper selection>
            <StructuredListBody>
              {this.state.members.filter((member) => member.data.connected).map((member, index) => {
                return (
                  <StructuredListRow key={index}>
                    <StructuredListCell><UserOnline/></StructuredListCell>
                    <StructuredListCell>
                      {member.user.firstname} {member.user.lastname?.toUpperCase()}
                    </StructuredListCell>
                  </StructuredListRow>)
              })}
            </StructuredListBody>
          </StructuredListWrapper>
          <p>Hors-ligne</p>
          {this.showOfflineMembers()}
        </Stack>
      </Tile>
    );
  }

}
