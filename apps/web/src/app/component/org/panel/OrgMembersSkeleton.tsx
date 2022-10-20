import { SkeletonPlaceholder, SkeletonText, Tile } from "carbon-components-react";
import React from "react";

import {Stack} from '@carbon/react';
import { TileStyle } from "@pld/ui";

export const OrgMembersSkeleton = () => {
  return (
    <Tile style={TileStyle.default}>
      <Stack>
        <h4 style={{fontWeight: 600, marginBottom: 10}}>Membres :</h4>
        {['', '', ''].map((user, index) => (
          <div key={index} style={{display: 'flex', flexDirection: 'row', justifyContent: 'start'}}>
            <SkeletonPlaceholder style={{width: 40, height: 40}}/>
            <div style={{marginLeft: 18, display: 'flex', flexDirection: 'column', width: '80%'}}>
              <SkeletonText/>
              <SkeletonText/>
            </div>
          </div>
        ))}
      </Stack>
    </Tile>
  );
};
