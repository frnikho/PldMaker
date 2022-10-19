import React from "react";
import {
  StructuredListSkeleton,
  Tile
} from "carbon-components-react";

import {Stack} from '@carbon/react';
import { TileStyle } from "../../../style/TileStyle";

export const PldOnlineMembersSkeleton = () => {

  return (
    <Tile style={TileStyle.default}>
      <Stack>
        <h4 style={{fontWeight: 'bold'}}>Membres</h4>
        <p>En ligne</p>
        <StructuredListSkeleton rowCount={2}/>
        <p>Hors-ligne</p>
        <StructuredListSkeleton rowCount={2}/>
      </Stack>
    </Tile>
  );
};
