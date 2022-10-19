import * as React from "react";
import {SkeletonText, Tile} from "carbon-components-react";

import {Stack} from '@carbon/react';
import { TileStyle } from "../../../style/TileStyle";

export const PldStateSkeleton = () => {
  return (
    <Tile style={TileStyle.default}>
      <Stack gap={6}>
        <SkeletonText/>
      </Stack>
    </Tile>
  )
};
