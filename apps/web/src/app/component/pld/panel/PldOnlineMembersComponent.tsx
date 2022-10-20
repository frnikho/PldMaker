import React, {useEffect, useState} from "react";
import {
  StructuredListBody,
  StructuredListCell,
  StructuredListRow,
  StructuredListWrapper,
  Tile
} from "carbon-components-react";

import {Stack} from '@carbon/react';
import {User, Organization} from "@pld/shared";
import {emitBody} from "../../../context/SocketContext";

import {UserOnline, Asleep} from '@carbon/icons-react'
import {formatLongDate} from "@pld/utils";
import { TileStyle } from "@pld/ui";
import {useSocket} from "../../../hook/useSocket";
import {useAuth} from "../../../hook/useAuth";

export const defaultRefreshTime = 10 * 1000;

type OnlineMembers = {
  connected: boolean;
  memberUuid: string;
  lastConnectionDate: Date;
}

type OnlineUser = {
  user: User;
  data: OnlineMembers;
}

type Props = {
  org: Organization;
};

export const PldOnlineMembersComponent = (props: Props) => {

  const [members, setMembers] = useState<OnlineUser[]>([]);
  const {accessToken} = useAuth();
  const {socket} = useSocket();

  useEffect(() => {
    registerEvents();
    gatherMembers();
    return () => {
      socket.removeListener('Org:GetOnlineMembers')
    };
  }, []);

  const gatherMembers = () => {
    socket.emit('Org:GetOnlineMembers', ...emitBody(accessToken, props.org._id));
  }

  const registerEvents = () => {
    socket.on('Org:GetOnlineMembers', (data: OnlineMembers[]) => {
      const members = data.map((member) => {
        return {
          user: [...props.org.members, props.org.owner].find((user) => user._id === member.memberUuid),
          data: member,
        }
      }).filter((a) => a !== undefined) as OnlineUser[];
      setMembers(members);
    });
  }

  const showOfflineMembers = () => {
    const orgMembers = [...props.org.members, props.org.owner];

    return (
      <StructuredListWrapper selection>
        <StructuredListBody>
          {orgMembers.map((member, index) => {
            const user: OnlineUser | undefined = members.find((m) => m.data.memberUuid === member._id);
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

  return (
    <Tile style={TileStyle.default}>
      <Stack>
        <h4 style={{fontWeight: 'bold'}}>Membres</h4>
        <p>En ligne</p>
        <StructuredListWrapper selection>
          <StructuredListBody>
            {members.filter((member) => member.data.connected).map((member, index) => {
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
        {showOfflineMembers()}
      </Stack>
    </Tile>
  );
};
