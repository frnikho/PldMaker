import * as React from "react";
import { ButtonSkeleton, NumberInputSkeleton, TextAreaSkeleton, Tile } from "carbon-components-react";

import {Stack} from '@carbon/react';
import { TileStyle } from "@pld/ui";

export const OrgInfoSkeleton = () => {

  return (
    <Tile style={TileStyle.default}>
      <Stack gap={6}>
        <TextAreaSkeleton />
        <NumberInputSkeleton/>
        <div style={{display: 'flex', flexDirection: 'row', gap: 10}}>
          <ButtonSkeleton style={{borderRadius: 8}} />
          <ButtonSkeleton style={{borderRadius: 8}} />
        </div>
      </Stack>
    </Tile>
  );
};
