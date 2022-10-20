import * as React from "react";
import { SkeletonText, Tile } from "carbon-components-react";

import {Stack} from '@carbon/react';
import { TileStyle } from "@pld/ui";

export const OrgQuickInfoSkeleton = () => {
  return (
    <Tile style={TileStyle.default}>
      <Stack gap={6}>
        <Stack gap={1}>
          <h4 style={{fontWeight: 600}}>Date de création :</h4>
          <SkeletonText/>
        </Stack>
        <Stack gap={1}>
          <h4 style={{fontWeight: 600}}>Date de mise à jour :</h4>
          <SkeletonText/>
        </Stack>
      </Stack>
    </Tile>
  );
};
