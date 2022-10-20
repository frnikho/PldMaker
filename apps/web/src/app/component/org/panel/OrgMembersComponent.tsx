import { capitalize } from "@pld/utils";
import { Tile } from "carbon-components-react";
import React from "react";
import { Organization } from "@pld/shared";

import {Stack} from '@carbon/react';
import { TileStyle } from "@pld/ui";

type Props = {
  org: Organization;
};
export const OrgMembersComponent = (props: Props) => {
  return (
    <Tile style={TileStyle.default}>
      <Stack>
        <h4 style={{fontWeight: 600, marginBottom: 10}}>Membres :</h4>
        {[...props.org.members, props.org.owner].map((user, index) => (
          <div key={index} style={{display: 'flex', flexDirection: 'row', justifyContent: 'start'}}>
            <img src={user.profile_picture} style={{borderRadius: '50%', objectFit: 'cover', width: 50, height: 50}}/>
            <div style={{marginLeft: 18, display: 'flex', flexDirection: 'column'}}>
              <p style={{fontWeight: 'bold'}}>{capitalize(user.firstname)} {user.lastname.toUpperCase()}</p>
              <p style={{fontWeight: 100}}>{user.email}</p>
            </div>
          </div>
        ))}
      </Stack>
    </Tile>
  );
};
